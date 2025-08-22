-- CreateTable
CREATE TABLE "historical_budgets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "budgetedAmount" DECIMAL NOT NULL,
    "actualExpenses" DECIMAL NOT NULL DEFAULT 0,
    "rolloverAmount" DECIMAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "historical_budgets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "historical_budgets_userId_idx" ON "historical_budgets"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "historical_budgets_userId_category_month_year_key" ON "historical_budgets"("userId", "category", "month", "year");
