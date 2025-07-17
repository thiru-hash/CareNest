
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { mockSections } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import ClientProfileCard from '@/components/people/ClientProfileCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DynamicFormRenderer } from '@/components/people/DynamicFormRenderer';

// Mock client data - in real app this would come from database
const mockClient = {
  id: 'client-1',
  name: 'Dianne Russell',
  photo: 'https://picsum.photos/150/150?random=1',
  email: 'd.russell@gmail.com',
  phone: '(229) 555-0109',
  address: '6301 Elgin St. Celina, Delaware, 10299',
  dateOfBirth: '12/03/1987',
  ndiaNumber: '453211',
  referenceNumber: '123456',
  status: 'Active',
  tags: ['Personal', 'Company client'],
  insurance: 'Yes',
  primaryContact: {
    name: 'Ms Juliane Cheng',
    phone: '0400004335',
    email: 'Juliane@Gmail.com',
    relation: 'Daughter',
  },
  notes: "Client may provide additional documents as test results, MRI, x-ray results. Please, attach them to the client's profile.",
  noteAuthor: 'Leslie Alexander',
  noteDate: '15 Apr, 2022',
};

export default async function ClientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const currentUser = await getCurrentUser();
  const section = mockSections.find((s) => s.path === '/people');
  
  if (!section) return <div>Section not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Back button */}
            <div className="flex items-center space-x-4">
              <Link href="/people">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Clients list</span>
                </Button>
              </Link>
            </div>
            {/* Right side - Actions */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Client Profile Card */}
          <div className="lg:w-80 2xl:w-96 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <ClientProfileCard client={mockClient} mode="view" />
            </div>
          </div>

          {/* Right Content - Dynamic Tabs from Section Management */}
          <div className="flex-1 min-w-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              {/* Tabs Header */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <Tabs defaultValue={section.tabs?.[0]?.id || "overview"} className="w-full">
                  <TabsList className="w-full justify-start bg-transparent border-b-0 h-auto p-0">
                    {section.tabs?.map((tab) => (
                      <TabsTrigger 
                        key={tab.id} 
                        value={tab.id}
                        className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-950 dark:data-[state=active]:text-blue-300"
                      >
                        {tab.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {/* Dynamic Tabs from Section Management */}
                  {section.tabs?.map((tab) => (
                    <TabsContent key={tab.id} value={tab.id} className="p-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>{tab.name}</CardTitle>
                          {tab.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">{tab.description}</p>
                          )}
                        </CardHeader>
                        <CardContent>
                          {tab.formId ? (
                            <DynamicFormRenderer 
                              formId={tab.formId} 
                              clientId={id}
                              mode="view"
                            />
                          ) : (
                            <div className="text-center py-8">
                              <p className="text-gray-500 dark:text-gray-400">
                                No form assigned to this tab. Configure in System Settings > Sections.
                              </p>
                              <p className="text-sm text-gray-400 mt-2">
                                Go to Settings → Sections → Edit "People We Support" → Add tabs and assign forms.
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
