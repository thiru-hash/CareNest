
import { notFound } from "next/navigation";
import { mockClients, mockClientBudgets } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Building2, User, Landmark, DollarSign, Target, Briefcase, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ClientExpenseManager } from "@/components/finance/ClientExpenseManager";

function BudgetCard({ title, icon: Icon, budget, spent }: { title: string, icon: React.ElementType, budget: number, spent: number }) {
    const remaining = budget - spent;
    const percentage = budget > 0 ? (spent / budget) * 100 : 0;
    const isOver = spent > budget;
    const isNearingLimit = percentage >= 90 && !isOver;

    let progressClass = "";
    if (isOver) {
        progressClass = "[&>div]:bg-destructive";
    } else if (isNearingLimit) {
        progressClass = "[&>div]:bg-yellow-500";
    }

    return (
        <Card className={cn(isNearingLimit && !isOver && "border-yellow-500/50 bg-yellow-500/5", isOver && "border-destructive/50 bg-destructive/5")}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-md font-medium">{title}</CardTitle>
                </div>
                 {(isOver || isNearingLimit) && (
                    <AlertTriangle className={cn("h-5 w-5", isOver ? "text-destructive" : "text-yellow-500")} />
                )}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">${spent.toLocaleString()} / <span className="text-lg text-muted-foreground">${budget.toLocaleString()}</span></div>
                <p className={cn("text-xs", isOver ? "text-destructive" : isNearingLimit ? "text-yellow-600" : "text-muted-foreground")}>
                    {isOver ? `$${Math.abs(remaining).toLocaleString()} over budget` : isNearingLimit ? `Nearing limit, $${remaining.toLocaleString()} remaining` : `$${remaining.toLocaleString()} remaining`}
                </p>
                <Progress value={isOver ? 100 : percentage} className={cn("mt-2 h-2", progressClass)} />
            </CardContent>
        </Card>
    )
}

export default async function ClientFinancePage({ params }: { params: { id: string } }) {
  const client = mockClients.find((c) => c.id === params.id);
  const clientBudget = mockClientBudgets.find(b => b.clientId === params.id);

  if (!client || !clientBudget) {
    notFound();
  }

  return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar className="w-24 h-24 border-4 border-background shadow-md">
                <AvatarImage src={client.avatarUrl} alt={client.name} />
                <AvatarFallback className="text-3xl">{client.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <h1 className="text-3xl font-bold">{client.name}</h1>
                <p className="text-lg text-muted-foreground">Client-Level Finance</p>
                <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Client ID: {client.id}</span>
                    </div>
                </div>
            </div>
        </div>

        <Tabs defaultValue="budgets" className="w-full">
            <TabsList>
                <TabsTrigger value="budgets">NDIS Budgets</TabsTrigger>
                <TabsTrigger value="bookings" disabled>Service Bookings</TabsTrigger>
                <TabsTrigger value="expenses">Expenses Log</TabsTrigger>
                <TabsTrigger value="claiming" disabled>Claiming</TabsTrigger>
            </TabsList>
            <TabsContent value="budgets" className="mt-4">
                <Card>
                    <CardHeader>
                        <CardTitle>NDIS Budget Overview</CardTitle>
                        <CardDescription>Tracking for Core, Capacity, and Capital funding streams.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-3">
                       <BudgetCard title="Core Supports" icon={Briefcase} budget={clientBudget.coreBudget} spent={clientBudget.coreSpent} />
                       <BudgetCard title="Capacity Building" icon={Target} budget={clientBudget.capacityBudget} spent={clientBudget.capacitySpent} />
                       <BudgetCard title="Capital Supports" icon={DollarSign} budget={clientBudget.capitalBudget} spent={clientBudget.capitalSpent} />
                    </CardContent>
                </Card>
            </TabsContent>
             <TabsContent value="bookings">
                <Card>
                    <CardHeader>
                        <CardTitle>Service Bookings</CardTitle>
                        <CardDescription>Feature coming soon.</CardDescription>
                    </CardHeader>
                </Card>
            </TabsContent>
            <TabsContent value="expenses" className="mt-4">
               <ClientExpenseManager clientId={client.id} />
            </TabsContent>
             <TabsContent value="claiming">
                <Card>
                    <CardHeader>
                        <CardTitle>Claim Preparation & Submission</CardTitle>
                        <CardDescription>Feature coming soon.</CardDescription>
                    </CardHeader>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
