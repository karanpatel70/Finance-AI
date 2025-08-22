"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeInvestment = (inv) => ({
  ...inv,
  quantity: inv.quantity?.toNumber?.() ?? inv.quantity,
  averageCost: inv.averageCost?.toNumber?.() ?? inv.averageCost,
  lastPrice: inv.lastPrice?.toNumber?.() ?? inv.lastPrice,
  currentValue: (inv.quantity?.toNumber() ?? 0) * (inv.lastPrice?.toNumber() ?? 0),
  gainLoss: ((inv.quantity?.toNumber() ?? 0) * (inv.lastPrice?.toNumber() ?? 0)) -
            ((inv.quantity?.toNumber() ?? 0) * (inv.averageCost?.toNumber() ?? 0)),
  totalValue: (inv.quantity?.toNumber() ?? 0) * (inv.lastPrice?.toNumber() ?? 0),
  // For demonstration, simulating dailyChange and percentageChange
  dailyChange: ((inv.lastPrice?.toNumber() ?? 0) * 0.01), // Simulating a 1% daily change
  percentageChange: 1, // Simulating a 1% percentage change
  totalDividends: inv.dividendOrInterests?.reduce((sum, item) => sum + item.amount.toNumber(), 0) || 0,
  totalInterest: inv.dividendOrInterests?.reduce((sum, item) => sum + item.amount.toNumber(), 0) || 0, // Assuming type distinction is made when fetching.
  sector: getSimulatedSector(inv.symbol), // Simulated sector for diversification analysis
});

// Helper to simulate a sector based on symbol
function getSimulatedSector(symbol) {
  const sectorMap = {
    "AAPL": "Technology",
    "MSFT": "Technology",
    "GOOG": "Technology",
    "AMZN": "Consumer Discretionary",
    "TSLA": "Consumer Discretionary",
    "JPM": "Financials",
    "BAC": "Financials",
    "XOM": "Energy",
    "CVX": "Energy",
    "PFE": "Healthcare",
    "JNJ": "Healthcare",
    "KO": "Consumer Staples",
    "PG": "Consumer Staples",
    "VOW": "Automotive",
  };
  return sectorMap[symbol.toUpperCase()] || "Other";
}

// Simulate fetching real-time market price
async function fetchMarketPrice(symbol) {
  // In a real application, this would call an external API (e.g., Alpha Vantage, Finnhub)
  console.log(`Simulating fetching market price for ${symbol}`);
  return Math.random() * 1000; // Return a random price for demonstration
}

async function requireUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");
  return user;
}

const MARKET_DATA_STALE_TIME = 5 * 60 * 1000; // 5 minutes

export async function getInvestments() {
  const user = await requireUser();
  let investments = await db.investment.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { dividendOrInterests: true }, // Include dividend and interest records
  });

  // Check and update stale market prices
  const updatedInvestments = await Promise.all(investments.map(async (inv) => {
    const now = new Date();
    const lastFetched = inv.lastPriceFetchedAt;
    const isStale = !lastFetched || (now.getTime() - lastFetched.getTime() > MARKET_DATA_STALE_TIME);

    if (isStale) {
      const newPrice = await fetchMarketPrice(inv.symbol);
      const updated = await db.investment.update({
        where: { id: inv.id },
        data: {
          lastPrice: newPrice,
          lastPriceFetchedAt: now,
        },
      });
      return { ...updated, dividendOrInterests: inv.dividendOrInterests }; // Merge back dividends
    } else {
      return inv; // Return original if not stale
    }
  }));

  return updatedInvestments.map(serializeInvestment);
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

  // Remove market data fields from payload to prevent direct manipulation
  delete payload.lastPrice;
  delete payload.lastPriceFetchedAt;

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

export async function getPortfolioDiversification() {
  const user = await requireUser();
  const investments = await getInvestments(); // Use the existing getInvestments to get updated data

  const diversification = investments.reduce((acc, investment) => {
    const sector = investment.sector || "Uncategorized";
    acc[sector] = acc[sector] || { totalValue: 0, investments: [] };
    acc[sector].totalValue += investment.currentValue;
    acc[sector].investments.push(investment);
    return acc;
  }, {});

  const totalPortfolioValue = Object.values(diversification).reduce((sum, sectorData) => sum + sectorData.totalValue, 0);

  const diversificationPercentage = Object.entries(diversification).map(([sector, data]) => ({
    sector,
    totalValue: data.totalValue,
    percentage: totalPortfolioValue > 0 ? (data.totalValue / totalPortfolioValue) * 100 : 0,
    investments: data.investments.map(inv => ({
      id: inv.id,
      symbol: inv.symbol,
      name: inv.name,
      currentValue: inv.currentValue,
      quantity: inv.quantity,
    })),
  }));

  return {
    totalPortfolioValue,
    diversification: diversificationPercentage,
  };
}


