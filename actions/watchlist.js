"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { fetchMarketPrice } from "./investments"; // Assuming fetchMarketPrice is exported

async function requireUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");
  return user;
}

export async function getWatchlist() {
  const user = await requireUser();
  const watchlistSymbols = user.watchlist ? user.watchlist.split(",") : [];

  const watchlistWithPrices = await Promise.all(
    watchlistSymbols.map(async (symbol) => {
      const price = await fetchMarketPrice(symbol);
      return { symbol, price };
    })
  );
  return watchlistWithPrices;
}

export async function addToWatchlist(symbol) {
  const user = await requireUser();
  const currentWatchlist = user.watchlist ? user.watchlist.split(",") : [];
  if (!currentWatchlist.includes(symbol)) {
    currentWatchlist.push(symbol);
    await db.user.update({
      where: { id: user.id },
      data: { watchlist: currentWatchlist.join(",") },
    });
    revalidatePath("/watchlist");
  }
  return { success: true };
}

export async function removeFromWatchlist(symbol) {
  const user = await requireUser();
  const currentWatchlist = user.watchlist ? user.watchlist.split(",") : [];
  const updatedWatchlist = currentWatchlist.filter((s) => s !== symbol);
  await db.user.update({
    where: { id: user.id },
    data: { watchlist: updatedWatchlist.join(",") },
  });
  revalidatePath("/watchlist");
  return { success: true };
}
