
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
} from "@/components/ui/alert-dialog"
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
import { mockStaff, mockProperties, mockClients } from "@/lib/data";
import { Calendar as CalendarIcon, Trash2 } from "lucide-react";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import type { Shift } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

interface CreateShiftDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  shift: Shift | null;
  onSave: (shifts: Shift[]) => void;
  onDelete: (shiftId: string) => void;
  allShifts: Shift[];
}

const currentUser = mockStaff.find(s => s.id === 'staff-1')!;

export function CreateShiftDialog({ isOpen, setIsOpen, shift, onSave, onDelete, allShifts }: CreateShiftDialogProps) {
  const { toast } = useToast();
  const [startDateTime, setStartDateTime] = useState<Date | undefined>();
  const [endDateTime, setEndDateTime] = useState<Date | undefined>();
  const [isRepeating, setIsRepeating] = useState(false);
  const [repeatCount, setRepeatCount] = useState(7);

  const isEditMode = !!shift?.id;

  useEffect(() => {
    if (isOpen) {
        if (shift) {
          setStartDateTime(shift.start);
          setEndDateTime(shift.end);
          setIsRepeating(false);
        } else {
          setStartDateTime(undefined);
          setEndDateTime(undefined);
          setIsRepeating(false);
          setRepeatCount(7);
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
    const clientIdValue = formData.get('clientId') as string;

    if (!title || !propertyId) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all required fields.' });
        return;
    }

    // Conflict Detection Logic
    if (staffIdValue && staffIdValue !== 'open') {
        const otherShiftsForStaff = allShifts.filter(s => s.staffId === staffIdValue && s.id !== shift?.id);
        const conflictingShift = otherShiftsForStaff.find(
            existingShift => (startDateTime < existingShift.end && endDateTime > existingShift.start)
        );

        if (conflictingShift) {
            const staffMember = mockStaff.find(s => s.id === staffIdValue);
            const property = mockProperties.find(p => p.id === conflictingShift.propertyId);
            toast({
                variant: 'destructive',
                title: 'Shift Conflict Detected',
                description: `${staffMember?.name} is already scheduled for "${conflictingShift.title}" at ${property?.name} from ${format(conflictingShift.start, 'p')} to ${format(conflictingShift.end, 'p')}. Please resolve the conflict before saving.`,
                duration: 9000,
            });
            return; // Stop the save
        }
    }

    const baseShift: Omit<Shift, 'id' | 'start' | 'end'> = {
        title,
        propertyId,
        staffId: staffIdValue === 'open' ? undefined : staffIdValue,
        clientId: clientIdValue === 'none' ? undefined : clientIdValue,
        status: staffIdValue === 'open' ? 'Open' : (shift?.status === 'In Progress' ? 'In Progress' : 'Assigned'),
    };
    
    if (!isEditMode && isRepeating && repeatCount > 0) {
        const shiftsToCreate: Shift[] = [];
        for (let i = 0; i < repeatCount; i++) {
            const newStart = addDays(startDateTime, i);
            const newEnd = addDays(endDateTime, i);
            shiftsToCreate.push({
                ...baseShift,
                id: `shift-${Date.now()}-${i}`,
                start: newStart,
                end: newEnd,
            });
        }
        onSave(shiftsToCreate);
    } else {
        const shiftToSave: Shift = {
            ...baseShift,
            id: shift?.id || `shift-${Date.now()}`,
            start: startDateTime,
            end: endDateTime,
        };
        onSave([shiftToSave]);
    }
    
    setIsOpen(false);
  };
  
  const handleDelete = () => {
    if (shift?.id) {
        onDelete(shift.id);
        setIsOpen(false);
    }
  }

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
              <Label htmlFor="clientId" className="text-right">
                Client
              </Label>
              <Select name="clientId" defaultValue={shift?.clientId || 'none'}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No specific client</SelectItem>
                  {mockClients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
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
            
            {!isEditMode && (
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Repeat</Label>
                    <div className="col-span-3 flex items-center space-x-4">
                        <Switch
                            id="isRepeating"
                            checked={isRepeating}
                            onCheckedChange={setIsRepeating}
                        />
                        {isRepeating && (
                            <div className="flex items-center gap-2">
                                <Label htmlFor="repeatCount">for the next</Label>
                                <Input
                                    id="repeatCount"
                                    type="number"
                                    value={repeatCount}
                                    onChange={(e) => setRepeatCount(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-20"
                                    min="1"
                                />
                                <span>days</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

          </div>
          <DialogFooter className="justify-between sm:justify-between">
            <div>
            {isEditMode && currentUser.role === 'Admin' && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button type="button" variant="destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Shift
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the shift.
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
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit">{isEditMode ? 'Save Changes' : 'Save Shift'}</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
