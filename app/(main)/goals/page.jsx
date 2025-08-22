"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, Users, RefreshCcw } from "lucide-react";

import useFetch from "@/hooks/use-fetch";
import { getGoals, createGoal, updateGoalProgress, deleteGoal, updateGoal, simulateGoalProgress } from "@/actions/goals";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function GoalsPage() {
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [priority, setPriority] = useState("0");
  const [autoContributeAmount, setAutoContributeAmount] = useState("");
  const [autoContributeFrequency, setAutoContributeFrequency] = useState("");
  const [sharedWithUserIds, setSharedWithUserIds] = useState([]); // Assuming a multi-select for user IDs
  const [progressAmount, setProgressAmount] = useState("");

  // For What-If Scenario
  const [simulatedGoalId, setSimulatedGoalId] = useState(null);
  const [additionalMonthlyContribution, setAdditionalMonthlyContribution] = useState("");
  const [expectedInterestRate, setExpectedInterestRate] = useState("");
  const { data: simulationResult, fn: runSimulationFn, loading: simulationLoading } = useFetch(simulateGoalProgress);


  const { data: goals, loading, fn: loadGoals, setData: setGoals } = useFetch(getGoals);
  const { fn: createGoalFn } = useFetch(createGoal);
  const { fn: updateProgressFn } = useFetch(updateGoalProgress);
  const { fn: deleteGoalFn } = useFetch(deleteGoal);
  const { fn: updateGoalFn } = useFetch(updateGoal);

  useEffect(() => {
    loadGoals();
  }, []);

  const handleCreate = async () => {
    if (!title || !targetAmount) {
      toast.error("Title and target amount are required");
      return;
    }
    await createGoalFn({
      title,
      targetAmount,
      dueDate: dueDate ? dueDate.toISOString() : null,
      priority: parseInt(priority),
      autoContributeAmount: autoContributeAmount ? parseFloat(autoContributeAmount) : null,
      autoContributeFrequency: autoContributeFrequency || null,
      sharedWithUserIds: sharedWithUserIds.length > 0 ? sharedWithUserIds : null,
    });
    setTitle("");
    setTargetAmount("");
    setDueDate(null);
    setPriority("0");
    setAutoContributeAmount("");
    setAutoContributeFrequency("");
    setSharedWithUserIds([]);
    loadGoals();
  };

  const handleUpdate = async (goalId, currentData) => {
    // This is a simplified update. In a real app, you'd have an edit modal
    // For demonstration, let's assume we're just updating priority here for an example.
    // Or you could open a modal with currentData pre-filled
    const newPriority = prompt(`Enter new priority for ${currentData.title}:`, currentData.priority);
    if (newPriority !== null && !isNaN(parseInt(newPriority))) {
      await updateGoalFn(goalId, { priority: parseInt(newPriority) });
      loadGoals();
    } else if (newPriority !== null) {
      toast.error("Invalid priority. Please enter a number.");
    }
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

  const handleRunSimulation = async (goalId) => {
    if (!additionalMonthlyContribution && !expectedInterestRate) {
      toast.error("Please enter at least one simulation parameter.");
      return;
    }
    setSimulatedGoalId(goalId);
    await runSimulationFn(goalId, {
      additionalMonthlyContribution,
      expectedInterestRate,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Financial Goals</CardTitle>
          <CardDescription>Track your financial goals with progress, priority, and auto-contributions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
            <Input placeholder="Goal title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input type="number" placeholder="Target amount" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Due Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Input type="number" placeholder="Priority (0-10)" value={priority} onChange={(e) => setPriority(e.target.value)} />
            <Input type="number" placeholder="Auto-contribute amount" value={autoContributeAmount} onChange={(e) => setAutoContributeAmount(e.target.value)} />
            <Select value={autoContributeFrequency} onValueChange={setAutoContributeFrequency}>
              <SelectTrigger>
                <SelectValue placeholder="Frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none-frequency">None</SelectItem>
                <SelectItem value="DAILY">Daily</SelectItem>
                <SelectItem value="WEEKLY">Weekly</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="YEARLY">Yearly</SelectItem>
              </SelectContent>
            </Select>
            {/* Simplified SharedWithUserIds input - in real app, this would be a multi-select user picker */}
            <Input
              placeholder="Share with User IDs (comma-separated)"
              value={sharedWithUserIds.join(",")}
              onChange={(e) => setSharedWithUserIds(e.target.value.split(",").map(id => id.trim()).filter(Boolean))}
              className="lg:col-span-2"
            />
            <Button onClick={handleCreate} className="lg:col-span-1">Add Goal</Button>
          </div>

          <div className="grid gap-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Current</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Auto-Contribute</TableHead>
                  <TableHead>Shared With</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(!goals || goals.length === 0) && (
                  <TableRow><TableCell colSpan={9}>No goals yet</TableCell></TableRow>
                )}
                {(goals || []).map((g) => (
                  <TableRow key={g.id}>
                    <TableCell>{g.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={g.progressPercentage} className="w-[60%]" />
                        <span className="text-sm text-muted-foreground">{g.progressPercentage.toFixed(1)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>${Number(g.targetAmount).toFixed(2)}</TableCell>
                    <TableCell>${Number(g.currentAmount).toFixed(2)}</TableCell>
                    <TableCell>{g.dueDate ? format(new Date(g.dueDate), "PPP") : "-"}</TableCell>
                    <TableCell>{g.priority}</TableCell>
                    <TableCell>
                      {g.autoContributeAmount ? (
                        <Badge variant="secondary" className="gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200">
                          <RefreshCcw className="h-3 w-3" />
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(g.autoContributeAmount)} {g.autoContributeFrequency?.toLowerCase()}
                        </Badge>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {g.sharedWithUserIds && g.sharedWithUserIds.length > 0 ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline" className="gap-1 cursor-pointer">
                                <Users className="h-3 w-3" />
                                {g.sharedWithUserIds.length} Users
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-sm">
                                <div className="font-medium">Shared with:</div>
                                {g.sharedWithUserIds.map((userId) => (
                                  <div key={userId}>{userId}</div>
                                ))}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Input
                        type="number"
                        placeholder="Add amount"
                        value={progressAmount}
                        onChange={(e) => setProgressAmount(e.target.value)}
                        className="inline-block w-32 mr-2"
                      />
                      <Button variant="outline" onClick={() => handleProgress(g.id)}>Add Progress</Button>
                      <Button variant="secondary" onClick={() => handleUpdate(g.id, g)}>Edit</Button>
                      <Button variant="destructive" onClick={() => handleDelete(g.id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* What-If Scenario Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>What-If Scenario for Goals</CardTitle>
              <CardDescription>Simulate how different contributions or interest rates affect your goal progress.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={simulatedGoalId} onValueChange={setSimulatedGoalId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Goal to Simulate" />
                  </SelectTrigger>
                  <SelectContent>
                    {(goals || []).map(g => (
                      <SelectItem key={g.id} value={g.id}>{g.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input type="number" placeholder="Additional Monthly Contribution" value={additionalMonthlyContribution} onChange={(e) => setAdditionalMonthlyContribution(e.target.value)} />
                <Input type="number" placeholder="Expected Annual Interest Rate (%)" value={expectedInterestRate} onChange={(e) => setExpectedInterestRate(e.target.value)} />
              </div>
              <Button onClick={() => handleRunSimulation(simulatedGoalId)} disabled={!simulatedGoalId || simulationLoading}>
                {simulationLoading ? "Running Simulation..." : "Run Simulation"}
              </Button>

              {simulationResult && simulatedGoalId && (
                <div className="mt-4 space-y-2 p-4 border rounded-md bg-muted">
                  <h4 className="font-semibold">Simulation Results for: {(goals || []).find(g => g.id === simulatedGoalId)?.title}</h4>
                  <p>Projected Current Amount: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(simulationResult.simulatedCurrentAmount)}</p>
                  <p>Projected Due Date: {simulationResult.simulatedDueDate ? format(new Date(simulationResult.simulatedDueDate), "PPP") : "N/A"}</p>
                  <p>Months to Reach Target: {simulationResult.monthsToReachTarget}</p>
                  <p>Progress: {simulationResult.progressPercentage.toFixed(1)}%</p>
                </div>
              )}
            </CardContent>
          </Card>

        </CardContent>
      </Card>
    </div>
  );
}


