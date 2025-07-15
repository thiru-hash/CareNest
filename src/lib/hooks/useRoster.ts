import { useState, useEffect } from 'react';

interface Shift {
  id: string;
  startTime: string;
  endTime: string;
  date: string;
  area: string;
  client: string;
  assignedStaff?: string;
  status: 'scheduled' | 'assigned' | 'in-progress' | 'completed' | 'cancelled' | 'clocked-in' | 'clocked-out';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface OpenShift {
  id: string;
  startTime: string;
  endTime: string;
  date: string;
  area: string;
  client: string;
  requiredRole: string;
  payRate: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'open' | 'requested' | 'assigned' | 'filled';
  requestedBy?: string;
  requestReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export function useRoster() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [openShifts, setOpenShifts] = useState<OpenShift[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock current user - in real app this would come from auth context
  const currentUserId = 'staff-1';

  useEffect(() => {
    // Simulate loading roster data
    const loadRosterData = () => {
      setLoading(true);
      
      // Get current date for realistic data
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      const dayAfterTomorrow = new Date();
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
      const dayAfterTomorrowStr = dayAfterTomorrow.toISOString().split('T')[0];
      
      // Mock shifts data for current user
      const mockShifts: Shift[] = [
        {
          id: 'shift-1',
          startTime: '08:30',
          endTime: '12:30',
          date: todayStr,
          area: 'Aspire HQ',
          client: '103 Tawa',
          assignedStaff: 'staff-1',
          status: 'assigned',
          notes: 'Morning support shift',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: 'shift-2',
          startTime: '13:00',
          endTime: '17:00',
          date: todayStr,
          area: 'Aspire HQ',
          client: '103 Tawa',
          assignedStaff: 'staff-1',
          status: 'assigned',
          notes: 'Afternoon support shift',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: 'shift-3',
          startTime: '08:30',
          endTime: '12:30',
          date: tomorrowStr,
          area: 'Aspire HQ',
          client: '103 Tawa',
          assignedStaff: 'staff-1',
          status: 'scheduled',
          notes: 'Morning support shift',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: 'shift-4',
          startTime: '13:00',
          endTime: '17:00',
          date: tomorrowStr,
          area: 'Aspire HQ',
          client: '103 Tawa',
          assignedStaff: 'staff-1',
          status: 'scheduled',
          notes: 'Afternoon support shift',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: 'shift-5',
          startTime: '08:30',
          endTime: '12:30',
          date: dayAfterTomorrowStr,
          area: 'Aspire HQ',
          client: '103 Tawa',
          assignedStaff: 'staff-1',
          status: 'scheduled',
          notes: 'Morning support shift',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: 'shift-6',
          startTime: '09:00',
          endTime: '13:00',
          date: todayStr,
          area: 'Aspire HQ',
          client: '103 Tawa',
          assignedStaff: 'staff-1',
          status: 'clocked-in',
          notes: 'Test shift - already clocked in',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: 'shift-7',
          startTime: new Date().toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
          }).split(':')[0] + ':' + (parseInt(new Date().toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
          }).split(':')[1]) + 2).toString().padStart(2, '0'),
          endTime: new Date().toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
          }).split(':')[0] + ':' + (parseInt(new Date().toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
          }).split(':')[1]) + 4).toString().padStart(2, '0'),
          date: todayStr,
          area: 'Aspire HQ',
          client: '105 Johnson',
          assignedStaff: 'staff-1',
          status: 'assigned',
          notes: 'Test shift - clock in available in 2 minutes',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-15')
        }
      ];

      // Mock open shifts data
      const mockOpenShifts: OpenShift[] = [
        {
          id: 'open-1',
          startTime: '09:00',
          endTime: '13:00',
          date: todayStr,
          area: 'Aspire HQ',
          client: '105 Johnson',
          requiredRole: 'Support Worker',
          payRate: '$25/hour',
          description: 'Morning support shift for elderly client',
          urgency: 'high',
          status: 'open',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: 'open-2',
          startTime: '14:00',
          endTime: '18:00',
          date: todayStr,
          area: 'Aspire HQ',
          client: '107 Wilson',
          requiredRole: 'Registered Nurse',
          payRate: '$35/hour',
          description: 'Afternoon nursing care for post-surgery client',
          urgency: 'medium',
          status: 'open',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: 'open-3',
          startTime: '08:00',
          endTime: '12:00',
          date: tomorrowStr,
          area: 'Aspire HQ',
          client: '109 Brown',
          requiredRole: 'Support Worker',
          payRate: '$25/hour',
          description: 'Morning personal care and medication assistance',
          urgency: 'low',
          status: 'open',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: 'open-4',
          startTime: '16:00',
          endTime: '20:00',
          date: tomorrowStr,
          area: 'Aspire HQ',
          client: '111 Davis',
          requiredRole: 'Registered Nurse',
          payRate: '$35/hour',
          description: 'Evening wound care and medication management',
          urgency: 'high',
          status: 'open',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-15')
        }
      ];

      // Filter shifts for current user
      const userShifts = mockShifts.filter(shift => shift.assignedStaff === currentUserId);
      
      setShifts(userShifts);
      setOpenShifts(mockOpenShifts);
      setLoading(false);
    };

    loadRosterData();
  }, [currentUserId]);

  // Clock in function - integrates with existing roster system
  const clockIn = (shiftId: string) => {
    setShifts(prevShifts => 
      prevShifts.map(shift => 
        shift.id === shiftId ? { ...shift, status: 'clocked-in' } : shift
      )
    );
    
    // In real implementation, this would:
    // 1. Update the shift status in the database
    // 2. Grant access to client/property details for this shift
    // 3. Trigger any notifications or audit logs
    console.log(`Clocked in for shift ${shiftId} - access granted to client/property details`);
  };

  // Clock out function - integrates with existing roster system
  const clockOut = (shiftId: string) => {
    setShifts(prevShifts => 
      prevShifts.map(shift => 
        shift.id === shiftId ? { ...shift, status: 'clocked-out' } : shift
      )
    );
    
    // In real implementation, this would:
    // 1. Update the shift status in the database
    // 2. Revoke access to client/property details for this shift
    // 3. Create timesheet entry
    // 4. Trigger any notifications or audit logs
    console.log(`Clocked out for shift ${shiftId} - access revoked to client/property details`);
  };

  // Request open shift function
  const requestOpenShift = (openShiftId: string, reason: string) => {
    setOpenShifts(prevOpenShifts => 
      prevOpenShifts.map(openShift => 
        openShift.id === openShiftId 
          ? { 
              ...openShift, 
              status: 'requested', 
              requestedBy: currentUserId,
              requestReason: reason,
              updatedAt: new Date()
            } 
          : openShift
      )
    );
  };

  // Get shifts for today
  const getTodayShifts = () => {
    const today = new Date().toISOString().split('T')[0];
    return shifts.filter(shift => shift.date === today);
  };

  // Get shifts for tomorrow
  const getTomorrowShifts = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    return shifts.filter(shift => shift.date === tomorrowStr);
  };

  // Get current shift (if any)
  const getCurrentShift = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    return shifts.find(shift => {
      const [startHour, startMin] = shift.startTime.split(':').map(Number);
      const [endHour, endMin] = shift.endTime.split(':').map(Number);
      const shiftStart = startHour * 60 + startMin;
      const shiftEnd = endHour * 60 + endMin;
      
      return currentTime >= shiftStart && currentTime <= shiftEnd && shift.status === 'assigned';
    });
  };

  return {
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
  };
} 