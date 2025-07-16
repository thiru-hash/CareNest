
"use client";

import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User } from 'lucide-react';
import { mockShifts, mockStaff } from '@/lib/data';

export function UpcomingShifts() {
  const upcomingShifts = mockShifts
    .filter(shift => new Date(shift.start) > new Date())
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 5);

  const getShiftStatus = (shift: any) => {
    const now = new Date();
    const shiftStart = new Date(shift.start);
    const hoursUntilShift = (shiftStart.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilShift < 24) return 'Today';
    if (hoursUntilShift < 48) return 'Tomorrow';
    return 'Upcoming';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Today':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Tomorrow':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Upcoming':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatShiftTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatShiftDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {upcomingShifts.length > 0 ? (
        upcomingShifts.map((shift) => {
          const staff = mockStaff.find(s => s.id === shift.staffId);
          const status = getShiftStatus(shift);
          
          return (
            <div key={shift.id} className="p-3 sm:p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 flex-shrink-0">
                    <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                      {staff?.name || 'Unknown Staff'}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {formatShiftDate(shift.start)} at {formatShiftTime(shift.start)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <Clock className="h-3 w-3 text-gray-500" />
                  <Badge className={`text-xs font-medium ${getStatusColor(status)}`}>
                    {status}
                  </Badge>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center py-8">
          <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Calendar className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            No upcoming shifts
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            All staff are scheduled
          </p>
        </div>
      )}
    </div>
  );
}
