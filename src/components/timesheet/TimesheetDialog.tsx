
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import type { Shift, Timesheet, TravelLogEntry } from "@/lib/types";
import { format, differenceInMinutes } from "date-fns";
import { PlusCircle, Trash2 } from "lucide-react";
import { mockProperties, mockClients } from "@/lib/data";

interface TimesheetDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  shift: Shift;
  onSave: (timesheet: Omit<Timesheet, 'id' | 'staffId'>) => void;
}

export function TimesheetDialog({ isOpen, setIsOpen, shift, onSave }: TimesheetDialogProps) {
  const [breakDuration, setBreakDuration] = useState(0);
  const [notes, setNotes] = useState("");
  const [travelLog, setTravelLog] = useState<TravelLogEntry[]>([]);

  const property = mockProperties.find(p => p.id === shift.propertyId);
  const client = mockClients.find(c => c.id === shift.clientId);

  const addTravelEntry = () => {
    setTravelLog([...travelLog, { startLocation: '', endLocation: '', distance: 0 }]);
  };

  const updateTravelEntry = (index: number, field: keyof TravelLogEntry, value: string | number) => {
    const newLog = [...travelLog];
    (newLog[index] as any)[field] = value;
    setTravelLog(newLog);
  };
  
  const removeTravelEntry = (index: number) => {
    setTravelLog(travelLog.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const shiftDuration = differenceInMinutes(shift.end, shift.start);
    const timesheetData: Omit<Timesheet, 'id' | 'staffId'> = {
        shiftId: shift.id,
        propertyId: shift.propertyId,
        startTime: shift.start,
        endTime: shift.end,
        breakDuration,
        hoursWorked: (shiftDuration - breakDuration) / 60,
        status: 'Submitted',
        notes,
        travelLog,
    };
    onSave(timesheetData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Submit Timesheet</DialogTitle>
          <DialogDescription>
            Review your shift details and add any notes or travel expenses before submitting for approval.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="p-4 rounded-lg border bg-muted/50 space-y-2">
                <h4 className="font-semibold">{shift.title}</h4>
                <p className="text-sm text-muted-foreground">
                    {client?.name} at {property?.name}
                </p>
                <p className="text-sm font-medium">
                    {format(shift.start, 'EEE, dd MMM yyyy')} from {format(shift.start, 'p')} to {format(shift.end, 'p')}
                </p>
            </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="breakDuration" className="text-right">
              Break (mins)
            </Label>
            <Input
              id="breakDuration"
              type="number"
              value={breakDuration}
              onChange={(e) => setBreakDuration(parseInt(e.target.value, 10) || 0)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="notes" className="text-right pt-2">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="col-span-3"
              placeholder="Add any notes about your shift..."
            />
          </div>
          
          <Separator />

          <div>
             <div className="flex justify-between items-center mb-2">
                <Label>Travel Log</Label>
                <Button variant="outline" size="sm" onClick={addTravelEntry}>
                    <PlusCircle className="mr-2" /> Add Entry
                </Button>
            </div>
            <div className="space-y-2">
                {travelLog.map((entry, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center">
                        <Input 
                            placeholder="Start" 
                            className="col-span-5" 
                            value={entry.startLocation}
                            onChange={(e) => updateTravelEntry(index, 'startLocation', e.target.value)}
                        />
                        <Input 
                            placeholder="End" 
                            className="col-span-5"
                            value={entry.endLocation}
                            onChange={(e) => updateTravelEntry(index, 'endLocation', e.target.value)}
                        />
                         <div className="relative col-span-1">
                            <Input 
                                type="number" 
                                placeholder="km" 
                                value={entry.distance || ''}
                                onChange={(e) => updateTravelEntry(index, 'distance', parseInt(e.target.value) || 0)}
                                className="pr-6"
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">km</span>
                        </div>
                        <Button variant="ghost" size="icon" className="col-span-1" onClick={() => removeTravelEntry(index)}>
                            <Trash2 className="h-4 w-4 text-destructive"/>
                        </Button>
                    </div>
                ))}
                 {travelLog.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-2">No travel entries added.</p>
                )}
            </div>
          </div>
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save & Submit Timesheet</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
