'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIOverviewPanel } from '@/components/people/AIOverviewPanel';
import { DynamicFormTab } from '@/components/people/DynamicFormTab';
import { useTabContext } from '@/lib/tab-context';

interface TabConsumerProps {
  sectionId: string;
  clientId: string;
  clientName: string;
}

export function TabConsumer({ sectionId, clientId, clientName }: TabConsumerProps) {
  const { getSectionTabs } = useTabContext();
  const tabs = getSectionTabs(sectionId);

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="w-full justify-start bg-transparent border-b-0 h-auto p-0 flex-wrap overflow-x-auto">
        <TabsTrigger 
          value="overview" 
          className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-950 dark:data-[state=active]:text-blue-300 flex-shrink-0 whitespace-nowrap"
        >
          AI Overview
        </TabsTrigger>
        {tabs.map((tab) => (
          <TabsTrigger 
            key={tab.id} 
            value={tab.id}
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-950 dark:data-[state=active]:text-blue-300 flex-shrink-0 whitespace-nowrap"
          >
            {tab.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* AI Overview Tab - Default */}
      <TabsContent value="overview" className="p-4 lg:p-6">
        <AIOverviewPanel clientId={clientId} clientName={clientName} />
      </TabsContent>

      {/* Dynamic Tabs from Section Management */}
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="p-4 lg:p-6">
          <DynamicFormTab
            tabId={tab.id}
            tabName={tab.name}
            formId={tab.formId}
            clientId={clientId}
            clientName={clientName}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
} 