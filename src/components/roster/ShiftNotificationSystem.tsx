'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Bell, Clock, CheckCircle, AlertTriangle, X, LogOut, Clock3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSystemSettings } from '@/lib/hooks/useSystemSettings';
import type { Staff, Shift } from '@/lib/types';

interface ShiftNotification {
  id: string;
  shiftId: string;
  staffId: string;
  type: 'shift_created' | 'shift_updated' | 'shift_reminder' | 'clock_in_available' | 'clock_out_available' | 'early_finish_available';
  message: string;
  timestamp: Date;
  isRead: boolean;
  shift?: Shift;
  staff?: Staff;
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

interface ShiftNotificationSystemProps {
  currentUser: Staff;
  shifts: Shift[];
}

export function ShiftNotificationSystem({ currentUser, shifts }: ShiftNotificationSystemProps) {
  const { toast } = useToast();
  const { settings } = useSystemSettings();
  const [notifications, setNotifications] = useState<ShiftNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
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
      
      // Generate notifications for upcoming shifts (clock-in)
      const upcomingShifts = shifts.filter(shift => {
        const shiftStart = new Date(shift.start);
        const timeDiff = shiftStart.getTime() - now.getTime();
        const minutesDiff = Math.floor(timeDiff / (1000 * 60));
        
        // Show notification 5 minutes before shift
        return shift.staffId === currentUser.id && 
               minutesDiff <= 5 && 
               minutesDiff > -60 && // Within last hour
               shift.status === 'Assigned';
      });

      // Generate notifications for active shifts (clock-out)
      const activeShifts = shifts.filter(shift => {
        const shiftEnd = new Date(shift.end);
        const timeDiff = shiftEnd.getTime() - now.getTime();
        const minutesDiff = Math.floor(timeDiff / (1000 * 60));
        
        // Show notification when shift is ending or has ended
        return shift.staffId === currentUser.id && 
               shift.status === 'clocked-in' &&
               minutesDiff <= 10; // Within 10 minutes of end
      });

      // Generate notifications for early finish opportunities
      const earlyFinishShifts = shifts.filter(shift => {
        const shiftEnd = new Date(shift.end);
        const timeDiff = shiftEnd.getTime() - now.getTime();
        const minutesDiff = Math.floor(timeDiff / (1000 * 60));
        const gracePeriod = settings.rosterBasedAccessControl?.earlyFinishGracePeriod || 30;
        
        return shift.staffId === currentUser.id && 
               shift.status === 'clocked-in' &&
               minutesDiff > 0 && 
               minutesDiff <= gracePeriod;
      });

      const newNotifications: ShiftNotification[] = [
        ...upcomingShifts.map(shift => ({
          id: `notification-clockin-${shift.id}`,
          shiftId: shift.id,
          staffId: currentUser.id,
          type: 'clock_in_available' as const,
          message: `Clock-in available for shift: ${shift.title}`,
          timestamp: new Date(),
          isRead: false,
          shift,
          staff: currentUser
        })),
        ...activeShifts.map(shift => ({
          id: `notification-clockout-${shift.id}`,
          shiftId: shift.id,
          staffId: currentUser.id,
          type: 'clock_out_available' as const,
          message: `Clock-out available for shift: ${shift.title}`,
          timestamp: new Date(),
          isRead: false,
          shift,
          staff: currentUser
        })),
        ...earlyFinishShifts.map(shift => ({
          id: `notification-earlyfinish-${shift.id}`,
          shiftId: shift.id,
          staffId: currentUser.id,
          type: 'early_finish_available' as const,
          message: `Early finish available for shift: ${shift.title}`,
          timestamp: new Date(),
          isRead: false,
          shift,
          staff: currentUser
        }))
      ];

      setNotifications(prev => {
        const existingIds = prev.map(n => n.id);
        const uniqueNew = newNotifications.filter(n => !existingIds.includes(n.id));
        return [...prev, ...uniqueNew];
      });
    }
  }, [shifts, currentUser, isSupportFacilitator, settings.rosterBasedAccessControl?.earlyFinishGracePeriod]);

  const handleClockIn = async (shiftId: string) => {
    try {
      // Update shift status
      const updatedShifts = shifts.map(shift => 
        shift.id === shiftId ? { ...shift, status: 'clocked-in' as any } : shift
      );

      // Mark notification as read
      setNotifications(prev => 
        prev.map(notif => 
          notif.shiftId === shiftId ? { ...notif, isRead: true } : notif
        )
      );

      toast({
        title: "Successfully Clocked In",
        description: "You have been clocked in for your shift.",
      });

      // In real implementation, this would:
      // 1. Update the shift status in the database
      // 2. Grant access to client/property details for this shift
      // 3. Trigger any notifications or audit logs
      console.log(`[RBAC] User ${currentUser.name} clocked in for shift ${shiftId}`);
      console.log(`[RBAC] Access granted to client/property details for shift ${shiftId}`);

    } catch (error) {
      toast({
        variant: 'destructive',
        title: "Clock-in Failed",
        description: "Unable to clock in. Please try again.",
      });
    }
  };

  const handleClockOut = async (shiftId: string, isEarlyFinish: boolean = false, reason?: string) => {
    try {
      // Update shift status
      const updatedShifts = shifts.map(shift => 
        shift.id === shiftId ? { ...shift, status: 'clocked-out' as any } : shift
      );

      // Mark notification as read
      setNotifications(prev => 
        prev.map(notif => 
          notif.shiftId === shiftId ? { ...notif, isRead: true } : notif
        )
      );

      const action = isEarlyFinish ? 'finished early' : 'clocked out';
      toast({
        title: `Successfully ${action}`,
        description: `You have ${action} for your shift.`,
      });

      // In real implementation, this would:
      // 1. Update the shift status in the database
      // 2. Revoke access to client/property details for this shift
      // 3. Create timesheet entry
      // 4. Create audit log entry with early finish reason if applicable
      // 5. Send notification to management
      console.log(`[RBAC] User ${currentUser.name} clocked out for shift ${shiftId}`);
      console.log(`[RBAC] Access revoked to client/property details for shift ${shiftId}`);
      if (isEarlyFinish && reason) {
        console.log(`[RBAC] Early finish reason: ${reason}`);
      }

    } catch (error) {
      toast({
        variant: 'destructive',
        title: "Clock-out Failed",
        description: "Unable to clock out. Please try again.",
      });
    } finally {
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
    if (!selectedShift) return;
    
    const reason = EARLY_FINISH_REASONS.find(r => r.id === earlyFinishReason);
    const fullReason = reason ? `${reason.label}: ${earlyFinishDetails}` : earlyFinishDetails;
    
    handleClockOut(selectedShift.id, true, fullReason);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isSupportFacilitator) {
    return null;
  }

  return (
    <>
      <div className="relative">
        {/* Notification Bell */}
        <Button
          variant="outline"
          size="icon"
          className="relative"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>

        {/* Notifications Panel */}
        {showNotifications && (
          <Card className="absolute top-12 right-0 w-80 z-50 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Shift Notifications</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setShowNotifications(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {notifications.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No notifications
                </p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border ${
                        notification.isRead 
                          ? 'bg-gray-50 dark:bg-gray-800' 
                          : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {notification.type === 'clock_in_available' && (
                              <Clock className="h-4 w-4 text-blue-600" />
                            )}
                            {notification.type === 'clock_out_available' && (
                              <LogOut className="h-4 w-4 text-red-600" />
                            )}
                            {notification.type === 'early_finish_available' && (
                              <Clock3 className="h-4 w-4 text-orange-600" />
                            )}
                            <span className="text-sm font-medium">
                              {notification.message}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {notification.timestamp.toLocaleTimeString()}
                          </p>
                          {notification.shift && (
                            <div className="mt-2 text-xs text-gray-600">
                              <p>Start: {new Date(notification.shift.start).toLocaleTimeString()}</p>
                              <p>End: {new Date(notification.shift.end).toLocaleTimeString()}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          )}
                          {notification.type === 'clock_in_available' && notification.shift && (
                            <Button
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => handleClockIn(notification.shiftId)}
                            >
                              Clock In
                            </Button>
                          )}
                          {notification.type === 'clock_out_available' && notification.shift && (
                            <Button
                              size="sm"
                              className="h-6 px-2 text-xs bg-red-600 hover:bg-red-700"
                              onClick={() => handleClockOut(notification.shiftId)}
                            >
                              Clock Out
                            </Button>
                          )}
                          {notification.type === 'early_finish_available' && notification.shift && (
                            <Button
                              size="sm"
                              className="h-6 px-2 text-xs bg-orange-600 hover:bg-orange-700"
                              onClick={() => handleEarlyFinish(notification.shift!)}
                            >
                              Early Finish
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Early Finish Dialog */}
      <Dialog open={showEarlyFinishDialog} onOpenChange={setShowEarlyFinishDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Early Finish Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for finishing your shift early. This information will be logged and may require approval.
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
              <Label htmlFor="details">Additional Details</Label>
              <Textarea
                id="details"
                placeholder="Provide additional details about your early finish..."
                value={earlyFinishDetails}
                onChange={(e) => setEarlyFinishDetails(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowEarlyFinishDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={submitEarlyFinish}
                disabled={!earlyFinishReason || (settings.rosterBasedAccessControl?.requireEarlyFinishReason && !earlyFinishDetails)}
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