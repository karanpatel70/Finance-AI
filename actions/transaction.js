"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import aj from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const serializeAmount = (obj) => {
    const newObj = {
        ...obj,
        amount: obj.amount?.toNumber?.() ?? obj.amount,
    };

    if (newObj.splitTransactions) {
        newObj.splitTransactions = newObj.splitTransactions.map(splitEntry => ({
            ...splitEntry,
            amount: splitEntry.amount?.toNumber?.() ?? splitEntry.amount,
        }));
    }

    return newObj;
};

async function applyCategorizationRules(userId, description, merchantName) {
  const rules = await db.categorizationRule.findMany({
    where: { userId },
    orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
  });

  for (const rule of rules) {
    const keyword = rule.keyword.toLowerCase();
    const sourceText = `${description || ""} ${merchantName || ""}`.toLowerCase();

    if (sourceText.includes(keyword)) {
      return {
        category: rule.categoryId || undefined,
        tagIds: rule.tagIds ? rule.tagIds.split(",") : [],
      };
    }
  }
  return { category: undefined, tagIds: [] };
}

export async function createTransaction(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Get request data for ArcJet
    const req = await request();

    // Rrcjet to add rate limit
    // Check rate limit
    const decision = await aj.protect(req, {
      userId,
      requested: 1, // Specify how many tokens to consume
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        const { remaining, reset } = decision.reason;
        console.error({
          code: "RATE_LIMIT_EXCEEDED",
          details: {
            remaining,
            resetInSeconds: reset,
          },
        });

        throw new Error("Too many requests. Please try again later.");
      }

      throw new Error("Request blocked");
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const account = await db.account.findUnique({
      where: {
        id: data.accountId,
        userId: user.id,
      },
    });

    if (!account) {
      throw new Error("Account not found");
    }

    // Apply categorization rules if no category or tags are provided
    let finalCategory = data.category;
    let finalTagIds = data.tagIds;
    if (!data.category || !data.tagIds || data.tagIds.length === 0) {
      const { category: ruleCategory, tagIds: ruleTagIds } = await applyCategorizationRules(user.id, data.description, data.merchantName);
      if (!finalCategory) finalCategory = ruleCategory;
      if (!finalTagIds || finalTagIds.length === 0) finalTagIds = ruleTagIds;
    }

    // If split entries are provided, sum their amounts to get the main transaction amount
    const mainTransactionAmount = data.splitEntries?.reduce((sum, entry) => sum + parseFloat(entry.amount), 0) || parseFloat(data.amount);

    // Calculate new balance
    const balanceChange = data.type === "EXPENSE" ? -mainTransactionAmount : mainTransactionAmount;
    const newBalance = account.balance.toNumber() + balanceChange;

    // Create transaction and update account balance
    const transaction = await db.$transaction(async (tx) => {
      const newTransaction = await tx.transaction.create({
        data: {
          type: data.type,
          amount: data.splitEntries ? null : mainTransactionAmount, // Set amount to null if split entries exist
          description: data.description,
          date: data.date,
          category: data.splitEntries ? null : (finalCategory || null), // Use finalCategory
          userId: user.id,
          accountId: data.accountId,
          isRecurring: data.isRecurring,
          recurringInterval: data.recurringInterval,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurringDate(data.date, data.recurringInterval)
              : null,
          status: data.status || "COMPLETED", // Allow setting status, default to COMPLETED
          isTaxDeductible: data.isTaxDeductible || false,
          isTaxableIncome: data.isTaxableIncome || false,
          tags: {
            connect: finalTagIds?.map((id) => ({ id })) || [], // Use finalTagIds
          },
        },
      });

      if (data.splitEntries && data.splitEntries.length > 0) {
        for (const entry of data.splitEntries) {
          await tx.splitTransactionEntry.create({
            data: {
              amount: parseFloat(entry.amount),
              category: entry.category || null,
              description: entry.description || null,
              transactionId: newTransaction.id,
              userId: user.id,
              tags: {
                connect: entry.tagIds?.map(tagId => ({ id: tagId })) || [],
              },
            },
          });
        }
      }

      await tx.account.update({
        where: { id: data.accountId },
        data: { balance: newBalance },
      });

      return newTransaction;
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${transaction.accountId}`);

    return { success: true, data: serializeAmount(transaction) };
  } catch (error) {
    throw new Error(error.message);
  }
}

// Scan Receipt
export async function scanReceipt(file) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    // Convert ArrayBuffer to Base64
    const base64String = Buffer.from(arrayBuffer).toString("base64");

    const prompt = `
      Analyze this receipt image and extract the following information in JSON format:
      - Total amount (just the number)
      - Date (in ISO format)
      - Description or items purchased (brief summary)
      - Merchant/store name
      - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense )
      
      Only respond with valid JSON in this exact format:
      {
        "amount": number,
        "date": "ISO date string",
        "description": "string",
        "merchantName": "string",
        "category": "string"
      }

      If its not a recipt, return an empty object
    `;

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      },
      prompt,
    ]);

    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    try {
      const data = JSON.parse(cleanedText);
      return {
        amount: parseFloat(data.amount),
        date: new Date(data.date),
        description: data.description,
        category: data.category,
        merchantName: data.merchantName,
      };
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      throw new Error("Invalid response format from Gemini");
    }
  } catch (error) {
    console.error("Error scanning receipt:", error);
    throw new Error("Failed to scan receipt");
  }
}


function calculateNextRecurringDate(startDate, interval) {
  const date = new Date(startDate);

  switch (interval) {
    case "DAILY":
      date.setDate(date.getDate() + 1);
      break;
    case "WEEKLY":
      date.setDate(date.getDate() + 7);
      break;
    case "MONTHLY":
      date.setMonth(date.getMonth() + 1);
      break;
    case "YEARLY":
      date.setFullYear(date.getFullYear() + 1);
      break;
  }
  return date;
}

export async function getTransaction(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const transaction = await db.transaction.findUnique({
    where: {
      id,
      userId: user.id,
    },
    include: { tags: true, splitTransactions: { include: { tags: true } } }, // Include tags and split transactions with their tags
  });

  if (!transaction) throw new Error("Transaction not found");

  return serializeAmount(transaction);
}

export async function updateTransaction(id, data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Get original transaction to calculate balance change
    const originalTransaction = await db.transaction.findUnique({
      where: {
        id,
        userId: user.id,
      },
      include: {
        account: true,
        tags: true,
        splitTransactions: { include: { tags: true } }, // Include split transactions and their tags
      },
    });

    if (!originalTransaction) throw new Error("Transaction not found");

    // Apply categorization rules if no category or tags are provided in the update data
    let finalCategory = data.category !== undefined ? data.category : originalTransaction.category;
    let finalTagIds = data.tagIds !== undefined ? data.tagIds : originalTransaction.tags.map(tag => tag.id);

    if ((data.category === undefined && data.tagIds === undefined) || (data.tagIds && data.tagIds.length === 0)) {
      const { category: ruleCategory, tagIds: ruleTagIds } = await applyCategorizationRules(user.id, data.description || originalTransaction.description, data.merchantName || originalTransaction.merchantName);
      if (data.category === undefined) finalCategory = ruleCategory;
      if ((data.tagIds === undefined || data.tagIds.length === 0) && ruleTagIds.length > 0) finalTagIds = ruleTagIds;
    }

    // Calculate old and new total amounts
    let oldTotalAmount = originalTransaction.amount?.toNumber() || 0;
    if (originalTransaction.splitTransactions && originalTransaction.splitTransactions.length > 0) {
      oldTotalAmount = originalTransaction.splitTransactions.reduce((sum, entry) => sum + entry.amount.toNumber(), 0);
    }

    let newTotalAmount = data.amount ? parseFloat(data.amount) : 0;
    if (data.splitEntries && data.splitEntries.length > 0) {
      newTotalAmount = data.splitEntries.reduce((sum, entry) => sum + parseFloat(entry.amount), 0);
    }

    // Calculate balance changes
    const oldBalanceChange =
      originalTransaction.type === "EXPENSE"
        ? -oldTotalAmount
        : oldTotalAmount;

    const newBalanceChange =
      data.type === "EXPENSE" ? -newTotalAmount : newTotalAmount;

    const netBalanceChange = newBalanceChange - oldBalanceChange;

    // Update transaction and account balance in a transaction
    const transaction = await db.$transaction(async (tx) => {
      const updated = await tx.transaction.update({
        where: {
          id,
          userId: user.id,
        },
        data: {
          type: data.type,
          amount: data.splitEntries ? null : (data.amount ? parseFloat(data.amount) : null), // Set amount to null if split entries exist
          description: data.description,
          date: data.date,
          category: data.splitEntries ? null : (finalCategory || null), // Use finalCategory
          isRecurring: data.isRecurring,
          recurringInterval: data.recurringInterval,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurringDate(data.date, data.recurringInterval)
              : null,
          status: data.status || originalTransaction.status, // Allow updating status
          lastProcessed: data.lastProcessed || originalTransaction.lastProcessed, // Allow updating lastProcessed
          isTaxDeductible: data.isTaxDeductible !== undefined ? data.isTaxDeductible : originalTransaction.isTaxDeductible,
          isTaxableIncome: data.isTaxableIncome !== undefined ? data.isTaxableIncome : originalTransaction.isTaxableIncome,
          tags: {
            // Disconnect old tags not in the new data
            disconnect: originalTransaction.tags
              .filter((tag) => !finalTagIds?.includes(tag.id))
              .map((tag) => ({ id: tag.id })),
            // Connect new tags not in the old data
            connect: finalTagIds
              ?.filter(
                (tagId) => !originalTransaction.tags.some((tag) => tag.id === tagId)
              )
              .map((id) => ({ id })) || [],
          },
        },
      });

      // Handle split transactions
      const existingSplitEntryIds = originalTransaction.splitTransactions.map(entry => entry.id);
      const incomingSplitEntryIds = data.splitEntries?.map(entry => entry.id).filter(Boolean) || [];

      // Delete removed split entries
      const splitEntriesToDelete = existingSplitEntryIds.filter(id => !incomingSplitEntryIds.includes(id));
      if (splitEntriesToDelete.length > 0) {
        await tx.splitTransactionEntry.deleteMany({
          where: { id: { in: splitEntriesToDelete }, transactionId: id, userId: user.id },
        });
      }

      // Create or update split entries
      if (data.splitEntries && data.splitEntries.length > 0) {
        for (const entry of data.splitEntries) {
          // Apply categorization rules to split entry if category or tags are not provided
          let splitEntryFinalCategory = entry.category;
          let splitEntryFinalTagIds = entry.tagIds;
          if (!entry.category || !entry.tagIds || entry.tagIds.length === 0) {
            const { category: splitRuleCategory, tagIds: splitRuleTagIds } = await applyCategorizationRules(user.id, entry.description, originalTransaction.merchantName || data.merchantName);
            if (!splitEntryFinalCategory) splitEntryFinalCategory = splitRuleCategory;
            if (!splitEntryFinalTagIds || splitEntryFinalTagIds.length === 0) splitEntryFinalTagIds = splitRuleTagIds;
          }

          if (entry.id && existingSplitEntryIds.includes(entry.id)) {
            // Update existing split entry
            await tx.splitTransactionEntry.update({
              where: { id: entry.id, userId: user.id },
              data: {
                amount: parseFloat(entry.amount),
                category: splitEntryFinalCategory || null,
                description: entry.description || null,
                tags: {
                  // Disconnect old tags
                  disconnect: originalTransaction.splitTransactions.find(e => e.id === entry.id)?.tags
                    .filter(tag => !splitEntryFinalTagIds?.includes(tag.id))
                    .map(tag => ({ id: tag.id })) || [],
                  // Connect new tags
                  connect: splitEntryFinalTagIds
                    ?.filter(tagId => !originalTransaction.splitTransactions.find(e => e.id === entry.id)?.tags.some(tag => tag.id === tagId))
                    .map(tagId => ({ id: tagId })) || [],
                },
              },
            });
          } else {
            // Create new split entry
            await tx.splitTransactionEntry.create({
              data: {
                amount: parseFloat(entry.amount),
                category: splitEntryFinalCategory || null,
                description: entry.description || null,
                transactionId: updated.id,
                userId: user.id,
                tags: {
                  connect: splitEntryFinalTagIds?.map(tagId => ({ id: tagId })) || [],
                },
              },
            });
          }
        }
      }

      // Update account balance
      await tx.account.update({
        where: { id: data.accountId },
        data: {
          balance: {
            increment: netBalanceChange,
          },
        },
      });

      return updated;
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${data.accountId}`);

    return { success: true, data: serializeAmount(transaction) };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getFilteredTransactions(filters) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const whereClause = {
      userId: user.id,
      ...(filters.type && { type: filters.type }),
      ...(filters.accountId && { accountId: filters.accountId }),
      ...(filters.category && { category: filters.category }),
      ...(filters.minAmount && { amount: { gte: parseFloat(filters.minAmount) } }),
      ...(filters.maxAmount && { amount: { lte: parseFloat(filters.maxAmount) } }),
      ...(filters.startDate && { date: { gte: new Date(filters.startDate) } }), // New: Start Date filter
      ...(filters.endDate && { date: { lte: new Date(filters.endDate) } }),   // New: End Date filter
      ...(filters.tagIds && { tags: { some: { id: { in: filters.tagIds } } } }),
    };

    const transactions = await db.transaction.findMany({
      where: whereClause,
      orderBy: { date: "desc" },
      include: { tags: true, splitTransactions: { include: { tags: true } } },
    });

    return transactions.map(serializeAmount);
  } catch (error) {
    console.error("Error fetching filtered transactions:", error);
    throw error;
  }
}

