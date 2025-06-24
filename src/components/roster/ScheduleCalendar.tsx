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
  const [filters, setFilters] = useState({ staffId: 'all', propertyId: 'all' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);

  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const day = new Date();
    day.setDate(day.getDate() + i);
    return day;
  });

  const handleFilterChange = (filterType: 'staffId' | 'propertyId') => (value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const filteredShifts = mockShifts.filter(shift => {
    const staffMatch = filters.staffId === 'all' 
        || (filters.staffId === 'open' && !shift.staffId)
        || shift.staffId === filters.staffId;
    const propertyMatch = filters.propertyId === 'all' || shift.propertyId === filters.propertyId;
    return staffMatch && propertyMatch;
  });

  const shiftsByDay = daysOfWeek.map(day => 
    filteredShifts.filter(shift => format(shift.start, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
  );

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

  return (
    <>
      <Card>
        <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                <CardTitle>Weekly Roster</CardTitle>
                <CardDescription>View and manage the upcoming shift schedule.</CardDescription>
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
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  {daysOfWeek.map((day) => (
                    <TableHead key={day.toISOString()} className="text-center">
                      <div className="font-semibold">{format(day, 'EEE')}</div>
                      <div className="text-muted-foreground text-sm">{format(day, 'd MMM')}</div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  {shiftsByDay.map((dayShifts, index) => (
                    <TableCell key={index} className="align-top p-2 h-96 w-[14.28%]">
                      <div className="space-y-2">
                      {dayShifts.map((shift) => {
                        const staff = mockStaff.find(s => s.id === shift.staffId);
                        const property = mockProperties.find(p => p.id === shift.propertyId);
                        const canEdit = currentUser.role === 'Admin' || currentUser.role === 'Roster Team';
                        return (
                          <div key={shift.id} onClick={() => handleShiftClick(shift)} className={`p-2 rounded-lg bg-accent/50 border border-accent ${canEdit ? 'cursor-pointer hover:bg-accent hover:border-primary/50' : 'cursor-default'}`}>
                            <p className="font-bold text-primary">{shift.title}</p>
                            <p className="text-xs text-muted-foreground">{format(shift.start, 'p')} - {format(shift.end, 'p')}</p>
                            <p className="text-xs mt-1">{property?.name}</p>
                            <div className="mt-2">
                              {staff ? (
                                  <Badge variant="secondary">{staff.name}</Badge>
                              ) : (
                                  <Badge variant="destructive">{shift.status}</Badge>
                              )}
                            </div>
                          </div>
                        )
                      })}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <CreateShiftDialog 
        isOpen={isDialogOpen} 
        setIsOpen={setIsDialogOpen} 
        shift={editingShift}
      />
    </>
  );
}
