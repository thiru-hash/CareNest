import { getCurrentUser } from "@/lib/auth";
import { mockStaff } from "@/lib/data";
import { ProfileClient } from "@/components/staff/ProfileClient";
import { redirect } from "next/navigation";

export default async function StaffProfilePage() {
  const currentUser = await getCurrentUser();
  
  // Find the current user's staff record
  const staffMember = mockStaff.find(s => s.id === currentUser.id);
  
  if (!staffMember) {
    redirect('/staff');
  }

  return (
    <div className="section-padding">
      <div className="mb-8">
        <h1 className="heading-1 mb-2">My Profile</h1>
        <p className="body-text text-gray-600 dark:text-gray-400">
          View and manage your personal information and employment details
        </p>
      </div>

      <ProfileClient currentUser={staffMember} isOwnProfile={true} />
    </div>
  );
} 