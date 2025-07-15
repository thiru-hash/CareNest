
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { mockForms } from '@/lib/data';

export default async function FormDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const currentUser = await getCurrentUser();
  const form = mockForms.find((f) => f.id === id);

  if (!form) {
    notFound();
  }

  return (
    <div className="section-padding">
      <div className="mb-8">
        <h1 className="heading-1 mb-2">Form Details</h1>
        <p className="body-text text-gray-600 dark:text-gray-400">
          View and manage form configuration
        </p>
      </div>

      <div className="card shadow-soft p-6">
        <h2 className="heading-3 mb-4">{form.name}</h2>
        <p className="body-text text-gray-600 dark:text-gray-400 mb-6">
          {form.description || 'No description available'}
        </p>
        
        <div className="space-y-4">
          <h3 className="heading-3">Form Fields</h3>
          {form.fields.length > 0 ? (
            <div className="space-y-2">
              {form.fields.map((field) => (
                <div key={field.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-black dark:text-white">{field.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{field.type}</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      Order: {field.order}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No fields configured for this form.</p>
          )}
        </div>
      </div>
    </div>
  );
}
