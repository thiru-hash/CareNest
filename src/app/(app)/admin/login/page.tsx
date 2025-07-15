'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Building, Users, Settings, Zap, Plus, Eye, Activity } from 'lucide-react';
import { switchUser } from '@/app/actions';

// Product Owner/Admin users
const adminUsers = [
  {
    id: 'admin-1',
    name: 'Tech Team Admin',
    email: 'admin@carenest.com',
    role: 'Product Owner',
    avatar: '/avatars/admin.jpg'
  },
  {
    id: 'admin-2', 
    name: 'Support Engineer',
    email: 'support@carenest.com',
    role: 'Technical Support',
    avatar: '/avatars/support.jpg'
  },
  {
    id: 'admin-3',
    name: 'Sales Manager',
    email: 'sales@carenest.com', 
    role: 'Sales Manager',
    avatar: '/avatars/sales.jpg'
  }
];

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md mx-auto space-y-4">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
              <div className="bg-blue-600 text-white p-3 rounded-full">
                <Shield className="h-8 w-8" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">CareNest Admin Portal</CardTitle>
            <CardDescription>Product Owner & Tech Team Access</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm font-medium text-muted-foreground mb-4">
                Select your role to access the admin portal:
              </div>
              
              <form className="space-y-3">
                <Button type="submit" className="w-full" formAction={switchUser.bind(null, adminUsers[0].id)}>
                  <Shield className="h-4 w-4 mr-2" />
                  🛡️ Product Owner (Tech Team Admin)
                </Button>
                
                <Button type="submit" variant="secondary" className="w-full" formAction={switchUser.bind(null, adminUsers[1].id)}>
                  <Settings className="h-4 w-4 mr-2" />
                  🔧 Technical Support (Support Engineer)
                </Button>
                
                <Button type="submit" variant="outline" className="w-full" formAction={switchUser.bind(null, adminUsers[2].id)}>
                  <Users className="h-4 w-4 mr-2" />
                  💼 Sales Manager
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        {/* Admin Features Card */}
        <Card className="border-dashed border-blue-200 bg-blue-50/50">
          <CardHeader className="text-center pb-3">
            <div className="flex justify-center items-center mb-2">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                <Building className="h-5 w-5" />
              </div>
            </div>
            <CardTitle className="text-lg">Admin Capabilities</CardTitle>
            <CardDescription>Manage client organizations and configurations</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 text-xs text-blue-700">
              <div className="flex items-center space-x-2">
                <Plus className="h-3 w-3" />
                <span>Create new client organizations</span>
              </div>
              <div className="flex items-center space-x-2">
                <Settings className="h-3 w-3" />
                <span>Configure client-side apps</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-3 w-3" />
                <span>Manage user access and roles</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-3 w-3" />
                <span>Deploy and monitor instances</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Client Access Card */}
        <Card className="border-dashed border-green-200 bg-green-50/50">
          <CardHeader className="text-center pb-3">
            <div className="flex justify-center items-center mb-2">
              <div className="bg-green-100 text-green-600 p-2 rounded-full">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <CardTitle className="text-lg">Client Access</CardTitle>
            <CardDescription>Access client instances for support</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 text-xs text-green-700">
              <div className="flex items-center space-x-2">
                <Eye className="h-3 w-3" />
                <span>View client dashboards</span>
              </div>
              <div className="flex items-center space-x-2">
                <Settings className="h-3 w-3" />
                <span>Configure client settings</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-3 w-3" />
                <span>Manage client permissions</span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="h-3 w-3" />
                <span>Monitor client usage</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 