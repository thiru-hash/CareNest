import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { mockTransactions } from "@/lib/data";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

export function ClientExpenseManager({ clientId }: { clientId: string }) {
  const transactions = mockTransactions
    .filter((t) => t.clientId === clientId)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  let balance = 0;
  const transactionsWithBalance = transactions.map(t => {
      balance = t.type === 'Payment' ? balance + t.amount : balance - t.amount;
      return {...t, balance};
  }).reverse();

  const totalPayments = transactions.filter(t => t.type === 'Payment').reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'Expense').reduce((acc, t) => acc + t.amount, 0);
  const finalBalance = totalPayments - totalExpenses;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <CardTitle>Expense & Payment Log</CardTitle>
                <CardDescription>
                    Track all incoming and outgoing funds for this client.
                </CardDescription>
            </div>
             <Button disabled>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Transaction
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3 mb-6 p-4 rounded-lg border bg-muted/50">
            <div>
                <div className="text-sm text-muted-foreground">Total Payments</div>
                <div className="text-2xl font-bold text-green-600">${totalPayments.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div>
                <div className="text-sm text-muted-foreground">Total Expenses</div>
                <div className="text-2xl font-bold text-destructive">${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
             <div>
                <div className="text-sm text-muted-foreground">Final Balance</div>
                <div className="text-2xl font-bold">${finalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactionsWithBalance.length > 0 ? (
              transactionsWithBalance.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{format(transaction.date, "dd MMM yyyy")}</TableCell>
                  <TableCell className="font-medium">{transaction.description}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={transaction.type === 'Payment' ? 'default' : 'secondary'} className={cn(
                        transaction.type === 'Payment' ? 'bg-green-500/20 text-green-700 border-green-500/30' : 'bg-red-500/20 text-red-700 border-red-500/30'
                    )}>
                        {transaction.type === 'Payment' 
                            ? <ArrowDownCircle className="mr-1 h-3 w-3" /> 
                            : <ArrowUpCircle className="mr-1 h-3 w-3" />
                        }
                        {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell className={cn(
                      "text-right font-semibold",
                      transaction.type === 'Payment' ? 'text-green-600' : 'text-destructive'
                  )}>
                    {transaction.type === 'Payment' ? '+' : '-'} ${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                   <TableCell className="text-right font-mono">
                     ${transaction.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No transactions have been logged for this client yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
