"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useFetch from "@/hooks/use-fetch";
import { getInvestments, createInvestment, updateInvestment, deleteInvestment } from "@/actions/investments";

export default function InvestmentsPage() {
  const [symbol, setSymbol] = useState("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [averageCost, setAverageCost] = useState("");
  const [notes, setNotes] = useState("");

  const { data: investments, fn: loadInvestments, setData: setInvestments } = useFetch(getInvestments);
  const { fn: createInvestmentFn } = useFetch(createInvestment);
  const { fn: updateInvestmentFn } = useFetch(updateInvestment);
  const { fn: deleteInvestmentFn } = useFetch(deleteInvestment);

  useEffect(() => { loadInvestments(); }, []);

  const handleAdd = async () => {
    await createInvestmentFn({ symbol, name, quantity, averageCost, notes });
    setSymbol(""); setName(""); setQuantity(""); setAverageCost(""); setNotes("");
    loadInvestments();
  };

  const handleDelete = async (id) => {
    await deleteInvestmentFn(id);
    loadInvestments();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Investment Tracking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            <Input placeholder="Symbol (e.g. AAPL)" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
            <Input placeholder="Name (optional)" value={name} onChange={(e) => setName(e.target.value)} />
            <Input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            <Input type="number" placeholder="Average Cost" value={averageCost} onChange={(e) => setAverageCost(e.target.value)} />
            <Button onClick={handleAdd}>Add</Button>
          </div>
          <Input placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Avg Cost</TableHead>
                <TableHead className="text-right">Market Value</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(!investments || investments.length === 0) && (
                <TableRow><TableCell colSpan={6}>No investments yet</TableCell></TableRow>
              )}
              {(investments || []).map((inv) => {
                const quantityNum = Number(inv.quantity);
                const avgCostNum = Number(inv.averageCost);
                const marketValue = quantityNum * avgCostNum;
                return (
                  <TableRow key={inv.id}>
                    <TableCell>{inv.symbol}</TableCell>
                    <TableCell>{inv.name || "-"}</TableCell>
                    <TableCell className="text-right">{quantityNum.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${avgCostNum.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${marketValue.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="destructive" onClick={() => handleDelete(inv.id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}


