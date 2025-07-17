"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Calendar, Users, Target, Shield, BookOpen, FileArchive, Heart, DollarSign, ClipboardList, ChevronDown } from "lucide-react";
import { AppSection, CustomForm } from "@/lib/types";
import { getAllForms } from "@/lib/data";
import { DynamicFormRenderer } from "./DynamicFormRenderer";
import { mockContacts } from "@/lib/data/contacts";
import { Contact } from "@/lib/data/contacts";

interface ClientProfileTabsProps {
  client: any;
  section: AppSection;
}

const tabIcons: { [key: string]: any } = {
  "PWS Basic Information": Users,
  "Contacts & Schedule": Calendar,
  "Communication": Users,
  "Goals": Target,
  "Oranga Tamariki": Shield,
  "Daily Diary": BookOpen,
  "Documents": FileArchive,
  "Health": Heart,
  "Financials": DollarSign,
  "Key Worker Report": ClipboardList,
  "Overview": FileText,
};

export function ClientProfileTabs({ client, section }: ClientProfileTabsProps) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const allForms = getAllForms();

  // Ensure section.tabs exists, fallback to empty array
  const sectionTabs = section.tabs || [];

  // Function to get form by ID
  const getFormById = (formId: string): CustomForm | undefined => {
    return allForms.find(form => form.id === formId);
  };

  // Function to get icon for tab
  const getTabIcon = (tabName: string) => {
    return tabIcons[tabName] || FileText;
  };

  // Handle contacts change
  const handleContactsChange = (newContacts: Contact[]) => {
    setContacts(newContacts);
    // In real app, you would save to database here
    console.log('Contacts updated:', newContacts);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Client Profile</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage client information and records</p>
        </div>
      </div>

      {/* Tabs Container */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          {/* Responsive Tabs List */}
          <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="px-6">
              <TabsList className="w-full h-auto bg-transparent border-b border-gray-200 dark:border-gray-700 rounded-none p-0 overflow-x-auto">
                <div className="flex space-x-1 min-w-full">
                  {/* Overview Tab - Always First */}
                  <TabsTrigger 
                    value="Overview" 
                    className="flex items-center space-x-2 px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:bg-transparent rounded-none h-auto"
                  >
                    <FileText className="h-4 w-4 flex-shrink-0" />
                    <span className="whitespace-nowrap">Overview</span>
                  </TabsTrigger>

                  {/* Dynamic Tabs from Section Configuration */}
                  {sectionTabs.map((tab) => {
                    const IconComponent = getTabIcon(tab.name);
                    return (
                      <TabsTrigger 
                        key={tab.id} 
                        value={tab.name} 
                        className="flex items-center space-x-2 px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:bg-transparent rounded-none h-auto"
                      >
                        <IconComponent className="h-4 w-4 flex-shrink-0" />
                        <span className="whitespace-nowrap">{tab.name}</span>
                      </TabsTrigger>
                    );
                  })}
                </div>
              </TabsList>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Overview Tab Content */}
            <TabsContent value="Overview" className="h-full p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Tasks Summary */}
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Recent Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Pending Tasks</span>
                          <Badge variant="outline">3</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Completed Today</span>
                          <Badge variant="default" className="bg-green-500">2</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Documents Summary */}
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Total Documents</span>
                          <Badge variant="outline">12</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Recent Uploads</span>
                          <Badge variant="default" className="bg-green-500">2</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Activity Summary */}
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Last Updated</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Profile Views</span>
                          <Badge variant="outline">15</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Dynamic Tab Content from Forms */}
            {sectionTabs.map((tab) => {
              const form = React.useMemo(() => getFormById(tab.formId), [tab.formId]);
              
              // Special handling for Contacts & Schedule tab
              if (tab.name === "Contacts & Schedule") {
                return (
                  <TabsContent key={tab.id} value={tab.name} className="h-full p-6">
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Calendar className="h-5 w-5" />
                          <span>Contacts & Schedule</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                          <h3 className="text-lg font-medium mb-2">Contacts Management</h3>
                          <p className="text-sm">Contact management functionality will be implemented here.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                );
              }

              if (!form) {
                return (
                  <TabsContent key={tab.id} value={tab.name} className="h-full p-6">
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          {React.createElement(getTabIcon(tab.name), { className: "h-5 w-5" })}
                          <span>{tab.name}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                          <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                          <p className="text-lg font-medium mb-2">No form configuration found</p>
                          <p className="text-sm">Please configure a form in settings to display content here.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                );
              }

              return (
                <TabsContent key={tab.id} value={tab.name} className="h-full p-6">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {React.createElement(getTabIcon(tab.name), { className: "h-5 w-5" })}
                          <span>{tab.name}</span>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-y-auto">
                      <DynamicFormRenderer
                        form={form}
                        mode="view"
                        clientId={client.id}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            })}
          </div>
        </Tabs>
      </div>
    </div>
  );
} 