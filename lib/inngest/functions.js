import EmailTemplate from "@/emails/template";
import { inngest } from "./client";
import { sendEmail } from "@/actions/send-email";
import { db } from "../prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

export const checkBudgetAlerts = inngest.createFunction(
  { name: "Check Budget Alerts" },
  { cron: "0 */6 * * *" }, // Every 6 hours
  async ({ step }) => {
    const budgets = await step.run("fetch-budgets", async () => {
      return await db.budget.findMany({
        include: {
          user: {
            include: {
              accounts: {
                where: {
                  isDefault: true,
                },
              },
            },
          },
        },
      });
    });

    for (const budget of budgets) {
      const defaultAccount = budget.user.accounts[0];

      if (!defaultAccount) continue; // Skip if no default account

      await step.run(`check-budget-${budget.id}`, async () => {
        const currentDate = new Date(); // Define currentDate
        const startOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() ,
          1
        );
        const endOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth()+1,
          0
        );
        
        // Calculate total expenses for the default account only
        const expenses = await db.transaction.aggregate({
          where: {
            userId: budget.userId,
            accountId: defaultAccount.id, // Only consider default account
            type: "EXPENSE",
            category: budget.category,
            date: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
          _sum: {
            amount: true,
          },
        });
        console.log("hello");
        const totalExpenses = expenses._sum.amount?.toNumber() || 0;
        const budgetAmount = budget.amount;
        const percentageUsed = (totalExpenses / budgetAmount) * 100;

        console.log("percentageUsed", percentageUsed);

        // Check if we should send an alert
        if (
          percentageUsed >= budget.alertThreshold.toNumber() * 100 && // Use custom threshold
          shouldSendAlert(new Date(budget.lastAlertSent), new Date(), budget.alertFrequency)
        ) {
          await sendEmail({
            to: budget.user.email,
            subject: `Budget Alert for ${defaultAccount.name} (${budget.category})`,
            react: EmailTemplate({
              userName: budget.user.name,
              type: "budget-alert",
              data: {
                percentageUsed,
                budgetAmount: budgetAmount.toNumber().toFixed(1),
                totalExpenses: totalExpenses.toFixed(1),
                accountName: defaultAccount.name,
                category: budget.category,
              },
            }),
          });

          // Update last alert sent
          await db.budget.update({
            where: { id: budget.id },
            data: { lastAlertSent: new Date() },
          });
        }
      });
    }
  }
);

// Trigger recurring transactions with batching
export const triggerRecurringTransactions = inngest.createFunction(
  {
    id: "trigger-recurring-transactions", // Unique ID,
    name: "Trigger Recurring Transactions",
  },
  { cron: "0 0 * * *" }, // Daily at midnight
  async ({ step }) => {
    const recurringTransactions = await step.run(
      "fetch-recurring-transactions",
      async () => {
        return await db.transaction.findMany({
          where: {
            isRecurring: true,
            status: "COMPLETED",
            OR: [
              { lastProcessed: null },
              {
                nextRecurringDate: {
                  lte: new Date(),
                },
              },
            ],
          },
        });
      }
    );

    // Send event for each recurring transaction in batches
    if (recurringTransactions.length > 0) {
      const events = recurringTransactions.map((transaction) => ({
        name: "transaction.recurring.process",
        data: {
          transactionId: transaction.id,
          userId: transaction.userId,
        },
      }));

      // Send events directly using inngest.send()
      await inngest.send(events);
    }

    return { triggered: recurringTransactions.length };
  }
);

// 1. Recurring Transaction Processing with Throttling
export const processRecurringTransaction = inngest.createFunction(
  {
    id: "process-recurring-transaction",
    name: "Process Recurring Transaction",
    throttle: {
      limit: 10, // Process 10 transactions
      period: "1m", // per minute
      key: "event.data.userId", // Throttle per user
    },
  },
  { event: "transaction.recurring.process" },
  async ({ event, step }) => {
    // Validate event data
    if (!event?.data?.transactionId || !event?.data?.userId) {
      console.error("Invalid event data:", event);
      return { error: "Missing required event data" };
    }

    await step.run("process-transaction", async () => {
      const transaction = await db.transaction.findUnique({
        where: {
          id: event.data.transactionId,
          userId: event.data.userId,
        },
        include: {
          account: true,
        },
      });

      if (!transaction || !isTransactionDue(transaction)) return;

      // Create new transaction and update account balance in a transaction
      await db.$transaction(async (tx) => {
        // Create new transaction
        await tx.transaction.create({
          data: {
            type: transaction.type,
            amount: transaction.amount,
            description: `${transaction.description} (Recurring)`,
            date: new Date(),
            category: transaction.category,
            userId: transaction.userId,
            accountId: transaction.accountId,
            isRecurring: false,
          },
        });

        // Update account balance
        const balanceChange =
          transaction.type === "EXPENSE"
            ? -transaction.amount.toNumber()
            : transaction.amount.toNumber();

        await tx.account.update({
          where: { id: transaction.accountId },
          data: { balance: { increment: balanceChange } },
        });

        // Update last processed date and next recurring date
        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            lastProcessed: new Date(),
            nextRecurringDate: calculateNextRecurringDate(
              new Date(),
              transaction.recurringInterval
            ),
          },
        });
      });
    });
  }
);

