
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { mockShifts, mockStaff, mockProperties, mockClients } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format, addDays, subDays, startOfWeek, isToday } from 'date-fns';
import { CreateShiftDialog } from "./CreateShiftDialog";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Search,
  Filter,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Printer,
  Upload,
  RefreshCw,
  ClipboardPaste,
  Send,
  CalendarX2,
  Bolt,
  Hand,
  Wrench,
  PieChart,
  Clock,
  Circle,
  CalendarPlus,
  CalendarDays,
  Calendar as CalendarIcon
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Shift, Staff, Client, UserRole } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

type ViewMode = 'staff' | 'client';

const privilegedRoles: UserRole[] = ['Admin', 'Roster Team'];

export function ScheduleCalendar({ currentUser }: { currentUser: Staff }) {
  const { toast } = useToast();
  const [shifts, setShifts] = useState<Shift[]>(mockShifts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  
  const [viewMode, setViewMode] = useState<ViewMode>('staff');
  const [daysOfWeek, setDaysOfWeek] = useState<Date[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewPeriod, setViewPeriod] = useState<7 | 14>(7);
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyFilter, setPropertyFilter] = useState("all");

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
        const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
        const weekDays = Array.from({ length: viewPeriod }, (_, i) => {
        const day = addDays(start, i);
        return day;
        });
        setDaysOfWeek(weekDays);
    }
  }, [currentDate, viewPeriod, isClient]);
  
  const handleDateNavigate = (days: number) => {
    setCurrentDate(current => addDays(current, days));
  };

  const handleGoToToday = () => {
    setCurrentDate(new Date());
  };
  
  const canPerformAction = () => privilegedRoles.includes(currentUser.role);

  const handleShiftClick = (shift: Shift) => {
    if (canPerformAction()) {
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
    if (canPerformAction()) {
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
    if (!canPerformAction()) {
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
     if (!canPerformAction()) {
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


  const handleSaveShift = (savedShifts: Shift[]) => {
    if (savedShifts.length === 1 && shifts.some(s => s.id === savedShifts[0].id)) {
        const shiftToUpdate = savedShifts[0];
        setShifts(prevShifts => prevShifts.map(s => s.id === shiftToUpdate.id ? shiftToUpdate : s));
        toast({ title: "Shift Updated", description: "The shift has been successfully updated." });
    } else {
        const newShiftsWithIds = savedShifts.map((s, i) => ({
            ...s,
            id: s.id || `shift-${Date.now()}-${i}`
        }));
        setShifts(prevShifts => [...prevShifts, ...newShiftsWithIds]);
        toast({ title: `${newShiftsWithIds.length} Shift(s) Created`, description: "The new shifts have been added to the roster." });
    }

    if (savedShifts.some(s => !s.staffId)) {
      console.log(`[Notification] An open shift has been created/updated. Notifying available staff.`);
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

  const dateRangeText = useMemo(() => {
    if (daysOfWeek.length === 0) return "Loading...";
    const start = daysOfWeek[0];
    const end = daysOfWeek[daysOfWeek.length - 1];
    return `${format(start, "d MMM yyyy")} - ${format(end, "d MMM yyyy")}`;
  }, [daysOfWeek]);
  
  const filteredResources = useMemo(() => {
      const term = searchTerm.toLowerCase();
      let resources: (Staff[] | Client[]) = viewMode === 'staff' ? mockStaff : mockClients;
      
      if (term) {
        resources = resources.filter(r => r.name.toLowerCase().includes(term));
      }

      if (propertyFilter !== 'all') {
          if (viewMode === 'staff') {
              // No direct property link on staff, so this filter doesn't apply in staff view.
              // In a real app, you might filter staff based on properties they are qualified for.
          } else if (viewMode === 'client') {
              resources = (resources as Client[]).filter(c => c.propertyId === propertyFilter);
          }
      }
      return resources;
  }, [searchTerm, viewMode, propertyFilter]);

  const propertyFilteredShifts = useMemo(() => shifts.filter(shift => {
    return propertyFilter === 'all' || shift.propertyId === propertyFilter;
  }), [shifts, propertyFilter]);


  const renderStaffView = () => (
    <TableBody>
      {(filteredResources as Staff[]).map((staff) => {
        const staffShifts = propertyFilteredShifts.filter(s => s.staffId === staff.id);
        return (
          <TableRow key={staff.id} className="h-full">
            <TableCell className="font-medium border-r p-2 align-top sticky left-0 bg-background z-10 w-[200px] min-w-[200px]">
              <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                      <AvatarImage src={staff.avatarUrl} alt={staff.name} />
                      <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                  <p className="font-semibold truncate">{staff.name}</p>
                  <p className="text-xs text-muted-foreground">{staff.role}</p>
                  </div>
              </div>
            </TableCell>
            {daysOfWeek.map((day) => {
              const dayShifts = staffShifts.filter(shift => format(shift.start, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
              return (
                <TableCell key={day.toISOString()} className="align-top p-1 border-l h-24 group/cell relative">
                  {dayShifts.length > 0 ? (
                    <div className="space-y-1">
                      {dayShifts.map(shift => {
                        const property = mockProperties.find(p => p.id === shift.propertyId);
                        const client = mockClients.find(c => c.id === shift.clientId);
                        return (
                          <div key={shift.id} onClick={() => handleShiftClick(shift)} className={`p-1.5 rounded-md bg-accent/80 border border-transparent text-xs ${canPerformAction() ? 'cursor-pointer hover:bg-accent hover:border-primary/50' : 'cursor-default'}`}>
                            <p className="font-bold text-primary truncate">{shift.title}</p>
                            <p className="text-muted-foreground">{format(shift.start, 'p')} - {format(shift.end, 'p')}</p>
                            {client && <p className="truncate mt-1 text-purple-600">{client.name}</p>}
                            <p className="truncate mt-1">{property?.name}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                      canPerformAction() && (
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
       <TableRow>
          <TableCell className="font-medium border-r p-2 align-top bg-amber-50 sticky left-0 z-10 w-[200px] min-w-[200px]">
            <p className="font-semibold text-amber-800">Open Shifts</p>
            <p className="text-xs text-amber-700">Unassigned</p>
          </TableCell>
          {daysOfWeek.map((day) => {
            const openShifts = propertyFilteredShifts.filter(shift => !shift.staffId && format(shift.start, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
            return (
              <TableCell key={day.toISOString()} className="align-top p-1 border-l bg-amber-50/50 h-24 group/cell relative">
                  {openShifts.length > 0 ? (
                  <div className="space-y-1">
                      {openShifts.map(shift => {
                        const property = mockProperties.find(p => p.id === shift.propertyId);
                        return (
                          <div key={shift.id} onClick={() => handleShiftClick(shift)} className={`p-1.5 rounded-md bg-destructive/10 border border-transparent text-xs ${canPerformAction() ? 'cursor-pointer hover:bg-destructive/20 hover:border-destructive/50' : 'cursor-default'}`}>
                            <p className="font-bold text-destructive truncate">{shift.title}</p>
                            <p className="text-muted-foreground">{format(shift.start, 'p')} - {format(shift.end, 'p')}</p>
                            <p className="truncate mt-1">{property?.name}</p>
                            <Badge variant="destructive" className="mt-1">{shift.status}</Badge>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                      canPerformAction() && (
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
    </TableBody>
  );

  const renderClientView = () => (
    <TableBody>
      {(filteredResources as Client[]).map((client) => {
        const clientShifts = propertyFilteredShifts.filter(s => s.clientId === client.id);
        return (
          <TableRow key={client.id} className="h-full">
            <TableCell className="font-medium border-r p-2 align-top sticky left-0 bg-background z-10 w-[200px] min-w-[200px]">
              <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                      <AvatarImage src={client.avatarUrl} alt={client.name} />
                      <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                  <p className="font-semibold truncate">{client.name}</p>
                  <p className="text-xs text-muted-foreground">{mockProperties.find(p => p.id === client.propertyId)?.name}</p>
                  </div>
              </div>
            </TableCell>
            {daysOfWeek.map((day) => {
              const dayShifts = clientShifts.filter(shift => format(shift.start, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
              return (
                <TableCell key={day.toISOString()} className="align-top p-1 border-l h-24 group/cell relative">
                  {dayShifts.length > 0 ? (
                    <div className="space-y-1">
                      {dayShifts.map(shift => {
                        const staff = mockStaff.find(s => s.id === shift.staffId);
                        return (
                          <div key={shift.id} onClick={() => handleShiftClick(shift)} className={`p-1.5 rounded-md bg-accent/80 border border-transparent text-xs ${canPerformAction() ? 'cursor-pointer hover:bg-accent hover:border-primary/50' : 'cursor-default'}`}>
                            <p className="font-bold text-primary truncate">{shift.title}</p>
                            <p className="text-muted-foreground">{format(shift.start, 'p')} - {format(shift.end, 'p')}</p>
                            {staff ? <p className="truncate mt-1 text-blue-600">{staff.name}</p> : <Badge variant="destructive">Open</Badge>}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                      canPerformAction() && (
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
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <CardTitle>Roster Schedule</CardTitle>
                <CardDescription>{dateRangeText}</CardDescription>
              </div>
               {canPerformAction() && (
                 <div className="flex items-center gap-2">
                    <Button variant="outline" className="w-full sm:w-auto" disabled>
                      <ClipboardPaste className="mr-2 h-4 w-4" /> Apply Template
                    </Button>
                    <Button variant="outline" className="w-full sm:w-auto" disabled>
                      <Send className="mr-2 h-4 w-4" /> Publish
                    </Button>
                    <Button onClick={handleCreateClick} className="w-full sm:w-auto">
                      <PlusCircle className="mr-2 h-4 w-4" /> Create Shift
                    </Button>
                 </div>
               )}
            </div>

            <div className="p-2 rounded-lg border bg-muted/50">
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-2">
                 <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <Select value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
                        <SelectTrigger className="w-full sm:w-[180px] h-9">
                          <SelectValue placeholder="Select a view" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="staff">Staff View</SelectItem>
                          <SelectItem value="client">Client View</SelectItem>
                        </SelectContent>
                    </Select>
                     <div className="relative sm:w-64">
                       <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                       <Input
                          type="search"
                          placeholder="Search by name..."
                          className="pl-9 h-9"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                     <Select value={propertyFilter} onValueChange={setPropertyFilter}>
                        <SelectTrigger className="w-full sm:w-[180px] h-9">
                          <SelectValue placeholder="Filter by location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Locations</SelectItem>
                          {mockProperties.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                     <Button variant="outline" className="h-9" disabled>
                      <Filter className="mr-2 h-4 w-4" /> Filters
                    </Button>
                    <div className="flex items-center rounded-md border bg-background h-9">
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                            <Bolt className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                            <Hand className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" className="h-8 px-3 font-bold" disabled>
                            ALL
                        </Button>
                    </div>
                </div>
                
                 <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex items-center rounded-md border bg-background p-0.5">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDateNavigate(-(viewPeriod*2))}>
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDateNavigate(-viewPeriod)}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" className="h-8 px-3" onClick={handleGoToToday} disabled={isToday(currentDate)}>Today</Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDateNavigate(viewPeriod)}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDateNavigate(viewPeriod*2)}>
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                     <Select value={String(viewPeriod)} onValueChange={(v) => setViewPeriod(Number(v) as 7 | 14)}>
                        <SelectTrigger className="w-full sm:w-[120px] h-9">
                          <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">Week</SelectItem>
                          <SelectItem value="14">Fortnight</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" className="h-9 w-9" disabled>
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-9 w-9" disabled>
                            <Printer className="h-4 w-4" />
                        </Button>
                         <Button variant="outline" size="icon" className="h-9 w-9" disabled>
                            <Upload className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-9 w-9" disabled>
                            <CalendarX2 className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="h-9 w-9">
                                    <Wrench className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Widgets</DropdownMenuLabel>
                                <DropdownMenuItem disabled>
                                    <Clock className="mr-2 h-4 w-4" />
                                    <span>Clock-On/Off Status</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem disabled>
                                    <PieChart className="mr-2 h-4 w-4" />
                                    <span>Roster Overview</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Manage</DropdownMenuLabel>
                                <DropdownMenuItem disabled>
                                    <Circle className="mr-2 h-4 w-4" />
                                    <span>Resources</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem disabled>
                                    <CalendarPlus className="mr-2 h-4 w-4" />
                                    <span>Templates</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem disabled>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    <span>Schedules</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem disabled>
                                    <CalendarDays className="mr-2 h-4 w-4" />
                                    <span>Public Holidays</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!isClient || daysOfWeek.length === 0 ? (
             <div className="text-center text-muted-foreground p-8">
              Loading calendar...
            </div>
          ) : (
            <div className="overflow-x-auto border rounded-lg">
              <Table className="min-w-full table-fixed">
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-[200px] min-w-[200px] sticky left-0 bg-muted/50 z-20">{viewMode === 'staff' ? 'Staff' : 'Client'}</TableHead>
                    {daysOfWeek.map((day) => (
                      <TableHead key={day.toISOString()} className="text-center border-l">
                        <div className={`font-semibold ${isToday(day) ? 'text-primary' : ''}`}>{format(day, 'EEE')}</div>
                        <div className={`text-muted-foreground text-sm ${isToday(day) ? 'text-primary' : ''}`}>{format(day, 'd MMM')}</div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                {viewMode === 'staff' ? renderStaffView() : renderClientView()}
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      <CreateShiftDialog 
        isOpen={isDialogOpen} 
        setIsOpen={setIsDialogOpen} 
        shift={editingShift}
        onSave={handleSaveShift}
        onDelete={handleDeleteShift}
        allShifts={shifts}
        currentUser={currentUser}
      />
    </>
  );
}
