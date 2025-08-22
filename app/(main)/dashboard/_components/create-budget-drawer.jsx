"use client";

import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { updateBudget } from "@/actions/budget";
import { getUserCategories } from "@/actions/user-category";

export function CreateBudgetDrawer({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [rolloverAmount, setRolloverAmount] = useState("");
  const [alertThreshold, setAlertThreshold] = useState("");
  const [alertFrequency, setAlertFrequency] = useState("MONTHLY");

  const router = useRouter();

  const { data: userCategories } = useFetch(getUserCategories);
  const { loading, fn: createBudgetFn } = useFetch(updateBudget);

  const handleSubmit = async () => {
    if (!amount) {
      toast.error("Budget amount is required.");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Please enter a valid budget amount.");
      return;
    }

    const parsedRollover = rolloverAmount ? parseFloat(rolloverAmount) : 0;
    const parsedAlertThreshold = alertThreshold ? parseFloat(alertThreshold) : 0;

    try {
      const result = await createBudgetFn({
        amount: parsedAmount,
        category: category,
        rolloverAmount: parsedRollover,
        alertThreshold: parsedAlertThreshold,
        alertFrequency: alertFrequency,
      });

      if (result?.success) {
        toast.success(`Budget for ${category} created successfully.`);
        setIsOpen(false);
        setAmount("");
        setCategory("Uncategorized");
        setRolloverAmount("");
        setAlertThreshold("");
        setAlertFrequency("MONTHLY");
        router.refresh();
      } else {
        toast.error(result?.error || "Failed to create budget.");
      }
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      {/* ✅ FIX: Always wrap trigger inside a non-button element */}
      <DrawerTrigger asChild>
        <div>
          <Button>
            <PlusCircle className="h-5 w-5 mr-2" />
            New Budget
          </Button>
        </div>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" /> Create New Budget
          </DrawerTitle>
          <DrawerDescription>
            Set up a new budget for a specific category.
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-4 pb-0 space-y-4">
          <Input
            label="Budget Amount"
            type="number"
            placeholder="e.g., 500.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading}
          />
          <Select
            value={category}
            onValueChange={setCategory}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Uncategorized">Uncategorized</SelectItem>
              {(userCategories || []).map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            label="Rollover Amount (Optional)"
            type="number"
            placeholder="e.g., 50.00"
            value={rolloverAmount}
            onChange={(e) => setRolloverAmount(e.target.value)}
            disabled={loading}
          />
          <Input
            label="Alert Threshold (%) (Optional)"
            type="number"
            placeholder="e.g., 80 (for 80% of budget)"
            value={alertThreshold}
            onChange={(e) => setAlertThreshold(e.target.value)}
            disabled={loading}
          />
          <Select
            value={alertFrequency}
            onValueChange={setAlertFrequency}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Alert Frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DAILY">Daily</SelectItem>
              <SelectItem value="WEEKLY">Weekly</SelectItem>
              <SelectItem value="MONTHLY">Monthly</SelectItem>
              <SelectItem value="YEARLY">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DrawerFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating Budget..." : "Create Budget"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
