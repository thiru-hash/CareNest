
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { mockForms } from '@/lib/data';
import { FormFieldManager } from '@/components/settings/FormFieldManager';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function FormDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const currentUser = await getCurrentUser();
  
  // Find the form in mock data
  let form = mockForms.find((f) => f.id === id);

  // If form doesn't exist in mock data, create a fallback for new forms
  if (!form) {
    // Check if this is a new form (has timestamp-based ID)
    if (id.startsWith('form-') && /^\d+$/.test(id.replace('form-', ''))) {
      // This is a new form, create a fallback
      form = {
        id: id,
        name: 'New Form',
        linkedSectionId: 'sec-people',
        status: 'Active',
        fields: []
      };
    } else {
      // Form doesn't exist and is not a new form
      notFound();
    }
  }

  return (
    <div className="section-padding">
      <div className="mb-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/settings" className="hover:text-foreground transition-colors">
            System Settings
          </Link>
          <span>/</span>
          <Link href="/settings" className="hover:text-foreground transition-colors">
            Forms Management
          </Link>
          <span>/</span>
          <span className="text-foreground">{form.name}</span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="heading-1 mb-2">Form Management</h1>
            <p className="body-text text-gray-600 dark:text-gray-400">
              Manage form configuration and fields
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/settings">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to System Settings
            </Link>
          </Button>
        </div>
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

        {/* Quick Actions */}
        <div className="card shadow-soft p-6">
          <h3 className="heading-3 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline" size="sm">
              <Link href="/settings">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to System Settings
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/settings/forms">
                View All Forms
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard">
                Go to Dashboard
              </Link>
            </Button>
          </div>
        </div>

        {/* Form Fields Management */}
        <FormFieldManager form={form} />
      </div>
    </div>
  );
}
