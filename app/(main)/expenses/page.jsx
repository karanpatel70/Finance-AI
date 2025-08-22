import { getUserAccounts } from "@/actions/dashboard";
import ClientOnly from "@/components/client-only";
import TransactionTable from "../account/_components/transaction-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserCategories } from "@/actions/user-category";
import { getTags } from "@/actions/tag";
import { getFilteredTransactions } from "@/actions/transaction";
import { ExpenseClientPage } from "./_components/expense-client-page";

export default async function ExpensesPage() {
  const accounts = await getUserAccounts();
  const defaultAccount = accounts?.find((a) => a.isDefault) || accounts[0];
  
  const userCategories = await getUserCategories();
  const tags = await getTags();

  // Fetch initial transactions (e.g., all expenses for the default account)
  const initialTransactions = await getFilteredTransactions({
    accountId: defaultAccount?.id,
    type: "EXPENSE",
  });

  return (
    <div className="space-y-6">
      <ClientOnly>
        <ExpenseClientPage
          initialTransactions={initialTransactions}
          accounts={accounts}
          userCategories={userCategories}
          tags={tags}
          defaultAccountId={defaultAccount?.id}
        />
      </ClientOnly>
    </div>
  );
}


