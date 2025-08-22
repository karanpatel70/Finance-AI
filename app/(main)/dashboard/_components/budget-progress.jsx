"use client";

import { useState, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateBudget } from "@/actions/budget";
import { getUserCategories } from "@/actions/user-category";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertTriangle, Clock, Repeat, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function BudgetProgress({ initialBudget, currentExpenses }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudgetAmount, setNewBudgetAmount] = useState("");
  const [newBudgetCategory, setNewBudgetCategory] = useState(initialBudget?.category || "Uncategorized");
  const [newRolloverAmount, setNewRolloverAmount] = useState(initialBudget?.rolloverAmount?.toString() || "");
  const [newAlertThreshold, setNewAlertThreshold] = useState(initialBudget?.alertThreshold?.toString() || "");
  const [newAlertFrequency, setNewAlertFrequency] = useState(initialBudget?.alertFrequency || "MONTHLY");
  const [mounted, setMounted] = useState(false);
  const { data: userCategories } = useFetch(getUserCategories); // Renamed from loadUserCategories

  useEffect(() => {
    setMounted(true);
    if (initialBudget?.amount) {
      setNewBudgetAmount(initialBudget.amount.toString());
    }
    if (initialBudget?.category) {
      setNewBudgetCategory(initialBudget.category);
    }
    if (initialBudget?.rolloverAmount) {
      setNewRolloverAmount(initialBudget.rolloverAmount.toString());
    }
    if (initialBudget?.alertThreshold) {
      setNewAlertThreshold(initialBudget.alertThreshold.toString());
    }
    if (initialBudget?.alertFrequency) {
      setNewAlertFrequency(initialBudget.alertFrequency);
    }
  }, [initialBudget]);

  const { loading: isLoading, fn: updateBudgetFn, data: updatedBudget, error } = useFetch(updateBudget);

  const percentUsed = initialBudget && initialBudget.amount
    ? Math.min((currentExpenses / initialBudget.amount) * 100, 100)
    : 0;
  
  const displayAmount = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudgetAmount);
    const rolloverAmount = parseFloat(newRolloverAmount);
    const alertThreshold = parseFloat(newAlertThreshold);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid budget amount");
      return;
    }

    const result = await updateBudgetFn({
      id: initialBudget.id, // Ensure we pass the ID for updating
      accountId: initialBudget.accountId,
      amount,
      category: newBudgetCategory,
      rolloverAmount: isNaN(rolloverAmount) ? 0 : rolloverAmount,
      alertThreshold: isNaN(alertThreshold) ? 0 : alertThreshold,
      alertFrequency: newAlertFrequency,
    });

    if (result?.success) {
      toast.success("Budget updated successfully");
      setIsEditing(false);
      // A full page refresh might be needed or a more granular state update
    } else {
      toast.error(result?.error || "Failed to update budget");
    }
  };

  const handleCancel = () => {
    setNewBudgetAmount(initialBudget?.amount?.toString() || "");
    setNewBudgetCategory(initialBudget?.category || "Uncategorized");
    setNewRolloverAmount(initialBudget?.rolloverAmount?.toString() || "");
    setNewAlertThreshold(initialBudget?.alertThreshold?.toString() || "");
    setNewAlertFrequency(initialBudget?.alertFrequency || "MONTHLY");
    setIsEditing(false);
  };

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update budget");
    }
  }, [error]);

  if (!mounted) {
    return (
      <Card className="col-span-1" suppressHydrationWarning>
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
    );
  }

  return (
    <Card key={`budget-${initialBudget?.id || 'no-budget'}`} className="relative group col-span-1 border-2 border-transparent hover:border-purple-500 transition-colors duration-200" suppressHydrationWarning>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex-1 space-y-1">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            {initialBudget?.category !== "Uncategorized" && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">{initialBudget?.category}</Badge>
            )}
            Monthly Budget
          </CardTitle>
          {isEditing ? (
            <div className="flex flex-col gap-2 w-full mt-2">
              <Input
                type="number"
                value={newBudgetAmount}
                onChange={(e) => setNewBudgetAmount(e.target.value)}
                placeholder="Enter budget amount"
                disabled={isLoading}
                className="text-base"
              />
              <Select value={newBudgetCategory} onValueChange={setNewBudgetCategory} disabled={isLoading}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Uncategorized">Uncategorized</SelectItem>
                  {(userCategories || []).map(cat => (
                    <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={newRolloverAmount}
                onChange={(e) => setNewRolloverAmount(e.target.value)}
                placeholder="Rollover amount (optional)"
                disabled={isLoading}
                className="text-base"
              />
              <Input
                type="number"
                value={newAlertThreshold}
                onChange={(e) => setNewAlertThreshold(e.target.value)}
                placeholder="Alert threshold (%)"
                disabled={isLoading}
                className="text-base"
              />
              <Select value={newAlertFrequency} onValueChange={setNewAlertFrequency} disabled={isLoading}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Alert Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAILY">Daily</SelectItem>
                  <SelectItem value="WEEKLY">Weekly</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="YEARLY">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 mr-1" /> Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleUpdateBudget}
                  disabled={isLoading}
                >
                  <Check className="h-4 w-4 mr-1" /> Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <CardDescription className="text-sm text-gray-600">
                {initialBudget && initialBudget.amount
                  ? `${displayAmount(currentExpenses)} of ${displayAmount(initialBudget.amount)} spent`
                  : "No budget set"}
              </CardDescription>
              {initialBudget?.rolloverAmount > 0 && (
                <CardDescription className="text-sm text-blue-600 flex items-center gap-1">
                  <Repeat className="h-4 w-4" /> Rollover: {displayAmount(initialBudget.rolloverAmount)}
                </CardDescription>
              )}
              {initialBudget?.alertThreshold > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CardDescription className="text-sm text-orange-600 flex items-center gap-1 cursor-pointer">
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4" /> Alert @ {initialBudget.alertThreshold}% ({initialBudget.alertFrequency.toLowerCase()})
                        </span>
                      </CardDescription>
                    </TooltipTrigger>
                    <TooltipContent>
                      Alerts are sent when your spending reaches {initialBudget.alertThreshold}% of your budget.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          )}
        </div>
        {!isEditing && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
            className="h-8 w-8 absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        {initialBudget && initialBudget.amount && (
          <div className="space-y-3">
            <Progress
              value={percentUsed}
              className={`h-3 ${percentUsed >= (initialBudget.alertThreshold || 90)
                ? "bg-red-500"
                : percentUsed >= ((initialBudget.alertThreshold || 90) * 0.75)
                  ? "bg-yellow-500"
                  : "bg-green-500"}
              `}
            />
            <p className="text-sm text-muted-foreground text-right">
              <span className="font-medium">{percentUsed.toFixed(1)}%</span> used
            </p>

            {initialBudget?.expensesByCategory && initialBudget.expensesByCategory.length > 0 && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md shadow-inner">
                <h4 className="font-semibold text-md mb-2 text-gray-800">Expenses Breakdown:</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  {initialBudget.expensesByCategory.map(item => (
                    <li key={item.category} className="flex justify-between items-center">
                      <span>{item.category}:</span>
                      <span className="font-medium">{displayAmount(item.amount)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}