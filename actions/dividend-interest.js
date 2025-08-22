"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

async function requireUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");
  return user;
}

export async function getDividendInterests(investmentId) {
  const user = await requireUser();
  const whereClause = {
    userId: user.id,
    ...(investmentId && { investmentId }),
  };
  const records = await db.dividendOrInterest.findMany({
    where: whereClause,
    orderBy: { date: "desc" },
  });
  return records.map(record => ({
    ...record,
    amount: record.amount.toNumber(),
  }));
}

export async function createDividendInterest(data) {
  const user = await requireUser();
  const record = await db.dividendOrInterest.create({
    data: {
      userId: user.id,
      investmentId: data.investmentId,
      amount: parseFloat(data.amount),
      date: new Date(data.date),
      type: data.type,
      description: data.description || null,
    },
  });
  revalidatePath("/investments");
  revalidatePath(`/investment/${data.investmentId}`);
  return { success: true, data: { ...record, amount: record.amount.toNumber() } };
}

export async function updateDividendInterest(id, data) {
  const user = await requireUser();
  const record = await db.dividendOrInterest.update({
    where: { id, userId: user.id },
    data: {
      investmentId: data.investmentId,
      amount: parseFloat(data.amount),
      date: new Date(data.date),
      type: data.type,
      description: data.description || null,
    },
  });
  revalidatePath("/investments");
  revalidatePath(`/investment/${data.investmentId}`);
  return { success: true, data: { ...record, amount: record.amount.toNumber() } };
}

export async function deleteDividendInterest(id) {
  const user = await requireUser();
  await db.dividendOrInterest.delete({ where: { id, userId: user.id } });
  revalidatePath("/investments");
  return { success: true };
}
