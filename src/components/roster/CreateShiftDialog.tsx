"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { mockStaff, mockProperties } from "@/lib/data";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Shift } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface CreateShiftDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  shift: Shift | null;
}

export function CreateShiftDialog({ isOpen, setIsOpen, shift }: CreateShiftDialogProps) {
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const isEditMode = !!shift;

  useEffect(() => {
    if (isEditMode && shift) {
      setStartDate(shift.start);
      setEndDate(shift.end);
    } else {
      setStartDate(undefined);
      setEndDate(undefined);
    }
  }, [shift, isEditMode]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      title: formData.get('title'),
      propertyId: formData.get('propertyId'),
      staffId: formData.get('staffId'),
      start: startDate,
      end: endDate,
    };
    
    if (!data.title || !data.propertyId || !data.start || !data.end) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all required fields.' });
        return;
    }

    if (isEditMode) {
      console.log("Updating shift:", shift?.id, "with data:", data);
    } else {
      console.log("Creating new shift with data:", data);
    }

    if (data.staffId === 'open') {
        console.log(`[Notification] An open shift "${data.title}" has been created/updated. Notifying available staff.`);
        toast({
            title: "Open Shift Action",
            description: "Notification simulated for available staff.",
        });
    }
    
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setStartDate(undefined);
      setEndDate(undefined);
    }
    setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Shift' : 'Create New Shift'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the details for this shift.' : "Fill in the details for the new shift. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>
        <form key={shift?.id || 'new'} onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input id="title" name="title" defaultValue={shift?.title} className="col-span-3" placeholder="e.g. Morning Support" required />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="propertyId" className="text-right">
                Location
              </Label>
              <Select name="propertyId" required defaultValue={shift?.propertyId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent>
                  {mockProperties.map((prop) => (
                    <SelectItem key={prop.id} value={prop.id}>
                      {prop.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="staffId" className="text-right">
                Assign to
              </Label>
              <Select name="staffId" defaultValue={shift?.staffId || 'open'}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select staff or leave open" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open Shift (Unassigned)</SelectItem>
                  {mockStaff.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {staff.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Start Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">End Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">{isEditMode ? 'Save Changes' : 'Save Shift'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
