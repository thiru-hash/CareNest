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
import { mockShifts, mockStaff, mockProperties, mockUsers, mockClients } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { CreateShiftDialog } from "./CreateShiftDialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Shift, User, Staff, Client } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const currentUser: User = mockUsers['user-1'];

type ViewMode = 'staff' | 'client';

export function ScheduleCalendar() {
  const { toast } = useToast();
  const [shifts, setShifts] = useState<Shift[]>(mockShifts);
  const [filters, setFilters] = useState({ staffId: 'all', propertyId: 'all' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('staff');

  const today = new Date();
  const dayOfWeek = today.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const startOfWeek = new Date(new Date().setDate(today.getDate() + diffToMonday));


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

  const handleCellCreateClick = (resource: Staff | Client, day: Date) => {
    if (currentUser.role !== 'Admin' && currentUser.role !== 'Roster Team') {
      toast({
        variant: 'destructive',
        title: "Permission Denied",
        description: "You are not authorized to create shifts.",
      });
      return;
    }

    const start = new Date(day);
    start.setHours(9, 0, 0, 0);

    const end = new Date(day);
    end.setHours(17, 0, 0, 0);

    const newShiftTemplate: Shift = {
      id: '',
      title: '',
      staffId: viewMode === 'staff' ? resource.id : undefined,
      clientId: viewMode === 'client' ? resource.id : undefined,
      propertyId: viewMode === 'client' ? (resource as Client).propertyId : '',
      start,
      end,
      status: 'Assigned',
    };

    setEditingShift(newShiftTemplate);
    setIsDialogOpen(true);
  };
  
  const handleOpenShiftCellClick = (day: Date) => {
    if (currentUser.role !== 'Admin' && currentUser.role !== 'Roster Team') {
      toast({
        variant: 'destructive',
        title: 'Permission Denied',
        description: 'You are not authorized to create shifts.',
      });
      return;
    }

    const start = new Date(day);
    start.setHours(9, 0, 0, 0);
    const end = new Date(day);
    end.setHours(17, 0, 0, 0);

    const newShiftTemplate: Shift = {
      id: '',
      title: '',
      staffId: undefined,
      propertyId: '',
      start,
      end,
      status: 'Open',
    };

    setEditingShift(newShiftTemplate);
    setIsDialogOpen(true);
  };


  const handleSaveShift = (savedShift: Shift) => {
    const shiftExists = shifts.some(s => s.id === savedShift.id);

    if (shiftExists) {
      setShifts(prevShifts => prevShifts.map(s => s.id === savedShift.id ? savedShift : s));
      toast({ title: "Shift Updated", description: "The shift has been successfully updated."});
    } else {
      setShifts(prevShifts => [...prevShifts, { ...savedShift, id: `shift-${Date.now()}` }]);
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
  
  const handleDeleteShift = (shiftId: string) => {
    setShifts(prevShifts => prevShifts.filter(s => s.id !== shiftId));
    toast({ title: "Shift Deleted", description: "The shift has been removed from the roster."});
  }

  const allStaffResources = mockStaff.map(s => ({...s, type: 'staff'}));
  const filteredStaffResources = filters.staffId === 'all'
    ? allStaffResources
    : filters.staffId === 'open'
      ? []
      : allStaffResources.filter(s => s.id === filters.staffId);
      
  const showOpenShifts = filters.staffId === 'all' || filters.staffId === 'open';

  const propertyFilteredShifts = shifts.filter(shift => {
    return filters.propertyId === 'all' || shift.propertyId === filters.propertyId;
  });

  const renderStaffView = () => (
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
              const canCreate = currentUser.role === 'Admin' || currentUser.role === 'Roster Team';
              return (
                <TableCell key={day.toISOString()} className="align-top p-1 border-l h-24 group/cell relative">
                  {dayShifts.length > 0 ? (
                    <div className="space-y-1">
                      {dayShifts.map(shift => {
                        const property = mockProperties.find(p => p.id === shift.propertyId);
                        const client = mockClients.find(c => c.id === shift.clientId);
                        const canEdit = currentUser.role === 'Admin' || currentUser.role === 'Roster Team';
                        return (
                          <div key={shift.id} onClick={() => handleShiftClick(shift)} className={`p-1.5 rounded-md bg-accent/80 border border-transparent text-xs ${canEdit ? 'cursor-pointer hover:bg-accent hover:border-primary/50' : 'cursor-default'}`}>
                            <p className="font-bold text-primary truncate">{shift.title}</p>
                            <p className="text-muted-foreground">{format(shift.start, 'p')} - {format(shift.end, 'p')}</p>
                            {client && <p className="truncate mt-1 text-purple-600">{client.name}</p>}
                            <p className="truncate mt-1">{property?.name}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                      canCreate && (
                          <div className="flex items-center justify-center h-full">
                              <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 opacity-0 group-hover/cell:opacity-100 focus:opacity-100 transition-opacity"
                                  onClick={() => handleCellCreateClick(staff, day)}
                              >
                                  <PlusCircle className="h-4 w-4" />
                                  <span className="sr-only">Add shift</span>
                              </Button>
                          </div>
                      )
                  )}
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
            const canCreate = currentUser.role === 'Admin' || currentUser.role === 'Roster Team';
            return (
              <TableCell key={day.toISOString()} className="align-top p-1 border-l bg-amber-50/50 h-24 group/cell relative">
                  {openShifts.length > 0 ? (
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
                  ) : (
                      canCreate && (
                          <div className="flex items-center justify-center h-full">
                              <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 opacity-0 group-hover/cell:opacity-100 focus:opacity-100 transition-opacity"
                                  onClick={() => handleOpenShiftCellClick(day)}
                              >
                                  <PlusCircle className="h-4 w-4" />
                                  <span className="sr-only">Add open shift</span>
                              </Button>
                          </div>
                      )
                  )}
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
  );

  const renderClientView = () => (
    <TableBody>
      {mockClients.map((client) => {
        const clientShifts = propertyFilteredShifts.filter(s => s.clientId === client.id);
        return (
          <TableRow key={client.id} className="h-full">
            <TableCell className="font-medium border-r p-2 align-top sticky left-0 bg-background z-10">
              <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                      <AvatarImage src={client.avatarUrl} alt={client.name} />
                      <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                  <p className="font-semibold">{client.name}</p>
                  <p className="text-xs text-muted-foreground">{mockProperties.find(p => p.id === client.propertyId)?.name}</p>
                  </div>
              </div>
            </TableCell>
            {daysOfWeek.map((day) => {
              const dayShifts = clientShifts.filter(shift => format(shift.start, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
              const canCreate = currentUser.role === 'Admin' || currentUser.role === 'Roster Team';
              return (
                <TableCell key={day.toISOString()} className="align-top p-1 border-l h-24 group/cell relative">
                  {dayShifts.length > 0 ? (
                    <div className="space-y-1">
                      {dayShifts.map(shift => {
                        const staff = mockStaff.find(s => s.id === shift.staffId);
                        const canEdit = currentUser.role === 'Admin' || currentUser.role === 'Roster Team';
                        return (
                          <div key={shift.id} onClick={() => handleShiftClick(shift)} className={`p-1.5 rounded-md bg-accent/80 border border-transparent text-xs ${canEdit ? 'cursor-pointer hover:bg-accent hover:border-primary/50' : 'cursor-default'}`}>
                            <p className="font-bold text-primary truncate">{shift.title}</p>
                            <p className="text-muted-foreground">{format(shift.start, 'p')} - {format(shift.end, 'p')}</p>
                            {staff ? <p className="truncate mt-1 text-blue-600">{staff.name}</p> : <Badge variant="destructive">Open</Badge>}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                      canCreate && (
                          <div className="flex items-center justify-center h-full">
                              <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 opacity-0 group-hover/cell:opacity-100 focus:opacity-100 transition-opacity"
                                  onClick={() => handleCellCreateClick(client, day)}
                              >
                                  <PlusCircle className="h-4 w-4" />
                                  <span className="sr-only">Add shift for client</span>
                              </Button>
                          </div>
                      )
                  )}
                </TableCell>
              );
            })}
          </TableRow>
        );
      })}
    </TableBody>
  )

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
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)} className="mt-4">
                <TabsList>
                    <TabsTrigger value="staff">Staff View</TabsTrigger>
                    <TabsTrigger value="client">Client View</TabsTrigger>
                </TabsList>
            </Tabs>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto border rounded-lg">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[200px] sticky left-0 bg-muted/50 z-10">{viewMode === 'staff' ? 'Staff' : 'Client'}</TableHead>
                  {daysOfWeek.map((day) => (
                    <TableHead key={day.toISOString()} className="text-center border-l min-w-[150px]">
                      <div className="font-semibold">{format(day, 'EEE')}</div>
                      <div className="text-muted-foreground text-sm">{format(day, 'd MMM')}</div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              {viewMode === 'staff' ? renderStaffView() : renderClientView()}
            </Table>
          </div>
        </CardContent>
      </Card>
      <CreateShiftDialog 
        isOpen={isDialogOpen} 
        setIsOpen={setIsDialogOpen} 
        shift={editingShift}
        onSave={handleSaveShift}
        onDelete={handleDeleteShift}
      />
    </>
  );
}
