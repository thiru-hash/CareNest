"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, Plane, Hourglass, Camera, Mail, Phone, MapPin, Calendar, Building, DollarSign, FileText, Shield, Download, Eye, Search, User } from "lucide-react";
import type { Staff } from "@/lib/types";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useRoster } from "@/lib/hooks/useRoster";
import { Label } from "@/components/ui/label";

interface ProfileClientProps {
  currentUser: Staff;
  isOwnProfile?: boolean;
}

interface Timesheet {
  id: string;
  shiftId: string;
  propertyId: string;
  propertyName: string;
  clientId: string;
  clientName: string;
  startTime: Date;
  endTime: Date;
  hoursWorked: number;
  breakDuration: number;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
  notes?: string;
  travelLog?: Array<{
    startLocation: string;
    endLocation: string;
    distance: number;
  }>;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
}

export function ProfileClient({ currentUser, isOwnProfile = true }: ProfileClientProps) {
  const { toast } = useToast();
  const { clockIn, clockOut, getCurrentShift, currentUserId } = useRoster();
  
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [currentShift, setCurrentShift] = useState<any>(null);
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [selectedTimesheet, setSelectedTimesheet] = useState<Timesheet | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    search: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock timesheet data for the current user
  useEffect(() => {
    const mockTimesheets: Timesheet[] = [
      {
        id: 'ts-1',
        shiftId: 'shift-1',
        propertyId: 'prop-1',
        propertyName: 'Wellington Residential',
        clientId: 'client-1',
        clientName: 'Peter Jones',
        startTime: new Date('2024-01-15T08:00:00'),
        endTime: new Date('2024-01-15T16:00:00'),
        hoursWorked: 7.5,
        breakDuration: 30,
        status: 'Approved',
        notes: 'Client was in good spirits today. Completed all scheduled activities.',
        travelLog: [
          {
            startLocation: 'Home',
            endLocation: 'Wellington Residential',
            distance: 15
          }
        ],
        submittedAt: new Date('2024-01-15T16:30:00'),
        reviewedAt: new Date('2024-01-16T09:00:00'),
        reviewedBy: 'Manager'
      },
      {
        id: 'ts-2',
        shiftId: 'shift-2',
        propertyId: 'prop-1',
        propertyName: 'Wellington Residential',
        clientId: 'client-1',
        clientName: 'Peter Jones',
        startTime: new Date('2024-01-14T08:00:00'),
        endTime: new Date('2024-01-14T16:00:00'),
        hoursWorked: 7,
        breakDuration: 30,
        status: 'Submitted',
        notes: 'Regular shift duties completed.',
        submittedAt: new Date('2024-01-14T16:30:00')
      },
      {
        id: 'ts-3',
        shiftId: 'shift-3',
        propertyId: 'prop-2',
        propertyName: 'Auckland Community',
        clientId: 'client-2',
        clientName: 'Mary Williams',
        startTime: new Date('2024-01-13T09:00:00'),
        endTime: new Date('2024-01-13T17:00:00'),
        hoursWorked: 7,
        breakDuration: 45,
        status: 'Rejected',
        notes: 'Assisted with daily activities and medication administration.',
        submittedAt: new Date('2024-01-13T17:15:00'),
        reviewedAt: new Date('2024-01-14T10:00:00'),
        reviewedBy: 'Manager',
        rejectionReason: 'Incorrect break duration recorded. Please review and resubmit.'
      }
    ];
    setTimesheets(mockTimesheets);
  }, []);

  // Check if user is currently clocked in
  useEffect(() => {
    const checkClockStatus = () => {
      const shift = getCurrentShift();
      if (shift && shift.status === 'clocked-in') {
        setIsClockedIn(true);
        setCurrentShift(shift);
        // Set clock in time from the shift data
        if (shift.clockInTime) {
          setClockInTime(new Date(shift.clockInTime));
        }
      } else {
        setIsClockedIn(false);
        setCurrentShift(null);
        setClockInTime(null);
      }
    };

    checkClockStatus();
    // Check every minute for status updates
    const interval = setInterval(checkClockStatus, 60000);
    return () => clearInterval(interval);
  }, [getCurrentShift]);

  const handleClockInOut = async () => {
    if (isClockedIn && currentShift) {
      // Clocking out
      try {
        await clockOut(currentShift.id);
        setIsClockedIn(false);
        setCurrentShift(null);
        setClockInTime(null);
        toast({
          title: "Clocked Out",
          description: `Successfully clocked out at ${new Date().toLocaleTimeString()}. A timesheet has been created for your review.`,
        });
      } catch (error) {
        toast({
          title: "Clock Out Failed",
          description: "There was an error clocking out. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      // Clocking in - find available shift
      const availableShift = getCurrentShift();
      if (availableShift && availableShift.status === 'assigned') {
        try {
          await clockIn(availableShift.id);
          setIsClockedIn(true);
          setCurrentShift(availableShift);
          setClockInTime(new Date());
          toast({
            title: "Clocked In",
            description: `Successfully clocked in at ${new Date().toLocaleTimeString()}`,
          });
        } catch (error) {
          toast({
            title: "Clock In Failed",
            description: "There was an error clocking in. Please try again.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "No Available Shift",
          description: "You don't have any assigned shifts available for clock in at this time.",
          variant: "destructive"
        });
      }
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
        toast({
          title: "Profile Picture Updated",
          description: "Your new profile picture has been set.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    if (currentUser.role === 'System Admin' || isOwnProfile) {
      fileInputRef.current?.click();
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Not specified';
    return format(date, 'MMM dd, yyyy');
  };

  const getEmploymentTypeColor = (type: string) => {
    const colorMap = {
      'Full-time': 'bg-blue-100 text-blue-800',
      'Part-time': 'bg-yellow-100 text-yellow-800',
      'Casual': 'bg-purple-100 text-purple-800',
      'Contract': 'bg-orange-100 text-orange-800'
    };
    return colorMap[type as keyof typeof colorMap] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <Badge className="bg-success/10 text-success border-success/20">Approved</Badge>;
      case 'Rejected':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Rejected</Badge>;
      case 'Submitted':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
      case 'Draft':
        return <Badge className="bg-muted text-muted-foreground">Draft</Badge>;
      default:
        return <Badge className="bg-muted text-muted-foreground">{status}</Badge>;
    }
  };

  const handleExportTimesheets = () => {
    // Mock export functionality
    const csvContent = [
      ['Date', 'Client', 'Property', 'Hours', 'Status', 'Notes'],
      ...timesheets.map(ts => [
        ts.startTime.toLocaleDateString(),
        ts.clientName,
        ts.propertyName,
        ts.hoursWorked.toString(),
        ts.status,
        ts.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentUser.name}-timesheets-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredTimesheets = timesheets.filter(ts => {
    if (filters.status !== 'all' && ts.status !== filters.status) return false;
    if (filters.search && !ts.clientName.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="relative group">
              <Avatar className="w-24 h-24 border-4 border-background shadow-md cursor-pointer" onClick={handleAvatarClick}>
                <AvatarImage src={avatarUrl} alt={currentUser.name} />
                <AvatarFallback className="text-3xl">{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {(currentUser.role === 'System Admin' || isOwnProfile) && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                className="hidden"
                accept="image/*"
              />
            </div>
            <div className="flex-1 pt-2">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{currentUser.name}</h1>
                <Badge className={getEmploymentTypeColor(currentUser.employmentDetails?.employmentType || 'Unknown')}>
                  {currentUser.employmentDetails?.employmentType || 'Unknown'}
                </Badge>
              </div>
              <p className="text-muted-foreground text-lg">{currentUser.role}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <span>{currentUser.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>{currentUser.phone}</span>
                </div>
              </div>
              {currentUser.personalDetails?.address && (
                <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{currentUser.personalDetails.address}</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Shift Management Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Shift Management</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Status</span>
                <Badge variant={isClockedIn ? "default" : "secondary"}>
                  {isClockedIn ? "Clocked In" : "Available"}
                </Badge>
              </div>
              {isClockedIn && clockInTime && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Clock In Time</span>
                  <span className="text-sm font-medium">{clockInTime.toLocaleTimeString()}</span>
                </div>
              )}
              {currentShift && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current Shift</span>
                  <span className="text-sm font-medium">{currentShift.area}</span>
                </div>
              )}
              <Button 
                onClick={handleClockInOut} 
                className="w-full mt-2"
                variant={isClockedIn ? "destructive" : "default"}
              >
                {isClockedIn ? "Clock Out" : "Clock In"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Employment Details Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Employment Details</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Start Date</span>
                <span className="text-sm font-medium">
                  {formatDate(currentUser.employmentDetails?.startDate)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Employment Type</span>
                <span className="text-sm font-medium">
                  {currentUser.employmentDetails?.employmentType || 'Not specified'}
                </span>
              </div>
              {currentUser.employmentDetails?.payRate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pay Rate</span>
                  <span className="text-sm font-medium">
                    ${currentUser.employmentDetails.payRate}/hr
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Personal Details Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Personal Details</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Date of Birth</span>
                <span className="text-sm font-medium">
                  {formatDate(currentUser.personalDetails?.dob)}
                </span>
              </div>
              {currentUser.personalDetails?.address && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Address</span>
                  <span className="text-sm font-medium truncate max-w-[120px]">
                    {currentUser.personalDetails.address}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timesheets">Timesheets</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overview content - existing content can go here */}
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>
                Welcome to your profile overview. Here you can manage your personal information and view your employment details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This is the overview tab where you can see a summary of your profile information.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timesheets" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Timesheets</CardTitle>
                  <CardDescription>
                    View and manage your timesheet history
                  </CardDescription>
                </div>
                <Button onClick={handleExportTimesheets} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search timesheets..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Submitted">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Timesheets Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTimesheets.map((timesheet) => (
                      <TableRow key={timesheet.id}>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {timesheet.startTime.toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>{timesheet.clientName}</TableCell>
                        <TableCell>{timesheet.propertyName}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {timesheet.hoursWorked}h
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(timesheet.status)}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedTimesheet(timesheet);
                              setDetailDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>
                View and manage your employment documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Document management functionality will be implemented here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Timesheet Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Timesheet Details</DialogTitle>
          </DialogHeader>
          {selectedTimesheet && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Client</Label>
                  <p className="text-sm text-muted-foreground">{selectedTimesheet.clientName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Property</Label>
                  <p className="text-sm text-muted-foreground">{selectedTimesheet.propertyName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Date</Label>
                  <p className="text-sm text-muted-foreground">{selectedTimesheet.startTime.toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Start Time</Label>
                  <p className="text-sm text-muted-foreground">{selectedTimesheet.startTime.toLocaleTimeString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">End Time</Label>
                  <p className="text-sm text-muted-foreground">{selectedTimesheet.endTime.toLocaleTimeString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Hours Worked</Label>
                  <p className="text-sm text-muted-foreground">{selectedTimesheet.hoursWorked}h</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Break Duration</Label>
                  <p className="text-sm text-muted-foreground">{selectedTimesheet.breakDuration}min</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedTimesheet.status)}</div>
                </div>
              </div>

              {selectedTimesheet.notes && (
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedTimesheet.notes}</p>
                </div>
              )}

              {selectedTimesheet.travelLog && selectedTimesheet.travelLog.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Travel Log</Label>
                  <div className="mt-2 space-y-2">
                    {selectedTimesheet.travelLog.map((entry, index) => (
                      <div key={index} className="p-3 bg-muted rounded-lg">
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="font-medium">From:</span> {entry.startLocation}
                          </div>
                          <div>
                            <span className="font-medium">To:</span> {entry.endLocation}
                          </div>
                          <div>
                            <span className="font-medium">Distance:</span> {entry.distance}km
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTimesheet.rejectionReason && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <Label className="text-sm font-medium text-destructive">Rejection Reason</Label>
                  <p className="text-sm text-destructive mt-1">{selectedTimesheet.rejectionReason}</p>
                </div>
              )}

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 