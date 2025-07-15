import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { mockStaff } from '@/lib/data';
import { ProfileClient } from '@/components/staff/ProfileClient';

export default async function StaffDetailPage({ 
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

  // Check if user is viewing their own profile
  const isOwnProfile = currentUser.id === id;

  return (
    <div className="section-padding">
      <div className="mb-8">
        <h1 className="heading-1 mb-2">
          {isOwnProfile ? 'My Profile' : `${staffMember.name}'s Profile`}
        </h1>
        <p className="body-text text-gray-600 dark:text-gray-400">
          {isOwnProfile 
            ? 'View and manage your personal information and employment details'
            : `View ${staffMember.name}'s profile and employment information`
          }
        </p>
      </div>

      <ProfileClient 
        currentUser={staffMember} 
        isOwnProfile={isOwnProfile}
      />
    </div>
  );
}
