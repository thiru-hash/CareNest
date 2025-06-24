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
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  const isEditMode = !!shift;

  useEffect(() => {
    if (isOpen) {
        if (isEditMode && shift) {
          setStartDate(shift.start);
          setEndDate(shift.end);
          setStartTime(format(shift.start, "HH:mm"));
          setEndTime(format(shift.end, "HH:mm"));
        } else {
          // Reset form for new entry
          setStartDate(undefined);
          setEndDate(undefined);
          setStartTime("");
          setEndTime("");
        }
    }
  }, [shift, isEditMode, isOpen]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    if (!startDate || !endDate || !startTime || !endTime) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all date and time fields.' });
        return;
    }

    const finalStartDate = new Date(startDate);
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    finalStartDate.setHours(startHours, startMinutes, 0, 0);

    const finalEndDate = new Date(endDate);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    finalEndDate.setHours(endHours, endMinutes, 0, 0);

    const data = {
      title: formData.get('title'),
      propertyId: formData.get('propertyId'),
      staffId: formData.get('staffId'),
      start: finalStartDate,
      end: finalEndDate,
    };
    
    if (!data.title || !data.propertyId) {
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[540px]">
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
              <Label className="text-right">Start</Label>
              <div className="col-span-3 flex gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                        "flex-1 justify-start text-left font-normal",
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
                <Input 
                    type="time" 
                    className="w-[120px]" 
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">End</Label>
              <div className="col-span-3 flex gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                        "flex-1 justify-start text-left font-normal",
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
                 <Input 
                    type="time" 
                    className="w-[120px]" 
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                />
              </div>
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
