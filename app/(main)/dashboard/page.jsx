import CreateAccountDrawer from "@/components/create-account-drawer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus } from "lucide-react";
import React from "react";
import { getDashboardData, getUserAccounts } from "@/actions/dashboard";
import AccountCard from "./_components/account-card";
import { getAllBudgets } from "@/actions/budget"; // Import getAllBudgets
import { BudgetProgress } from "./_components/budget-progress";
import { DashboardOverview } from "./_components/transaction-overview";
import ClientOnly from "@/components/client-only";
import { CreateBudgetDrawer } from "./_components/create-budget-drawer"; // Import the new drawer
import { Button } from "@/components/ui/button"; // Added missing import for Button

async function DashboardPage() {
  // Fetch all user accounts first
  const accounts = await getUserAccounts();
  const defaultAccount = accounts?.find((account) => account.isDefault);

  // Fetch all budgets using the new action
  const allBudgets = await getAllBudgets();

  // Safely fetch dashboard data only if a default account exists
  let transactions = []; // Default to an empty array

  if (defaultAccount) {
    const transactionResult = await getDashboardData(defaultAccount.id);
    transactions = transactionResult || [];
  }

  return (
    <div className="space-y-8" suppressHydrationWarning>
      {/* Budget Planning Section */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold tracking-tight">Budget Planning</h2>
        <CreateBudgetDrawer> {/* Removed onBudgetCreated prop */}
          <Button className="flex items-center gap-2">
            <span className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add New Budget
            </span>
          </Button>
        </CreateBudgetDrawer>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {allBudgets.length === 0 ? (
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>No Budgets Set</CardTitle>
              <CardDescription>Click "Add New Budget" to create your first budget.</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          allBudgets.map((budget) => (
            <ClientOnly key={budget.id} fallback={
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex-1">
                    <CardTitle className="text-sm font-medium">
                      Monthly Budget (Loading)
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
                key={budget.id}
                initialBudget={budget}
                currentExpenses={budget.currentExpenses || 0}
              />
            </ClientOnly>
          ))
        )}
      </div>

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
                <div className="flex flex-col items-center justify-center">
                  <Plus className="h-10 w-10 mb-2" />
                  <p className="text-sm font-medium">Add New Account</p>
                </div>
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