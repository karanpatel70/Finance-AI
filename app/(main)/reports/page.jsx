"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getMonthlyReport } from "@/actions/reports";

export default function ReportsPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [report, setReport] = useState(null);

  const load = async () => {
    const res = await getMonthlyReport({ month: Number(month), year: Number(year) });
    setReport(res);
  };

  useEffect(() => { load(); }, []);

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  return (
    <div className="space-y-6" suppressHydrationWarning>
      <Card>
        <CardHeader>
          <CardTitle>Financial Reports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 items-center">
            <select className="border rounded px-2 py-1" value={month} onChange={(e) => setMonth(e.target.value)}>
              {months.map((label, idx) => (
                <option key={idx} value={idx}>{label}</option>
              ))}
            </select>
            <Input type="number" className="w-28" value={year} onChange={(e) => setYear(e.target.value)} />
            <Button onClick={load}>Run</Button>
          </div>

          {!report ? (
            <div>Loading...</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Income</CardTitle></CardHeader>
                <CardContent className="text-2xl font-semibold">${report.totalIncome.toFixed(2)}</CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base">Expenses</CardTitle></CardHeader>
                <CardContent className="text-2xl font-semibold">${report.totalExpense.toFixed(2)}</CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base">Net</CardTitle></CardHeader>
                <CardContent className="text-2xl font-semibold">${report.net.toFixed(2)}</CardContent>
              </Card>

              <div className="md:col-span-3">
                <h3 className="font-medium mb-2">Expenses by Category</h3>
                <ul className="space-y-1">
                  {Object.entries(report.expensesByCategory || {}).map(([cat, amt]) => (
                    <li key={cat} className="flex justify-between">
                      <span className="capitalize">{cat}</span>
                      <span>${amt.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


