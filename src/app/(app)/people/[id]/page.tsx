
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { mockSections } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import ClientProfileCard from '@/components/people/ClientProfileCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DynamicFormRenderer } from '@/components/people/DynamicFormRenderer';
import { AIOverviewPanel } from '@/components/people/AIOverviewPanel';
import { TabConsumer } from '@/components/people/TabConsumer';

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
      {/* Main Content - No top navigation bar, direct content */}
      <div className="w-full">
        <div className="flex flex-col xl:flex-row gap-2 lg:gap-3">
          {/* Left Sidebar - Client Profile Card - Optimized spacing */}
          <div className="xl:w-80 2xl:w-96 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
              <ClientProfileCard client={mockClient} mode="view" />
            </div>
          </div>

          {/* Right Content - AI Overview and Dynamic Tabs - Full width utilization */}
          <div className="flex-1 min-w-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              {/* Tabs Header - Responsive single row */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <TabConsumer 
                  sectionId="sec-people"
                  clientId={id}
                  clientName={mockClient.name}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
