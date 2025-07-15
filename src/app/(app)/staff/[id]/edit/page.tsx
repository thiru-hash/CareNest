import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { mockStaff } from '@/lib/data';
import { EditStaffClient } from '@/components/staff/EditStaffClient';

export default async function EditStaffPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const currentUser = await getCurrentUser();
  const staffMember = mockStaff.find(s => s.id === id);

  if (!staffMember) {
    notFound();
  }

  // Check if user can edit this staff member
  const isOwnProfile = currentUser.id === id;
  const canEdit = isOwnProfile || 
    ['System Admin', 'HR Manager', 'HR Admin', 'Support Manager'].includes(currentUser.role);

  if (!canEdit) {
    notFound();
  }

  return (
    <div className="section-padding">
      <div className="mb-8">
        <h1 className="heading-1 mb-2">
          {isOwnProfile ? 'Edit My Profile' : `Edit ${staffMember.name}'s Profile`}
        </h1>
        <p className="body-text text-gray-600 dark:text-gray-400">
          {isOwnProfile 
            ? 'Update your personal information and employment details'
            : `Update ${staffMember.name}'s profile and employment information`
          }
        </p>
      </div>

      <EditStaffClient 
        currentUser={staffMember} 
        isOwnProfile={isOwnProfile}
        currentUserRole={currentUser.role}
      />
    </div>
  );
} 