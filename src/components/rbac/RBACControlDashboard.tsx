"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Shield, 
  Users, 
  Building2, 
  Clock, 
  Activity, 
  Settings, 
  Eye, 
  EyeOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Filter,
  Download,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { rbacService } from "@/lib/services/rbac-service";
import type { 
  RBACConfig, 
  CurrentRBACAccess, 
  AccessAuditLog, 
  RoleRBACConfig,
  GlobalRBACSettings 
} from "@/lib/types/rbac";

interface RBACControlDashboardProps {
  organizationId: string;
}

export function RBACControlDashboard({ organizationId }: RBACControlDashboardProps) {
  const [config, setConfig] = useState<RBACConfig | null>(null);
  const [currentAccess, setCurrentAccess] = useState<CurrentRBACAccess[]>([]);
  const [accessHistory, setAccessHistory] = useState<AccessAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  useEffect(() => {
    loadRBACData();
  }, [organizationId]);

  const loadRBACData = async () => {
    try {
      setLoading(true);
      const [configData, accessData, historyData] = await Promise.all([
        rbacService.getRBACConfig(organizationId),
        rbacService.getCurrentAccess(organizationId),
        rbacService.getAccessHistory(organizationId, { limit: 50 })
      ]);
      
      setConfig(configData);
      setCurrentAccess(accessData);
      setAccessHistory(historyData);
    } catch (error) {
      console.error('Error loading RBAC data:', error);
      toast({
        title: "Error",
        description: "Failed to load RBAC data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOrganizationToggle = async (enabled: boolean) => {
    if (!config) return;
    
    try {
      const updatedConfig = {
        ...config,
        organizationEnabled: enabled
      };
      
      await rbacService.updateRBACConfig(organizationId, updatedConfig);
      setConfig(updatedConfig);
      
      toast({
        title: "RBAC Updated",
        description: `RBAC ${enabled ? 'enabled' : 'disabled'} for organization`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update RBAC configuration",
        variant: "destructive"
      });
    }
  };

  const handleRoleToggle = async (roleId: string, enabled: boolean) => {
    if (!config) return;
    
    try {
      const updatedConfig = {
        ...config,
        roleConfigurations: config.roleConfigurations.map(role =>
          role.roleId === roleId ? { ...role, rbacEnabled: enabled } : role
        )
      };
      
      await rbacService.updateRBACConfig(organizationId, updatedConfig);
      setConfig(updatedConfig);
      
      toast({
        title: "Role Updated",
        description: `RBAC ${enabled ? 'enabled' : 'disabled'} for role`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update role configuration",
        variant: "destructive"
      });
    }
  };

  const handleGlobalSettingChange = async (setting: keyof GlobalRBACSettings, value: any) => {
    if (!config) return;
    
    try {
      const updatedConfig = {
        ...config,
        globalSettings: {
          ...config.globalSettings,
          [setting]: value
        }
      };
      
      await rbacService.updateRBACConfig(organizationId, updatedConfig);
      setConfig(updatedConfig);
      
      toast({
        title: "Setting Updated",
        description: `${setting} updated successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update global settings",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-NZ', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            RBAC Control Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage roster-based access control for your organization
          </p>
        </div>
        <Button onClick={loadRBACData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Master Toggle */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Organization RBAC Status
          </CardTitle>
          <CardDescription>
            Enable or disable RBAC for the entire organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <Label className="text-lg font-semibold">RBAC Enabled</Label>
              <p className="text-sm text-muted-foreground">
                When enabled, staff access is automatically managed based on their shifts
              </p>
            </div>
            <Switch
              checked={config?.organizationEnabled || false}
              onCheckedChange={handleOrganizationToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="roles">Role Configuration</TabsTrigger>
          <TabsTrigger value="access">Current Access</TabsTrigger>
          <TabsTrigger value="history">Access History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Active Staff */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentAccess.length}</div>
                <p className="text-xs text-muted-foreground">
                  Staff with active RBAC access
                </p>
              </CardContent>
            </Card>

            {/* Active Properties */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Properties</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(currentAccess.map(a => a.propertyId)).size}
                </div>
                <p className="text-xs text-muted-foreground">
                  Properties with active access
                </p>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{accessHistory.length}</div>
                <p className="text-xs text-muted-foreground">
                  Access events in last 24h
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>RBAC Configuration Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {config?.roleConfigurations.filter(r => r.rbacEnabled).length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">RBAC Enabled Roles</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {config?.globalSettings.gracePeriodMinutes || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Grace Period (min)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {config?.globalSettings.requireLocation ? 'Yes' : 'No'}
                  </div>
                  <div className="text-sm text-muted-foreground">Location Required</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {config?.globalSettings.auditLogging ? 'Yes' : 'No'}
                  </div>
                  <div className="text-sm text-muted-foreground">Audit Logging</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Role Configuration Tab */}
        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Role-Based RBAC Configuration</CardTitle>
              <CardDescription>
                Configure which roles use RBAC and their permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {config?.roleConfigurations.map((role) => (
                  <div key={role.roleId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{role.roleName}</h3>
                        <Badge variant={role.rbacEnabled ? "default" : "secondary"}>
                          {role.rbacEnabled ? "RBAC Enabled" : "Manual Access"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {role.permissions.length} permissions configured
                      </p>
                    </div>
                    <Switch
                      checked={role.rbacEnabled}
                      onCheckedChange={(enabled) => handleRoleToggle(role.roleId, enabled)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Global Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Global RBAC Settings</CardTitle>
              <CardDescription>
                Configure system-wide RBAC behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Strict Mode</Label>
                    <Switch
                      checked={config?.globalSettings.strictMode || false}
                      onCheckedChange={(checked) => handleGlobalSettingChange('strictMode', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Require Location</Label>
                    <Switch
                      checked={config?.globalSettings.requireLocation || false}
                      onCheckedChange={(checked) => handleGlobalSettingChange('requireLocation', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Audit Logging</Label>
                    <Switch
                      checked={config?.globalSettings.auditLogging || false}
                      onCheckedChange={(checked) => handleGlobalSettingChange('auditLogging', checked)}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Grace Period (minutes)</Label>
                    <Input
                      type="number"
                      value={config?.globalSettings.gracePeriodMinutes || 15}
                      onChange={(e) => handleGlobalSettingChange('gracePeriodMinutes', parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Max Distance (meters)</Label>
                    <Input
                      type="number"
                      value={config?.globalSettings.maxDistanceMeters || 100}
                      onChange={(e) => handleGlobalSettingChange('maxDistanceMeters', parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Current Access Tab */}
        <TabsContent value="access" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current RBAC Access</CardTitle>
              <CardDescription>
                Real-time view of staff with active access based on their shifts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Shift Time</TableHead>
                    <TableHead>Last Clock Event</TableHead>
                    <TableHead>Access Granted</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentAccess.map((access) => (
                    <TableRow key={`${access.staffId}-${access.propertyId}`}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{access.staffName}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{access.propertyName}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatTime(access.startTime)} - {formatTime(access.endTime)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {access.lastClockEvent ? formatTime(access.lastClockEvent) : 'Not clocked in'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {access.accessGrantedAt ? formatTime(access.accessGrantedAt) : 'Pending'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor('active')}>
                          Active
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Access History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Access History</CardTitle>
              <CardDescription>
                Audit trail of all RBAC access events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Staff</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accessHistory.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="text-sm">
                          {formatTime(log.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {log.staff?.name || 'Unknown'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={log.action === 'access_granted' ? 'default' : 'destructive'}
                        >
                          {log.action.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {log.resourceType}: {log.resourceId}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {log.reason || 'No reason provided'}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 