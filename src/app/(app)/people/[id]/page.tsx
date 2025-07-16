
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { mockSections, getAllForms } from '@/lib/data';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DynamicFormRenderer } from "@/components/people/DynamicFormRenderer";
import { ArrowLeft, Edit, Phone, Mail, MapPin, Calendar, User, FileText, DollarSign, Users } from 'lucide-react';
import Link from 'next/link';

// Mock client data - in real app this would come from database
const mockClient = {
  id: "client-1",
  name: "Mr Colin Cheng",
  photo: "/api/placeholder/150/150",
  email: "colin.cheng@email.com",
  phone: "0400 123 456",
  address: "2/211 Chandler Rd, Noble Park VIC 3174, Australia",
  dateOfBirth: "15/03/1945",
  ndiaNumber: "453211",
  referenceNumber: "123456",
  status: "Active",
  tags: ["Personal", "NDIS"],
  primaryContact: {
    name: "Ms Juliane Cheng",
    phone: "0400004335",
    email: "Juliane@Gmail.com",
    relation: "Daughter"
  }
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/people">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to People
                </Link>
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  People We Support
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Client Profile
                </p>
              </div>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile & Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={mockClient.photo} alt={mockClient.name} />
                    <AvatarFallback className="text-2xl">
                      {mockClient.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl">{mockClient.name}</CardTitle>
                <div className="flex justify-center space-x-2 mt-2">
                  {mockClient.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{mockClient.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{mockClient.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{mockClient.address}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">DOB: {mockClient.dateOfBirth}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">NDIA Number:</span>
                      <span className="font-medium">{mockClient.ndiaNumber}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Reference Number:</span>
                      <span className="font-medium">{mockClient.referenceNumber}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Primary Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Primary Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Name:</span>
                    <span className="font-medium">{mockClient.primaryContact.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Phone:</span>
                    <span className="font-medium">{mockClient.primaryContact.phone}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Email:</span>
                    <span className="font-medium">{mockClient.primaryContact.email}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Relation:</span>
                    <span className="font-medium">{mockClient.primaryContact.relation}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Dynamic Tabs */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <Tabs defaultValue={basicInfoTab.id} className="w-full">
                  <div className="border-b border-gray-200 dark:border-gray-700">
                    <TabsList className="h-auto p-0 bg-transparent border-b-0 rounded-none">
                      {allTabs.map(tab => (
                        <TabsTrigger 
                          key={tab.id} 
                          value={tab.id} 
                          className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-4"
                        >
                          {tab.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>
                  
                  <div className="p-6">
                    {allTabs.map(tab => {
                      const form = getFormForTab(tab.id);
                      
                      return (
                        <TabsContent key={tab.id} value={tab.id} className="mt-0">
                          {form ? (
                            <DynamicFormRenderer 
                              form={form}
                              clientId={id}
                              mode="view"
                              onSave={(data) => {
                                console.log('Form data saved:', data);
                                // In real app, save to database
                              }}
                            />
                          ) : (
                            <div className="space-y-6">
                              <div>
                                <h3 className="text-lg font-semibold mb-4">{tab.name}</h3>
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
                                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                                    No form configured for <strong>{tab.name}</strong>
                                  </p>
                                  <p className="text-sm text-gray-400">
                                    Create a form in Settings → Forms Management and link it to this tab.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </TabsContent>
                      );
                    })}
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
