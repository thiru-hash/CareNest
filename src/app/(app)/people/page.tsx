import { PeopleTable } from "@/modules/people/components/PeopleTable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { mockSections } from "@/lib/data";

export default function PeopleWeSupportPage() {
  // Find the section config for 'People We Support'
  const section = mockSections.find(s => s.path === "/people");
  if (!section) return <div>Section not found</div>;

  // First tab: People List
  const peopleListTab = { id: "people-list", name: "People List" };
  // Other tabs from section config
  const otherTabs = section.tabs || [];
  const allTabs = [peopleListTab, ...otherTabs];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">People We Support</h1>
      <Tabs defaultValue={peopleListTab.id} className="w-full">
        <TabsList className="mb-4">
          {allTabs.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id} className="capitalize">
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={peopleListTab.id}>
          <PeopleTable />
        </TabsContent>
        {otherTabs.map(tab => (
          <TabsContent key={tab.id} value={tab.id}>
            <div className="border rounded-lg p-6 bg-muted text-muted-foreground">
              <h2 className="text-lg font-semibold mb-2">{tab.name}</h2>
              <p>Custom form or widget for <span className="font-mono">{tab.name}</span> goes here.</p>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
