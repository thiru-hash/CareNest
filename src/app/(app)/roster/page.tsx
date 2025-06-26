import { ScheduleCalendar } from "@/components/roster/ScheduleCalendar";
import { getCurrentUser } from "@/lib/auth";

export default async function RosterPage() {
  const currentUser = await getCurrentUser();
  return (
    <div>
      <ScheduleCalendar currentUser={currentUser} />
    </div>
  );
}
