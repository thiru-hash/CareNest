
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { mockSections, getAllForms } from '@/lib/data';
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  MoreHorizontal
} from 'lucide-react';
import Link from 'next/link';
import ClientProfileCard from '@/components/people/ClientProfileCard';
import { ClientProfileTabs } from '@/components/people/ClientProfileTabs';

// Mock client data - in real app this would come from database
const mockClient = {
  id: "client-1",
  name: "Dianne Russell",
  photo: "https://picsum.photos/150/150?random=1",
  email: "d.russell@gmail.com",
  phone: "(229) 555-0109",
  address: "6301 Elgin St. Celina, Delaware, 10299",
  dateOfBirth: "12/03/1987",
  ndiaNumber: "453211",
  referenceNumber: "123456",
  status: "Active",
  tags: ["Personal", "Company client"],
  insurance: "Yes",
  primaryContact: {
    name: "Ms Juliane Cheng",
    phone: "0400004335",
    email: "Juliane@Gmail.com",
    relation: "Daughter"
  },
  notes: "Client may provide additional documents as test results, MRI, x-ray results. Please, attach them to the client's profile.",
  noteAuthor: "Leslie Alexander",
  noteDate: "15 Apr, 2022"
};

export default async function ClientProfilePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const currentUser = await getCurrentUser();
  
  // Find the section config for 'People We Support'
  const section = mockSections.find(s => s.path === "/people");
  if (!section) return <div>Section not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Simplified Top Navigation Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Back button */}
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
                <Link href="/people">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span>Back to Clients</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className="sm:hidden">
                <Link href="/people">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Right side - Empty for now */}
            <div className="flex items-center space-x-2">
              {/* Removed search bar and other elements */}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full mx-auto">
        <div className="flex flex-col xl:flex-row min-h-[calc(100vh-4rem)]">
          {/* Left Sidebar - Client Profile */}
          <div className="w-full xl:w-80 2xl:w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 xl:border-r-0 xl:border-b">
            <div className="p-4 sm:p-6 xl:p-4 2xl:p-6">
              <ClientProfileCard client={mockClient} mode="edit" />
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 bg-white dark:bg-gray-800 xl:border-l border-gray-200 dark:border-gray-700">
            <div className="h-full">
              <ClientProfileTabs 
                client={mockClient}
                section={section}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button size="lg" className="rounded-full h-14 w-14 p-0 shadow-lg bg-green-500 hover:bg-green-600">
          <MoreHorizontal className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
