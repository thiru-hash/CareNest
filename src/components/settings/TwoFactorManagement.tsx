"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Shield, 
  Users, 
  User, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Clock,
  Bell,
  Lock,
  Unlock,
  Smartphone,
  MessageSquare,
  QrCode
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TwoFactorConfig } from "@/lib/types";
import { mockTwoFactorConfig, mockGroups, mockUserAccounts } from "@/lib/data";

interface TwoFactorManagementProps {
  onConfigChange?: (config: TwoFactorConfig) => void;
}

export function TwoFactorManagement({ onConfigChange }: TwoFactorManagementProps) {
  const { toast } = useToast();
  const default2FAConfig = {
    globalEnabled: true,
    enforcementMode: 'strict',
    excludedUsers: [],
    excludedGroups: [],
    groupSettings: Object.fromEntries(mockGroups.map(g => [g.id, { enabled: true, required: true, method: 'app' }]))
  };
  const [config, setConfig] = useState<TwoFactorConfig>(default2FAConfig);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");

  const handleGlobalChange = (key: keyof TwoFactorConfig, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onConfigChange?.(newConfig);
    
    toast({
      title: "2FA Settings Updated",
      description: `Global ${key} has been updated.`,
    });
  };

  const handleGroupSettingChange = (groupId: string, key: string, value: any) => {
    const newConfig = {
      ...config,
      groupSettings: {
        ...config.groupSettings,
        [groupId]: {
          ...config.groupSettings[groupId],
          [key]: value
        }
      }
    };
    setConfig(newConfig);
    onConfigChange?.(newConfig);
    
    toast({
      title: "Group 2FA Settings Updated",
      description: `2FA settings for group have been updated.`,
    });
  };

  const handleUserSettingChange = (userId: string, key: string, value: any) => {
    const newConfig = {
      ...config,
      userSettings: {
        ...config.userSettings,
        [userId]: {
          ...config.userSettings[userId],
          [key]: value
        }
      }
    };
    setConfig(newConfig);
    onConfigChange?.(newConfig);
    
    toast({
      title: "User 2FA Settings Updated",
      description: `2FA settings for user have been updated.`,
    });
  };

  const getGroup2FAStatus = (groupId: string) => {
    const group = config.groupSettings[groupId];
    if (!group) return { enabled: false, required: false, method: 'none' };
    return group;
  };

  const getUser2FAStatus = (userId: string) => {
    const user = config.userSettings[userId];
    if (!user) return { enabled: false, required: false, method: 'none', setupComplete: false };
    return user;
  };

  const isUserExcluded = (userId: string) => {
    return config.excludedUsers.includes(userId);
  };

  const isGroupExcluded = (groupId: string) => {
    return config.excludedGroups.includes(groupId);
  };

  const getEffective2FAStatus = (userId: string, groupIds: string[]) => {
    // Check if user is excluded
    if (isUserExcluded(userId)) {
      return { enabled: false, required: false, method: 'none' };
    }

    // Check user-specific settings first
    const userSettings = getUser2FAStatus(userId);
    if (userSettings.enabled || userSettings.required) {
      return userSettings;
    }

    // Check group settings
    for (const groupId of groupIds) {
      if (isGroupExcluded(groupId)) continue;
      
      const groupSettings = getGroup2FAStatus(groupId);
      if (groupSettings.enabled || groupSettings.required) {
        return groupSettings;
      }
    }

    // Fall back to global settings
    return {
      enabled: config.globalEnabled,
      required: config.globalRequired,
      method: 'app' as const
    };
  };

  return (
    <div className="space-y-6">
      {/* Global 2FA Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Global Two-Factor Authentication Settings
          </CardTitle>
          <CardDescription>
            Configure system-wide 2FA policies and enforcement rules
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Enable 2FA Globally</Label>
                <Switch
                  checked={config.globalEnabled}
                  onCheckedChange={(checked) => handleGlobalChange('globalEnabled', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Require 2FA Globally</Label>
                <Switch
                  checked={config.globalRequired}
                  onCheckedChange={(checked) => handleGlobalChange('globalRequired', checked)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Enforcement Mode</Label>
                <Select 
                  value={config.enforcementMode} 
                  onValueChange={(value) => handleGlobalChange('enforcementMode', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strict">Strict - Immediate enforcement</SelectItem>
                    <SelectItem value="gradual">Gradual - With grace period</SelectItem>
                    <SelectItem value="optional">Optional - User choice</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Grace Period (days)</Label>
                <Input
                  type="number"
                  value={config.gracePeriod}
                  onChange={(e) => handleGlobalChange('gracePeriod', parseInt(e.target.value))}
                  min="0"
                  max="365"
                />
              </div>
            </div>
          </div>

          <Alert className="border-blue-200 bg-blue-50">
            <Shield className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Global Settings:</strong> These settings apply to all users unless overridden by group or user-specific settings.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Group-based 2FA Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            Group-based 2FA Settings
          </CardTitle>
          <CardDescription>
            Configure 2FA requirements for specific user groups
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="groups" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="groups">Group Settings</TabsTrigger>
              <TabsTrigger value="exclusions">Exclusions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="groups" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockGroups.map((group) => {
                  const groupSettings = getGroup2FAStatus(group.id);
                  const isExcluded = isGroupExcluded(group.id);
                  
                  return (
                    <Card key={group.id} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{group.name}</h4>
                          <p className="text-sm text-gray-500">{group.description}</p>
                        </div>
                        <Badge variant={isExcluded ? "destructive" : groupSettings.enabled ? "default" : "secondary"}>
                          {isExcluded ? "Excluded" : groupSettings.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      
                      {!isExcluded && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Enable 2FA</Label>
                            <Switch
                              checked={groupSettings.enabled}
                              onCheckedChange={(checked) => handleGroupSettingChange(group.id, 'enabled', checked)}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Require 2FA</Label>
                            <Switch
                              checked={groupSettings.required}
                              onCheckedChange={(checked) => handleGroupSettingChange(group.id, 'required', checked)}
                            />
                          </div>
                          
                          <div>
                            <Label className="text-sm">Method</Label>
                            <Select 
                              value={groupSettings.method} 
                              onValueChange={(value) => handleGroupSettingChange(group.id, 'method', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="app">Authenticator App</SelectItem>
                                <SelectItem value="sms">SMS</SelectItem>
                                <SelectItem value="both">Both</SelectItem>
                                <SelectItem value="none">None</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="exclusions" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Excluded Groups</Label>
                  <div className="space-y-2 mt-2">
                    {mockGroups.map((group) => (
                      <div key={group.id} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{group.name}</span>
                        <Switch
                          checked={isGroupExcluded(group.id)}
                          onCheckedChange={(checked) => {
                            const newExcludedGroups = checked 
                              ? [...config.excludedGroups, group.id]
                              : config.excludedGroups.filter(id => id !== group.id);
                            handleGlobalChange('excludedGroups', newExcludedGroups);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Excluded Users</Label>
                  <div className="space-y-2 mt-2">
                    {mockUserAccounts.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{user.username}</span>
                        <Switch
                          checked={isUserExcluded(user.id)}
                          onCheckedChange={(checked) => {
                            const newExcludedUsers = checked 
                              ? [...config.excludedUsers, user.id]
                              : config.excludedUsers.filter(id => id !== user.id);
                            handleGlobalChange('excludedUsers', newExcludedUsers);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Summary and Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-orange-600" />
            2FA Summary & Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {mockUserAccounts.filter(user => getUser2FAStatus(user.id).setupComplete).length}
              </div>
              <div className="text-sm text-gray-500">Users with 2FA Setup</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {mockUserAccounts.filter(user => getEffective2FAStatus(user.id, user.groupIds || []).enabled).length}
              </div>
              <div className="text-sm text-gray-500">Users with 2FA Enabled</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {config.excludedUsers.length + config.excludedGroups.length}
              </div>
              <div className="text-sm text-gray-500">Total Exclusions</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {config.enforcementMode}
              </div>
              <div className="text-sm text-gray-500">Enforcement Mode</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 