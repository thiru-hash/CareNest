
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagement } from "@/components/settings/UserManagement";
import { GroupManagement } from "@/components/settings/GroupManagement";
import { RightsManagement } from "@/components/settings/RightsManagement";
import { SectionManager } from "@/components/settings/SectionManager";
import { RoleManagement } from "@/components/settings/RoleManagement";
import { FormBuilder } from "@/components/settings/FormBuilder";
import { SystemSettings } from "@/components/settings/SystemSettings";
import { NoticeManagement } from "@/components/settings/NoticeManagement";
import { DashboardCustomization } from "@/components/settings/DashboardCustomization";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">System Settings</h1>
        <p className="text-muted-foreground">
          Manage system-wide settings and configuration for app admins.
        </p>
      </div>
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-9">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="rights">Rights</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="notices">Notices</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        <TabsContent value="groups">
          <GroupManagement />
        </TabsContent>
        <TabsContent value="roles">
          <RoleManagement />
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
        <TabsContent value="notices">
          <NoticeManagement />
        </TabsContent>
        <TabsContent value="dashboard">
          <DashboardCustomization />
        </TabsContent>
        <TabsContent value="system">
          <SystemSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
