import { getUserAccounts } from "@/actions/dashboard";
import { getCurrentBudget, updateBudget } from "@/actions/budget";
import { BudgetProgress } from "../dashboard/_components/budget-progress";
import ClientOnly from "@/components/client-only";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
            <BudgetProgress
              initialBudget={budgetData?.budget}
              currentExpenses={budgetData?.currentExpenses || 0}
            />
          </ClientOnly>
        </CardContent>
      </Card>
    </div>
  );
}


