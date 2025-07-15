"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, Square, AlertCircle } from 'lucide-react';
import { Staff } from '@/lib/types';

interface ShiftManagementProps {
  currentUser: Staff;
}

export function ShiftManagement({ currentUser }: ShiftManagementProps) {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [shiftStartTime, setShiftStartTime] = useState<string | null>(null);
  const [pendingRequests, setPendingRequests] = useState(2);

  const handleClockIn = () => {
    setIsClockedIn(true);
    setShiftStartTime(new Date().toLocaleTimeString());
  };

  const handleClockOut = () => {
    setIsClockedIn(false);
    setShiftStartTime(null);
  };

  const requestShift = () => {
    setPendingRequests(prev => prev + 1);
  };

  return (
    <div className="space-y-4">
      {/* Current Status */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${isClockedIn ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {isClockedIn ? 'Currently Working' : 'Not Clocked In'}
            </p>
            {shiftStartTime && (
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Started at {shiftStartTime}
              </p>
            )}
          </div>
        </div>
        
        <Button
          onClick={isClockedIn ? handleClockOut : handleClockIn}
          variant={isClockedIn ? "destructive" : "default"}
          size="sm"
          className="flex items-center gap-2"
        >
          {isClockedIn ? (
            <>
              <Square className="h-3 w-3" />
              Clock Out
            </>
          ) : (
            <>
              <Play className="h-3 w-3" />
              Clock In
            </>
          )}
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={requestShift}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <AlertCircle className="h-3 w-3" />
          Request Shift
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Clock className="h-3 w-3" />
          View Schedule
        </Button>
      </div>

      {/* Pending Requests */}
      {pendingRequests > 0 && (
        <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-3 w-3 text-yellow-600" />
            <span className="text-xs text-yellow-800 dark:text-yellow-200">
              {pendingRequests} shift request{pendingRequests > 1 ? 's' : ''} pending approval
            </span>
          </div>
        </div>
      )}
    </div>
  );
} 