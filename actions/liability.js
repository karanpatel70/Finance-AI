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

const serializeLiability = (liability) => ({
  ...liability,
  amount: liability.amount.toNumber(),
  interestRate: liability.interestRate?.toNumber() ?? null,
});

export async function getLiabilities() {
  const user = await requireUser();
  const liabilities = await db.liability.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return liabilities.map(serializeLiability);
}

export async function createLiability(data) {
  const user = await requireUser();
  const liability = await db.liability.create({
    data: {
      userId: user.id,
      name: data.name,
      amount: parseFloat(data.amount),
      type: data.type,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      interestRate: data.interestRate ? parseFloat(data.interestRate) : null,
    },
  });
  revalidatePath("/net-worth");
  return { success: true, data: serializeLiability(liability) };
}

export async function updateLiability(id, data) {
  const user = await requireUser();
  const liability = await db.liability.update({
    where: { id, userId: user.id },
    data: {
      name: data.name,
      amount: parseFloat(data.amount),
      type: data.type,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      interestRate: data.interestRate ? parseFloat(data.interestRate) : null,
    },
  });
  revalidatePath("/net-worth");
  return { success: true, data: serializeLiability(liability) };
}

export async function deleteLiability(id) {
  const user = await requireUser();
  await db.liability.delete({ where: { id, userId: user.id } });
  revalidatePath("/net-worth");
  return { success: true };
}
