import { getCurrentUser } from '@/lib/auth';
import { SystemAutomation } from '@/components/dashboard/SystemAutomation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Settings, Users, Shield, Calendar, Bell, AlertCircle } from 'lucide-react';
import { redirect } from 'next/navigation';
import { isAutomationEnabled } from '@/lib/settings';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default async function AutomationPage() {
  const currentUser = await getCurrentUser();

  // Define IT admin roles for automation access
  const itAdminRoles = ['System Admin', 'IT Admin', 'Technical Admin', 'Client IT Admin'];
  const isITAdmin = itAdminRoles.includes(currentUser.role);

  // Check if automation is enabled in system settings
  const automationEnabled = isAutomationEnabled();

  // Redirect non-IT admins or if automation is disabled
  if (!isITAdmin || !automationEnabled) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              System Automation
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Create and manage automated workflows for your organization
            </p>
          </div>
        </div>

        {/* Automation Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-900">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900">
                  <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Automations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white dark:bg-gray-900">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Bell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Notification Rules</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white dark:bg-gray-900">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900">
                  <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">5</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Compliance Alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white dark:bg-gray-900">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
                  <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Scheduling Rules</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Settings Alert */}
        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            <strong>System Status:</strong> Automation features are currently enabled. 
            You can manage these settings in <a href="/settings" className="underline font-medium">System Settings</a>.
          </AlertDescription>
        </Alert>

        {/* Main Automation Management */}
        <Card className="border-0 shadow-lg bg-white dark:bg-gray-900">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold">
              <Zap className="h-5 w-5 text-indigo-600" />
              Automation Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SystemAutomation />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 