
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockInvoices, mockPayrollRuns } from "@/lib/data";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const statusConfig = {
    Paid: "bg-green-500/20 text-green-700 border-green-500/30",
    Pending: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
    Overdue: "bg-red-500/20 text-red-700 border-red-500/30",
} as const;


export default async function OrganisationalFinancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Organisational Finance</h1>
        <p className="text-muted-foreground">
          Manage invoices, payroll, budgets, and reporting for the entire organisation.
        </p>
      </div>

       <Tabs defaultValue="invoices" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="budgeting" disabled>Budgeting</TabsTrigger>
          <TabsTrigger value="reporting" disabled>Reporting</TabsTrigger>
          <TabsTrigger value="settings" disabled>Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="invoices" className="mt-4">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>Invoices</CardTitle>
                            <CardDescription>Track and manage all invoices across the organisation.</CardDescription>
                        </div>
                        <div className="flex gap-2">
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">
                                        <Download className="mr-2 h-4 w-4" />
                                        Export
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem>Export as XLSX</DropdownMenuItem>
                                    <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                                    <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button disabled>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Invoice
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Invoice #</TableHead>
                            <TableHead>Client/Funder</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockInvoices.map((invoice) => (
                            <TableRow key={invoice.id}>
                                <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                                <TableCell>{invoice.clientOrFunderName}</TableCell>
                                <TableCell>{format(invoice.dueDate, "dd MMM yyyy")}</TableCell>
                                <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                                <TableCell>
                                <Badge variant="outline" className={cn(statusConfig[invoice.status])}>
                                    {invoice.status}
                                </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Toggle menu</span>
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                    <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">Void Invoice</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="payroll">
            <Card>
                <CardHeader>
                    <CardTitle>Payroll Summaries</CardTitle>
                    <CardDescription>View and export payroll run summaries.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Pay Period</TableHead>
                            <TableHead>Total Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockPayrollRuns.map((run) => (
                            <TableRow key={run.id}>
                                <TableCell className="font-medium">{format(run.startDate, "dd MMM")} - {format(run.endDate, "dd MMM yyyy")}</TableCell>
                                <TableCell>${run.totalAmount.toLocaleString()}</TableCell>
                                <TableCell>
                                     <Badge variant="outline" className={cn(statusConfig[run.status])}>
                                        {run.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                     <Button variant="outline" size="sm" disabled>View Details</Button>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
