
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Landmark, Users } from "lucide-react";

export default function FinanceDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Finance Dashboard</h1>
        <p className="text-muted-foreground">
          Central hub for managing organisational and client-level finances.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-lg">
                    <Landmark className="h-8 w-8" />
                </div>
                <div>
                    <CardTitle>Organisational Finance</CardTitle>
                    <CardDescription>Manage invoices, payroll, budgets, and reporting.</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">
              Access tools for tracking payments, managing funding streams like NDIS, and generating financial statements.
            </p>
          </CardContent>
          <div className="p-6 pt-0">
            <Button asChild>
                <Link href="/finance/organisational">
                    Go to Organisational Finance <ArrowRight className="ml-2" />
                </Link>
            </Button>
          </div>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-4">
                 <div className="bg-primary/10 text-primary p-3 rounded-lg">
                    <Users className="h-8 w-8" />
                </div>
                <div>
                    <CardTitle>Client-Level Finance</CardTitle>
                    <CardDescription>Manage individual client funding and expenses.</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">
                Track NDIS budgets, service bookings, and prepare claims for individual clients.
            </p>
          </CardContent>
          <div className="p-6 pt-0">
            <Button asChild>
                <Link href="/finance/client">
                    Go to Client Finance <ArrowRight className="ml-2" />
                </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
