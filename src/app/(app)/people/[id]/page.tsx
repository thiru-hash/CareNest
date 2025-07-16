
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { mockSections, getAllForms } from '@/lib/data';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DynamicFormRenderer } from "@/components/people/DynamicFormRenderer";
import { 
  ArrowLeft, 
  Edit, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  User, 
  FileText, 
  DollarSign, 
  Users, 
  ChevronRight,
  Plus,
  CheckCircle,
  Clock,
  Download,
  MoreHorizontal,
  Star
} from 'lucide-react';
import Link from 'next/link';

// Mock client data - in real app this would come from database
const mockClient = {
  id: "client-1",
  name: "Dianne Russell",
  photo: "/api/placeholder/150/150",
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

// Mock tasks data
const mockTasks = [
  {
    id: 1,
    title: "Contact client for outstanding invoices (Monthly)",
    dueDate: "Mon, 16 Aug",
    priority: "high",
    completed: false
  },
  {
    id: 2,
    title: "Share consultation forms before the next appointment",
    dueDate: "Tue, 25 Aug",
    priority: "medium",
    completed: false
  },
  {
    id: 3,
    title: "Schedule next personal consultation",
    dueDate: "Wed, 26 Aug",
    priority: "medium",
    completed: false
  }
];

// Mock documents data
const mockDocuments = [
  {
    id: 1,
    title: "Client intake form",
    type: "document",
    submittedDate: "15 Apr, 2022",
    color: "blue"
  },
  {
    id: 2,
    title: "Treatment plan",
    type: "document",
    submittedDate: "18 Apr, 2022",
    color: "yellow"
  }
];

// Mock activity data
const mockActivity = [
  {
    id: 1,
    action: "Leslie Alexander added new file Primary questionnaire",
    time: "1 day ago"
  },
  {
    id: 2,
    action: "Devon Lane updated personal client information",
    time: "3 days ago"
  },
  {
    id: 3,
    action: "Marvin McKinney requested an appointment for Personal consultation service",
    time: "5 days ago"
  }
];

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

  // Get all forms for this section
  const sectionForms = getAllForms().filter(form => form.linkedSectionId === section.id);
  
  // Create tabs: Basic Info (first tab) + dynamic tabs from section config
  const basicInfoTab = { id: "basic-info", name: "Basic Information", formId: "form-basic-info" };
  const otherTabs = section.tabs || [];
  const allTabs = [basicInfoTab, ...otherTabs];

  // Find forms for each tab
  const getFormForTab = (tabId: string) => {
    if (tabId === "basic-info") {
      // Return a basic info form
      return {
        id: "form-basic-info",
        name: "Basic Information",
        linkedSectionId: section.id,
        status: "Active",
        fields: [
          { id: "full-name", name: "Full Name", type: "text", order: 1, required: true, status: "Active", visibleRoles: [] },
          { id: "email", name: "Email", type: "email", order: 2, required: true, status: "Active", visibleRoles: [] },
          { id: "phone", name: "Phone", type: "phone", order: 3, required: true, status: "Active", visibleRoles: [] },
          { id: "date-of-birth", name: "Date of Birth", type: "dob", order: 4, status: "Active", visibleRoles: [] },
          { id: "ndia-number", name: "NDIA Number", type: "text", order: 5, status: "Active", visibleRoles: [] },
          { id: "address", name: "Address", type: "textbox", order: 6, status: "Active", visibleRoles: [] }
        ]
      };
    }
    
    // Find form by formId in tab config
    const tab = otherTabs.find(t => t.id === tabId);
    if (tab?.formId) {
      return sectionForms.find(f => f.id === tab.formId);
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/people">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Clients list
                </Link>
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Client Profile & Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Client Profile Card */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Avatar className="h-20 w-20 mx-auto mb-4">
                    <AvatarImage src={mockClient.photo} alt={mockClient.name} />
                    <AvatarFallback className="text-xl">
                      {mockClient.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{mockClient.name}</h2>
                </div>

                {/* Client Details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Email</span>
                    <a href={`mailto:${mockClient.email}`} className="text-sm font-medium text-blue-600 hover:underline">
                      {mockClient.email}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Phone</span>
                    <a href={`tel:${mockClient.phone}`} className="text-sm font-medium text-blue-600 hover:underline">
                      {mockClient.phone}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Date of birth</span>
                    <span className="text-sm font-medium">{mockClient.dateOfBirth}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Home address</span>
                    <span className="text-sm font-medium text-right">{mockClient.address}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Insurance</span>
                    <span className="text-sm font-medium">{mockClient.insurance}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Tags</span>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {mockClient.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Assigned Experts */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Assigned experts</span>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <ChevronRight className="h-4 w-4 mr-2" />
                    <span>View assigned experts</span>
                  </div>
                </div>

                {/* Notes */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Notes</span>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{mockClient.notes}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{mockClient.noteAuthor}</span>
                      <span>{mockClient.noteDate}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Content Area */}
          <div className="lg:col-span-3">
            {/* Tabs Navigation */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
              <Tabs defaultValue="overview" className="w-full">
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <TabsList className="h-auto p-0 bg-transparent border-b-0 rounded-none">
                    <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-6 py-4">
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="tasks" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-6 py-4">
                      Tasks 6
                    </TabsTrigger>
                    <TabsTrigger value="appointments" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-6 py-4">
                      Appointments 3
                    </TabsTrigger>
                    <TabsTrigger value="billing" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-6 py-4">
                      Billing 3
                    </TabsTrigger>
                    <TabsTrigger value="notes" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-6 py-4">
                      Notes 1
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-6 py-4">
                      Documents 4
                    </TabsTrigger>
                    <TabsTrigger value="files" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-6 py-4">
                      Files 2
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <div className="p-6">
                  <TabsContent value="overview" className="mt-0 space-y-6">
                    {/* Latest Tasks */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Latest tasks</h3>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                          Show all
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {mockTasks.map(task => (
                          <div key={task.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{task.title}</p>
                              <p className="text-xs text-gray-500">{task.dueDate}</p>
                            </div>
                            <Badge 
                              variant={task.priority === 'high' ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              {task.dueDate}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pinned Documents & Files */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Pinned documents & files</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mockDocuments.map(doc => (
                          <div key={doc.id} className={`p-4 rounded-lg text-white ${
                            doc.color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gradient-to-r from-yellow-500 to-orange-600'
                          }`}>
                            <div className="flex items-center space-x-3">
                              <FileText className="h-8 w-8" />
                              <div className="flex-1">
                                <p className="font-medium">{doc.title}</p>
                                <p className="text-sm opacity-90">Submitted {doc.submittedDate}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Latest Activity */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Latest activity</h3>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {mockActivity.map(activity => (
                          <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm">{activity.action}</p>
                              <p className="text-xs text-gray-500">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="tasks" className="mt-0">
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Tasks management coming soon...</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="appointments" className="mt-0">
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Appointments management coming soon...</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="billing" className="mt-0">
                    <div className="text-center py-8">
                      <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Billing management coming soon...</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="notes" className="mt-0">
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Notes management coming soon...</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="documents" className="mt-0">
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Documents management coming soon...</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="files" className="mt-0">
                    <div className="text-center py-8">
                      <Download className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Files management coming soon...</p>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <Button size="lg" className="rounded-full h-14 w-14 p-0 shadow-lg">
          <MoreHorizontal className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