export async function getExpenseTrends(filters) {
  const user = await requireUser();
  const { startDate, endDate, interval } = filters;

  const baseWhereClause = {
    userId: user.id,
    type: "EXPENSE",
    date: {},
  };

  if (startDate) {
    baseWhereClause.date.gte = new Date(startDate);
  }
  if (endDate) {
    baseWhereClause.date.lte = new Date(endDate);
  }

  const transactions = await db.transaction.findMany({
    where: baseWhereClause,
    orderBy: { date: "asc" },
  });

  // Group transactions by interval
  const trendData = {};
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    let key;

    switch (interval) {
      case "MONTHLY":
        key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        break;
      case "YEARLY":
        key = `${date.getFullYear()}`;
        break;
      case "DAILY": // Adding daily interval as well
        key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        break;
      default:
        key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        break;
    }

    trendData[key] = (trendData[key] || 0) + transaction.amount.toNumber();
  });

  // Convert to an array of objects for easier consumption by frontend charts
  const sortedTrendData = Object.entries(trendData)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([period, amount]) => ({ period, totalExpenses: amount }));

  return sortedTrendData;
}

export async function getNetWorthReport() {
  const user = await requireUser();

  // Fetch all accounts and sum their balances
  const accounts = await db.account.findMany({
    where: { userId: user.id },
  });
  const totalAccountBalance = accounts.reduce((sum, account) => sum + account.balance.toNumber(), 0);

  // Fetch all investments and sum their current values
  // We need to re-fetch investments with market prices updated
  const investmentsModule = require("./investments"); // Dynamically import to avoid circular dependency
  const investments = await investmentsModule.getInvestments(); // This already fetches and updates prices
  const totalInvestmentsValue = investments.reduce((sum, investment) => sum + (investment.currentValue || 0), 0);

  // Fetch all liabilities and sum their amounts
  const liabilities = await db.liability.findMany({
    where: { userId: user.id },
  });
  const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.amount.toNumber(), 0);

  const totalAssets = totalAccountBalance + totalInvestmentsValue;
  const netWorth = totalAssets - totalLiabilities;

  return {
    totalAssets: totalAssets,
    totalLiabilities: totalLiabilities,
    netWorth: netWorth,
    assetBreakdown: {
      accounts: totalAccountBalance,
      investments: totalInvestmentsValue,
    },
    liabilityBreakdown: liabilities.map(lib => ({
      id: lib.id,
      name: lib.name,
      amount: lib.amount.toNumber(),
      type: lib.type,
    })),
    reportDate: new Date(),
  };
}

