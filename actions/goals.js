"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeGoal = (goal) => ({
  ...goal,
  targetAmount: goal.targetAmount?.toNumber?.() ?? goal.targetAmount,
  currentAmount: goal.currentAmount?.toNumber?.() ?? goal.currentAmount,
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
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
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