// 2. Monthly Report Generation
async function generateFinancialInsights(stats, month) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Analyze this financial data and provide 3 concise, actionable insights.
    Focus on spending patterns and practical advice.
    Keep it friendly and conversational.

    Financial Data for ${month}:
    - Total Income: $${stats.totalIncome}
    - Total Expenses: $${stats.totalExpenses}
    - Net Income: $${stats.totalIncome - stats.totalExpenses}
    - Expense Categories: ${Object.entries(stats.byCategory)
      .map(([category, amount]) => `${category}: $${amount}`)
      .join(", ")}

    Format the response as a JSON array of strings, like this:
    ["insight 1", "insight 2", "insight 3"]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating insights:", error);
    return [
      "Your highest expense category this month might need attention.",
      "Consider setting up a budget for better financial management.",
      "Track your recurring expenses to identify potential savings.",
    ];
  }
}

export const generateMonthlyReports = inngest.createFunction(
  {
    id: "generate-monthly-reports",
    name: "Generate Monthly Reports",
  },
  { cron: "0 0 1 * *" }, // First day of each month
  async ({ step }) => {
    const users = await step.run("fetch-users", async () => {
      return await db.user.findMany({
        include: { accounts: true },
      });
    });

    for (const user of users) {
      await step.run(`generate-report-${user.id}`, async () => {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const stats = await getMonthlyStats(user.id, lastMonth);
        const monthName = lastMonth.toLocaleString("default", {
          month: "long",
        });

        // Generate AI insights
        const insights = await generateFinancialInsights(stats, monthName);

        await sendEmail({
          to: user.email,
          subject: `Your Monthly Financial Report - ${monthName}`,
          react: EmailTemplate({
            userName: user.name,
            type: "monthly-report",
            data: {
              stats,
              month: monthName,
              insights,
            },
          }),
        });

        // Budget rollover logic
        const currentMonth = new Date();
        const previousMonth = new Date();
        previousMonth.setMonth(currentMonth.getMonth() - 1);

        const budgets = await db.budget.findMany({
          where: { userId: user.id },
    });

    for (const budget of budgets) {
          const startOfPreviousMonth = new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 1);
          const endOfPreviousMonth = new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 0, 23, 59, 59, 999);

        const expenses = await db.transaction.aggregate({
          where: {
              userId: user.id,
            type: "EXPENSE",
              category: budget.category,
            date: {
                gte: startOfPreviousMonth,
                lte: endOfPreviousMonth,
            },
          },
          _sum: {
            amount: true,
          },
        });

          const totalExpensesLastMonth = expenses._sum.amount?.toNumber() || 0;
          const remainingBudget = budget.amount.toNumber() - totalExpensesLastMonth;

          // Create historical budget record
          await db.historicalBudget.upsert({
            where: {
              userId_category_month_year: {
                userId: user.id,
                category: budget.category,
                month: previousMonth.getMonth() + 1, // Months are 0-indexed
                year: previousMonth.getFullYear(),
              },
            },
            update: {
              budgetedAmount: budget.amount,
              actualExpenses: totalExpensesLastMonth,
              rolloverAmount: remainingBudget,
            },
            create: {
              userId: user.id,
              category: budget.category,
              month: previousMonth.getMonth() + 1, // Months are 0-indexed
              year: previousMonth.getFullYear(),
              budgetedAmount: budget.amount,
              actualExpenses: totalExpensesLastMonth,
              rolloverAmount: remainingBudget,
            },
          });

          // Update the budget for the current month with rollover
          await db.budget.update({
            where: { id: budget.id },
            data: {
              amount: budget.amount.toNumber() + remainingBudget,
              rolloverAmount: 0, // Reset rollover for the next cycle
            },
          });
        }


      });
    }

    return { processed: users.length };
  }
);

// Utility functions
function isTransactionDue(transaction) {
  // If no lastProcessed date, transaction is due
  if (!transaction.lastProcessed) return true;

  const today = new Date();
  const nextDue = new Date(transaction.nextRecurringDate);

  // Compare with nextDue date
  return nextDue <= today;
}

function calculateNextRecurringDate(date, interval) {
  const next = new Date(date);
  switch (interval) {
    case "DAILY":
      next.setDate(next.getDate() + 1);
      break;
    case "WEEKLY":
      next.setDate(next.getDate() + 7);
      break;
    case "MONTHLY":
      next.setMonth(next.getMonth() + 1);
      break;
    case "YEARLY":
      next.setFullYear(next.getFullYear() + 1);
      break;
  }
  return next;
}

function isNewMonth(lastAlertDate, currentDate) {
  return (
    lastAlertDate.getMonth() !== currentDate.getMonth() ||
    lastAlertDate.getFullYear() !== currentDate.getFullYear()
  );
}

