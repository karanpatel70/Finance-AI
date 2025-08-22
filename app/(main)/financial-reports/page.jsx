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
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import useFetch from "@/hooks/use-fetch";
import { getExpenseTrends, getNetWorthReport, getTaxReport, getCashFlowStatement } from "@/actions/transaction";
import { toast } from "sonner";

export default function FinancialReportsPage() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reportYear, setReportYear] = useState(new Date().getFullYear().toString());
  const [expenseTrendInterval, setExpenseTrendInterval] = useState("MONTHLY");

  // Net Worth Report
  const { data: netWorthData, loading: netWorthLoading, fn: loadNetWorth } = useFetch(getNetWorthReport);

  // Expense Trends Report
  const { data: expenseTrendsData, loading: expenseTrendsLoading, fn: loadExpenseTrends } = useFetch(getExpenseTrends);

  // Tax Report
  const { data: taxReportData, loading: taxReportLoading, fn: loadTaxReport } = useFetch(getTaxReport);

  // Cash Flow Statement
  const { data: cashFlowData, loading: cashFlowLoading, fn: loadCashFlow } = useFetch(getCashFlowStatement);

  useEffect(() => {
    // Initial load for Net Worth (doesn't depend on date range)
    loadNetWorth();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      loadExpenseTrends({ startDate: startDate.toISOString(), endDate: endDate.toISOString(), interval: expenseTrendInterval });
      loadCashFlow({ startDate: startDate.toISOString(), endDate: endDate.toISOString() });
    }
  }, [startDate, endDate, expenseTrendInterval]);

  useEffect(() => {
    loadTaxReport(parseInt(reportYear));
  }, [reportYear]);

  const handleDateRangeChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleGenerateReports = () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates for reports.");
      return;
    }
    loadNetWorth(); // Net worth can also be reloaded if needed, though it's less date-dependent in current design
    loadExpenseTrends({ startDate: startDate.toISOString(), endDate: endDate.toISOString(), interval: expenseTrendInterval });
    loadTaxReport(parseInt(reportYear));
    loadCashFlow({ startDate: startDate.toISOString(), endDate: endDate.toISOString() });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Financial Reports</CardTitle>
          <CardDescription>Generate various financial reports for your analysis.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Range Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <label htmlFor="startDate" className="text-sm font-medium">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="startDate"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label htmlFor="endDate" className="text-sm font-medium">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="endDate"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button onClick={handleGenerateReports} disabled={!startDate || !endDate}>
              Generate Reports
            </Button>
          </div>

          {/* Net Worth Report */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Net Worth Report</CardTitle>
            </CardHeader>
            <CardContent>
              {netWorthLoading ? (
                <p>Loading Net Worth...</p>
              ) : netWorthData ? (
                <div className="space-y-2">
                  <p><strong>Total Assets:</strong> {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(netWorthData.totalAssets)}</p>
                  <p><strong>Total Liabilities:</strong> {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(netWorthData.totalLiabilities)}</p>
                  <h3 className="text-xl font-bold">Net Worth: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(netWorthData.netWorth)}</h3>

                  <div className="pt-4">
                    <h4 className="font-semibold">Asset Breakdown:</h4>
                    <p>Accounts: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(netWorthData.assetBreakdown.accounts)}</p>
                    <p>Investments: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(netWorthData.assetBreakdown.investments)}</p>
                  </div>

                  <div className="pt-4">
                    <h4 className="font-semibold">Liability Breakdown:</h4>
                    <ul className="list-disc pl-5">
                      {netWorthData.liabilityBreakdown.map(lib => (
                        <li key={lib.id}>{lib.name} ({lib.type}): {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(lib.amount)}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No net worth data available. Ensure you have accounts, investments, and liabilities recorded.</p>
              )}
            </CardContent>
          </Card>

          {/* Expense Trend Analysis */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Expense Trend Analysis</CardTitle>
              <CardDescription>Visualize your spending patterns over time.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Select value={expenseTrendInterval} onValueChange={setExpenseTrendInterval}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DAILY">Daily</SelectItem>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                    <SelectItem value="YEARLY">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {expenseTrendsLoading ? (
                <p>Loading Expense Trends...</p>
              ) : expenseTrendsData && expenseTrendsData.length > 0 ? (
                <div className="space-y-2">
                  {expenseTrendsData.map(trend => (
                    <p key={trend.period}>{trend.period}: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(trend.totalExpenses)}</p>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No expense trend data for the selected period. Add some expenses!</p>
              )}
            </CardContent>
          </Card>

          {/* Tax-Ready Reports */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Tax-Ready Reports</CardTitle>
              <CardDescription>Summarize taxable income and deductible expenses.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Select value={reportYear} onValueChange={setReportYear}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {taxReportLoading ? (
                <p>Loading Tax Report...</p>
              ) : taxReportData ? (
                <div className="space-y-2">
                  <p><strong>Taxable Income ({taxReportData.year}):</strong> {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(taxReportData.totalTaxableIncome)}</p>
                  <p><strong>Deductible Expenses ({taxReportData.year}):</strong> {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(taxReportData.totalDeductibleExpenses)}</p>
                  <div className="pt-4">
                    <h4 className="font-semibold">Taxable Income Transactions:</h4>
                    <ul className="list-disc pl-5">
                      {taxReportData.taxableIncomeTransactions.map(t => (
                        <li key={t.id}>{format(new Date(t.date), "PPP")}: {t.description} - {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(t.amount)}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-4">
                    <h4 className="font-semibold">Deductible Expense Transactions:</h4>
                    <ul className="list-disc pl-5">
                      {taxReportData.deductibleExpenseTransactions.map(t => (
                        <li key={t.id}>{format(new Date(t.date), "PPP")}: {t.description} - {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(t.amount)}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No tax report data available for the selected year.</p>
              )}
            </CardContent>
          </Card>

          {/* Cash Flow Statement */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Cash Flow Statement</CardTitle>
              <CardDescription>Analyze your cash inflows and outflows.</CardDescription>
            </CardHeader>
            <CardContent>
              {cashFlowLoading ? (
                <p>Loading Cash Flow Statement...</p>
              ) : cashFlowData ? (
                <div className="space-y-2">
                  <p><strong>Operating Activities:</strong> {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cashFlowData.operatingActivities)}</p>
                  <p><strong>Investing Activities:</strong> {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cashFlowData.investingActivities)}</p>
                  <p><strong>Financing Activities:</strong> {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cashFlowData.financingActivities)}</p>
                  <h3 className="text-xl font-bold">Net Cash Flow: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cashFlowData.netCashFlow)}</h3>
                </div>
              ) : (
                <p className="text-muted-foreground">No cash flow data available for the selected period.</p>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
