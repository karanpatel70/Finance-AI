"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

import TransactionTable from "../../account/_components/transaction-table"; // Assuming this path

// Import the server action directly (Next.js will handle RPC)
import { getFilteredTransactions } from "@/actions/transaction";
import { Checkbox } from "@/components/ui/checkbox";

export function ExpenseClientPage({
  initialTransactions,
  accounts,
  userCategories,
  tags,
  defaultAccountId,
}) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    accountId: defaultAccountId || "",
    type: "EXPENSE", // Default to expenses for this page
    category: "",
    tagIds: [],
    minAmount: "",
    maxAmount: "",
    startDate: null,
    endDate: null,
    isRecurring: null, // null for all, true for recurring, false for non-recurring
    status: "", // PENDING, COMPLETED, FAILED
  });

  // Fetch transactions based on filters
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // Prepare tagIds for the backend (it expects an array of strings)
      const filtersToSend = {
        ...filters,
        startDate: filters.startDate ? filters.startDate.toISOString() : null,
        endDate: filters.endDate ? filters.endDate.toISOString() : null,
        minAmount: filters.minAmount ? parseFloat(filters.minAmount) : null,
        maxAmount: filters.maxAmount ? parseFloat(filters.maxAmount) : null,
        tagIds: filters.tagIds.length > 0 ? filters.tagIds : null,
      };

      const fetchedTransactions = await getFilteredTransactions(filtersToSend);
      setTransactions(fetchedTransactions);
    } catch (error) {
      console.error("Failed to fetch filtered transactions:", error);
      // Optionally show an error message in the UI
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce or initial fetch on component mount
    fetchTransactions();
  }, [filters]); // Re-fetch when filters change

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      accountId: defaultAccountId || "",
      type: "EXPENSE",
      category: "",
      tagIds: [],
      minAmount: "",
      maxAmount: "",
      startDate: null,
      endDate: null,
      isRecurring: null,
      status: "",
    });
  };

  const handleTagToggle = (tagId) => {
    setFilters((prev) => {
      const newTagIds = prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId];
      return { ...prev, tagIds: newTagIds };
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Expense Tracking</CardTitle>
          <CardDescription>
            View and filter your expense transactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Account Filter */}
            <Select
              value={filters.accountId}
              onValueChange={(value) => handleFilterChange("accountId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-accounts">All Accounts</SelectItem>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select
              value={filters.category}
              onValueChange={(value) => handleFilterChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-categories">All Categories</SelectItem>
                {userCategories
                  .filter((cat) => cat.type === "EXPENSE")
                  .map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {/* Tags Filter (Multi-select) */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start">
                  <Filter className="mr-2 h-4 w-4" />
                  {filters.tagIds.length > 0
                    ? `${filters.tagIds.length} Tags Selected`
                    : "Filter by Tags"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-2">
                <div className="space-y-2">
                  {tags.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`tag-${tag.id}`}
                        checked={filters.tagIds.includes(tag.id)}
                        onCheckedChange={() => handleTagToggle(tag.id)}
                      />
                      <label htmlFor={`tag-${tag.id}`} className="text-sm">
                        {tag.name}
                      </label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Min Amount Filter */}
            <Input
              type="number"
              placeholder="Min Amount"
              value={filters.minAmount}
              onChange={(e) => handleFilterChange("minAmount", e.target.value)}
            />

            {/* Max Amount Filter */}
            <Input
              type="number"
              placeholder="Max Amount"
              value={filters.maxAmount}
              onChange={(e) => handleFilterChange("maxAmount", e.target.value)}
            />

            {/* Start Date Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.startDate ? (
                    format(filters.startDate, "PPP")
                  ) : (
                    <span>Start Date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.startDate}
                  onSelect={(date) => handleFilterChange("startDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {/* End Date Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.endDate ? (
                    format(filters.endDate, "PPP")
                  ) : (
                    <span>End Date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.endDate}
                  onSelect={(date) => handleFilterChange("endDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {/* Status Filter */}
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-statuses">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>

            {/* Recurring Filter */}
            <Select
              value={filters.isRecurring === true ? "true" : filters.isRecurring === false ? "false" : "all-recurring"}
              onValueChange={(value) => handleFilterChange("isRecurring", value === "true" ? true : value === "false" ? false : null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Recurring Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-recurring">All</SelectItem>
                <SelectItem value="true">Recurring</SelectItem>
                <SelectItem value="false">Non-Recurring</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end mb-4">
            <Button variant="outline" onClick={handleClearFilters}>
              <X className="mr-2 h-4 w-4" /> Clear Filters
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading transactions...</div>
          ) : (
            <TransactionTable transactions={transactions} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
