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
    
    clockIn(shiftId);
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
    
    // Check if shift is today and within 15 minutes of start time (more realistic)
    const today = new Date();
    const shiftDate = new Date(shift.date);
    const isToday = today.toDateString() === shiftDate.toDateString();
    
    if (!isToday) return false;
    
    const timeDiff = shiftStart.getTime() - now.getTime();
    const fifteenMinutes = 15 * 60 * 1000; // 15 minutes in milliseconds
    
    return timeDiff >= -fifteenMinutes && timeDiff <= fifteenMinutes; // Allow 15 minutes before and after
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
        return <Badge className="bg-success/10 text-success border-success/20">Clocked In</Badge>;
      case 'clocked-out':
        return <Badge className="bg-muted text-muted-foreground">Clocked Out</Badge>;
      case 'assigned':
        return <Badge className="bg-info/10 text-info border-info/20">Current</Badge>;
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
      <div className="space-y-8">
        <div className="section-padding">
          <h1 className="heading-1">Dashboard</h1>
          <p className="text-muted">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="section-padding">
        <h1 className="heading-1">Dashboard</h1>
        <p className="text-muted">
          Welcome to your CareNest dashboard
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="content-padding">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - My Shifts */}
          <div className="xl:col-span-2 space-y-6">
            {/* My Shifts Section */}
            <Card className="shadow-soft border-0 bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3 text-xl font-semibold">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <span>My Shifts</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {shifts.map((shift) => (
                  <div key={shift.id} className="border border-border rounded-xl p-6 hover:shadow-medium transition-all duration-200 bg-background">
                    {/* Mobile Layout */}
                    <div className="md:hidden space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-xl font-semibold text-foreground">{shift.startTime}</span>
                            <span className="text-muted-foreground">-</span>
                            <span className="text-xl font-semibold text-foreground">{shift.endTime}</span>
                          </div>
                          <span className={`text-sm font-medium ${isToday(shift.date) ? 'text-primary' : isTomorrow(shift.date) ? 'text-success' : 'text-muted-foreground'}`}>
                            {formatDate(shift.date)}
                          </span>
                        </div>
                        <div className="ml-3">
                          {getStatusBadge(shift)}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="font-semibold text-foreground">{shift.area} ({shift.client})</p>
                        <p className="text-sm text-muted-foreground">{shift.notes}</p>
                      </div>
                      
                      <div className="flex justify-between items-center pt-4 border-t border-border">
                        <span className="text-sm text-muted-foreground">4 hours</span>
                        <div className="flex space-x-2">
                          {/* Show Clock In when shift is about to start or in progress */}
                          {(shift.status === 'assigned' || shift.status === 'scheduled') && (isShiftAboutToStart(shift) || isShiftInProgress(shift)) && (
                            <Button
                              size="sm"
                              onClick={() => handleClockIn(shift.id)}
                              className="bg-success hover:bg-success/90 text-success-foreground"
                            >
                              <Play className="h-3 w-3 mr-1" />
                              Clock In
                            </Button>
                          )}
                          {/* Show Clock Out for shifts that are clocked in */}
                          {shift.status === 'clocked-in' && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setSelectedShift(shift);
                                handleClockOut(shift.id);
                              }}
                            >
                              <Square className="h-3 w-3 mr-1" />
                              Clock Out
                            </Button>
                          )}
                          {/* Show status for shifts that are not ready for clock in */}
                          {(shift.status === 'assigned' || shift.status === 'scheduled') && !isShiftAboutToStart(shift) && !isShiftInProgress(shift) && (
                            <span className="text-sm text-muted-foreground">Not ready</span>
                          )}
                          {/* No action buttons for completed or cancelled shifts */}
                          {(shift.status === 'completed' || shift.status === 'cancelled') && (
                            <span className="text-sm text-muted-foreground">No actions</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Desktop Layout */}
                    <div className="hidden md:block">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left py-4 px-6 font-semibold text-foreground">Time</th>
                              <th className="text-left py-4 px-6 font-semibold text-foreground">Client & Area</th>
                              <th className="text-left py-4 px-6 font-semibold text-foreground">Duration</th>
                              <th className="text-left py-4 px-6 font-semibold text-foreground">Notes</th>
                              <th className="text-left py-4 px-6 font-semibold text-foreground">Status</th>
                              <th className="text-left py-4 px-6 font-semibold text-foreground">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-border hover:bg-muted/50 transition-colors">
                              <td className="py-4 px-6">
                                <div className="flex flex-col">
                                  <div className="flex items-center space-x-1">
                                    <span className="text-lg font-semibold text-foreground">{shift.startTime.split(':')[0]}</span>
                                    <span className="text-sm text-muted-foreground">: {shift.startTime.split(':')[1]}</span>
                                    <span className="text-muted-foreground mx-1">-</span>
                                    <span className="text-lg font-semibold text-foreground">{shift.endTime.split(':')[0]}</span>
                                    <span className="text-sm text-muted-foreground">: {shift.endTime.split(':')[1]}</span>
                                  </div>
                                  <span className={`text-xs font-medium ${isToday(shift.date) ? 'text-primary' : isTomorrow(shift.date) ? 'text-success' : 'text-muted-foreground'}`}>
                                    {formatDate(shift.date)}
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex flex-col">
                                  <span className="font-semibold text-foreground">{shift.client}</span>
                                  <span className="text-sm text-muted-foreground">{shift.area}</span>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <span className="text-sm text-muted-foreground">4 hours</span>
                              </td>
                              <td className="py-4 px-6">
                                <span className="text-sm text-muted-foreground max-w-xs truncate" title={shift.notes}>
                                  {shift.notes}
                                </span>
                              </td>
                              <td className="py-4 px-6">
                                {getStatusBadge(shift)}
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex space-x-2">
                                  {/* Show Clock In when shift is about to start or in progress */}
                                  {(shift.status === 'assigned' || shift.status === 'scheduled') && (isShiftAboutToStart(shift) || isShiftInProgress(shift)) && (
                                    <Button
                                      size="sm"
                                      onClick={() => handleClockIn(shift.id)}
                                      className="bg-success hover:bg-success/90 text-success-foreground"
                                    >
                                      <Play className="h-3 w-3 mr-1" />
                                      Clock In
                                    </Button>
                                  )}
                                  {/* Show Clock Out for shifts that are clocked in */}
                                  {shift.status === 'clocked-in' && (
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => {
                                        setSelectedShift(shift);
                                        handleClockOut(shift.id);
                                      }}
                                    >
                                      <Square className="h-3 w-3 mr-1" />
                                      Clock Out
                                    </Button>
                                  )}
                                  {/* Show status for shifts that are not ready for clock in */}
                                  {(shift.status === 'assigned' || shift.status === 'scheduled') && !isShiftAboutToStart(shift) && !isShiftInProgress(shift) && (
                                    <span className="text-sm text-muted-foreground">Not ready</span>
                                  )}
                                  {/* No action buttons for completed or cancelled shifts */}
                                  {(shift.status === 'completed' || shift.status === 'cancelled') && (
                                    <span className="text-sm text-muted-foreground">No actions</span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Open Shifts Section */}
            <Card className="shadow-soft border-0 bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3 text-xl font-semibold">
                  <div className="p-2 bg-info/10 rounded-lg">
                    <Users className="h-5 w-5 text-info" />
                  </div>
                  <span>Open Shifts</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {openShifts.filter(shift => shift.status === 'open').map((openShift) => (
                  <div key={openShift.id} className="border border-border rounded-xl p-6 hover:shadow-medium transition-all duration-200 bg-background">
                    {/* Mobile Layout */}
                    <div className="md:hidden space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-xl font-semibold text-foreground">{openShift.startTime}</span>
                            <span className="text-muted-foreground">-</span>
                            <span className="text-xl font-semibold text-foreground">{openShift.endTime}</span>
                          </div>
                          <span className={`text-sm font-medium ${isToday(openShift.date) ? 'text-primary' : isTomorrow(openShift.date) ? 'text-success' : 'text-muted-foreground'}`}>
                            {formatDate(openShift.date)}
                          </span>
                        </div>
                        <div className="ml-3">
                          {getUrgencyBadge(openShift.urgency)}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="font-semibold text-foreground">{openShift.area} ({openShift.client})</p>
                        <p className="text-sm text-muted-foreground">{openShift.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-foreground">{openShift.requiredRole}</span>
                            <span className="text-sm font-medium text-success">{openShift.payRate}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-4 border-t border-border">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRequestOpenShift(openShift)}
                          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          Request
                        </Button>
                      </div>
                    </div>
                    
                    {/* Desktop Layout */}
                    <div className="hidden md:block">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left py-4 px-6 font-semibold text-foreground">Time</th>
                              <th className="text-left py-4 px-6 font-semibold text-foreground">Client & Area</th>
                              <th className="text-left py-4 px-6 font-semibold text-foreground">Required Role</th>
                              <th className="text-left py-4 px-6 font-semibold text-foreground">Pay Rate</th>
                              <th className="text-left py-4 px-6 font-semibold text-foreground">Priority</th>
                              <th className="text-left py-4 px-6 font-semibold text-foreground">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-border hover:bg-muted/50 transition-colors">
                              <td className="py-4 px-6">
                                <div className="flex flex-col">
                                  <div className="flex items-center space-x-1">
                                    <span className="text-lg font-semibold text-foreground">{openShift.startTime.split(':')[0]}</span>
                                    <span className="text-sm text-muted-foreground">: {openShift.startTime.split(':')[1]}</span>
                                    <span className="text-muted-foreground mx-1">-</span>
                                    <span className="text-lg font-semibold text-foreground">{openShift.endTime.split(':')[0]}</span>
                                    <span className="text-sm text-muted-foreground">: {openShift.endTime.split(':')[1]}</span>
                                  </div>
                                  <span className={`text-xs font-medium ${isToday(openShift.date) ? 'text-primary' : isTomorrow(openShift.date) ? 'text-success' : 'text-muted-foreground'}`}>
                                    {formatDate(openShift.date)}
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex flex-col">
                                  <span className="font-semibold text-foreground">{openShift.client}</span>
                                  <span className="text-sm text-muted-foreground">{openShift.area}</span>
                                  <span className="text-xs text-muted-foreground mt-1">{openShift.description}</span>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <span className="text-sm font-medium text-foreground">{openShift.requiredRole}</span>
                              </td>
                              <td className="py-4 px-6">
                                <span className="text-sm font-medium text-success">{openShift.payRate}</span>
                              </td>
                              <td className="py-4 px-6">
                                {getUrgencyBadge(openShift.urgency)}
                              </td>
                              <td className="py-4 px-6">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRequestOpenShift(openShift)}
                                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                                >
                                  <FileText className="h-3 w-3 mr-1" />
                                  Request
                                </Button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Compliance */}
          <div className="space-y-6">
            <Card className="shadow-soft border-0 bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3 text-xl font-semibold">
                  <div className="p-2 bg-warning/10 rounded-lg">
                    <UserCheck className="h-5 w-5 text-warning" />
                  </div>
                  <span>Compliance & Training</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {complianceItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border border-border rounded-xl hover:shadow-soft transition-all duration-200 bg-background">
                      <div className="flex items-center space-x-3 flex-1">
                        {getComplianceStatusIcon(item.status)}
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm text-foreground truncate">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.category}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1 ml-3">
                        <Badge 
                          variant={item.status === 'completed' ? 'default' : item.status === 'overdue' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {item.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground">Due: {item.dueDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

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
    </div>
  );
}
