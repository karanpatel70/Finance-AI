import CreateAccountDrawer from "@/components/create-account-drawer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus } from "lucide-react";
import React from "react";
import { getDashboardData, getUserAccounts } from "@/actions/dashboard";
import AccountCard from "./_components/account-card";
import { getCurrentBudget } from "@/actions/budget";
import { BudgetProgress } from "./_components/budget-progress";
import { DashboardOverview } from "./_components/transaction-overview";
import ClientOnly from "@/components/client-only";

async function DashboardPage() {
  // Fetch all user accounts first
  const accounts = await getUserAccounts();
  const defaultAccount = accounts?.find((account) => account.isDefault);

  // Safely fetch budget and transactions only if a default account exists
  let budgetData = null;
  let transactions = []; // Default to an empty array

  if (defaultAccount) {
    // Run fetches in parallel for better performance
    const [budgetResult, transactionResult] = await Promise.all([
      getCurrentBudget(defaultAccount.id),
      getDashboardData(defaultAccount.id),
    ]);
    budgetData = budgetResult;
    transactions = transactionResult || [];
  }

  return (
    <div className="space-y-8" suppressHydrationWarning>
      {/* Budget Progress */}
      <ClientOnly fallback={
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex-1">
              <CardTitle className="text-sm font-medium">
                Monthly Budget (Default Account)
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <CardDescription>Loading...</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          </CardContent>
        </Card>
      }>
        <BudgetProgress
          key={`budget-${budgetData?.budget?.amount || 'no-budget'}-${budgetData?.currentExpenses || 0}`}
          initialBudget={budgetData?.budget}
          currentExpenses={budgetData?.currentExpenses || 0}
        />
      </ClientOnly>
      {/* Dashboard Overview */}
      <ClientOnly>
        <DashboardOverview
          accounts={accounts}
          transactions={transactions}
        />
      </ClientOnly>

      {/* Accounts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ClientOnly>
          <CreateAccountDrawer>
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
              <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
                <Plus className="h-10 w-10 mb-2" />
                <p className="text-sm font-medium">Add New Account</p>
              </CardContent>
            </Card>
          </CreateAccountDrawer>
        </ClientOnly>

        {accounts.length > 0 &&
          accounts?.map((account) => {
            return (
              <ClientOnly key={account.id}>
                <AccountCard account={account} />
              </ClientOnly>
            );
          })}
      </div>
    </div>
  );
}

export default DashboardPage;