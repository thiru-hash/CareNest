import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { mockInvoices, mockPayrollRuns } from "@/lib/data";
import { DollarSign, FileWarning, Users, CalendarCheck2 } from "lucide-react";
import { differenceInDays, format } from "date-fns";

export function FinanceOverview() {
  const totalInvoiced = mockInvoices.reduce((acc, inv) => acc + inv.amount, 0);
  const totalOverdue = mockInvoices
    .filter(inv => inv.status === 'Overdue')
    .reduce((acc, inv) => acc + inv.amount, 0);
  
  const nextPayroll = mockPayrollRuns
    .filter(run => run.status === 'Pending')
    .reduce((acc, run) => acc + run.netPay, 0);

  const upcomingInvoiceDue = mockInvoices
    .filter(inv => inv.status === 'Pending' && differenceInDays(inv.dueDate, new Date()) >= 0)
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Finance Overview</CardTitle>
        <CardDescription>A quick summary of key financial metrics.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Invoiced</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalInvoiced.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all clients</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Overdue</CardTitle>
            <FileWarning className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">${totalOverdue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Invoices >30 days past due</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Next Payroll Due</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${nextPayroll.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">For pending payroll runs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Next Invoice Due</CardTitle>
            <CalendarCheck2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {upcomingInvoiceDue ? `$${upcomingInvoiceDue.amount.toLocaleString()}`: 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {upcomingInvoiceDue ? `Due on ${format(upcomingInvoiceDue.dueDate, 'dd MMM')}` : 'No upcoming invoices'}
            </p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
