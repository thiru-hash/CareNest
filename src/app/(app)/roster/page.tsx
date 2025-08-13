import { ScheduleCalendar } from "@/components/roster/ScheduleCalendar";
import { ShiftNotificationSystem } from "@/components/roster/ShiftNotificationSystem";
import { getCurrentUser } from "@/lib/auth";
import { mockShifts } from "@/lib/data";

export default async function RosterPage() {
  const currentUser = await getCurrentUser();
  
  return (
    <div className="space-y-6">
      {/* Header with notifications for support facilitators */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Roster Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage shifts, scheduling, and time tracking
          </p>
        </div>
        <ShiftNotificationSystem currentUser={currentUser} shifts={mockShifts} />
      </div>
      
      {/* Main roster calendar */}
      <ScheduleCalendar currentUser={currentUser} />
    </div>
  );
}
