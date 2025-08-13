'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Clock, CheckCircle, AlertTriangle, Calendar, LogOut, Clock3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSystemSettings } from '@/lib/hooks/useSystemSettings';
import { mockShifts, mockClients, mockProperties } from '@/lib/data';
import type { Staff, Shift } from '@/lib/types';

interface ClockInWidgetProps {
  currentUser: Staff;
}

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

export function ClockInWidget({ currentUser }: ClockInWidgetProps) {
  const { toast } = useToast();
  const { settings } = useSystemSettings();
  const [upcomingShifts, setUpcomingShifts] = useState<Shift[]>([]);
  const [activeShifts, setActiveShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(false);
  const [showEarlyFinishDialog, setShowEarlyFinishDialog] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [earlyFinishReason, setEarlyFinishReason] = useState('');
  const [earlyFinishDetails, setEarlyFinishDetails] = useState('');

  // Check if user is a support facilitator
  const isSupportFacilitator = currentUser.role === 'Support Worker' || 
                               currentUser.role === 'Support Manager' ||
                               currentUser.role === 'Behavioural Support';

  useEffect(() => {
    if (isSupportFacilitator) {
      const now = new Date();
      
      // Filter upcoming shifts
      const userShifts = mockShifts.filter(shift => 
        shift.staffId === currentUser.id && 
        new Date(shift.start) > now &&
        shift.status === 'Assigned'
      );

      // Filter active shifts (clocked in)
      const userActiveShifts = mockShifts.filter(shift => 
        shift.staffId === currentUser.id && 
        shift.status === 'clocked-in'
      );

      // Sort by start time
      const sortedShifts = userShifts.sort((a, b) => 
        new Date(a.start).getTime() - new Date(b.start).getTime()
      );

      setUpcomingShifts(sortedShifts.slice(0, 3));
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

      // Remove from upcoming shifts and add to active shifts
      setUpcomingShifts(prev => prev.filter(s => s.id !== shift.id));
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
        title: "Clock-in Failed",
        description: "Unable to clock in. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async (shift: Shift, isEarlyFinish: boolean = false, reason?: string) => {
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

      const action = isEarlyFinish ? 'finished early' : 'clocked out';
      toast({
        title: `Successfully ${action}`,
        description: `You have ${action} for your shift at ${new Date(shift.start).toLocaleTimeString()}`,
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
        title: "Clock-out Failed",
        description: "Unable to clock out. Please try again.",
      });
    } finally {
      setLoading(false);
      setShowEarlyFinishDialog(false);
      setSelectedShift(null);
      setEarlyFinishReason('');
      setEarlyFinishDetails('');
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
    const fullReason = reason ? `${reason.label}: ${earlyFinishDetails}` : earlyFinishDetails;
    
    handleClockOut(selectedShift, true, fullReason);
  };

  const canClockIn = (shift: Shift) => {
    const now = new Date();
    const shiftStart = new Date(shift.start);
    const timeDiff = shiftStart.getTime() - now.getTime();
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));
    
    // Can clock in ONLY 5 minutes before shift starts (not for future shifts)
    return minutesDiff <= 5 && minutesDiff > -60;
  };

  const canClockOut = (shift: Shift) => {
    if (!settings.rosterBasedAccessControl?.allowManualClockOut) return false;
    
    const now = new Date();
    const shiftEnd = new Date(shift.end);
    const timeDiff = shiftEnd.getTime() - now.getTime();
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));
    
    // Can clock out if shift has started
    return minutesDiff < 0;
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

  const canEarlyFinish = (shift: Shift) => {
    if (!settings.rosterBasedAccessControl?.allowEarlyFinish) return false;
    
    const now = new Date();
    const shiftEnd = new Date(shift.end);
    const timeDiff = shiftEnd.getTime() - now.getTime();
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));
    const gracePeriod = settings.rosterBasedAccessControl?.earlyFinishGracePeriod || 30;
    
    // Can early finish if within grace period
    return minutesDiff > 0 && minutesDiff <= gracePeriod;
  };

  if (!isSupportFacilitator) {
    return null;
  }

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-blue-500 rounded-full shadow-lg"></div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Clock-In/Out Status</h3>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
        
        <div className="space-y-8">
          {/* Active Shifts */}
          {activeShifts.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Active Shifts</h4>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                  {activeShifts.length} active
                </Badge>
              </div>
              <div className="grid gap-4">
                {activeShifts.map((shift) => {
                  const shiftEnd = new Date(shift.end);
                  const now = new Date();
                  const timeDiff = shiftEnd.getTime() - now.getTime();
                  const minutesDiff = Math.floor(timeDiff / (1000 * 60));

                  return (
                    <div
                      key={shift.id}
                      className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:border-green-300 dark:hover:border-green-600 transition-all duration-200"
                    >
                      {/* Active indicator */}
                      <div className="absolute top-4 right-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{shift.title}</span>
                          <Badge variant="default" className="bg-green-600 text-xs">
                            Active
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <p>End: {shiftEnd.toLocaleTimeString()}</p>
                          {minutesDiff > 0 && (
                            <p className="text-orange-600">
                              Ends in {Math.floor(minutesDiff / 60)}h {minutesDiff % 60}m
                            </p>
                          )}
                          {minutesDiff <= 0 && (
                            <p className="text-red-600">
                              Shift ended {Math.abs(minutesDiff)}m ago
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {canEarlyFinish(shift) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEarlyFinish(shift)}
                            disabled={loading}
                            className="border-orange-300 text-orange-700 hover:bg-orange-50"
                          >
                            <Clock3 className="h-4 w-4 mr-1" />
                            Early Finish
                          </Button>
                        )}
                        {canClockOut(shift) && (
                          <Button
                            size="sm"
                            onClick={() => handleClockOut(shift)}
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {loading ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                              <>
                                <LogOut className="h-4 w-4 mr-1" />
                                Clock Out
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upcoming Shifts */}
          {upcomingShifts.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Upcoming Shifts</h4>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs">
                  {upcomingShifts.length} upcoming
                </Badge>
              </div>
              <div className="grid gap-4">
                {upcomingShifts.map((shift) => {
                  const shiftStart = new Date(shift.start);
                  const now = new Date();
                  const timeDiff = shiftStart.getTime() - now.getTime();
                  const minutesDiff = Math.floor(timeDiff / (1000 * 60));
                  const canClock = canClockIn(shift);

                  return (
                    <div
                      key={shift.id}
                      className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
                    >
                      {/* Status indicator */}
                      <div className="absolute top-4 right-4">
                        <Badge 
                          variant={canClock ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {canClock ? "Ready to Clock In" : "Upcoming"}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{shift.title}</span>
                          <Badge 
                            variant={canClock ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {canClock ? "Ready to Clock In" : "Upcoming"}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <p>📍 {getPropertyName(shift.propertyId)}</p>
                          <p>👤 {getClientName(shift.clientId)}</p>
                          <p>⏰ {shiftStart.toLocaleTimeString()} - {new Date(shift.end).toLocaleTimeString()}</p>
                          <p>🕒 {Math.round((new Date(shift.end).getTime() - shiftStart.getTime()) / (1000 * 60 * 60) * 10) / 10}h</p>
                          {minutesDiff > 0 && (
                            <p className="text-orange-600 font-medium">
                              ⏳ Starts in {Math.floor(minutesDiff / 60)}h {minutesDiff % 60}m
                            </p>
                          )}
                        </div>
                      </div>
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
                  );
                })}
              </div>
            </div>
          )}

          {activeShifts.length === 0 && upcomingShifts.length === 0 && (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No active or upcoming shifts</p>
              <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
            </div>
          )}
        </div>
      </div>

      {/* Early Finish Dialog */}
      <Dialog open={showEarlyFinishDialog} onOpenChange={setShowEarlyFinishDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Early Finish Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for finishing your shift early. This will be attached to your timesheet.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Reason for Early Finish</Label>
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
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowEarlyFinishDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={submitEarlyFinish}
                disabled={!earlyFinishReason || !earlyFinishDetails.trim()}
              >
                Submit Early Finish
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 