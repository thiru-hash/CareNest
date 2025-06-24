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
import { mockShifts, mockStaff, mockProperties, mockUsers } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { CreateShiftDialog } from "./CreateShiftDialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Shift, User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const currentUser: User = mockUsers['user-1'];

export function ScheduleCalendar() {
  const { toast } = useToast();
  const [shifts, setShifts] = useState<Shift[]>(mockShifts);
  const [filters, setFilters] = useState({ staffId: 'all', propertyId: 'all' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);

  const today = new Date();
  const dayOfWeek = today.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const startOfWeek = new Date(today.setDate(today.getDate() + diffToMonday));

  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(day.getDate() + i);
    return day;
  });

  const handleFilterChange = (filterType: 'staffId' | 'propertyId') => (value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleShiftClick = (shift: Shift) => {
    if (currentUser.role === 'Admin' || currentUser.role === 'Roster Team') {
      setEditingShift(shift);
      setIsDialogOpen(true);
    } else {
      toast({
        variant: 'destructive',
        title: "Permission Denied",
        description: "You are not authorized to edit shifts.",
      });
    }
  };
  
  const handleCreateClick = () => {
    if (currentUser.role === 'Admin' || currentUser.role === 'Roster Team') {
        setEditingShift(null);
        setIsDialogOpen(true);
    } else {
        toast({
            variant: 'destructive',
            title: "Permission Denied",
            description: "You are not authorized to create shifts.",
        });
    }
  };

  const handleSaveShift = (savedShift: Shift) => {
    const shiftExists = shifts.some(s => s.id === savedShift.id);

    if (shiftExists) {
      setShifts(prevShifts => prevShifts.map(s => s.id === savedShift.id ? savedShift : s));
      toast({ title: "Shift Updated", description: "The shift has been successfully updated."});
    } else {
      setShifts(prevShifts => [...prevShifts, savedShift]);
      toast({ title: "Shift Created", description: "The new shift has been added to the roster."});
    }

    if (!savedShift.staffId) {
      console.log(`[Notification] An open shift "${savedShift.title}" has been created/updated. Notifying available staff.`);
      toast({
          title: "Open Shift Action",
          description: "Notification simulated for available staff.",
      });
    }
  };

  // Filter staff resources based on selection
  const allStaffResources = mockStaff.map(s => ({...s, type: 'staff'}));
  const filteredStaffResources = filters.staffId === 'all'
    ? allStaffResources
    : filters.staffId === 'open'
      ? [] // 'open' is handled separately
      : allStaffResources.filter(s => s.id === filters.staffId);
      
  const showOpenShifts = filters.staffId === 'all' || filters.staffId === 'open';

  // Filter all shifts based on the property filter first
  const propertyFilteredShifts = shifts.filter(shift => {
    return filters.propertyId === 'all' || shift.propertyId === filters.propertyId;
  });

  return (
    <>
      <Card>
        <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                <CardTitle>Weekly Roster</CardTitle>
                <CardDescription>View and manage the upcoming shift schedule for the week.</CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Select value={filters.staffId} onValueChange={handleFilterChange('staffId')}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by staff" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="all">All Staff</SelectItem>
                        <SelectItem value="open">Open Shifts</SelectItem>
                        {mockStaff.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={filters.propertyId} onValueChange={handleFilterChange('propertyId')}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by location" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {mockProperties.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Button onClick={handleCreateClick} className="w-full sm:w-auto">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Shift
                    </Button>
                </div>
            </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto border rounded-lg">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[200px] sticky left-0 bg-muted/50 z-10">Staff</TableHead>
                  {daysOfWeek.map((day) => (
                    <TableHead key={day.toISOString()} className="text-center border-l min-w-[150px]">
                      <div className="font-semibold">{format(day, 'EEE')}</div>
                      <div className="text-muted-foreground text-sm">{format(day, 'd MMM')}</div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaffResources.map((staff) => {
                  const staffShifts = propertyFilteredShifts.filter(s => s.staffId === staff.id);
                  return (
                    <TableRow key={staff.id} className="h-full">
                      <TableCell className="font-medium border-r p-2 align-top sticky left-0 bg-background z-10">
                        <div className="flex items-center gap-2">
                           <Avatar className="h-8 w-8">
                                <AvatarImage src={staff.avatarUrl} alt={staff.name} />
                                <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                           </Avatar>
                           <div>
                            <p className="font-semibold">{staff.name}</p>
                            <p className="text-xs text-muted-foreground">{staff.role}</p>
                           </div>
                        </div>
                      </TableCell>
                      {daysOfWeek.map((day) => {
                        const dayShifts = staffShifts.filter(shift => format(shift.start, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
                        return (
                          <TableCell key={day.toISOString()} className="align-top p-1 border-l">
                            <div className="space-y-1">
                              {dayShifts.map(shift => {
                                const property = mockProperties.find(p => p.id === shift.propertyId);
                                const canEdit = currentUser.role === 'Admin' || currentUser.role === 'Roster Team';
                                return (
                                  <div key={shift.id} onClick={() => handleShiftClick(shift)} className={`p-1.5 rounded-md bg-accent/80 border border-transparent text-xs ${canEdit ? 'cursor-pointer hover:bg-accent hover:border-primary/50' : 'cursor-default'}`}>
                                    <p className="font-bold text-primary truncate">{shift.title}</p>
                                    <p className="text-muted-foreground">{format(shift.start, 'p')} - {format(shift.end, 'p')}</p>
                                    <p className="truncate mt-1">{property?.name}</p>
                                  </div>
                                );
                              })}
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
                {showOpenShifts && (
                  <TableRow>
                    <TableCell className="font-medium border-r p-2 align-top bg-amber-50 sticky left-0 z-10">
                      <p className="font-semibold text-amber-800">Open Shifts</p>
                      <p className="text-xs text-amber-700">Unassigned</p>
                    </TableCell>
                    {daysOfWeek.map((day) => {
                      const openShifts = propertyFilteredShifts.filter(shift => !shift.staffId && format(shift.start, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
                      return (
                        <TableCell key={day.toISOString()} className="align-top p-1 border-l bg-amber-50/50">
                           <div className="space-y-1">
                              {openShifts.map(shift => {
                                const property = mockProperties.find(p => p.id === shift.propertyId);
                                const canEdit = currentUser.role === 'Admin' || currentUser.role === 'Roster Team';
                                return (
                                  <div key={shift.id} onClick={() => handleShiftClick(shift)} className={`p-1.5 rounded-md bg-destructive/10 border border-transparent text-xs ${canEdit ? 'cursor-pointer hover:bg-destructive/20 hover:border-destructive/50' : 'cursor-default'}`}>
                                    <p className="font-bold text-destructive truncate">{shift.title}</p>
                                    <p className="text-muted-foreground">{format(shift.start, 'p')} - {format(shift.end, 'p')}</p>
                                    <p className="truncate mt-1">{property?.name}</p>
                                    <Badge variant="destructive" className="mt-1">{shift.status}</Badge>
                                  </div>
                                );
                              })}
                            </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                )}

                 {filteredStaffResources.length === 0 && !showOpenShifts && (
                    <TableRow>
                        <TableCell colSpan={8} className="h-48 text-center text-muted-foreground">
                            No staff members match the current filter.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <CreateShiftDialog 
        isOpen={isDialogOpen} 
        setIsOpen={setIsDialogOpen} 
        shift={editingShift}
        onSave={handleSaveShift}
      />
    </>
  );
}
