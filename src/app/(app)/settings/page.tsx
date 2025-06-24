import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagement } from "@/components/settings/UserManagement";
import { GroupManagement } from "@/components/settings/GroupManagement";
import { RightsManagement } from "@/components/settings/RightsManagement";
import { SectionManager } from "@/components/settings/SectionManager";
import { FormBuilder } from "@/components/settings/FormBuilder";
import { SystemSettings } from "@/components/settings/SystemSettings";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your organization's settings and configuration.
        </p>
      </div>
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="rights">Rights</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        <TabsContent value="groups">
          <GroupManagement />
        </TabsContent>
        <TabsContent value="rights">
          <RightsManagement />
        </TabsContent>
        <TabsContent value="sections">
          <SectionManager />
        </TabsContent>
        <TabsContent value="forms">
          <FormBuilder />
        </TabsContent>
        <TabsContent value="system">
          <SystemSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
