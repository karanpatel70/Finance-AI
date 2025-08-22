-- AlterTable
ALTER TABLE "investments" ADD COLUMN "lastPrice" DECIMAL;
ALTER TABLE "investments" ADD COLUMN "lastPriceFetchedAt" DATETIME;