export async function getTaxReport(year) {
  const user = await requireUser();
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

  const taxableIncomeTransactions = await db.transaction.findMany({
    where: {
      userId: user.id,
      type: "INCOME",
      isTaxableIncome: true,
      date: { gte: startOfYear, lte: endOfYear },
    },
  });

  const deductibleExpenseTransactions = await db.transaction.findMany({
    where: {
      userId: user.id,
      type: "EXPENSE",
      isTaxDeductible: true,
      date: { gte: startOfYear, lte: endOfYear },
    },
  });

  const totalTaxableIncome = taxableIncomeTransactions.reduce((sum, t) => sum + t.amount.toNumber(), 0);
  const totalDeductibleExpenses = deductibleExpenseTransactions.reduce((sum, t) => sum + t.amount.toNumber(), 0);

  return {
    year,
    totalTaxableIncome,
    taxableIncomeTransactions: taxableIncomeTransactions.map(serializeAmount),
    totalDeductibleExpenses,
    deductibleExpenseTransactions: deductibleExpenseTransactions.map(serializeAmount),
  };
}

export async function getCashFlowStatement(filters) {
  const user = await requireUser();
  const { startDate, endDate } = filters;

  const baseWhereClause = {
    userId: user.id,
    date: {},
  };

  if (startDate) {
    baseWhereClause.date.gte = new Date(startDate);
  }
  if (endDate) {
    baseWhereClause.date.lte = new Date(endDate);
  }

  const transactions = await db.transaction.findMany({
    where: baseWhereClause,
    include: { tags: true }, // Include tags to potentially help categorize
    orderBy: { date: "asc" },
  });

  let operatingActivitiesNet = 0;
  let investingActivitiesNet = 0;
  let financingActivitiesNet = 0;

  transactions.forEach(transaction => {
    const amount = transaction.amount.toNumber();

    // Simplified categorization for cash flow statement
    // In a real application, more sophisticated rules or explicit user input would be used.
    if (transaction.type === "INCOME") {
      // Assume most income is operating
      operatingActivitiesNet += amount;
    } else { // EXPENSE
      // Basic categorization based on keywords or categories
      const description = transaction.description?.toLowerCase() || "";
      const category = transaction.category?.toLowerCase() || "";

      if (description.includes("investment") || category.includes("investment")) {
        investingActivitiesNet -= amount;
      } else if (description.includes("loan") || category.includes("loan") || description.includes("debt") || category.includes("debt")) {
        financingActivitiesNet -= amount;
      } else {
        operatingActivitiesNet -= amount;
      }
    }
  });

  const netCashFlow = operatingActivitiesNet + investingActivitiesNet + financingActivitiesNet;

  return {
    startDate,
    endDate,
    operatingActivities: operatingActivitiesNet,
    investingActivities: investingActivitiesNet,
    financingActivities: financingActivitiesNet,
    netCashFlow,
    reportDate: new Date(),
  };
}

