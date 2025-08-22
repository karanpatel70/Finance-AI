"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeBudget = (budget) => ({
  ...budget,
  amount: budget.amount?.toNumber?.() ?? budget.amount,
  rolloverAmount: budget.rolloverAmount?.toNumber?.() ?? budget.rolloverAmount,
  alertThreshold: budget.alertThreshold?.toNumber?.() ?? budget.alertThreshold,
});

export async function getCurrentBudget(accountId, category = "Uncategorized") {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    console.log("user", user);

    const budget = await db.budget.findFirst({
      where: {
        userId: user.id,
        category,
      },
    });

    // Get current month's expenses
    const currentDate = new Date();
    console.log("currentDate", currentDate);
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() +1,
      0
    );

    console.log("startOfMonth", startOfMonth);
    console.log("endOfMonth", endOfMonth);  
    console.log("usid",user.id );

    

    const expensesWhereClause = {
      userId: user.id,
      type: "EXPENSE",
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
      ...(accountId && { accountId }), // Conditionally include accountId
    };

    console.log("expensesWhereClause", expensesWhereClause);

    const expenses = await db.transaction.groupBy({
      by: ["category"],
      where: expensesWhereClause,
      _sum: {
        amount: true,
      },
    });

    console.log("expenses", expenses);

    const totalCurrentExpenses = expenses.reduce((sum, item) => sum + item._sum.amount.toNumber(), 0);

    return {
      budget: budget ? serializeBudget(budget) : null,
      currentExpenses: totalCurrentExpenses,
      expensesByCategory: expenses.map(item => ({
        category: item.category,
        amount: item._sum.amount.toNumber(),
      })),
    };
  } catch (error) {
    console.error("Error fetching budget:", error);
    throw error;
  }
}

export async function updateBudget(data, category = "Uncategorized") {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Update or create budget
    const budget = await db.budget.upsert({
      where: {
        userId: user.id,
        category,
      },
      update: {
        amount: data.amount,
        alertThreshold: data.alertThreshold,
        alertFrequency: data.alertFrequency,
      },
      create: {
        userId: user.id,
        amount: data.amount,
        category,
        alertThreshold: data.alertThreshold,
        alertFrequency: data.alertFrequency,
      },
    });

    revalidatePath("/dashboard");
    return {
      success: true,
      data: serializeBudget(budget),
    };
  } catch (error) {
    console.error("Error updating budget:", error);
    return { success: false, error: error.message };
  }
}

export async function getAllBudgets() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const budgets = await db.budget.findMany({
      where: {
        userId: user.id,
      },
      orderBy: { category: "asc" }, // Order by category for consistent display
    });

    // Fetch current month's expenses for each budget
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const budgetsWithExpenses = await Promise.all(budgets.map(async (budget) => {
      const expenses = await db.transaction.groupBy({
        by: ["category"],
        where: {
          userId: user.id,
          type: "EXPENSE",
          category: budget.category,
          date: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        _sum: {
          amount: true,
        },
      });

      const totalCurrentExpenses = expenses.reduce((sum, item) => sum + item._sum.amount.toNumber(), 0);
      const expensesByCategory = expenses.map(item => ({
        category: item.category,
        amount: item._sum.amount.toNumber(),
      }));

      return {
        ...serializeBudget(budget),
        currentExpenses: totalCurrentExpenses,
        expensesByCategory,
      };
    }));

    return budgetsWithExpenses;

  } catch (error) {
    console.error("Error fetching all budgets:", error);
    throw error;
  }
}

export async function getHistoricalBudgetAnalysis(category, year) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const whereClause = {
      userId: user.id,
      ...(category && { category }),
      ...(year && { year }),
    };

    const historicalData = await db.historicalBudget.findMany({
      where: whereClause,
      orderBy: [{ year: "asc" }, { month: "asc" }],
    });

    return historicalData.map((data) => ({
      ...data,
      budgetedAmount: data.budgetedAmount.toNumber(),
      actualExpenses: data.actualExpenses.toNumber(),
      rolloverAmount: data.rolloverAmount.toNumber(),
    }));
  } catch (error) {
    console.error("Error fetching historical budget analysis:", error);
    throw error;
  }
}