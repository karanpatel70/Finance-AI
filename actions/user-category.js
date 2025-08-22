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

export async function getUserCategories(type) {
  const user = await requireUser();
  const whereClause = {
    userId: user.id,
    ...(type && { type }),
  };
  const categories = await db.userCategory.findMany({
    where: whereClause,
    orderBy: { name: "asc" },
  });
  return categories;
}

export async function createUserCategory(data) {
  const user = await requireUser();
  const category = await db.userCategory.create({
    data: {
      name: data.name,
      type: data.type,
      color: data.color || null,
      icon: data.icon || null,
      userId: user.id,
    },
  });
  revalidatePath("/settings/categories");
  return { success: true, data: category };
}

export async function updateUserCategory(id, data) {
  const user = await requireUser();
  const category = await db.userCategory.update({
    where: { id, userId: user.id },
    data: {
      name: data.name,
      type: data.type,
      color: data.color || null,
      icon: data.icon || null,
    },
  });
  revalidatePath("/settings/categories");
  return { success: true, data: category };
}

export async function deleteUserCategory(id) {
  const user = await requireUser();
  await db.userCategory.delete({ where: { id, userId: user.id } });
  revalidatePath("/settings/categories");
  return { success: true };
}
