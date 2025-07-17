
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
  
  // Find the section config for People We Support'
  const section = mockSections.find(s => s.path === "/people");
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
          <div className="lg:w-80 2xl:w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 lg:border-b-0 lg:border-r">
            <ClientProfileCard client={mockClient} mode="view" />
          </div>

          {/* Right Content - Overview */}
          <div className="flex-1 min-w-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              {/* Overview Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-xl font-semibold text-gray-90 dark:text-white">Overview</h1>
                <p className="text-sm text-gray-60 dark:text-gray-400 mt-1">Client information and recent activity</p>
              </div>

              {/* Overview Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Latest Tasks */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-90 dark:text-white">Latest tasks</h3>
                      <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700">
                        Show all
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                          <p className="text-sm text-gray-90 dark:text-white">Contact client for outstanding invoices (Monthly)</p>
                          <span className="inline-block mt-1 px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Mon, 16 Aug</span>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                          <p className="text-sm text-gray-90 dark:text-white">Share consultation forms before the next appointment</p>
                          <span className="inline-block mt-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Tue, 25 Aug</span>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                          <p className="text-sm text-gray-90 dark:text-white">Schedule next personal consultation</p>
                          <span className="inline-block mt-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Wed, 26 Aug</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pinned Documents */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-90 dark:text-white">Pinned documents & files</h3>
                    <div className="space-y-3">
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6-4h6m2 5H7a2 0 01-2-2V7a2 0 012-2h11a2 0 012 2v11a2 0 01-2 2H7a2 0 01-2-2v-5m-1.414.414 201120.828 2.82811.828 15H9v-20.828l8.586-8.586z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-90 dark:text-white">Client intake form</p>
                            <p className="text-xs text-gray-50 dark:text-gray-400">submitted on 15</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6-4h6m2 5H7a2 0 01-2-2V7a2 0 012-2h11a2 0 012 2v11a2 0 01-2 2H7a2 0 01-2-2v-5m-1.414.414 201120.828 2.82811.828 15H9v-20.828l8.586-8.586z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-90 dark:text-white">Treatment plan</p>
                            <p className="text-xs text-gray-50 dark:text-gray-400">submitted on 18</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Latest Activity */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-90 dark:text-white">Latest activity</h3>
                      <Button variant="ghost" size="sm" className="text-xs text-gray-500 hover:text-gray-700">
                        <svg className="w-4 fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6-4h6m2 5H7a2 0 01-2-2V7a2 0 012-2h11a2 0 012 2v11a2 0 01-2 2H7a2 0 01-2-2v-5m-1.414.414 201120.828 2.82811.828 15H9v-20.828l8.586-8.586z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-90 dark:text-white">
                            <span className="font-medium">Leslie Alexander</span> added new file Primary questionnaire
                          </p>
                          <p className="text-xs text-gray-50 dark:text-gray-400 mt-1">submitted on 15</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 0 00-2 2v11a2 0 002 2h11a2 0 002-2V7a2 0 00-2-2h-5m-1.414.414 201120.828 2.82811.828 15H9v-20.828l8.586-8.586z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-90 dark:text-white">
                            <span className="font-medium">Devon Lane</span> updated personal client information
                          </p>
                          <p className="text-xs text-gray-50 dark:text-gray-400 mt-1">submitted on 18</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m-9 8h10M5 21h14a2 0 002-2V7a2 0 00-2-2H5a2 0 00-2 2a2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-90 dark:text-white">
                            <span className="font-medium">Marvin McKinney</span> requested an appointment for Personal consultation service
                          </p>
                          <p className="text-xs text-gray-50 dark:text-gray-400 mt-1">submitted on 18</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
