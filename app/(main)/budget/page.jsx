import { getUserAccounts } from "@/actions/dashboard";
import { getCurrentBudget, updateBudget } from "@/actions/budget";
import { BudgetProgress } from "../dashboard/_components/budget-progress";
import ClientOnly from "@/components/client-only";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateBudgetDrawer } from "../dashboard/_components/create-budget-drawer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function BudgetPage() {
  const accounts = await getUserAccounts();
  const defaultAccount = accounts?.find((a) => a.isDefault);
  const budgetData = defaultAccount
    ? await getCurrentBudget(defaultAccount.id)
    : { budget: null, currentExpenses: 0 };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientOnly>
            {budgetData?.budget ? (
              <BudgetProgress
                initialBudget={budgetData?.budget}
                currentExpenses={budgetData?.currentExpenses || 0}
              />
            ) : (
              <div className="p-4 text-center">
                <p className="text-gray-500 mb-4">No budget set for this account. Create one now!</p>
                <CreateBudgetDrawer>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Create Budget
                  </Button>
                </CreateBudgetDrawer>
              </div>
            )}
          </ClientOnly>
        </CardContent>
      </Card>
    </div>
  );
}


