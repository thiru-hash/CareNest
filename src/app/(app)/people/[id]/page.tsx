
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { mockSections } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import ClientProfileCard from '@/components/people/ClientProfileCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

// AI-generated overview data
const generateOverviewData = (client: typeof mockClient) => {
  return {
    tasks: [
      { id: 1, title: 'Contact client for outstanding invoices (Monthly)', date: 'Mon, 16 Aug', status: 'overdue', color: 'red' },
      { id: 2, title: 'Share consultation forms before the next appointment', date: 'Tue, 25 Aug', status: 'pending', color: 'green' },
      { id: 3, title: 'Schedule next personal consultation', date: 'Wed, 26 Aug', status: 'completed', color: 'green' },
    ],
    documents: [
      { id: 1, name: 'Client intake form', date: '15 Apr, 2022', type: 'form', gradient: 'from-blue-50 to-purple-50' },
      { id: 2, name: 'Treatment plan', date: '18 Apr, 2022', type: 'plan', gradient: 'from-orange-50 to-yellow-50' },
      { id: 3, name: 'Insurance certificate', date: '24 Apr, 2022', type: 'certificate', gradient: 'from-green-50 to-blue-50' },
    ],
    activities: [
      { id: 1, user: 'Leslie Alexander', action: 'added new file Primary questionnaire', time: '1 day ago', icon: 'document' },
      { id: 2, user: 'Devon Lane', action: 'updated personal client information', time: '3 days ago', icon: 'edit' },
      { id: 3, user: 'Marvin McKinney', action: 'requested an appointment for Personal consultation service', time: '5 days ago', icon: 'calendar' },
    ]
  };
};

export default async function ClientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const currentUser = await getCurrentUser();
  const section = mockSections.find((s) => s.path === '/people');
  
  if (!section) return <div>Section not found</div>;

  const overviewData = generateOverviewData(mockClient);

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

          {/* Right Content - Overview and Tabs */}
          <div className="flex-1 min-w-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              {/* Tabs Header */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="w-full justify-start bg-transparent border-b-0 h-auto p-0">
                    <TabsTrigger 
                      value="overview" 
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-950 dark:data-[state=active]:text-blue-300"
                    >
                      Overview
                    </TabsTrigger>
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

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Latest Tasks */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Latest tasks</h3>
                          <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700">
                            Show all
                          </Button>
                        </div>
                        <div className="space-y-3">
                          {overviewData.tasks.map((task) => (
                            <div key={task.id} className="flex items-start space-x-3">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900 dark:text-white">{task.title}</p>
                                <Badge 
                                  variant="secondary" 
                                  className={`mt-1 text-xs bg-${task.color}-100 text-${task.color}-800 dark:bg-${task.color}-900 dark:text-${task.color}-200`}
                                >
                                  {task.date}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pinned Documents */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Pinned documents & files</h3>
                        <div className="space-y-3">
                          {overviewData.documents.map((doc) => (
                            <div key={doc.id} className={`bg-gradient-to-r ${doc.gradient} dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4`}>
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6-4h6m2 5H7a2 0 01-2-2V7a2 0 012-2h11a2 0 012 2v11a2 0 01-2 2H7a2 0 01-2-2v-5" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">{doc.name}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Submitted on {doc.date}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Latest Activity */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Latest activity</h3>
                          <Button variant="ghost" size="sm" className="text-xs text-gray-500 hover:text-gray-700">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </Button>
                        </div>
                        <div className="space-y-3">
                          {overviewData.activities.map((activity) => (
                            <div key={activity.id} className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6-4h6m2 5H7a2 0 01-2-2V7a2 0 012-2h11a2 0 012 2v11a2 0 01-2 2H7a2 0 01-2-2v-5" />
                                </svg>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900 dark:text-white">
                                  <span className="font-medium">{activity.user}</span> {activity.action}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

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
