
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { mockClients } from '@/lib/data';
import { canAccessClient } from '@/lib/access-control';
import { ClientTable } from '@/components/people/ClientTable';

export default async function ClientProfilePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const currentUser = await getCurrentUser();
  const hasAccess = await canAccessClient(currentUser, id);

  if (!hasAccess) {
    notFound();
  }

  const client = mockClients.find((c) => c.id === id);

  if (!client) {
    notFound();
  }

  return (
    <div className="section-padding">
      <div className="mb-8">
        <h1 className="heading-1 mb-2">Client Profile</h1>
        <p className="body-text text-gray-600 dark:text-gray-400">
          View and manage client details
        </p>
      </div>

      <div className="card shadow-soft p-6">
        <ClientTable clients={[client]} currentUser={currentUser} />
      </div>
    </div>
  );
}
