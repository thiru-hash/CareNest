'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { RBACControlDashboard } from "@/components/rbac/RBACControlDashboard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, Database, Settings } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { databaseAutomation, type DatabaseField } from "@/lib/database-automation";
import { getTerm } from "@/lib/terminology";

// Define IT admin roles that can access system settings
const IT_ADMIN_ROLES = [
  'System Admin', 
  'IT Admin', 
  'Technical Admin', 
  'Client IT Admin',
  'Platform Admin',
  'CareNest Owner',
  'CareNest Tech Team'
];

// Define client admin roles that can customize their tenant
const CLIENT_ADMIN_ROLES = [
  'Client Company Admin',
  'Tenant Admin',
  'Client IT Admin'
];

interface SettingsAccessControl {
  isITAdmin: boolean;
  isClientAdmin: boolean;
  canAccessSystemSettings: boolean;
  canCustomizeTenant: boolean;
  userRole: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [accessControl, setAccessControl] = useState<SettingsAccessControl>({
    isITAdmin: false,
    isClientAdmin: false,
    canAccessSystemSettings: false,
    canCustomizeTenant: false,
    userRole: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate getting current user (in real app, this would come from auth context)
    const getCurrentUser = async () => {
      try {
        // Mock user - in real app this would come from your auth system
        const mockUser = {
          id: 'user-1',
          name: 'Thirumurthi',
          email: 'thiru@carenest.com',
          role: 'System Admin', // Change this to test different roles
          tenantId: 'tenant-1'
        };

        const isITAdmin = IT_ADMIN_ROLES.includes(mockUser.role);
        const isClientAdmin = CLIENT_ADMIN_ROLES.includes(mockUser.role);
        const canAccessSystemSettings = isITAdmin || isClientAdmin;
        const canCustomizeTenant = isClientAdmin;

        setAccessControl({
          isITAdmin,
          isClientAdmin,
          canAccessSystemSettings,
          canCustomizeTenant,
          userRole: mockUser.role
        });

        // If user doesn't have access, redirect to dashboard
        if (!canAccessSystemSettings) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access System Settings. Only IT admins and app admins can access this section.",
            variant: "destructive"
          });
          router.push('/dashboard');
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error getting current user:', error);
        router.push('/dashboard');
      }
    };

    getCurrentUser();
  }, [router, toast]);

  // Function to handle automatic database creation
  const handleDatabaseCreation = async (sectionName: string, formData: any) => {
    try {
      console.log('Creating database table for:', sectionName, formData);
      
      // Convert form fields to database fields
      const databaseFields: DatabaseField[] = Object.entries(formData.fields || {}).map(([fieldName, fieldConfig]: [string, any]) => ({
        name: fieldName,
        type: fieldConfig.type || 'text',
        required: fieldConfig.required || false,
        maxLength: fieldConfig.maxLength,
        options: fieldConfig.options,
        defaultValue: fieldConfig.defaultValue
      }));

      // Use the database automation service
      const result = await databaseAutomation.createDatabaseTable(sectionName, databaseFields);

      if (result.success) {
        toast({
          title: "Database Created Successfully",
          description: `Successfully created database table for "${sectionName}" with ${databaseFields.length} fields. The new section is now ready to use.`,
        });

        console.log('Generated SQL:', result.sql);
      } else {
        throw new Error(result.error || 'Database creation failed');
      }

    } catch (error) {
      console.error('Error creating database table:', error);
      toast({
        title: "Database Creation Failed",
        description: error instanceof Error ? error.message : "There was an error creating the database table. Please contact your IT administrator.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Settings className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading System Settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Access Control Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-muted-foreground">
            {accessControl.isITAdmin 
              ? "Manage system-wide settings and configuration for IT admins."
              : "Customize your organization's settings and configuration."
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">
            {accessControl.userRole}
          </span>
        </div>
      </div>

      {/* Access Level Indicator */}
      <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          <strong>Access Level:</strong> {
            accessControl.isITAdmin 
              ? "IT Admin - Full system access and configuration"
              : accessControl.isClientAdmin
              ? "Client Admin - Organization customization access"
              : "No Access - Redirected to dashboard"
          }
        </AlertDescription>
      </Alert>

      {/* Database Automation Notice */}
      <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
        <Database className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800 dark:text-green-200">
          <strong>Database Automation:</strong> When you create new sections and forms, 
          the system will automatically create corresponding database tables. This ensures 
          data integrity and proper storage for all custom configurations.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-9">
          <TabsTrigger value="users">{getTerm('users')}</TabsTrigger>
          <TabsTrigger value="groups">{getTerm('groups')}</TabsTrigger>
          <TabsTrigger value="roles">{getTerm('roles')}</TabsTrigger>
          <TabsTrigger value="rights">{getTerm('rights')}</TabsTrigger>
          <TabsTrigger value="sections">{getTerm('sections')}</TabsTrigger>
          <TabsTrigger value="forms">{getTerm('forms')}</TabsTrigger>
          <TabsTrigger value="notices">Notices</TabsTrigger>
          <TabsTrigger value="rbac">RBAC</TabsTrigger>
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
          <SectionManager onDatabaseCreation={handleDatabaseCreation} />
        </TabsContent>
        <TabsContent value="forms">
          <FormBuilder onDatabaseCreation={handleDatabaseCreation} />
        </TabsContent>
        <TabsContent value="notices">
          <NoticeManagement />
        </TabsContent>
        <TabsContent value="rbac">
          <RBACControlDashboard organizationId="org_1" />
        </TabsContent>
        <TabsContent value="system">
          <SystemSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
