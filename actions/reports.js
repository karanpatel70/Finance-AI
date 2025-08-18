"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

async function requireUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");
  return user;
}

export async function getMonthlyReport({ month, year } = {}) {
  const user = await requireUser();
  const now = new Date();
  const y = year ?? now.getFullYear();
  const m = month ?? now.getMonth();
  const start = new Date(y, m, 1);
  const end = new Date(y, m + 1, 0, 23, 59, 59, 999);

  const transactions = await db.transaction.findMany({
    where: {
      userId: user.id,
      date: { gte: start, lte: end },
    },
  });

  let totalIncome = 0;
  let totalExpense = 0;
  const byCategory = {};

  for (const t of transactions) {
    const amt = t.amount?.toNumber?.() ?? t.amount;
    if (t.type === "INCOME") totalIncome += amt;
    if (t.type === "EXPENSE") {
      totalExpense += amt;
      const key = t.category || "uncategorized";
      byCategory[key] = (byCategory[key] || 0) + amt;
    }
  }

  return {
    month: m,
    year: y,
    totalIncome,
    totalExpense,
    net: totalIncome - totalExpense,
    expensesByCategory: byCategory,
  };
}


