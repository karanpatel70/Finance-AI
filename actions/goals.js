"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeGoal = (goal) => ({
  ...goal,
  targetAmount: goal.targetAmount?.toNumber?.() ?? goal.targetAmount,
  currentAmount: goal.currentAmount?.toNumber?.() ?? goal.currentAmount,
  autoContributeAmount: goal.autoContributeAmount?.toNumber?.() ?? goal.autoContributeAmount, // Ensure this is serialized
  progressPercentage: goal.targetAmount
    ? Math.min(100, (goal.currentAmount?.toNumber() ?? 0) / goal.targetAmount.toNumber() * 100)
    : 0,
  lastContributedAt: goal.lastContributedAt,
  sharedWithUserIds: goal.sharedWithUserIds ? goal.sharedWithUserIds.split(",") : [], // Convert back to array
});

async function requireUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");
  return user;
}

export async function getGoals() {
  const user = await requireUser();
  const goals = await db.goal.findMany({
    where: {
      OR: [
        { userId: user.id },
        { sharedWithUserIds: { contains: user.id } }, // Check if user.id is in the sharedWithUserIds string
      ],
    },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }], // Order by priority, then creation date
  });
  return goals.map(serializeGoal);
}

export async function createGoal(data) {
  const user = await requireUser();
  const targetAmount = parseFloat(data.targetAmount);
  if (isNaN(targetAmount) || targetAmount <= 0) {
    throw new Error("Invalid target amount");
  }
  const goal = await db.goal.create({
    data: {
      title: data.title,
      targetAmount,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      priority: data.priority || 0,
      autoContributeAmount: data.autoContributeAmount ? parseFloat(data.autoContributeAmount) : null,
      autoContributeFrequency: data.autoContributeFrequency || null,
      sharedWithUserIds: data.sharedWithUserIds ? data.sharedWithUserIds.join(",") : null,
      userId: user.id,
    },
  });
  revalidatePath("/goals");
  return { success: true, data: serializeGoal(goal) };
}

export async function updateGoal(goalId, data) {
  const user = await requireUser();
  const payload = { ...data };
  if (payload.targetAmount !== undefined) {
    const amt = parseFloat(payload.targetAmount);
    if (isNaN(amt) || amt <= 0) throw new Error("Invalid target amount");
    payload.targetAmount = amt;
  }
  if (payload.currentAmount !== undefined) {
    const amt = parseFloat(payload.currentAmount);
    if (isNaN(amt) || amt < 0) throw new Error("Invalid current amount");
    payload.currentAmount = amt;
  }
  if (payload.dueDate) payload.dueDate = new Date(payload.dueDate);
  if (payload.priority !== undefined) {
    const p = parseInt(payload.priority);
    if (isNaN(p)) throw new Error("Invalid priority");
    payload.priority = p;
  }
  if (payload.autoContributeAmount !== undefined) {
    const amt = parseFloat(payload.autoContributeAmount);
    if (isNaN(amt) || amt < 0) throw new Error("Invalid auto-contribute amount");
    payload.autoContributeAmount = amt;
  }
  if (payload.autoContributeFrequency === null) {
    payload.autoContributeFrequency = null;
  }
  if (payload.sharedWithUserIds !== undefined) {
    payload.sharedWithUserIds = payload.sharedWithUserIds ? payload.sharedWithUserIds.join(",") : null;
  }

  const goal = await db.goal.update({
    where: { id: goalId, userId: user.id },
    data: payload,
  });
  revalidatePath("/goals");
  return { success: true, data: serializeGoal(goal) };
}

export async function updateGoalProgress(goalId, incrementBy) {
  const user = await requireUser();
  const addAmount = parseFloat(incrementBy);
  if (isNaN(addAmount) || addAmount <= 0) throw new Error("Invalid amount");

  // Read current values
  const existing = await db.goal.findFirst({ where: { id: goalId, userId: user.id } });
  if (!existing) throw new Error("Goal not found");

  const newCurrent = (existing.currentAmount ?? 0) + addAmount;
  const shouldComplete = newCurrent >= existing.targetAmount;

  const goal = await db.goal.update({
    where: { id: goalId, userId: user.id },
    data: {
      currentAmount: newCurrent,
      status: shouldComplete ? "COMPLETED" : undefined,
    },
  });
  revalidatePath("/goals");
  return { success: true, data: serializeGoal(goal) };
}

export async function deleteGoal(goalId) {
  const user = await requireUser();
  await db.goal.delete({ where: { id: goalId, userId: user.id } });
  revalidatePath("/goals");
  return { success: true };
}

export async function simulateGoalProgress(goalId, simulationData) {
  const user = await requireUser();
  const goal = await db.goal.findUnique({
    where: { id: goalId, userId: user.id },
  });

  if (!goal) throw new Error("Goal not found");

  let simulatedCurrentAmount = goal.currentAmount.toNumber();
  let simulatedDueDate = goal.dueDate;
  let monthsRemaining = 0;

  const target = goal.targetAmount.toNumber();
  const monthlyContribution = simulationData.additionalMonthlyContribution
    ? parseFloat(simulationData.additionalMonthlyContribution)
    : 0;
  const annualInterestRate = simulationData.expectedInterestRate
    ? parseFloat(simulationData.expectedInterestRate) / 100
    : 0;

  // Calculate months to reach target
  if (monthlyContribution > 0 || annualInterestRate > 0) {
    let tempAmount = simulatedCurrentAmount;
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    while (tempAmount < target && monthsRemaining < 1200) { // Limit to 100 years to prevent infinite loops
      tempAmount += monthlyContribution;
      if (annualInterestRate > 0) {
        tempAmount *= (1 + annualInterestRate / 12);
      }
      monthsRemaining++;

      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
    }
    simulatedDueDate = new Date(currentYear, currentMonth, 1);
  }

  return {
    goalId: goal.id,
    simulatedCurrentAmount: parseFloat(simulatedCurrentAmount.toFixed(2)), // Ensure number conversion
    simulatedDueDate: simulatedDueDate,
    monthsToReachTarget: monthsRemaining,
    progressPercentage: target
      ? parseFloat(Math.min(100, (simulatedCurrentAmount / target) * 100).toFixed(1))
      : 0,
  };
}


