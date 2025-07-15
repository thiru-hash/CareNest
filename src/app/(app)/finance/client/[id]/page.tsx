
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { mockClients, mockClientBudgets } from '@/lib/data';
import { ClientExpenseManager } from '@/components/finance/ClientExpenseManager';

export default async function ClientFinancePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const client = mockClients.find((c) => c.id === id);
  const clientBudget = mockClientBudgets.find(b => b.clientId === id);

  if (!client || !clientBudget) {
    notFound();
  }

  return (
    <div className="section-padding">
      <div className="mb-8">
        <h1 className="heading-1 mb-2">Client Finance</h1>
        <p className="body-text text-gray-600 dark:text-gray-400">
          Manage finances for {client.name}
        </p>
      </div>

      <div className="card shadow-soft p-6">
        <ClientExpenseManager 
          client={client} 
          budget={clientBudget}
        />
      </div>
    </div>
  );
}
