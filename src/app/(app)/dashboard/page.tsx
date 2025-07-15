'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Play, Square, AlertTriangle, CheckCircle, XCircle, UserCheck, FileText, Users } from 'lucide-react';
import { useRoster } from '@/lib/hooks/useRoster';
import { useDashboardConfig } from '@/lib/hooks/useDashboardConfig';
import { UserLevelSelector } from '@/components/UserLevelSelector';

interface ComplianceItem {
  id: string;
  title: string;
  status: 'completed' | 'pending' | 'overdue';
  dueDate: string;
  category: string;
}

export default function DashboardPage() {
  const { 
    shifts, 
    openShifts, 
    loading, 
    clockIn, 
    clockOut, 
    requestOpenShift,
    getTodayShifts,
    getTomorrowShifts,
    getCurrentShift,
    currentUserId 
  } = useRoster();

  const { isSectionVisible, isFieldVisible } = useDashboardConfig();

  const [complianceItems] = useState<ComplianceItem[]>([
    {
      id: '1',
      title: 'First Aid Certification',
      status: 'completed',
      dueDate: '2024-01-15',
      category: 'Training'
    },
    {
      id: '2',
      title: 'Manual Handling Training',
      status: 'pending',
      dueDate: '2024-02-20',
      category: 'Training'
    },
    {
      id: '3',
      title: 'Police Check Renewal',
      status: 'overdue',
      dueDate: '2024-01-10',
      category: 'Background Check'
    },
    {
      id: '4',
      title: 'COVID-19 Vaccination',
      status: 'completed',
      dueDate: '2023-12-01',
      category: 'Health'
    }
  ]);

  const [openShiftRequestDialogOpen, setOpenShiftRequestDialogOpen] = useState(false);
  const [clockOutDialogOpen, setClockOutDialogOpen] = useState(false);
  const [timesheetDialogOpen, setTimesheetDialogOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<any>(null);
  const [selectedOpenShift, setSelectedOpenShift] = useState<any>(null);
  const [openShiftRequestReason, setOpenShiftRequestReason] = useState('');
  const [clockOutReason, setClockOutReason] = useState('');
  const [timesheetData, setTimesheetData] = useState({
    clockInTime: '',
    clockOutTime: '',
    clockInLocation: '',
    clockOutLocation: '',
    breaks: [{ startTime: '', endTime: '', duration: '' }],
    notes: '',
    totalHours: { hours: 0, minutes: 0 }
  });

  const handleClockIn = (shiftId: string) => {
    const location = getCurrentLocation();
    const now = new Date();
    const clockInTime = now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    // Store clock in data
    setTimesheetData(prev => ({
      ...prev,
      clockInTime,
      clockInLocation: location.address
    }));
    
    // Call the clock in function from the hook
    clockIn(shiftId);
    
    // Show success feedback (you could add a toast notification here)
    console.log(`Successfully clocked in at ${clockInTime} from ${location.address}`);
  };

  const handleClockOut = (shiftId: string) => {
    const location = getCurrentLocation();
    const now = new Date();
    const clockOutTime = now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    // Update timesheet data
    setTimesheetData(prev => ({
      ...prev,
      clockOutTime,
      clockOutLocation: location.address
    }));
    
    if (selectedShift && isShiftEarly(selectedShift)) {
      setClockOutDialogOpen(true);
    } else {
      // Calculate total hours
      const totalHours = calculateShiftHours(
        timesheetData.clockInTime, 
        clockOutTime, 
        timesheetData.breaks
      );
      
      setTimesheetData(prev => ({
        ...prev,
        totalHours
      }));
      
      setTimesheetDialogOpen(true);
    }
    // Show success feedback (you could add a toast notification here)
    console.log(`Successfully clocked out at ${clockOutTime} from ${location.address}`);
  };

  const confirmClockOut = () => {
    if (selectedShift) {
      // Calculate total hours
      const totalHours = calculateShiftHours(
        timesheetData.clockInTime, 
        timesheetData.clockOutTime, 
        timesheetData.breaks
      );
      
      setTimesheetData(prev => ({
        ...prev,
        totalHours
      }));
      
      setClockOutDialogOpen(false);
      setClockOutReason('');
      setTimesheetDialogOpen(true);
    }
  };

  const submitTimesheet = () => {
    // Here you would submit the timesheet to your backend
    console.log('Timesheet submitted:', {
      shift: selectedShift,
      timesheetData,
      earlyClockOutReason: clockOutReason
    });
    
    clockOut(selectedShift.id);
    setTimesheetDialogOpen(false);
    setClockOutReason('');
    setSelectedShift(null);
    setTimesheetData({
      clockInTime: '',
      clockOutTime: '',
      clockInLocation: '',
      clockOutLocation: '',
      breaks: [{ startTime: '', endTime: '', duration: '' }],
      notes: '',
      totalHours: { hours: 0, minutes: 0 }
    });
  };

  const addBreak = () => {
    setTimesheetData(prev => ({
      ...prev,
      breaks: [...prev.breaks, { startTime: '', endTime: '', duration: '' }]
    }));
  };

  const updateBreak = (index: number, field: string, value: string) => {
    setTimesheetData(prev => ({
      ...prev,
      breaks: prev.breaks.map((break_, i) => 
        i === index ? { ...break_, [field]: value } : break_
      )
    }));
  };

  const isShiftAboutToStart = (shift: any) => {
    const now = new Date();
    const shiftStart = new Date();
    const [hours, minutes] = shift.startTime.split(':');
    shiftStart.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    // Check if shift is today and within 1 minute of start time (your business logic)
    const today = new Date();
    const shiftDate = new Date(shift.date);
    const isToday = today.toDateString() === shiftDate.toDateString();
    
    if (!isToday) return false;
    
    const timeDiff = shiftStart.getTime() - now.getTime();
    const oneMinute = 1 * 60 * 1000; // 1 minute in milliseconds
    
    return timeDiff >= -oneMinute && timeDiff <= oneMinute; // Allow 1 minute before and after
  };

  const isShiftInProgress = (shift: any) => {
    const now = new Date();
    const shiftStart = new Date();
    const shiftEnd = new Date();
    const [startHours, startMinutes] = shift.startTime.split(':');
    const [endHours, endMinutes] = shift.endTime.split(':');
    
    const today = new Date();
    const shiftDate = new Date(shift.date);
    const isToday = today.toDateString() === shiftDate.toDateString();
    
    if (!isToday) return false;
    
    shiftStart.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);
    shiftEnd.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);
    
    return now >= shiftStart && now <= shiftEnd;
  };

  const isShiftEarly = (shift: any) => {
    const now = new Date();
    const shiftEnd = new Date();
    const [endHours, endMinutes] = shift.endTime.split(':');
    
    const today = new Date();
    const shiftDate = new Date(shift.date);
    const isToday = today.toDateString() === shiftDate.toDateString();
    
    if (!isToday) return false;
    
    shiftEnd.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);
    return now < shiftEnd;
  };

  const getCurrentLocation = () => {
    // Mock location - in real app this would use browser geolocation API
    return {
      latitude: -41.2866,
      longitude: 174.7756,
      address: "Wellington, New Zealand"
    };
  };

  // Check if client/property details should be visible (only when clocked in)
  const shouldShowClientDetails = (shift: any) => {
    return shift.status === 'clocked-in';
  };

  const calculateShiftHours = (startTime: string, endTime: string, breaks: any[]) => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    let totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    
    // Subtract break time
    const totalBreakMinutes = breaks.reduce((total, break_) => {
      const [breakStartHour, breakStartMin] = break_.startTime.split(':').map(Number);
      const [breakEndHour, breakEndMin] = break_.endTime.split(':').map(Number);
      return total + ((breakEndHour * 60 + breakEndMin) - (breakStartHour * 60 + breakStartMin));
    }, 0);
    
    totalMinutes -= totalBreakMinutes;
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return { hours, minutes, totalMinutes };
  };

  const getStatusBadge = (shift: any) => {
    switch (shift.status) {
      case 'clocked-in':
        return <Badge className="bg-success/10 text-success border-success/20">In Progress</Badge>;
      case 'clocked-out':
        return <Badge className="bg-muted text-muted-foreground">Completed</Badge>;
      case 'assigned':
        return <Badge className="bg-info/10 text-info border-info/20">Ready</Badge>;
      case 'scheduled':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Upcoming</Badge>;
      default:
        return <Badge className="bg-muted text-muted-foreground">Completed</Badge>;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Medium Priority</Badge>;
      case 'low':
        return <Badge className="bg-success/10 text-success border-success/20">Low Priority</Badge>;
      default:
        return <Badge className="bg-muted text-muted-foreground">Standard</Badge>;
    }
  };

  const getComplianceStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'overdue':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  const handleRequestOpenShift = (openShift: any) => {
    setSelectedOpenShift(openShift);
    setOpenShiftRequestDialogOpen(true);
  };

  const submitOpenShiftRequest = () => {
    if (selectedOpenShift && openShiftRequestReason.trim()) {
      requestOpenShift(selectedOpenShift.id, openShiftRequestReason);
      setOpenShiftRequestDialogOpen(false);
      setOpenShiftRequestReason('');
      setSelectedOpenShift(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' });
    }
  };

  const isToday = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isTomorrow = (dateString: string) => {
    const date = new Date(dateString);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
  };

  if (loading) {
  return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="w-full max-w-3xl mx-auto p-6">
          <div className="animate-pulse bg-white rounded-2xl shadow-md p-8">
            <h1 className="text-2xl font-bold text-left mb-2">Dashboard</h1>
            <p className="text-muted-foreground text-left">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

    return (
    <div className="min-h-screen bg-muted">
      <div className="w-full h-full p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-left">Dashboard</h1>
          <p className="text-muted-foreground text-left">Welcome to your CareNest dashboard</p>
          <div className="text-xs text-muted-foreground">
            Current Time: {new Date().toLocaleTimeString()} | 
            Today: {new Date().toISOString().split('T')[0]}
          </div>
        </div>

        {/* My Shifts Section */}
        {isSectionVisible('my-shifts') && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-left">
                <Calendar className="h-5 w-5 text-primary" /> My Shifts
              </h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">List</Button>
                <Button size="sm" variant="ghost">Week</Button>
                <Button size="sm" variant="ghost">Day</Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="text-xs text-muted-foreground border-b">
                    <th className="py-2 px-2">Shift</th>
                    {isFieldVisible('my-shifts-client') && <th className="py-2 px-2 hidden md:table-cell">Client</th>}
                    <th className="py-2 px-2">Time</th>
                    {isFieldVisible('my-shifts-status') && <th className="py-2 px-2 hidden sm:table-cell">Status</th>}
                    {isFieldVisible('my-shifts-actions') && <th className="py-2 px-2">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {shifts.filter(shift => shift.status !== 'completed' && shift.status !== 'cancelled').map((shift, idx) => (
                    <tr key={shift.id} className={
                      `align-middle ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b last:border-0`
                    }>
                      <td className="py-2 px-2">
                        <div className="font-medium text-gray-900">{shift.area}</div>
                        <div className="text-xs text-muted-foreground">{shift.notes}</div>
                        {isFieldVisible('my-shifts-client') && shouldShowClientDetails(shift) && (
                          <div className="text-xs text-muted-foreground md:hidden">{shift.client}</div>
                        )}
                        {isFieldVisible('my-shifts-client') && !shouldShowClientDetails(shift) && (
                          <div className="text-xs text-muted-foreground md:hidden">Client details hidden until clocked in</div>
                        )}
                        <div className="text-xs text-blue-600">
                          Status: {shift.status} | 
                          Time: {shift.startTime}-{shift.endTime} | 
                          Date: {shift.date}
                        </div>
                      </td>
                      {isFieldVisible('my-shifts-client') && (
                        <td className="py-2 px-2 hidden md:table-cell">
                          {shouldShowClientDetails(shift) ? (
                            shift.client
                          ) : (
                            <span className="text-muted-foreground">Hidden until clocked in</span>
                          )}
                        </td>
                      )}
                      <td className="py-2 px-2">
                        <span className="font-semibold">{shift.startTime}</span> - <span className="font-semibold">{shift.endTime}</span>
                        <div className="text-xs text-muted-foreground">{formatDate(shift.date)}</div>
                      </td>
                      {isFieldVisible('my-shifts-status') && <td className="py-2 px-2 hidden sm:table-cell">{getStatusBadge(shift)}</td>}
                      {isFieldVisible('my-shifts-actions') && (
                        <td className="py-2 px-2">
                          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                            
                            {(shift.status === 'assigned' || shift.status === 'scheduled') && isShiftAboutToStart(shift) && (
                              <Button 
                                size="sm" 
                                className="bg-primary text-white text-xs"
                                onClick={() => handleClockIn(shift.id)}
                              >
                                <Play className="h-3 w-3 mr-1" /> Clock In
                              </Button>
                            )}
                            {(shift.status === 'assigned' || shift.status === 'scheduled') && !isShiftAboutToStart(shift) && (
                              <span className="text-xs text-muted-foreground">
                                Clock in available 1 min before shift
                              </span>
                            )}
                            {shift.status === 'clocked-in' && (
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => { setSelectedShift(shift); handleClockOut(shift.id); }} 
                                className="text-xs"
                              >
                                <Square className="h-3 w-3 mr-1" /> Clock Out
                              </Button>
                            )}
                            {shift.status === 'clocked-out' && (
                              <span className="text-xs text-muted-foreground">Completed</span>
                            )}
                            {(shift.status === 'completed' || shift.status === 'cancelled') && (
                              <span className="text-xs text-muted-foreground">No actions</span>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Open Shifts Section */}
        {isSectionVisible('open-shifts') && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-left">
                <Users className="h-5 w-5 text-info" /> Open Shifts
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="text-xs text-muted-foreground border-b">
                    <th className="py-2 px-2">Shift</th>
                    {isFieldVisible('open-shifts-client') && <th className="py-2 px-2 hidden lg:table-cell">Client</th>}
                    <th className="py-2 px-2">Time</th>
                    {isFieldVisible('open-shifts-role') && <th className="py-2 px-2 hidden md:table-cell">Role</th>}
                    {isFieldVisible('open-shifts-pay') && <th className="py-2 px-2 hidden xl:table-cell">Pay</th>}
                    {isFieldVisible('open-shifts-priority') && <th className="py-2 px-2 hidden sm:table-cell">Priority</th>}
                    {isFieldVisible('open-shifts-actions') && <th className="py-2 px-2">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {openShifts.filter(shift => shift.status === 'open').map((shift, idx) => (
                    <tr key={shift.id} className={
                      `align-middle ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b last:border-0`
                    }>
                      <td className="py-2 px-2">
                        <div className="font-medium text-gray-900">{shift.area}</div>
                        <div className="text-xs text-muted-foreground">{shift.description}</div>
                        {isFieldVisible('open-shifts-client') && <div className="text-xs text-muted-foreground lg:hidden">{shift.client}</div>}
                      </td>
                      {isFieldVisible('open-shifts-client') && <td className="py-2 px-2 hidden lg:table-cell">{shift.client}</td>}
                      <td className="py-2 px-2">
                        <span className="font-semibold">{shift.startTime}</span> - <span className="font-semibold">{shift.endTime}</span>
                        <div className="text-xs text-muted-foreground">{formatDate(shift.date)}</div>
                      </td>
                      {isFieldVisible('open-shifts-role') && <td className="py-2 px-2 hidden md:table-cell">{shift.requiredRole}</td>}
                      {isFieldVisible('open-shifts-pay') && <td className="py-2 px-2 hidden xl:table-cell text-success">{shift.payRate}</td>}
                      {isFieldVisible('open-shifts-priority') && <td className="py-2 px-2 hidden sm:table-cell">{getUrgencyBadge(shift.urgency)}</td>}
                      {isFieldVisible('open-shifts-actions') && (
                        <td className="py-2 px-2">
                          <Button size="sm" variant="outline" onClick={() => handleRequestOpenShift(shift)} className="text-xs">
                            <FileText className="h-3 w-3 mr-1" /> Request
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Compliance Section */}
        {isSectionVisible('compliance') && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center mb-4">
              <UserCheck className="h-5 w-5 text-warning mr-2" />
              <h2 className="text-xl font-semibold text-left">Compliance & Training</h2>
            </div>
            <div className="divide-y">
              {complianceItems.map((item, idx) => (
                <div key={item.id} className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3 min-w-0">
                    {getComplianceStatusIcon(item.status)}
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end ml-3">
                    <Badge variant={item.status === 'completed' ? 'default' : item.status === 'overdue' ? 'destructive' : 'secondary'} className="text-xs">
                      {item.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">Due: {item.dueDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dialogs (unchanged) */}
        {/* Open Shift Request Dialog */}
        <Dialog open={openShiftRequestDialogOpen} onOpenChange={setOpenShiftRequestDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Request Open Shift</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="open-shift-details">Shift Details</Label>
                <div className="mt-2 p-4 bg-muted rounded-lg">
                  <p className="font-semibold text-foreground">{selectedOpenShift?.area} ({selectedOpenShift?.client})</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedOpenShift?.date} - {selectedOpenShift?.startTime} to {selectedOpenShift?.endTime}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Required: {selectedOpenShift?.requiredRole} • Pay: {selectedOpenShift?.payRate}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedOpenShift?.description}
                  </p>
                </div>
              </div>
              <div>
                <Label htmlFor="open-shift-reason">Why are you suitable for this shift?</Label>
                <Textarea
                  id="open-shift-reason"
                  placeholder="Please explain your qualifications, experience, and why you can handle this shift effectively..."
                  value={openShiftRequestReason}
                  onChange={(e) => setOpenShiftRequestReason(e.target.value)}
                  className="mt-2"
                  rows={4}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setOpenShiftRequestDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={submitOpenShiftRequest} disabled={!openShiftRequestReason.trim()}>
                  Submit Request
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Clock Out Early Dialog */}
        <Dialog open={clockOutDialogOpen} onOpenChange={setClockOutDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Early Clock Out</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <p className="text-sm font-medium text-warning">
                    You are clocking out before your scheduled shift end time.
                  </p>
                </div>
              </div>
              <div>
                <Label htmlFor="clockout-reason">Reason for early clock out</Label>
                <Textarea
                  id="clockout-reason"
                  placeholder="Please explain why you need to clock out early..."
                  value={clockOutReason}
                  onChange={(e) => setClockOutReason(e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setClockOutDialogOpen(false)}>
                  Cancel
              </Button>
                <Button 
                  variant="destructive" 
                  onClick={confirmClockOut}
                  disabled={!clockOutReason.trim()}
                >
                  Confirm Clock Out
              </Button>
            </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Timesheet Dialog */}
        <Dialog open={timesheetDialogOpen} onOpenChange={setTimesheetDialogOpen}>
          <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Submit Timesheet</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Shift Details */}
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2 text-foreground">Shift Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-foreground">Client:</span> {selectedShift?.client}
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Area:</span> {selectedShift?.area}
            </div>
                  <div>
                    <span className="font-medium text-foreground">Scheduled:</span> {selectedShift?.startTime} - {selectedShift?.endTime}
            </div>
                  <div>
                    <span className="font-medium text-foreground">Date:</span> {selectedShift?.date}
            </div>
            </div>
      </div>

              {/* Clock In/Out Times */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Clock In Time</Label>
                  <div className="mt-1 p-3 bg-muted rounded-lg border">
                    <div className="font-semibold text-foreground">{timesheetData.clockInTime}</div>
                    <div className="text-xs text-muted-foreground">{timesheetData.clockInLocation}</div>
                  </div>
                </div>
                <div>
                  <Label>Clock Out Time</Label>
                  <div className="mt-1 p-3 bg-muted rounded-lg border">
                    <div className="font-semibold text-foreground">{timesheetData.clockOutTime}</div>
                    <div className="text-xs text-muted-foreground">{timesheetData.clockOutLocation}</div>
                  </div>
                </div>
              </div>

              {/* Total Hours */}
              <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">Total Hours Worked:</span>
                  <span className="text-lg font-bold text-success">
                    {timesheetData.totalHours.hours}h {timesheetData.totalHours.minutes}m
                  </span>
                </div>
              </div>

              {/* Break Times */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label>Break Times</Label>
                  <Button size="sm" variant="outline" onClick={addBreak}>
                    Add Break
                  </Button>
                </div>
                <div className="space-y-3">
                  {timesheetData.breaks.map((break_, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Input
                        placeholder="Start Time"
                        value={break_.startTime}
                        onChange={(e) => updateBreak(index, 'startTime', e.target.value)}
                      />
                      <Input
                        placeholder="End Time"
                        value={break_.endTime}
                        onChange={(e) => updateBreak(index, 'endTime', e.target.value)}
                      />
                      <Input
                        placeholder="Duration"
                        value={break_.duration}
                        onChange={(e) => updateBreak(index, 'duration', e.target.value)}
                      />
            </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="timesheet-notes">Notes (Optional)</Label>
                <Textarea
                  id="timesheet-notes"
                  placeholder="Add any notes about your shift, reasons for finishing late, or other relevant information..."
                  value={timesheetData.notes}
                  onChange={(e) => setTimesheetData(prev => ({ ...prev, notes: e.target.value }))}
                  className="mt-2"
                  rows={3}
                />
              </div>

              {/* Early Clock Out Reason */}
              {clockOutReason && (
                <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <span className="font-semibold text-warning">Early Clock Out Reason:</span>
            </div>
                  <p className="text-sm text-warning">{clockOutReason}</p>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setTimesheetDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={submitTimesheet}>
                  Submit Timesheet
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* User Level Selector for Testing */}
        <UserLevelSelector />
          </div>
    </div>
  );
}
