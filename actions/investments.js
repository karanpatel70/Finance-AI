"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeInvestment = (inv) => ({
  ...inv,
  quantity: inv.quantity?.toNumber?.() ?? inv.quantity,
  averageCost: inv.averageCost?.toNumber?.() ?? inv.averageCost,
});

async function requireUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");
  return user;
}

export async function getInvestments() {
  const user = await requireUser();
  const investments = await db.investment.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return investments.map(serializeInvestment);
}

export async function createInvestment(data) {
  const user = await requireUser();

  const quantity = parseFloat(data.quantity);
  const averageCost = parseFloat(data.averageCost);
  if (isNaN(quantity) || quantity < 0) throw new Error("Invalid quantity");
  if (isNaN(averageCost) || averageCost < 0) throw new Error("Invalid average cost");

  const inv = await db.investment.create({
    data: {
      symbol: data.symbol,
      name: data.name || null,
      quantity,
      averageCost,
      notes: data.notes || null,
      userId: user.id,
    },
  });
  revalidatePath("/investments");
  return { success: true, data: serializeInvestment(inv) };
}

export async function updateInvestment(id, data) {
  const user = await requireUser();
  const payload = { ...data };
  if (payload.quantity !== undefined) {
    const q = parseFloat(payload.quantity);
    if (isNaN(q) || q < 0) throw new Error("Invalid quantity");
    payload.quantity = q;
  }
  if (payload.averageCost !== undefined) {
    const c = parseFloat(payload.averageCost);
    if (isNaN(c) || c < 0) throw new Error("Invalid average cost");
    payload.averageCost = c;
  }

  const inv = await db.investment.update({
    where: { id, userId: user.id },
    data: payload,
  });
  revalidatePath("/investments");
  return { success: true, data: serializeInvestment(inv) };
}

export async function deleteInvestment(id) {
  const user = await requireUser();
  await db.investment.delete({ where: { id, userId: user.id } });
  revalidatePath("/investments");
  return { success: true };
}


