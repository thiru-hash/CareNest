'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Clock, Calendar, MapPin, User, AlertTriangle, CheckCircle, LogOut, Clock3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSystemSettings } from '@/lib/hooks/useSystemSettings';
import { mockShifts, mockClients, mockProperties } from '@/lib/data';
import type { Staff, Shift } from '@/lib/types';

interface EarlyFinishReason {
  id: string;
  label: string;
  description: string;
}

const EARLY_FINISH_REASONS: EarlyFinishReason[] = [
  { id: 'client_requested', label: 'Client Requested Early Finish', description: 'Client asked to finish early' },
  { id: 'task_completed', label: 'All Tasks Completed', description: 'All assigned tasks have been completed' },
  { id: 'emergency', label: 'Emergency Situation', description: 'Emergency requiring immediate departure' },
  { id: 'health_issue', label: 'Health Issue', description: 'Personal health concern' },
  { id: 'family_emergency', label: 'Family Emergency', description: 'Family emergency requiring attention' },
  { id: 'transport_issue', label: 'Transport Issue', description: 'Transportation problem' },
  { id: 'other', label: 'Other', description: 'Other reason' },
];

interface ShiftManagementWidgetProps {
  currentUser: Staff;
}

export function ShiftManagementWidget({ currentUser }: ShiftManagementWidgetProps) {
  const { toast } = useToast();
  const { settings } = useSystemSettings();
  const [scheduledShifts, setScheduledShifts] = useState<Shift[]>([]);
  const [activeShifts, setActiveShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showEarlyFinishDialog, setShowEarlyFinishDialog] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [earlyFinishReason, setEarlyFinishReason] = useState('');
  const [earlyFinishDetails, setEarlyFinishDetails] = useState('');

  // Check if user is a support facilitator
  const isSupportFacilitator = currentUser.role === 'Support Worker' || 
                               currentUser.role === 'Support Manager' ||
                               currentUser.role === 'Behavioural Support';

  // Live countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isSupportFacilitator) {
      const now = new Date();
      
      // Filter scheduled shifts (not yet started)
      const userScheduledShifts = mockShifts.filter(shift => 
        shift.staffId === currentUser.id && 
        new Date(shift.start) > now &&
        (shift.status === 'Assigned' || shift.status === 'Open')
      );

      // Filter active shifts (currently in progress - either clocked-in or assigned and within shift time)
      const userActiveShifts = mockShifts.filter(shift => 
        shift.staffId === currentUser.id && 
        (shift.status === 'clocked-in' || 
         (shift.status === 'Assigned' && 
          new Date(shift.start) <= now && 
          new Date(shift.end) >= now))
      );

      // Sort by start time
      const sortedShifts = userScheduledShifts.sort((a, b) => 
        new Date(a.start).getTime() - new Date(b.start).getTime()
      );

      setScheduledShifts(sortedShifts.slice(0, 5)); // Show next 5 shifts
      setActiveShifts(userActiveShifts);
    }
  }, [currentUser, isSupportFacilitator]);

  const handleClockIn = async (shift: Shift) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update shift status
      const updatedShifts = mockShifts.map(s => 
        s.id === shift.id ? { ...s, status: 'clocked-in' as any } : s
      );

      // Remove from scheduled shifts and add to active shifts
      setScheduledShifts(prev => prev.filter(s => s.id !== shift.id));
      setActiveShifts(prev => [...prev, { ...shift, status: 'clocked-in' as any }]);

      toast({
        title: "Successfully Clocked In",
        description: `You have been clocked in for your shift at ${new Date(shift.start).toLocaleTimeString()}`,
      });

      // In real implementation, this would:
      // 1. Update the shift status in the database
      // 2. Grant access to client/property details for this shift
      // 3. Create audit log entry
      // 4. Send notification to management
      console.log(`[RBAC] User ${currentUser.name} clocked in for shift ${shift.id}`);
      console.log(`[RBAC] Access granted to client/property details for shift ${shift.id}`);

    } catch (error) {
      toast({
        variant: 'destructive',
        title: "Clock In Failed",
        description: "There was an error clocking you in. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async (shift: Shift, isEarlyFinish = false, reason?: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update shift status
      const updatedShifts = mockShifts.map(s => 
        s.id === shift.id ? { ...s, status: 'clocked-out' as any } : s
      );

      // Remove from active shifts
      setActiveShifts(prev => prev.filter(s => s.id !== shift.id));

      toast({
        title: isEarlyFinish ? "Early Finish Submitted" : "Successfully Clocked Out",
        description: isEarlyFinish 
          ? "Your early finish request has been submitted and attached to your timesheet."
          : `You have been clocked out for your shift at ${new Date(shift.end).toLocaleTimeString()}`,
      });

      // In real implementation, this would:
      // 1. Update the shift status in the database
      // 2. Revoke access to client/property details for this shift
      // 3. Create timesheet entry with early finish notes if applicable
      // 4. Create audit log entry
      console.log(`[RBAC] User ${currentUser.name} clocked out for shift ${shift.id}`);
      console.log(`[RBAC] Access revoked to client/property details for shift ${shift.id}`);
      if (isEarlyFinish && reason) {
        console.log(`[TIMESHEET] Early finish notes attached to timesheet for shift ${shift.id}`);
        console.log(`[TIMESHEET] Reason: ${reason}`);
        console.log(`[TIMESHEET] Clock-out time: ${new Date().toLocaleString()}`);
        console.log(`[TIMESHEET] Original shift end: ${new Date(shift.end).toLocaleString()}`);
      }

    } catch (error) {
      toast({
        variant: 'destructive',
        title: "Clock Out Failed",
        description: "There was an error clocking you out. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEarlyFinish = (shift: Shift) => {
    setSelectedShift(shift);
    setShowEarlyFinishDialog(true);
  };

  const submitEarlyFinish = () => {
    if (!selectedShift || !earlyFinishReason) {
      toast({
        variant: 'destructive',
        title: "Missing Information",
        description: "Please select a reason for early finish.",
      });
      return;
    }

    if (!earlyFinishDetails.trim()) {
      toast({
        variant: 'destructive',
        title: "Missing Details",
        description: "Please provide details for early finish.",
      });
      return;
    }

    const reason = EARLY_FINISH_REASONS.find(r => r.id === earlyFinishReason);
    const reasonText = reason ? reason.label : earlyFinishReason;
    
    handleClockOut(selectedShift, true, `${reasonText}: ${earlyFinishDetails}`);
    
    // Reset form
    setShowEarlyFinishDialog(false);
    setSelectedShift(null);
    setEarlyFinishReason('');
    setEarlyFinishDetails('');
  };

  // Helper functions
  const canClockIn = (shift: Shift) => {
    const shiftStart = new Date(shift.start);
    const timeDiff = shiftStart.getTime() - currentTime.getTime();
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));

    // Can clock in ONLY 5 minutes before shift starts (not for future shifts)
    return minutesDiff <= 5 && minutesDiff > -60;
  };

  const canClockOut = (shift: Shift) => {
    const shiftEnd = new Date(shift.end);
    const timeDiff = shiftEnd.getTime() - currentTime.getTime();
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));

    // Can clock out when shift is ending or has ended
    return minutesDiff <= 0;
  };

  const canEarlyFinish = (shift: Shift) => {
    const shiftEnd = new Date(shift.end);
    const timeDiff = shiftEnd.getTime() - currentTime.getTime();
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));

    // Can early finish within grace period (default 30 minutes before shift end)
    const gracePeriod = settings.rosterBasedAccessControl?.earlyFinishGracePeriod || 30;
    return minutesDiff > 0 && minutesDiff <= gracePeriod;
  };

  const isEarlyFinish = (shift: Shift) => {
    const shiftEnd = new Date(shift.end);
    const timeDiff = shiftEnd.getTime() - currentTime.getTime();
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));

    return minutesDiff > 0;
  };

  const getTimeUntilShift = (shift: Shift) => {
    const shiftStart = new Date(shift.start);
    const timeDiff = shiftStart.getTime() - currentTime.getTime();
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));

    if (minutesDiff < 0) return 'Started';
    if (minutesDiff < 60) return `${minutesDiff}m`;
    
    const hours = Math.floor(minutesDiff / 60);
    const minutes = minutesDiff % 60;
    return `${hours}h ${minutes}m`;
  };

  const getShiftStatus = (shift: Shift) => {
    const shiftStart = new Date(shift.start);
    const shiftEnd = new Date(shift.end);
    const timeDiff = shiftStart.getTime() - currentTime.getTime();
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));

    if (minutesDiff > 0) return 'Scheduled';
    if (currentTime >= shiftStart && currentTime <= shiftEnd) return 'In Progress';
    return 'Completed';
  };

  // Check for overlapping shifts to prevent double assignments
  const hasOverlappingShifts = (shift: Shift) => {
    const shiftStart = new Date(shift.start);
    const shiftEnd = new Date(shift.end);

    // Check if user has any active shifts that overlap with this shift
    const overlappingShifts = activeShifts.filter(activeShift => {
      const activeStart = new Date(activeShift.start);
      const activeEnd = new Date(activeShift.end);

      // Check for overlap: new shift starts before active shift ends AND new shift ends after active shift starts
      return shiftStart < activeEnd && shiftEnd > activeStart;
    });

    return overlappingShifts.length > 0;
  };

  // Helper functions to get client and property names
  const getClientName = (clientId?: string) => {
    if (!clientId) return 'Client TBD';
    const client = mockClients.find(c => c.id === clientId);
    return client?.name || `Client ${clientId}`;
  };

  const getPropertyName = (propertyId: string) => {
    const property = mockProperties.find(p => p.id === propertyId);
    return property?.name || `Property ${propertyId}`;
  };

  if (!isSupportFacilitator) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Active Shifts Section */}
      {activeShifts.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Active Shifts</h3>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-sm px-3 py-1">
                {activeShifts.length} active
              </Badge>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeShifts.map((shift) => {
              const shiftStart = new Date(shift.start);
              const shiftEnd = new Date(shift.end);
              const isClockedIn = shift.status === 'clocked-in';
              const canClockInNow = !isClockedIn && canClockIn(shift);
              const canClockOutNow = isClockedIn && canClockOut(shift);
              const canEarlyFinishNow = isClockedIn && canEarlyFinish(shift);
              const isEarlyFinishNow = isClockedIn && isEarlyFinish(shift);

              return (
                <div
                  key={shift.id}
                  className="group relative bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-2xl border-2 border-green-200 dark:border-green-700 p-8 hover:shadow-xl hover:border-green-300 dark:hover:border-green-600 transition-all duration-300"
                >
                  {/* Active indicator */}
                  <div className="absolute top-6 right-6">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
                  </div>

                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                          {isClockedIn ? (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          ) : (
                            <Clock className="h-6 w-6 text-orange-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                            {shift.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {getClientName(shift.clientId)} • {getPropertyName(shift.propertyId)}
                          </p>
                        </div>
                      </div>
                      <Badge className={`text-sm px-3 py-1 ${
                        isClockedIn 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                      }`}>
                        {isClockedIn ? 'Active' : 'Ready to Clock In'}
                      </Badge>
                    </div>

                    {/* Time and Duration */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-5 w-5 text-blue-600" />
                          <span className="font-semibold text-gray-900 dark:text-white">Time</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {shiftStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                          {shiftEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {shiftStart.toLocaleDateString()}
                        </p>
                      </div>

                      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-5 w-5 text-purple-600" />
                          <span className="font-semibold text-gray-900 dark:text-white">Duration</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {Math.round((shiftEnd.getTime() - shiftStart.getTime()) / (1000 * 60 * 60) * 10) / 10}h
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {isClockedIn 
                            ? (isEarlyFinishNow ? 'In progress' : 'Ending soon')
                            : 'Shift in progress'
                          }
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {isClockedIn ? (
                      // Clocked-in: Show Clock Out and Early Finish
                      canClockOutNow && (
                        <div className="flex gap-3 pt-4">
                          {canEarlyFinishNow && (
                            <Button
                              onClick={() => handleEarlyFinish(shift)}
                              disabled={loading}
                              variant="outline"
                              className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-100 h-12 text-base font-semibold"
                            >
                              <Clock3 className="h-5 w-5 mr-2" />
                              Early Finish
                            </Button>
                          )}
                          <Button
                            onClick={() => handleClockOut(shift, isEarlyFinishNow)}
                            disabled={loading}
                            className="flex-1 bg-red-600 hover:bg-red-700 h-12 text-base font-semibold"
                          >
                            {loading ? (
                              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                              <>
                                <LogOut className="h-5 w-5 mr-2" />
                                {isEarlyFinishNow ? 'Early Finish' : 'Clock Out'}
                              </>
                            )}
                          </Button>
                        </div>
                      )
                    ) : (
                      // Not clocked-in: Show Clock In button
                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={() => handleClockIn(shift)}
                          disabled={!canClockInNow || loading}
                          className={`flex-1 h-12 text-base font-semibold ${
                            canClockInNow
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {loading ? (
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          ) : (
                            <>
                              <CheckCircle className="h-5 w-5 mr-2" />
                              Clock In
                            </>
                          )}
                        </Button>
                        {!canClockInNow && (
                          <div className="flex-1 flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="h-4 w-4 mr-2" />
                            Wait for 5 min before start
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Scheduled Shifts Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-blue-500 rounded-full shadow-lg"></div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Scheduled Shifts</h3>
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm px-3 py-1">
              {scheduledShifts.length} scheduled
            </Badge>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Next shift: {scheduledShifts.length > 0 ? getTimeUntilShift(scheduledShifts[0]) : 'None'}
          </div>
        </div>

        {scheduledShifts.length === 0 ? (
          <div className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl border-2 border-dashed border-blue-300 dark:border-blue-600">
            <div className="text-center">
              <Calendar className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Scheduled Shifts</h3>
              <p className="text-gray-600 dark:text-gray-400">You have no upcoming shifts scheduled.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {scheduledShifts.map((shift) => {
              const shiftStart = new Date(shift.start);
              const shiftEnd = new Date(shift.end);
              const minutesDiff = Math.floor((shiftStart.getTime() - currentTime.getTime()) / (1000 * 60));
              const canClock = canClockIn(shift);

              return (
                <div
                  key={shift.id}
                  className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl border-2 border-blue-200 dark:border-blue-700 p-8 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
                >
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                            {shift.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {getClientName(shift.clientId)} • {getPropertyName(shift.propertyId)}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm px-3 py-1">
                        Scheduled
                      </Badge>
                    </div>

                    {/* Time and Duration */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-5 w-5 text-blue-600" />
                          <span className="font-semibold text-gray-900 dark:text-white">Time</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {shiftStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                          {shiftEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {shiftStart.toLocaleDateString()}
                        </p>
                      </div>

                      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-5 w-5 text-purple-600" />
                          <span className="font-semibold text-gray-900 dark:text-white">Duration</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {Math.round((shiftEnd.getTime() - shiftStart.getTime()) / (1000 * 60 * 60) * 10) / 10}h
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {minutesDiff > 0 ? `${getTimeUntilShift(shift)} until start` : 'Starting soon'}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {hasOverlappingShifts(shift) ? (
                        <div className="text-xs text-red-600 text-center">
                          <AlertTriangle className="h-4 w-4 mx-auto mb-1" />
                          <p>Overlapping</p>
                          <p>shift</p>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleClockIn(shift)}
                          disabled={!canClock || loading}
                          className={`${
                            canClock
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {loading ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Clock In
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Early Finish Dialog */}
      <Dialog open={showEarlyFinishDialog} onOpenChange={setShowEarlyFinishDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Early Finish Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for finishing your shift early. This will be attached to your timesheet.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Reason for Early Finish *</Label>
              <Select value={earlyFinishReason} onValueChange={setEarlyFinishReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {EARLY_FINISH_REASONS.map((reason) => (
                    <SelectItem key={reason.id} value={reason.id}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="details">Additional Details *</Label>
              <Textarea
                id="details"
                placeholder="Please provide details about why you are finishing early..."
                value={earlyFinishDetails}
                onChange={(e) => setEarlyFinishDetails(e.target.value)}
                rows={3}
                required
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowEarlyFinishDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={submitEarlyFinish}
                disabled={!earlyFinishReason || !earlyFinishDetails.trim()}
                className="flex-1"
              >
                Submit Early Finish
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 