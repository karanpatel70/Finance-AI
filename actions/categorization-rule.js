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

export async function getCategorizationRules() {
  const user = await requireUser();
  const rules = await db.categorizationRule.findMany({
    where: { userId: user.id },
    orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
    include: { userCategory: true },
  });
  return rules;
}

export async function createCategorizationRule(data) {
  const user = await requireUser();
  const rule = await db.categorizationRule.create({
    data: {
      userId: user.id,
      keyword: data.keyword,
      categoryId: data.categoryId || null,
      tagIds: data.tagIds ? data.tagIds.join(",") : null,
      priority: data.priority || 0,
    },
  });
  revalidatePath("/settings/categorization-rules");
  return { success: true, data: rule };
}

export async function updateCategorizationRule(id, data) {
  const user = await requireUser();
  const rule = await db.categorizationRule.update({
    where: { id, userId: user.id },
    data: {
      keyword: data.keyword,
      categoryId: data.categoryId || null,
      tagIds: data.tagIds ? data.tagIds.join(",") : null,
      priority: data.priority,
    },
  });
  revalidatePath("/settings/categorization-rules");
  return { success: true, data: rule };
}

export async function deleteCategorizationRule(id) {
  const user = await requireUser();
  await db.categorizationRule.delete({ where: { id, userId: user.id } });
  revalidatePath("/settings/categorization-rules");
  return { success: true };
}