function shouldSendAlert(lastAlertDate, currentDate, frequency) {
  if (frequency === "NONE") return false;
  if (!lastAlertDate) return true; // Always send if no previous alert

  const last = new Date(lastAlertDate);
  const current = new Date(currentDate);

  switch (frequency) {
    case "DAILY":
      return last.getDate() !== current.getDate() ||
             last.getMonth() !== current.getMonth() ||
             last.getFullYear() !== current.getFullYear();
    case "WEEKLY":
      // Simple week check (might not align with ISO weeks perfectly but good enough for alerts)
      const oneWeek = 1000 * 60 * 60 * 24 * 7;
      return (current.getTime() - last.getTime()) >= oneWeek;
    case "MONTHLY":
      return isNewMonth(last, current);
    default:
      return true; // Default to always sending if frequency is unrecognized
  }
}

async function getMonthlyStats(userId, month) {
  const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
  const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);

  const transactions = await db.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  return transactions.reduce(
    (stats, t) => {
      const amount = t.amount.toNumber();
      if (t.type === "EXPENSE") {
        stats.totalExpenses += amount;
        stats.byCategory[t.category] =
          (stats.byCategory[t.category] || 0) + amount;
      } else {
        stats.totalIncome += amount;
      }
      return stats;
    },
    {
      totalExpenses: 0,
      totalIncome: 0,
      byCategory: {},
      transactionCount: transactions.length,
    }
  );
}

export const processPendingTransactions = inngest.createFunction(
  { name: "Process Pending Transactions" },
  { cron: "0 * * * *" }, // Every hour
  async ({ step }) => {
    const pendingTransactions = await step.run("fetch-pending-transactions", async () => {
      const twentyFourHoursAgo = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
      return await db.transaction.findMany({
        where: {
          status: "PENDING",
          createdAt: { lte: twentyFourHoursAgo },
        },
      });
    });

    for (const transaction of pendingTransactions) {
      await step.run(`complete-transaction-${transaction.id}`, async () => {
        await db.transaction.update({
          where: { id: transaction.id },
          data: { status: "COMPLETED" },
        });
        revalidatePath("/dashboard");
        revalidatePath(`/account/${transaction.accountId}`);
      });
    }

    return { processed: pendingTransactions.length };
  }
);

// Utility function to determine if an auto-contribution is due
function isAutoContributionDue(lastProcessedDate, currentDate, frequency) {
  if (!lastProcessedDate) return true; // Always contribute if no previous contribution

  const last = new Date(lastProcessedDate);
  const current = new Date(currentDate);

  switch (frequency) {
    case "DAILY":
      return last.getDate() !== current.getDate() ||
             last.getMonth() !== current.getMonth() ||
             last.getFullYear() !== current.getFullYear();
    case "WEEKLY":
      const oneWeek = 1000 * 60 * 60 * 24 * 7;
      return (current.getTime() - last.getTime()) >= oneWeek;
    case "MONTHLY":
      return last.getMonth() !== current.getMonth() ||
             last.getFullYear() !== current.getFullYear();
    case "YEARLY":
      return last.getFullYear() !== current.getFullYear();
    default:
      return false; // Should not happen with validation
  }
}

export const processGoalAutoContributions = inngest.createFunction(
  { name: "Process Goal Auto Contributions" },
  { cron: "0 0 * * *" }, // Every day at midnight
  async ({ step }) => {
    const goalsToContribute = await step.run("fetch-goals-for-auto-contribution", async () => {
      return await db.goal.findMany({
        where: {
          autoContributeAmount: { not: null },
          autoContributeFrequency: { not: null },
          status: "ACTIVE",
        },
        include: {
          user: {
            include: {
              accounts: {
                where: { isDefault: true },
              },
            },
          },
        },
      });
    });

    for (const goal of goalsToContribute) {
      if (!goal.user?.accounts[0]) continue; // Skip if no default account

      await step.run(`contribute-to-goal-${goal.id}`, async () => {
        const lastProcessedDateForContribution = goal.lastContributedAt; // Assuming a new field `lastContributedAt` for goals

        if (isAutoContributionDue(lastProcessedDateForContribution, new Date(), goal.autoContributeFrequency)) {
          const contributionAmount = goal.autoContributeAmount.toNumber();
          const defaultAccountId = goal.user.accounts[0].id;

          await db.$transaction(async (tx) => {
            // Create a new transaction representing the contribution
            await tx.transaction.create({
              data: {
                type: "EXPENSE", // Or a specific type for goal contributions
                amount: contributionAmount,
                description: `Auto-contribution to goal: ${goal.title}`,
                date: new Date(),
                category: "Savings", // A default category for contributions
                userId: goal.userId,
                accountId: defaultAccountId,
                status: "COMPLETED",
                isRecurring: false,
              },
            });

            // Update the goal's current amount
            await tx.goal.update({
              where: { id: goal.id },
              data: {
                currentAmount: { increment: contributionAmount },
                lastContributedAt: new Date(), // Update last contributed date
              },
            });

            // Deduct from account balance
            await tx.account.update({
              where: { id: defaultAccountId },
              data: { balance: { decrement: contributionAmount } },
            });
          });

          revalidatePath("/dashboard");
          revalidatePath("/goals");
          revalidatePath(`/account/${defaultAccountId}`);
        }
      });
    }

    return { processed: goalsToContribute.length };
  }
);