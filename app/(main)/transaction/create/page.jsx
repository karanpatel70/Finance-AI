import { getUserAccounts } from "@/actions/dashboard";
import { defaultCategories } from "@/data/categories";
import { AddTransactionForm } from "../_components/transaction-form";
import { getTransaction } from "@/actions/transaction";
import ClientOnly from "@/components/client-only";

export default async function AddTransactionPage({ searchParams }) {
  const accounts = await getUserAccounts();

  const editId = searchParams?.edit;

  let initialData = null;
  if (editId) {
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }

  return (
    <div className="max-w-3xl mx-auto px-5" suppressHydrationWarning>
      <div className="flex justify-center md:justify-normal mb-8">
        <h1 className="text-5xl gradient-title ">{editId?"Edit":"Add"} Transaction</h1>
      </div>
      <ClientOnly>
        <AddTransactionForm
          accounts={accounts}
          categories={defaultCategories}
          editMode={!!editId}
          initialData={initialData}
        />
      </ClientOnly>
    </div>
  );
}
