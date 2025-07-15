
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { mockForms } from '@/lib/data';
import { FormFieldManager } from '@/components/settings/FormFieldManager';

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
        <h1 className="heading-1 mb-2">Form Management</h1>
        <p className="body-text text-gray-600 dark:text-gray-400">
          Manage form configuration and fields
        </p>
      </div>

      <div className="space-y-6">
        {/* Form Details Card */}
        <div className="card shadow-soft p-6">
          <h2 className="heading-3 mb-4">{form.name}</h2>
          <p className="body-text text-gray-600 dark:text-gray-400 mb-6">
            {form.description || 'No description available'}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Form ID:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">{form.id}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">{form.status}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Linked Section:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">{form.linkedSectionId}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Total Fields:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">{form.fields?.length || 0}</span>
            </div>
          </div>
        </div>

        {/* Form Fields Management */}
        <FormFieldManager form={form} />
      </div>
    </div>
  );
}
