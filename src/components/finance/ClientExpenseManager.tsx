
"use client";

import { useState } from "react";
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
import { PlusCircle, ArrowDownCircle, ArrowUpCircle, MoreHorizontal, Paperclip, Search, Filter, Download } from "lucide-react";
import { mockTransactions } from "@/lib/data";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import type { ClientTransaction } from "@/lib/types";
import { CreateEditTransactionDialog } from "./CreateEditTransactionDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";


const statusConfig: Record<ClientTransaction['status'], { variant: 'default' | 'secondary' | 'destructive', className: string }> = {
  Pending: { variant: 'secondary', className: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30" },
  Approved: { variant: 'default', className: "bg-blue-500/20 text-blue-700 border-blue-500/30" },
  Reimbursed: { variant: 'default', className: "bg-green-500/20 text-green-700 border-green-500/30" },
  Rejected: { variant: 'destructive', className: "bg-red-500/20 text-red-700 border-red-500/30" },
};

export function ClientExpenseManager({ clientId }: { clientId: string }) {
  const [transactions, setTransactions] = useState<ClientTransaction[]>(
    mockTransactions.filter((t) => t.clientId === clientId)
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<ClientTransaction | null>(null);

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setIsDialogOpen(true);
  };

  const handleEditTransaction = (transaction: ClientTransaction) => {
    setEditingTransaction(transaction);
    setIsDialogOpen(true);
  };
  
  const handleDeleteTransaction = (transactionId: string) => {
    setTransactions(prev => prev.filter(t => t.id !== transactionId));
  };

  const handleSaveTransaction = (transactionData: Omit<ClientTransaction, 'id' | 'clientId'>) => {
    if (editingTransaction) {
      setTransactions(prev => prev.map(t => t.id === editingTransaction.id ? { ...t, ...transactionData } : t));
    } else {
      const newTransaction: ClientTransaction = {
        id: `txn-${Date.now()}`,
        clientId: clientId,
        ...transactionData,
      };
      setTransactions(prev => [newTransaction, ...prev]);
    }
    setIsDialogOpen(false);
  };

  const transactionsWithBalance = transactions
    .slice() 
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((t, index, arr) => {
        const balanceBefore = index === 0 ? 0 : arr.slice(0, index).reduce((acc, curr) => {
            return curr.type === 'Payment' ? acc + curr.amount : acc - curr.amount;
        }, 0);
        const currentBalance = t.type === 'Payment' ? balanceBefore + t.amount : balanceBefore - t.amount;
        return {...t, balance: currentBalance};
    }).reverse();


  const totalPayments = transactions.filter(t => t.type === 'Payment').reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'Expense').reduce((acc, t) => acc + t.amount, 0);
  const finalBalance = totalPayments - totalExpenses;

  return (
    <>
      <Card>
        <CardHeader>
            <CardTitle>Expense & Payment Log</CardTitle>
            <CardDescription>
                Track all incoming and outgoing funds for this client.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-2 mb-4">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search expenses..." className="pl-8 w-full md:w-64" />
                </div>
                <div className="flex w-full md:w-auto gap-2">
                    <Select>
                        <SelectTrigger className="w-full md:w-[160px]">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="Transport">Transport</SelectItem>
                            <SelectItem value="Groceries">Groceries</SelectItem>
                            <SelectItem value="Equipment">Equipment</SelectItem>
                            <SelectItem value="Utilities">Utilities</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger className="w-full md:w-[160px]">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Approved">Approved</SelectItem>
                            <SelectItem value="Reimbursed">Reimbursed</SelectItem>
                            <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="h-10" disabled>
                        <Filter className="mr-2 h-4 w-4" /> Date
                    </Button>
                </div>
            </div>

            <div className="flex items-center justify-end gap-2 mb-6">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem disabled>Export as CSV</DropdownMenuItem>
                        <DropdownMenuItem disabled>Export as PDF</DropdownMenuItem>
                        <DropdownMenuItem disabled>Export as Excel</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button onClick={handleAddTransaction}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Transaction
                </Button>
            </div>

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
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactionsWithBalance.length > 0 ? (
                transactionsWithBalance.map((transaction) => {
                    const currentStatusConfig = statusConfig[transaction.status] || statusConfig.Pending;
                    return (
                  <TableRow key={transaction.id}>
                    <TableCell>{format(transaction.date, "dd MMM yyyy")}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span>{transaction.description}</span>
                        {transaction.attachmentName && (
                          <Paperclip className="h-4 w-4 text-muted-foreground" title={transaction.attachmentName} />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={transaction.type === 'Payment' ? 'default' : 'secondary'} className={cn(
                          'w-24 justify-center',
                          transaction.type === 'Payment' ? 'bg-green-500/20 text-green-700 border-green-500/30' : 'bg-red-500/20 text-red-700 border-red-500/30'
                      )}>
                          {transaction.type === 'Payment' 
                              ? <ArrowDownCircle className="mr-1 h-3 w-3" /> 
                              : <ArrowUpCircle className="mr-1 h-3 w-3" />
                          }
                          {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                       <Badge variant={currentStatusConfig.variant} className={cn('w-24 justify-center', currentStatusConfig.className)}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell className={cn(
                        "text-right font-semibold",
                        transaction.type === 'Payment' ? 'text-green-600' : 'text-destructive'
                    )}>
                        <div className="flex flex-col items-end -my-1">
                            <span>
                                {transaction.type === 'Payment' ? '+' : '-'} ${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            {transaction.type === 'Expense' && transaction.gst > 0 && (
                                <span className="text-xs font-normal text-muted-foreground">
                                    incl. ${transaction.gst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} GST
                                </span>
                            )}
                        </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      ${transaction.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditTransaction(transaction)}>Edit Transaction</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem disabled>Mark as Reimbursed</DropdownMenuItem>
                            <DropdownMenuItem disabled>Submit to Claim Queue</DropdownMenuItem>
                            <DropdownMenuItem disabled>Assign for Review</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteTransaction(transaction.id)}>Delete Transaction</DropdownMenuItem>
                          </DropdownMenuContent>
                       </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )})
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No transactions have been logged for this client yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <CreateEditTransactionDialog 
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        transaction={editingTransaction}
        onSave={handleSaveTransaction}
        onDelete={handleDeleteTransaction}
      />
    </>
  );
}
