-- CreateTable
CREATE TABLE "split_transaction_entries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" DECIMAL NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "transactionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "split_transaction_entries_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "split_transaction_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_SplitTransactionEntryToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_SplitTransactionEntryToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "split_transaction_entries" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_SplitTransactionEntryToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "tags" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "amount" DECIMAL,
    "description" TEXT,
    "date" DATETIME NOT NULL,
    "category" TEXT,
    "receiptUrl" TEXT,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurringInterval" TEXT,
    "nextRecurringDate" DATETIME,
    "lastProcessed" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "userId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "transactions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_transactions" ("accountId", "amount", "category", "createdAt", "date", "description", "id", "isRecurring", "lastProcessed", "nextRecurringDate", "receiptUrl", "recurringInterval", "status", "type", "updatedAt", "userId") SELECT "accountId", "amount", "category", "createdAt", "date", "description", "id", "isRecurring", "lastProcessed", "nextRecurringDate", "receiptUrl", "recurringInterval", "status", "type", "updatedAt", "userId" FROM "transactions";
DROP TABLE "transactions";
ALTER TABLE "new_transactions" RENAME TO "transactions";
CREATE INDEX "transactions_userId_idx" ON "transactions"("userId");
CREATE INDEX "transactions_accountId_idx" ON "transactions"("accountId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "split_transaction_entries_transactionId_idx" ON "split_transaction_entries"("transactionId");

-- CreateIndex
CREATE INDEX "split_transaction_entries_userId_idx" ON "split_transaction_entries"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_SplitTransactionEntryToTag_AB_unique" ON "_SplitTransactionEntryToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_SplitTransactionEntryToTag_B_index" ON "_SplitTransactionEntryToTag"("B");
