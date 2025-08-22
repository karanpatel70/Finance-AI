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

export async function getTags() {
  const user = await requireUser();
  const tags = await db.tag.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
  });
  return tags;
}

export async function createTag(data) {
  const user = await requireUser();
  const tag = await db.tag.create({
    data: {
      name: data.name,
      userId: user.id,
    },
  });
  revalidatePath("/settings/tags");
  return { success: true, data: tag };
}

export async function updateTag(id, data) {
  const user = await requireUser();
  const tag = await db.tag.update({
    where: { id, userId: user.id },
    data: {
      name: data.name,
    },
  });
  revalidatePath("/settings/tags");
  return { success: true, data: tag };
}

export async function deleteTag(id) {
  const user = await requireUser();
  await db.tag.delete({ where: { id, userId: user.id } });
  revalidatePath("/settings/tags");
  return { success: true };
}
