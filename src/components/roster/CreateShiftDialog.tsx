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
  onSave: (shift: Shift) => void;
}

export function CreateShiftDialog({ isOpen, setIsOpen, shift, onSave }: CreateShiftDialogProps) {
  const { toast } = useToast();
  const [startDateTime, setStartDateTime] = useState<Date | undefined>();
  const [endDateTime, setEndDateTime] = useState<Date | undefined>();

  const isEditMode = !!shift?.id;

  useEffect(() => {
    if (isOpen) {
        if (shift) {
          setStartDateTime(shift.start);
          setEndDateTime(shift.end);
        } else {
          // Reset form for new entry from scratch
          setStartDateTime(undefined);
          setEndDateTime(undefined);
        }
    }
  }, [shift, isOpen]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    if (!startDateTime || !endDateTime) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all date and time fields.' });
        return;
    }

    if (endDateTime < startDateTime) {
        toast({ variant: 'destructive', title: 'Error', description: 'End time cannot be earlier than start time.' });
        return;
    }

    const title = formData.get('title') as string;
    const propertyId = formData.get('propertyId') as string;
    const staffIdValue = formData.get('staffId') as string;

    if (!title || !propertyId) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all required fields.' });
        return;
    }

    const shiftToSave: Shift = {
        id: shift?.id || `shift-${Date.now()}`,
        title,
        propertyId,
        staffId: staffIdValue === 'open' ? undefined : staffIdValue,
        start: startDateTime,
        end: endDateTime,
        status: staffIdValue === 'open' ? 'Open' : (shift?.status === 'In Progress' ? 'In Progress' : 'Assigned'),
    };
    
    onSave(shiftToSave);
    setIsOpen(false);
  };
  
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = ['00', '15', '30', '45'];


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
              <Label htmlFor="startDateTime" className="text-right">
                Start
              </Label>
              <Popover>
                  <PopoverTrigger asChild>
                      <Button
                          id="startDateTime"
                          variant={"outline"}
                          className={cn(
                              "col-span-3 justify-start text-left font-normal",
                              !startDateTime && "text-muted-foreground"
                          )}
                      >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDateTime ? format(startDateTime, "PPP p") : <span>Pick a date and time</span>}
                      </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                      <Calendar
                          mode="single"
                          selected={startDateTime}
                          onSelect={(date) => {
                              if (!date) return;
                              const newDateTime = startDateTime ? new Date(startDateTime) : new Date();
                              newDateTime.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                              setStartDateTime(newDateTime);
                          }}
                          initialFocus
                      />
                      <div className="p-3 border-t border-border">
                          <div className="flex items-center justify-center gap-2">
                              <Select
                                  value={startDateTime ? format(startDateTime, 'HH') : undefined}
                                  onValueChange={(hour) => {
                                      const newDateTime = startDateTime ? new Date(startDateTime) : new Date();
                                      newDateTime.setHours(parseInt(hour, 10));
                                      setStartDateTime(newDateTime);
                                  }}
                              >
                                  <SelectTrigger className="w-[80px]">
                                      <SelectValue placeholder="Hour" />
                                  </SelectTrigger>
                                  <SelectContent>
                                      {hours.map(h => <SelectItem key={`start-hour-${h}`} value={h}>{h}</SelectItem>)}
                                  </SelectContent>
                              </Select>
                              :
                              <Select
                                  value={startDateTime ? format(startDateTime, 'mm') : undefined}
                                  onValueChange={(minute) => {
                                      const newDateTime = startDateTime ? new Date(startDateTime) : new Date();
                                      newDateTime.setMinutes(parseInt(minute, 10));
                                      setStartDateTime(newDateTime);
                                  }}
                              >
                                  <SelectTrigger className="w-[80px]">
                                      <SelectValue placeholder="Min" />
                                  </SelectTrigger>
                                  <SelectContent>
                                       {minutes.map(m => <SelectItem key={`start-min-${m}`} value={m}>{m}</SelectItem>)}
                                  </SelectContent>
                              </Select>
                          </div>
                      </div>
                  </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDateTime" className="text-right">
                End
              </Label>
              <Popover>
                  <PopoverTrigger asChild>
                      <Button
                          id="endDateTime"
                          variant={"outline"}
                          className={cn(
                              "col-span-3 justify-start text-left font-normal",
                              !endDateTime && "text-muted-foreground"
                          )}
                      >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDateTime ? format(endDateTime, "PPP p") : <span>Pick a date and time</span>}
                      </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                      <Calendar
                          mode="single"
                          selected={endDateTime}
                          onSelect={(date) => {
                              if (!date) return;
                              const newDateTime = endDateTime ? new Date(endDateTime) : new Date();
                              newDateTime.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                              setEndDateTime(newDateTime);
                          }}
                          initialFocus
                      />
                      <div className="p-3 border-t border-border">
                          <div className="flex items-center justify-center gap-2">
                              <Select
                                  value={endDateTime ? format(endDateTime, 'HH') : undefined}
                                  onValueChange={(hour) => {
                                      const newDateTime = endDateTime ? new Date(endDateTime) : new Date();
                                      newDateTime.setHours(parseInt(hour, 10));
                                      setEndDateTime(newDateTime);
                                  }}
                              >
                                  <SelectTrigger className="w-[80px]">
                                      <SelectValue placeholder="Hour" />
                                  </SelectTrigger>
                                  <SelectContent>
                                      {hours.map(h => <SelectItem key={`end-hour-${h}`} value={h}>{h}</SelectItem>)}
                                  </SelectContent>
                              </Select>
                              :
                              <Select
                                  value={endDateTime ? format(endDateTime, 'mm') : undefined}
                                  onValueChange={(minute) => {
                                      const newDateTime = endDateTime ? new Date(endDateTime) : new Date();
                                      newDateTime.setMinutes(parseInt(minute, 10));
                                      setEndDateTime(newDateTime);
                                  }}
                              >
                                  <SelectTrigger className="w-[80px]">
                                      <SelectValue placeholder="Min" />
                                  </SelectTrigger>
                                  <SelectContent>
                                       {minutes.map(m => <SelectItem key={`end-min-${m}`} value={m}>{m}</SelectItem>)}
                                  </SelectContent>
                              </Select>
                          </div>
                      </div>
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
