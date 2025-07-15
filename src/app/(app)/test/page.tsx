'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function TestPage() {
  // Mock data for testing
  const tenant = { name: 'Test Tenant' };
  const user = { name: 'Test User', role: 'Manager' };
  const sections = [
    { id: '1', name: 'Dashboard', path: '/dashboard' },
    { id: '2', name: 'People', path: '/people' }
  ];
  const forms = [
    { id: '1', name: 'Client Form', fields: ['name', 'email', 'phone'] },
    { id: '2', name: 'Staff Form', fields: ['name', 'role', 'department'] }
  ];
  const dashboardAccess = { canView: true, canCreate: false };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Multi-Tenant System Test</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Tenant Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Tenant:</strong> {tenant.name}</p>
          <p><strong>User:</strong> {user.name} ({user.role})</p>
          <p><strong>Available Sections:</strong> {sections.length}</p>
          <p><strong>Available Forms:</strong> {forms.length}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Access Control Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span>Dashboard Access:</span>
              <Badge variant={dashboardAccess.canView ? "default" : "secondary"}>
                {dashboardAccess.canView ? "✓ Can View" : "✗ No Access"}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <span>Dashboard Create:</span>
              <Badge variant={dashboardAccess.canCreate ? "default" : "secondary"}>
                {dashboardAccess.canCreate ? "✓ Can Create" : "✗ No Access"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Sections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {sections.map((section) => (
              <div key={section.id} className="p-2 border rounded">
                <p className="font-medium">{section.name}</p>
                <p className="text-sm text-gray-600">{section.path}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Forms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {forms.map((form) => (
              <div key={form.id} className="p-2 border rounded">
                <p className="font-medium">{form.name}</p>
                <p className="text-sm text-gray-600">{form.fields.length} fields</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 