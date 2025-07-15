import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { mockStaff } from '@/lib/data';
import { StaffTableClient } from '@/components/staff/StaffTableClient';

export default async function StaffProfilePage({ 
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

  return (
    <div className="section-padding">
      <div className="mb-8">
        <h1 className="heading-1 mb-2">Staff Profile</h1>
        <p className="body-text text-gray-600 dark:text-gray-400">
          View and manage staff member details
        </p>
      </div>

      <div className="card shadow-soft p-6">
        <StaffTableClient 
          staff={[staffMember]} 
          currentUser={currentUser}
        />
      </div>
    </div>
  );
}
