import { getUserAccounts, getDashboardData } from "@/actions/dashboard";
import ClientOnly from "@/components/client-only";
import TransactionTable from "../account/_components/transaction-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ExpensesPage() {
  const accounts = await getUserAccounts();
  const defaultAccount = accounts?.find((a) => a.isDefault) || accounts[0];
  const transactions = await getDashboardData();
  const onlyExpenses = (transactions || []).filter((t) => t.type === "EXPENSE");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Expense Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientOnly>
            <TransactionTable transactions={onlyExpenses} />
          </ClientOnly>
        </CardContent>
      </Card>
    </div>
  );
}


