
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { ClientTransaction } from "@/lib/types";

interface CreateEditTransactionDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  transaction: ClientTransaction | null;
  onSave: (data: Omit<ClientTransaction, 'id' | 'clientId'>) => void;
  onDelete: (transactionId: string) => void;
}

export function CreateEditTransactionDialog({ isOpen, setIsOpen, transaction, onSave, onDelete }: CreateEditTransactionDialogProps) {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>();
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"Payment" | "Expense">("Expense");
  const [amount, setAmount] = useState("");
  const [attachmentName, setAttachmentName] = useState<string | undefined>("");
  const [category, setCategory] = useState<ClientTransaction['category']>('Other');
  const [status, setStatus] = useState<ClientTransaction['status']>('Approved');
  
  const isEditMode = !!transaction;

  useEffect(() => {
    if (isOpen) {
      if (transaction) {
        setDate(transaction.date);
        setDescription(transaction.description);
        setType(transaction.type);
        setAmount(String(transaction.amount));
        setAttachmentName(transaction.attachmentName);
        setCategory(transaction.category);
        setStatus(transaction.status);
      } else {
        // On create, default status to Approved as per user request
        setDate(new Date());
        setDescription("");
        setType("Expense");
        setAmount("");
        setAttachmentName("");
        setCategory("Other");
        setStatus("Approved");
      }
    }
  }, [transaction, isOpen]);

  const handleSave = () => {
    if (!date || !description || !amount || isNaN(parseFloat(amount))) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields with valid data.",
      });
      return;
    }
    
    // Assume GST is 0 unless it's an expense, then calculate it as 15% for demo.
    const gstAmount = type === 'Expense' ? parseFloat(amount) * 0.15 : 0;

    onSave({
      date,
      description,
      type,
      amount: parseFloat(amount),
      gst: gstAmount,
      category,
      attachmentName,
      status,
    });
  };

  const handleDelete = () => {
    if(transaction?.id) {
        onDelete(transaction.id);
        setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Transaction" : "Add New Transaction"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the details for this transaction." : "Log a new payment or expense."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button id="date" variant="outline" className={cn("col-span-3 justify-start text-left font-normal", !date && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Weekly Groceries"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as "Payment" | "Expense")}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select transaction type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Expense">Expense</SelectItem>
                <SelectItem value="Payment">Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">Amount</Label>
            <div className="col-span-3 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="pl-6"
              />
            </div>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as ClientTransaction['category'])}>
                <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="Transport">Transport</SelectItem>
                <SelectItem value="Groceries">Groceries</SelectItem>
                <SelectItem value="Equipment">Equipment</SelectItem>
                <SelectItem value="Utilities">Utilities</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as ClientTransaction['status'])}>
                <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Reimbursed">Reimbursed</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
            </Select>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="attachment" className="text-right">Attachment</Label>
            <div className="col-span-3">
                <Input id="attachment" type="file" onChange={(e) => setAttachmentName(e.target.files?.[0]?.name)}/>
                {attachmentName && <p className="text-xs text-muted-foreground mt-1 truncate">Current file: {attachmentName}</p>}
            </div>
          </div>
        </div>
        <DialogFooter className="justify-between">
           <div>
            {isEditMode && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button type="button" variant="destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the transaction record.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
            </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Transaction</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
