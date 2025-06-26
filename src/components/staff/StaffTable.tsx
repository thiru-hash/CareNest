import { getCurrentUser } from "@/lib/auth";
import { mockStaff } from "@/lib/data";
import { StaffTableClient } from "@/components/staff/StaffTableClient";
// StaffTable is now a Server Component responsible for data fetching
// Client-side interactivity (state, modal) is handled in StaffTableClient
export async function StaffTable() {
  const currentUser = await getCurrentUser();
  const staffToDisplay =
    currentUser.role === 'System Admin'
      ? mockStaff
      : mockStaff.filter((staff) => staff.id === currentUser.id);
  return <StaffTableClient staffToDisplay={staffToDisplay} currentUser={currentUser} />;
}
