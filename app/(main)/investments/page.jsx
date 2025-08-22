"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useFetch from "@/hooks/use-fetch";
import { getInvestments, createInvestment, updateInvestment, deleteInvestment, getPortfolioDiversification } from "@/actions/investments";
import { addToWatchlist, removeFromWatchlist, getWatchlist } from "@/actions/watchlist";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DollarSign, Percent, ArrowUp, ArrowDown, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function InvestmentsPage() {
  const [symbol, setSymbol] = useState("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [averageCost, setAverageCost] = useState("");
  const [notes, setNotes] = useState("");
  const [watchlistSymbol, setWatchlistSymbol] = useState("");

  const { data: investments, loading: investmentsLoading, fn: loadInvestments } = useFetch(getInvestments);
  const { fn: createInvestmentFn } = useFetch(createInvestment);
  const { fn: updateInvestmentFn } = useFetch(updateInvestment);
  const { fn: deleteInvestmentFn } = useFetch(deleteInvestment);
  const { data: diversificationData, fn: loadDiversification } = useFetch(getPortfolioDiversification);
  const { data: watchlist, fn: loadWatchlist } = useFetch(getWatchlist);
  const { fn: addToWatchlistFn } = useFetch(addToWatchlist);
  const { fn: removeFromWatchlistFn } = useFetch(removeFromWatchlist);

  useEffect(() => {
    loadInvestments();
    loadDiversification();
    loadWatchlist();
  }, []);

  const handleAddInvestment = async () => {
    await createInvestmentFn({ symbol, name, quantity, averageCost, notes });
    setSymbol(""); setName(""); setQuantity(""); setAverageCost(""); setNotes("");
    loadInvestments();
  };

  const handleDeleteInvestment = async (id) => {
    await deleteInvestmentFn(id);
    loadInvestments();
  };

  const handleAddToWatchlist = async () => {
    if (watchlistSymbol) {
      await addToWatchlistFn(watchlistSymbol.toUpperCase());
      setWatchlistSymbol("");
      loadWatchlist();
      toast.success(`${watchlistSymbol.toUpperCase()} added to watchlist.`);
    }
  };

  const handleRemoveFromWatchlist = async (symbolToRemove) => {
    await removeFromWatchlistFn(symbolToRemove);
    loadWatchlist();
    toast.success(`${symbolToRemove} removed from watchlist.`);
  };

  return (
    <div className="space-y-6">
      {/* Investment Portfolio */}
      <Card>
        <CardHeader>
          <CardTitle>Investment Portfolio</CardTitle>
          <CardDescription>Track your investments and their performance.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Investment Form */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            <Input placeholder="Symbol (e.g. AAPL)" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
            <Input placeholder="Name (optional)" value={name} onChange={(e) => setName(e.target.value)} />
            <Input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            <Input type="number" placeholder="Average Cost" value={averageCost} onChange={(e) => setAverageCost(e.target.value)} />
            <Button onClick={handleAddInvestment}>Add Investment</Button>
          </div>
          <Input placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />

          {/* Investments Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Avg Cost</TableHead>
                <TableHead className="text-right">Last Price</TableHead>
                <TableHead className="text-right">Current Value</TableHead>
                <TableHead className="text-right">Gain/Loss</TableHead>
                <TableHead className="text-right">Daily Change</TableHead>
                <TableHead className="text-right">Dividends/Interest</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investmentsLoading ? (
                <TableRow><TableCell colSpan={10} className="text-center">Loading investments...</TableCell></TableRow>
              ) : !investments || investments.length === 0 ? (
                <TableRow><TableCell colSpan={10} className="text-center">No investments yet</TableCell></TableRow>
              ) : (
                (investments || []).map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>{inv.symbol}</TableCell>
                    <TableCell>{inv.name || "-"}</TableCell>
                    <TableCell className="text-right">{inv.quantity.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${inv.averageCost.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${inv.lastPrice?.toFixed(2) || "N/A"}</TableCell>
                    <TableCell className="text-right">${inv.currentValue.toFixed(2)}</TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-medium",
                        inv.gainLoss > 0 ? "text-green-500" : inv.gainLoss < 0 ? "text-red-500" : "text-muted-foreground"
                      )}
                    >
                      {inv.gainLoss > 0 ? "+" : ""}${inv.gainLoss.toFixed(2)}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right flex items-center justify-end",
                        inv.dailyChange > 0 ? "text-green-500" : inv.dailyChange < 0 ? "text-red-500" : "text-muted-foreground"
                      )}
                    >
                      {inv.dailyChange > 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : inv.dailyChange < 0 ? <ArrowDown className="h-4 w-4 mr-1" /> : null}
                      {inv.dailyChange.toFixed(2)} ({inv.percentageChange.toFixed(2)}%)
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                            <span>Dividends: ${inv.totalDividends.toFixed(2)}</span>
                            <span>Interest: ${inv.totalInterest.toFixed(2)}</span>
                        </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteInvestment(inv.id)}>Delete</Button>
                      {/* <Button variant="outline" size="sm" className="ml-2">View Details</Button> */}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Portfolio Diversification */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Diversification</CardTitle>
          <CardDescription>Breakdown of your investments by sector.</CardDescription>
        </CardHeader>
        <CardContent>
          {diversificationData?.diversification && diversificationData.diversification.length > 0 ? (
            <div className="space-y-2">
              {diversificationData.diversification.map(sectorData => (
                <div key={sectorData.sector} className="flex justify-between items-center">
                  <span className="font-medium">{sectorData.sector}</span>
                  <span>{sectorData.percentage.toFixed(1)}% ({new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(sectorData.totalValue)})</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No diversification data available. Add some investments!</p>
          )}
        </CardContent>
      </Card>

      {/* Investment Watchlist */}
      <Card>
        <CardHeader>
          <CardTitle>Investment Watchlist</CardTitle>
          <CardDescription>Keep an eye on stocks of interest.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add symbol to watchlist (e.g., MSFT)"
              value={watchlistSymbol}
              onChange={(e) => setWatchlistSymbol(e.target.value)}
            />
            <Button onClick={handleAddToWatchlist}>Add</Button>
          </div>

          {watchlist && watchlist.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {watchlist.map((item) => (
                <Badge key={item.symbol} variant="secondary" className="text-sm flex items-center">
                  {item.symbol}: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.price)}
                  <X className="ml-2 h-3 w-3 cursor-pointer" onClick={() => handleRemoveFromWatchlist(item.symbol)} />
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Your watchlist is empty.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


