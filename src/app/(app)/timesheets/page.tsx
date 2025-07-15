'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Calendar,
  User,
  FileText,
  AlertTriangle,
  Check,
  X
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { mockStaff, mockClients, mockProperties } from '@/lib/data';

interface Timesheet {
  id: string;
  staffId: string;
  staffName: string;
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

export default function TimesheetsPage() {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [filteredTimesheets, setFilteredTimesheets] = useState<Timesheet[]>([]);
  const [selectedTimesheet, setSelectedTimesheet] = useState<Timesheet | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    staff: 'all',
    dateRange: 'all',
    search: ''
  });

  // Mock timesheet data
  useEffect(() => {
    const mockTimesheets: Timesheet[] = [
      {
        id: 'ts-1',
        staffId: 'staff-1',
        staffName: 'Sarah Johnson',
        shiftId: 'shift-1',
        propertyId: 'prop-1',
        propertyName: 'Wellington Residential',
        clientId: 'client-1',
        clientName: 'Peter Jones',
        startTime: new Date('2024-01-15T08:00:00'),
        endTime: new Date('2024-01-15T16:00:00'),
        hoursWorked: 7.5,
        breakDuration: 30,
        status: 'Submitted',
        notes: 'Client was in good spirits today. Completed all scheduled activities.',
        travelLog: [
          {
            startLocation: 'Home',
            endLocation: 'Wellington Residential',
            distance: 15
          }
        ],
        submittedAt: new Date('2024-01-15T16:30:00')
      },
      {
        id: 'ts-2',
        staffId: 'staff-2',
        staffName: 'Michael Chen',
        shiftId: 'shift-2',
        propertyId: 'prop-2',
        propertyName: 'Auckland Community',
        clientId: 'client-2',
        clientName: 'Mary Williams',
        startTime: new Date('2024-01-15T09:00:00'),
        endTime: new Date('2024-01-15T17:00:00'),
        hoursWorked: 7,
        breakDuration: 45,
        status: 'Approved',
        notes: 'Assisted with daily activities and medication administration.',
        submittedAt: new Date('2024-01-15T17:15:00'),
        reviewedAt: new Date('2024-01-16T09:00:00'),
        reviewedBy: 'Manager'
      },
      {
        id: 'ts-3',
        staffId: 'staff-1',
        staffName: 'Sarah Johnson',
        shiftId: 'shift-3',
        propertyId: 'prop-1',
        propertyName: 'Wellington Residential',
        clientId: 'client-1',
        clientName: 'Peter Jones',
        startTime: new Date('2024-01-14T08:00:00'),
        endTime: new Date('2024-01-14T16:00:00'),
        hoursWorked: 7,
        breakDuration: 30,
        status: 'Rejected',
        notes: 'Regular shift duties completed.',
        submittedAt: new Date('2024-01-14T16:30:00'),
        reviewedAt: new Date('2024-01-15T10:00:00'),
        reviewedBy: 'Manager',
        rejectionReason: 'Incorrect break duration recorded. Please review and resubmit.'
      }
    ];
    setTimesheets(mockTimesheets);
    setFilteredTimesheets(mockTimesheets);
  }, []);

  // Filter timesheets
  useEffect(() => {
    let filtered = timesheets;

    if (filters.status !== 'all') {
      filtered = filtered.filter(ts => ts.status === filters.status);
    }

    if (filters.staff !== 'all') {
      filtered = filtered.filter(ts => ts.staffId === filters.staff);
    }

    if (filters.search) {
      filtered = filtered.filter(ts => 
        ts.staffName.toLowerCase().includes(filters.search.toLowerCase()) ||
        ts.clientName.toLowerCase().includes(filters.search.toLowerCase()) ||
        ts.propertyName.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredTimesheets(filtered);
  }, [timesheets, filters]);

  const handleApprove = (timesheetId: string) => {
    setTimesheets(prev => prev.map(ts => 
      ts.id === timesheetId 
        ? { ...ts, status: 'Approved' as const, reviewedAt: new Date(), reviewedBy: 'Current User' }
        : ts
    ));
  };

  const handleReject = (timesheetId: string) => {
    if (rejectionReason.trim()) {
      setTimesheets(prev => prev.map(ts => 
        ts.id === timesheetId 
          ? { 
              ...ts, 
              status: 'Rejected' as const, 
              reviewedAt: new Date(), 
              reviewedBy: 'Current User',
              rejectionReason: rejectionReason
            }
          : ts
      ));
      setRejectionDialogOpen(false);
      setRejectionReason('');
    }
  };

  const handleExport = () => {
    // Mock export functionality
    const csvContent = [
      ['Staff', 'Client', 'Property', 'Date', 'Hours', 'Status', 'Notes'],
      ...filteredTimesheets.map(ts => [
        ts.staffName,
        ts.clientName,
        ts.propertyName,
        ts.startTime.toLocaleDateString(),
        ts.hoursWorked.toString(),
        ts.status,
        ts.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timesheets-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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

  const getStatusCounts = () => {
    const counts = {
      submitted: timesheets.filter(ts => ts.status === 'Submitted').length,
      approved: timesheets.filter(ts => ts.status === 'Approved').length,
      rejected: timesheets.filter(ts => ts.status === 'Rejected').length,
      total: timesheets.length
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-muted">
      <div className="w-full h-full p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-left">Timesheets</h1>
          <p className="text-muted-foreground text-left">Review and approve staff timesheets</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{statusCounts.total}</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-warning">{statusCounts.submitted}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold text-success">{statusCounts.approved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold text-destructive">{statusCounts.rejected}</p>
                </div>
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
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
                <Select value={filters.staff} onValueChange={(value) => setFilters({ ...filters, staff: value })}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Staff" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Staff</SelectItem>
                    {mockStaff.map(staff => (
                      <SelectItem key={staff.id} value={staff.id}>{staff.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleExport} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Timesheets Table */}
        <Card>
          <CardHeader>
            <CardTitle>Timesheets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTimesheets.map((timesheet) => (
                    <TableRow key={timesheet.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {timesheet.staffName}
                        </div>
                      </TableCell>
                      <TableCell>{timesheet.clientName}</TableCell>
                      <TableCell>{timesheet.propertyName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {timesheet.startTime.toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {timesheet.hoursWorked}h
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(timesheet.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
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
                          {timesheet.status === 'Submitted' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-success hover:text-success"
                                onClick={() => handleApprove(timesheet.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-destructive hover:text-destructive"
                                onClick={() => {
                                  setSelectedTimesheet(timesheet);
                                  setRejectionDialogOpen(true);
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

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
                    <Label className="text-sm font-medium">Staff</Label>
                    <p className="text-sm text-muted-foreground">{selectedTimesheet.staffName}</p>
                  </div>
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

                <div className="flex justify-end gap-2">
                  {selectedTimesheet.status === 'Submitted' && (
                    <>
                      <Button
                        variant="outline"
                        className="text-success hover:text-success"
                        onClick={() => {
                          handleApprove(selectedTimesheet.id);
                          setDetailDialogOpen(false);
                        }}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          setDetailDialogOpen(false);
                          setRejectionDialogOpen(true);
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                  <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Rejection Dialog */}
        <Dialog open={rejectionDialogOpen} onOpenChange={setRejectionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Timesheet</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="rejection-reason">Reason for rejection</Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Please provide a reason for rejecting this timesheet..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setRejectionDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => selectedTimesheet && handleReject(selectedTimesheet.id)}
                  disabled={!rejectionReason.trim()}
                >
                  Reject Timesheet
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 