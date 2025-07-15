'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Settings, 
  Users, 
  Building, 
  Globe, 
  Shield, 
  Activity,
  Eye,
  Edit,
  Trash2,
  Copy,
  Download,
  Upload,
  Zap
} from 'lucide-react';
import { mockTenants } from '@/lib/data/tenants';

interface ClientOrganization {
  id: string;
  name: string;
  slug: string;
  domain: string;
  status: 'active' | 'inactive' | 'suspended';
  plan: 'basic' | 'professional' | 'enterprise';
  users: number;
  clients: number;
  locations: number;
  createdAt: Date;
  lastActive: Date;
  settings: {
    branding: {
      logo: string;
      primaryColor: string;
      companyName: string;
    };
    features: {
      automation: boolean;
      advancedReporting: boolean;
      customForms: boolean;
      apiAccess: boolean;
    };
    modules: {
      roster: boolean;
      people: boolean;
      finance: boolean;
      timesheet: boolean;
      compliance: boolean;
      automation: boolean;
    };
  };
}

export default function AdminDashboard() {
  const [organizations, setOrganizations] = useState<ClientOrganization[]>(
    mockTenants.map(tenant => ({
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      domain: tenant.domain,
      status: tenant.status as 'active' | 'inactive' | 'suspended',
      plan: 'professional' as const,
      users: 15,
      clients: 120,
      locations: 8,
      createdAt: tenant.createdAt,
      lastActive: tenant.updatedAt,
      settings: tenant.settings
    }))
  );

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<ClientOrganization | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return 'bg-purple-100 text-purple-800';
      case 'professional':
        return 'bg-blue-100 text-blue-800';
      case 'basic':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const createOrganization = (orgData: Partial<ClientOrganization>) => {
    const newOrg: ClientOrganization = {
      id: `org-${Date.now()}`,
      name: orgData.name || '',
      slug: orgData.slug || '',
      domain: orgData.domain || '',
      status: 'active',
      plan: 'basic',
      users: 0,
      clients: 0,
      locations: 0,
      createdAt: new Date(),
      lastActive: new Date(),
      settings: {
        branding: {
          logo: '',
          primaryColor: '#10B981',
          companyName: orgData.name || ''
        },
        features: {
          automation: false,
          advancedReporting: false,
          customForms: false,
          apiAccess: false
        },
        modules: {
          roster: true,
          people: true,
          finance: false,
          timesheet: true,
          compliance: true,
          automation: false
        }
      },
      ...orgData
    };

    setOrganizations(prev => [...prev, newOrg]);
    setIsCreateDialogOpen(false);
  };

  const updateOrganization = (orgId: string, updates: Partial<ClientOrganization>) => {
    setOrganizations(prev =>
      prev.map(org =>
        org.id === orgId ? { ...org, ...updates } : org
      )
    );
  };

  const deleteOrganization = (orgId: string) => {
    setOrganizations(prev => prev.filter(org => org.id !== orgId));
  };

  const generateClientConfig = (org: ClientOrganization) => {
    return {
      tenantId: org.id,
      tenantName: org.name,
      domain: org.domain,
      branding: org.settings.branding,
      features: org.settings.features,
      modules: org.settings.modules
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Product Owner Dashboard</h1>
          <p className="text-muted-foreground">
            Manage client organizations and configure their instances
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Organization
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total Organizations</p>
                <p className="text-2xl font-bold">{organizations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Active Users</p>
                <p className="text-2xl font-bold">
                  {organizations.reduce((sum, org) => sum + org.users, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Active Organizations</p>
                <p className="text-2xl font-bold">
                  {organizations.filter(org => org.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Enterprise Plans</p>
                <p className="text-2xl font-bold">
                  {organizations.filter(org => org.plan === 'enterprise').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Organizations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Client Organizations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.map((org) => (
                <TableRow key={org.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{org.name}</div>
                      <div className="text-sm text-muted-foreground">{org.slug}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Globe className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{org.domain}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPlanColor(org.plan)}>
                      {org.plan}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(org.status)}>
                      {org.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {org.users} users
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {org.lastActive.toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrg(org)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const config = generateClientConfig(org);
                          console.log('Client config:', config);
                          // In real app, this would download a config file
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const config = generateClientConfig(org);
                          navigator.clipboard.writeText(JSON.stringify(config, null, 2));
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Organization Details Dialog */}
      {selectedOrg && (
        <Dialog open={!!selectedOrg} onOpenChange={() => setSelectedOrg(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedOrg.name} - Configuration</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="branding">Branding</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="modules">Modules</TabsTrigger>
                <TabsTrigger value="config">Client Config</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Organization Name</Label>
                    <Input
                      value={selectedOrg.name}
                      onChange={(e) => updateOrganization(selectedOrg.id, { name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Domain</Label>
                    <Input
                      value={selectedOrg.domain}
                      onChange={(e) => updateOrganization(selectedOrg.id, { domain: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Plan</Label>
                    <Select
                      value={selectedOrg.plan}
                      onValueChange={(value) => updateOrganization(selectedOrg.id, { plan: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select
                      value={selectedOrg.status}
                      onValueChange={(value) => updateOrganization(selectedOrg.id, { status: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="branding" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Company Name</Label>
                    <Input
                      value={selectedOrg.settings.branding.companyName}
                      onChange={(e) => updateOrganization(selectedOrg.id, {
                        settings: {
                          ...selectedOrg.settings,
                          branding: {
                            ...selectedOrg.settings.branding,
                            companyName: e.target.value
                          }
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Primary Color</Label>
                    <Input
                      type="color"
                      value={selectedOrg.settings.branding.primaryColor}
                      onChange={(e) => updateOrganization(selectedOrg.id, {
                        settings: {
                          ...selectedOrg.settings,
                          branding: {
                            ...selectedOrg.settings.branding,
                            primaryColor: e.target.value
                          }
                        }
                      })}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="features" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(selectedOrg.settings.features).map(([feature, enabled]) => (
                    <div key={feature} className="flex items-center justify-between">
                      <Label className="text-sm capitalize">
                        {feature.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </Label>
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => updateOrganization(selectedOrg.id, {
                          settings: {
                            ...selectedOrg.settings,
                            features: {
                              ...selectedOrg.settings.features,
                              [feature]: e.target.checked
                            }
                          }
                        })}
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="modules" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(selectedOrg.settings.modules).map(([module, enabled]) => (
                    <div key={module} className="flex items-center justify-between">
                      <Label className="text-sm capitalize">
                        {module.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </Label>
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => updateOrganization(selectedOrg.id, {
                          settings: {
                            ...selectedOrg.settings,
                            modules: {
                              ...selectedOrg.settings.modules,
                              [module]: e.target.checked
                            }
                          }
                        })}
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="config" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Client Configuration</h4>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const config = generateClientConfig(selectedOrg);
                          navigator.clipboard.writeText(JSON.stringify(config, null, 2));
                        }}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Config
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const config = generateClientConfig(selectedOrg);
                          const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${selectedOrg.slug}-config.json`;
                          a.click();
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="text-sm overflow-auto">
                      {JSON.stringify(generateClientConfig(selectedOrg), null, 2)}
                    </pre>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Organization Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Organization</DialogTitle>
          </DialogHeader>
          <CreateOrganizationForm
            onSubmit={createOrganization}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CreateOrganizationForm({ onSubmit, onCancel }: {
  onSubmit: (orgData: Partial<ClientOrganization>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    domain: '',
    plan: 'basic' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Organization Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter organization name"
          required
        />
      </div>
      <div>
        <Label>Slug</Label>
        <Input
          value={formData.slug}
          onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
          placeholder="organization-slug"
          required
        />
      </div>
      <div>
        <Label>Domain</Label>
        <Input
          value={formData.domain}
          onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value }))}
          placeholder="organization.com"
          required
        />
      </div>
      <div>
        <Label>Plan</Label>
        <Select
          value={formData.plan}
          onValueChange={(value) => setFormData(prev => ({ ...prev, plan: value as any }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="basic">Basic</SelectItem>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create Organization
        </Button>
      </div>
    </form>
  );
} 