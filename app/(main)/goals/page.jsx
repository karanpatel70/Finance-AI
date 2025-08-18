"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useFetch from "@/hooks/use-fetch";
import { getGoals, createGoal, updateGoalProgress, deleteGoal } from "@/actions/goals";
import { toast } from "sonner";

export default function GoalsPage() {
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [progressAmount, setProgressAmount] = useState("");

  const { data: goals, loading, fn: loadGoals, setData: setGoals } = useFetch(getGoals);
  const { fn: createGoalFn } = useFetch(createGoal);
  const { fn: updateProgressFn } = useFetch(updateGoalProgress);
  const { fn: deleteGoalFn } = useFetch(deleteGoal);

  useEffect(() => {
    loadGoals();
  }, []);

  const handleCreate = async () => {
    if (!title || !targetAmount) {
      toast.error("Title and target amount are required");
      return;
    }
    await createGoalFn({ title, targetAmount, dueDate });
    setTitle("");
    setTargetAmount("");
    setDueDate("");
    loadGoals();
  };

  const handleProgress = async (goalId) => {
    if (!progressAmount) return;
    await updateProgressFn(goalId, progressAmount);
    setProgressAmount("");
    loadGoals();
  };

  const handleDelete = async (goalId) => {
    await deleteGoalFn(goalId);
    loadGoals();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Financial Goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <Input placeholder="Goal title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input type="number" placeholder="Target amount" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} />
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            <Button onClick={handleCreate}>Add Goal</Button>
          </div>

          <div className="grid gap-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Current</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(!goals || goals.length === 0) && (
                  <TableRow><TableCell colSpan={6}>No goals yet</TableCell></TableRow>
                )}
                {(goals || []).map((g) => (
                  <TableRow key={g.id}>
                    <TableCell>{g.title}</TableCell>
                    <TableCell>${Number(g.targetAmount).toFixed(2)}</TableCell>
                    <TableCell>${Number(g.currentAmount).toFixed(2)}</TableCell>
                    <TableCell>{g.dueDate ? new Date(g.dueDate).toLocaleDateString() : "-"}</TableCell>
                    <TableCell className="capitalize">{g.status?.toLowerCase?.()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Input
                        type="number"
                        placeholder="Add amount"
                        value={progressAmount}
                        onChange={(e) => setProgressAmount(e.target.value)}
                        className="inline-block w-32 mr-2"
                      />
                      <Button variant="outline" onClick={() => handleProgress(g.id)}>Add Progress</Button>
                      <Button variant="destructive" onClick={() => handleDelete(g.id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


