
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { mockSections } from '@/lib/data';

export default async function SectionDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const currentUser = await getCurrentUser();
  const section = mockSections.find((s) => s.id === id);

  if (!section) {
    notFound();
  }

  return (
    <div className="section-padding">
      <div className="mb-8">
        <h1 className="heading-1 mb-2">Section Details</h1>
        <p className="body-text text-gray-600 dark:text-gray-400">
          View and manage section configuration
        </p>
      </div>

      <div className="card shadow-soft p-6">
        <h2 className="heading-3 mb-4">{section.name}</h2>
        <p className="body-text text-gray-600 dark:text-gray-400 mb-6">
          {section.description || 'No description available'}
        </p>
        
        <div className="space-y-4">
          <h3 className="heading-3">Section Tabs</h3>
          {section.tabs && section.tabs.length > 0 ? (
            <div className="space-y-2">
              {section.tabs.map((tab) => (
                <div key={tab.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-black dark:text-white">{tab.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Form ID: {tab.formId}</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      Order: {tab.order}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No tabs configured for this section.</p>
          )}
        </div>
      </div>
    </div>
  );
}
