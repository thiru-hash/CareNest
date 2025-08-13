'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Clock, 
  MapPin, 
  User, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Play,
  Square,
  Shield,
  TrendingUp,
  Timer
} from 'lucide-react';
import { 
  Shift, 
  ComplianceItem, 
  HoursSummary, 
  Activity 
} from '@/lib/types/dashboard';

interface SupportWorkerDashboardProps {
  userId: string;
}

export function SupportWorkerDashboard({ userId }: SupportWorkerDashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentShift, setCurrentShift] = useState<Shift | null>(null);
  const [nextShifts, setNextShifts] = useState<Shift[]>([]);
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([]);
  const [hoursSummary, setHoursSummary] = useState<HoursSummary | null>(null);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [showEarlyClockOffDialog, setShowEarlyClockOffDialog] = useState(false);
  const [earlyClockOffReason, setEarlyClockOffReason] = useState('');
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Load dashboard data
    loadDashboardData();

    return () => clearInterval(timer);
  }, [userId]);

  const loadDashboardData = async () => {
    // Mock data - replace with actual API calls
    const mockCurrentShift: Shift = {
      id: '1',
      title: 'Morning Support',
      clientName: 'John Smith',
      clientId: 'client1',
      location: '123 Care Street, Melbourne VIC 3000',
      propertyId: 'prop1',
      startTime: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 8, 0),
      endTime: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 16, 0),
      totalHours: 8,
      status: 'active',
      isClockedIn: true,
      clockInTime: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 7, 55),
      staffId: userId,
      staffName: 'Jane Doe',
      canClockIn: false,
      canClockOut: true,
    };

    const mockNextShifts: Shift[] = [
      {
        id: '2',
        title: 'Evening Support',
        clientName: 'Mary Johnson',
        clientId: 'client2',
        location: '456 Support Ave, Melbourne VIC 3000',
        propertyId: 'prop2',
        startTime: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate() + 1, 16, 0),
        endTime: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate() + 1, 0, 0),
        totalHours: 8,
        status: 'scheduled',
        isClockedIn: false,
        staffId: userId,
        staffName: 'Jane Doe',
        canClockIn: false,
        canClockOut: false,
      },
      {
        id: '3',
        title: 'Night Support',
        clientName: 'David Wilson',
        clientId: 'client3',
        location: '789 Care Lane, Melbourne VIC 3000',
        propertyId: 'prop3',
        startTime: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate() + 2, 0, 0),
        endTime: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate() + 2, 8, 0),
        totalHours: 8,
        status: 'scheduled',
        isClockedIn: false,
        staffId: userId,
        staffName: 'Jane Doe',
        canClockIn: false,
        canClockOut: false,
      },
      {
        id: '4',
        title: 'Weekend Support',
        clientName: 'Sarah Brown',
        clientId: 'client4',
        location: '321 Support Road, Melbourne VIC 3000',
        propertyId: 'prop4',
        startTime: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate() + 3, 9, 0),
        endTime: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate() + 3, 17, 0),
        totalHours: 8,
        status: 'scheduled',
        isClockedIn: false,
        staffId: userId,
        staffName: 'Jane Doe',
        canClockIn: false,
        canClockOut: false,
      },
    ];

    const mockComplianceItems: ComplianceItem[] = [
      {
        id: '1',
        name: 'First Aid Certificate',
        type: 'certification',
        expiryDate: new Date(currentTime.getFullYear(), currentTime.getMonth() + 1, 15),
        status: 'valid',
        daysUntilExpiry: 45,
        staffId: userId,
        staffName: 'Jane Doe',
      },
      {
        id: '2',
        name: 'CPR Certification',
        type: 'certification',
        expiryDate: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate() + 15),
        status: 'expiring',
        daysUntilExpiry: 15,
        staffId: userId,
        staffName: 'Jane Doe',
      },
      {
        id: '3',
        name: 'Background Check',
        type: 'police_check',
        expiryDate: new Date(currentTime.getFullYear() + 1, 5, 10),
        status: 'valid',
        daysUntilExpiry: 180,
        staffId: userId,
        staffName: 'Jane Doe',
      },
    ];

    const mockHoursSummary: HoursSummary = {
      week: {
        completed: 32,
        rostered: 40,
        remaining: 8,
      },
      fortnight: {
        completed: 64,
        rostered: 80,
        remaining: 16,
      },
      payPeriod: {
        completed: 128,
        rostered: 160,
        remaining: 32,
      },
    };

    setCurrentShift(mockCurrentShift);
    setNextShifts(mockNextShifts);
    setComplianceItems(mockComplianceItems);
    setHoursSummary(mockHoursSummary);
  };

  const handleClockIn = async (shift: Shift) => {
    try {
      // API call to clock in
      const updatedShift = { ...shift, isClockedIn: true, status: 'active' as const };
      setCurrentShift(updatedShift);
      
      // Update next shifts
      setNextShifts(prev => prev.map(s => s.id === shift.id ? updatedShift : s));
      
      // Add activity
      const activity: Activity = {
        id: Date.now().toString(),
        type: 'shift',
        title: 'Clocked In',
        description: `Clocked in for ${shift.title} at ${currentTime.toLocaleTimeString()}`,
        timestamp: currentTime,
        userId: userId,
        userName: 'Jane Doe',
        severity: 'success',
      };
      setRecentActivities(prev => [activity, ...prev.slice(0, 9)]);
    } catch (error) {
      console.error('Failed to clock in:', error);
    }
  };

  const handleClockOut = async (shift: Shift) => {
    if (currentTime < shift.endTime) {
      // Early clock off - show dialog
      setSelectedShift(shift);
      setShowEarlyClockOffDialog(true);
    } else {
      // Normal clock off
      await performClockOut(shift, '');
    }
  };

  const performClockOut = async (shift: Shift, reason: string) => {
    try {
      // API call to clock out
      const updatedShift = { 
        ...shift, 
        isClockedIn: false, 
        status: 'completed' as const,
        clockOutTime: currentTime,
        earlyClockOffReason: reason || undefined,
      };
      
      setCurrentShift(null);
      setNextShifts(prev => prev.map(s => s.id === shift.id ? updatedShift : s));
      
      // Add activity
      const activity: Activity = {
        id: Date.now().toString(),
        type: 'shift',
        title: 'Clocked Out',
        description: `Clocked out from ${shift.title} at ${currentTime.toLocaleTimeString()}${reason ? ` - Reason: ${reason}` : ''}`,
        timestamp: currentTime,
        userId: userId,
        userName: 'Jane Doe',
        severity: 'info',
      };
      setRecentActivities(prev => [activity, ...prev.slice(0, 9)]);
      
      setShowEarlyClockOffDialog(false);
      setEarlyClockOffReason('');
      setSelectedShift(null);
    } catch (error) {
      console.error('Failed to clock out:', error);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-AU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-AU', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const canClockIn = (shift: Shift) => {
    const fiveMinutesBefore = new Date(shift.startTime.getTime() - 5 * 60 * 1000);
    return currentTime >= fiveMinutesBefore && currentTime <= shift.endTime && !shift.isClockedIn;
  };

  const getShiftStatus = (shift: Shift) => {
    if (shift.isClockedIn) return 'Active';
    if (shift.status === 'completed') return 'Completed';
    if (canClockIn(shift)) return 'Ready to Clock In';
    return 'Scheduled';
  };

  const getShiftStatusColor = (shift: Shift) => {
    if (shift.isClockedIn) return 'bg-green-100 text-green-800';
    if (shift.status === 'completed') return 'bg-gray-100 text-gray-800';
    if (canClockIn(shift)) return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="space-y-6">
      {/* Current Shift */}
      {currentShift && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900">
              <Clock className="h-6 w-6 mr-2" />
              Current Shift
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{currentShift.title}</h3>
                  <p className="text-gray-600">{currentShift.clientName}</p>
                </div>
                <Badge className={getShiftStatusColor(currentShift)}>
                  {getShiftStatus(currentShift)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{currentShift.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {formatTime(currentShift.startTime)} - {formatTime(currentShift.endTime)} ({currentShift.totalHours}h)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{currentShift.clientName}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-blue-200">
                <div className="text-sm text-gray-600">
                  {currentShift.isClockedIn ? 'Clocked in' : 'Not clocked in'}
                </div>
                <div className="flex space-x-2">
                  {!currentShift.isClockedIn && canClockIn(currentShift) && (
                    <Button 
                      onClick={() => handleClockIn(currentShift)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Clock In
                    </Button>
                  )}
                  {currentShift.isClockedIn && (
                    <Button 
                      onClick={() => handleClockOut(currentShift)}
                      variant="destructive"
                    >
                      <Square className="h-4 w-4 mr-1" />
                      Clock Out
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next 3 Shifts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-6 w-6 mr-2" />
            Next 3 Shifts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {nextShifts.slice(0, 3).map((shift) => (
              <div key={shift.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{shift.title}</h4>
                    <Badge className={getShiftStatusColor(shift)}>
                      {getShiftStatus(shift)}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{shift.clientName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{shift.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatTime(shift.startTime)} - {formatTime(shift.endTime)} ({shift.totalHours}h)</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(shift.startTime)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-6 w-6 mr-2" />
            Compliance Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {complianceItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    item.status === 'valid' ? 'bg-green-100' :
                    item.status === 'expiring' ? 'bg-orange-100' :
                    'bg-red-100'
                  }`}>
                    {item.status === 'valid' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">
                      Expires: {item.expiryDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge className={
                  item.status === 'valid' ? 'bg-green-100 text-green-800' :
                  item.status === 'expiring' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }>
                  {item.status === 'valid' ? `${item.daysUntilExpiry} days left` :
                   item.status === 'expiring' ? `${item.daysUntilExpiry} days left` :
                   'Expired'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hours Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-sm">
              <TrendingUp className="h-4 w-4 mr-2" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hoursSummary && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completed:</span>
                  <span className="font-semibold">{hoursSummary.week.completed}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Rostered:</span>
                  <span className="font-semibold">{hoursSummary.week.rostered}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Remaining:</span>
                  <span className="font-semibold text-blue-600">{hoursSummary.week.remaining}h</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2" />
              This Fortnight
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hoursSummary && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completed:</span>
                  <span className="font-semibold">{hoursSummary.fortnight.completed}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Rostered:</span>
                  <span className="font-semibold">{hoursSummary.fortnight.rostered}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Remaining:</span>
                  <span className="font-semibold text-blue-600">{hoursSummary.fortnight.remaining}h</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-sm">
              <Timer className="h-4 w-4 mr-2" />
              Pay Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hoursSummary && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completed:</span>
                  <span className="font-semibold">{hoursSummary.payPeriod.completed}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Rostered:</span>
                  <span className="font-semibold">{hoursSummary.payPeriod.rostered}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Remaining:</span>
                  <span className="font-semibold text-blue-600">{hoursSummary.payPeriod.remaining}h</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Early Clock Off Dialog */}
      <Dialog open={showEarlyClockOffDialog} onOpenChange={setShowEarlyClockOffDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Early Clock Off</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              You are clocking off before your scheduled end time. Please provide a reason for early clock off.
            </p>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Early Clock Off</Label>
              <Textarea
                id="reason"
                placeholder="Please explain why you are clocking off early..."
                value={earlyClockOffReason}
                onChange={(e) => setEarlyClockOffReason(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowEarlyClockOffDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => selectedShift && performClockOut(selectedShift, earlyClockOffReason)}
                disabled={!earlyClockOffReason.trim()}
              >
                Clock Out
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 