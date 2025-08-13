import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Zap, AlertCircle, DollarSign, Eye, EyeOff, Languages, Globe, Users, Building2, Calendar, Landmark, FileText, Settings, Shield } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { useSystemSettings } from "@/lib/hooks/useSystemSettings";
import { useTerminology, type TerminologySettings } from "@/lib/hooks/useTerminology";
import { useToast } from "@/hooks/use-toast";
import { 
  autoDetectNewSections, 
  autoDetectNewForms, 
  autoDetectNewTabs, 
  getAllTerminologyKeys,
  updateItemTerminology,
  removeItemTerminology,
  clearTerminologyCache
} from "@/lib/terminology";
import { TwoFactorManagement } from "./TwoFactorManagement";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function SystemSettings() {
    const { settings, updateSettings } = useSystemSettings();
    const { toast } = useToast();
    const { 
        terminology, 
        saveTerminology, 
        updateTerm, 
        updateCustomTerm, 
        resetToDefault, 
        applyMaoriPreset 
    } = useTerminology();

    const handleSettingChange = (key: keyof typeof settings, value: boolean) => {
        updateSettings({ [key]: value });
        toast({
            title: "Setting Updated",
            description: `The ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} setting has been updated.`,
        });
    };

    const handleTerminologyChange = (key: keyof TerminologySettings, value: string | boolean) => {
        updateTerm(key, value);
    };

    const handleCustomTermChange = (key: string, value: string) => {
        updateCustomTerm(key, value);
    };

    const handleSaveTerminology = () => {
        saveTerminology(terminology);
        toast({
            title: "Terminology Saved",
            description: "Custom terminology has been saved and will be applied throughout the application.",
        });
    };

    const handleResetToDefault = () => {
        resetToDefault();
        toast({
            title: "Terminology Reset",
            description: "All terminology has been reset to default values.",
        });
    };

    const handleApplyMaoriPreset = () => {
        applyMaoriPreset();
        toast({
            title: "Māori Terminology Applied",
            description: "Māori terminology has been applied throughout the application.",
        });
    };

    const handleTwoFactorConfigChange = (config: any) => {
        toast({
            title: "2FA Configuration Updated",
            description: "Two-factor authentication settings have been updated.",
        });
    };

    return (
        <div className="space-y-6">
            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="rbac">RBAC</TabsTrigger>
                    <TabsTrigger value="terminology">Terminology</TabsTrigger>
                    <TabsTrigger value="twofactor">Two-Factor Auth</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6">
                    {/* General Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5" />
                                General System Settings
                            </CardTitle>
                            <CardDescription>
                                Configure core system features and functionality
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* AI Features */}
                            <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                                <Label htmlFor="ai-features" className="flex flex-col space-y-1">
                                    <span>AI Features</span>
                                    <span className="font-normal leading-snug text-muted-foreground">
                                        Enable AI-powered features like smart suggestions and automation.
                                    </span>
                                </Label>
                                <Switch 
                                    id="ai-features" 
                                    checked={settings.aiFeatures}
                                    onCheckedChange={(checked) => handleSettingChange('aiFeatures', checked)}
                                />
                            </div>

                            {/* Dark Mode */}
                            <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                                <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                                    <span>Dark Mode</span>
                                    <span className="font-normal leading-snug text-muted-foreground">
                                        Enable dark theme across the application.
                                    </span>
                                </Label>
                                <Switch 
                                    id="dark-mode" 
                                    checked={settings.darkMode}
                                    onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
                                />
                            </div>

                            {/* Beta Features */}
                            <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                                <Label htmlFor="beta-features" className="flex flex-col space-y-1">
                                    <span>Beta Features</span>
                                    <span className="font-normal leading-snug text-muted-foreground">
                                        Enable experimental features for testing.
                                    </span>
                                </Label>
                                <Switch 
                                    id="beta-features" 
                                    checked={settings.betaFeatures}
                                    onCheckedChange={(checked) => handleSettingChange('betaFeatures', checked)}
                                />
                            </div>

                            {/* Staff Management Settings */}
                            <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                                <Label htmlFor="show-pay-rates" className="flex flex-col space-y-1">
                                    <span>Show Pay Rates</span>
                                    <span className="font-normal leading-snug text-muted-foreground">
                                        Allow users to view staff pay rate information.
                                    </span>
                                </Label>
                                <Switch 
                                    id="show-pay-rates" 
                                    checked={settings.showPayRates}
                                    onCheckedChange={(checked) => handleSettingChange('showPayRates', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                                <Label htmlFor="allow-staff-editing" className="flex flex-col space-y-1">
                                    <span>Allow Staff Editing</span>
                                    <span className="font-normal leading-snug text-muted-foreground">
                                        Allow users to edit staff information and profiles.
                                    </span>
                                </Label>
                                <Switch 
                                    id="allow-staff-editing" 
                                    checked={settings.allowStaffEditing}
                                    onCheckedChange={(checked) => handleSettingChange('allowStaffEditing', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                                <Label htmlFor="enable-dynamic-forms" className="flex flex-col space-y-1">
                                    <span>Enable Dynamic Forms</span>
                                    <span className="font-normal leading-snug text-muted-foreground">
                                        Allow creation and customization of dynamic forms.
                                    </span>
                                </Label>
                                <Switch 
                                    id="enable-dynamic-forms" 
                                    checked={settings.enableDynamicForms}
                                    onCheckedChange={(checked) => handleSettingChange('enableDynamicForms', checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Automation Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="h-5 w-5" />
                                Automation Settings
                            </CardTitle>
                            <CardDescription>
                                Configure system automation and workflow rules
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                                <Label htmlFor="automation-enabled" className="flex flex-col space-y-1">
                                    <span>System Automation</span>
                                    <span className="font-normal leading-snug text-muted-foreground">
                                        Enable automated workflows and system processes.
                                    </span>
                                </Label>
                                <Switch 
                                    id="automation-enabled" 
                                    checked={settings.automationEnabled}
                                    onCheckedChange={(checked) => handleSettingChange('automationEnabled', checked)}
                                />
                            </div>
                            
                            <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                                <Label htmlFor="client-automation" className="flex flex-col space-y-1">
                                    <span>Client Automation Rules</span>
                                    <span className="font-normal leading-snug text-muted-foreground">
                                        Enable automation rules specific to client organizations.
                                    </span>
                                </Label>
                                <Switch 
                                    id="client-automation" 
                                    checked={settings.clientAutomation}
                                    onCheckedChange={(checked) => handleSettingChange('clientAutomation', checked)}
                                />
                            </div>
                            
                            <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                                <Label htmlFor="global-automation" className="flex flex-col space-y-1">
                                    <span>Global Automation Rules</span>
                                    <span className="font-normal leading-snug text-muted-foreground">
                                        Enable system-wide automation rules that apply to all clients.
                                    </span>
                                </Label>
                                <Switch 
                                    id="global-automation" 
                                    checked={settings.globalAutomation}
                                    onCheckedChange={(checked) => handleSettingChange('globalAutomation', checked)}
                                />
                            </div>
                            
                            <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
                                <AlertCircle className="h-4 w-4 text-orange-600" />
                                <AlertDescription className="text-orange-800 dark:text-orange-200">
                                    <strong>Developer Note:</strong> These automation settings control access to the System Automation 
                                    section. When disabled, IT admins will not be able to create or manage automation rules. 
                                    Changes take effect immediately for all users.
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="rbac" className="space-y-6">
                    {/* RBAC Configuration */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-green-500" />
                                Roster-Based Access Control
                            </CardTitle>
                            <CardDescription>
                                Configure how staff access is managed based on their shifts and clock-in/out status.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* RBAC Master Toggle */}
                            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                <div>
                                    <Label htmlFor="rbac-enabled" className="font-semibold text-base">Enable RBAC</Label>
                                    <p className="text-sm text-muted-foreground">
                                        When enabled, staff access is automatically granted/revoked based on their shift status
                                    </p>
                                </div>
                                <Switch
                                    id="rbac-enabled"
                                    checked={settings.rosterBasedAccessControl?.enabled || false}
                                    onCheckedChange={(checked) => {
                                        const newSettings = {
                                            ...settings,
                                            rosterBasedAccessControl: {
                                                ...settings.rosterBasedAccessControl,
                                                enabled: checked
                                            }
                                        };
                                        updateSettings(newSettings);
                                    }}
                                />
                            </div>

                            {/* RBAC Detailed Settings */}
                            {settings.rosterBasedAccessControl?.enabled && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center justify-between p-4 rounded-lg border">
                                            <div>
                                                <Label className="font-medium">Auto Grant Access</Label>
                                                <p className="text-sm text-muted-foreground">Grant access when staff clock in</p>
                                            </div>
                                            <Switch
                                                checked={settings.rosterBasedAccessControl?.autoGrantAccess || false}
                                                onCheckedChange={(checked) => {
                                                    const newSettings = {
                                                        ...settings,
                                                        rosterBasedAccessControl: {
                                                            ...settings.rosterBasedAccessControl,
                                                            autoGrantAccess: checked
                                                        }
                                                    };
                                                    updateSettings(newSettings);
                                                }}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between p-4 rounded-lg border">
                                            <div>
                                                <Label className="font-medium">Auto Revoke Access</Label>
                                                <p className="text-sm text-muted-foreground">Revoke access when staff clock out</p>
                                            </div>
                                            <Switch
                                                checked={settings.rosterBasedAccessControl?.autoRevokeAccess || false}
                                                onCheckedChange={(checked) => {
                                                    const newSettings = {
                                                        ...settings,
                                                        rosterBasedAccessControl: {
                                                            ...settings.rosterBasedAccessControl,
                                                            autoRevokeAccess: checked
                                                        }
                                                    };
                                                    updateSettings(newSettings);
                                                }}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between p-4 rounded-lg border">
                                            <div>
                                                <Label className="font-medium">Require Clock-In</Label>
                                                <p className="text-sm text-muted-foreground">Only grant access after clock-in</p>
                                            </div>
                                            <Switch
                                                checked={settings.rosterBasedAccessControl?.requireClockIn || false}
                                                onCheckedChange={(checked) => {
                                                    const newSettings = {
                                                        ...settings,
                                                        rosterBasedAccessControl: {
                                                            ...settings.rosterBasedAccessControl,
                                                            requireClockIn: checked
                                                        }
                                                    };
                                                    updateSettings(newSettings);
                                                }}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between p-4 rounded-lg border">
                                            <div>
                                                <Label className="font-medium">Audit Logging</Label>
                                                <p className="text-sm text-muted-foreground">Log all access changes</p>
                                            </div>
                                            <Switch
                                                checked={settings.rosterBasedAccessControl?.auditLogging || false}
                                                onCheckedChange={(checked) => {
                                                    const newSettings = {
                                                        ...settings,
                                                        rosterBasedAccessControl: {
                                                            ...settings.rosterBasedAccessControl,
                                                            auditLogging: checked
                                                        }
                                                    };
                                                    updateSettings(newSettings);
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Notification Settings */}
                                    <div className="border-t pt-4">
                                        <h4 className="font-medium mb-3">Notification Settings</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center justify-between p-3 rounded-lg border">
                                                <Label className="text-sm">Clock-In Notifications</Label>
                                                <Switch
                                                    checked={settings.rosterBasedAccessControl?.notificationSettings?.onClockIn || false}
                                                    onCheckedChange={(checked) => {
                                                        const newSettings = {
                                                            ...settings,
                                                            rosterBasedAccessControl: {
                                                                ...settings.rosterBasedAccessControl,
                                                                notificationSettings: {
                                                                    ...settings.rosterBasedAccessControl?.notificationSettings,
                                                                    onClockIn: checked
                                                                }
                                                            }
                                                        };
                                                        updateSettings(newSettings);
                                                    }}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between p-3 rounded-lg border">
                                                <Label className="text-sm">Clock-Out Notifications</Label>
                                                <Switch
                                                    checked={settings.rosterBasedAccessControl?.notificationSettings?.onClockOut || false}
                                                    onCheckedChange={(checked) => {
                                                        const newSettings = {
                                                            ...settings,
                                                            rosterBasedAccessControl: {
                                                                ...settings.rosterBasedAccessControl,
                                                                notificationSettings: {
                                                                    ...settings.rosterBasedAccessControl?.notificationSettings,
                                                                    onClockOut: checked
                                                                }
                                                            }
                                                        };
                                                        updateSettings(newSettings);
                                                    }}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between p-3 rounded-lg border">
                                                <Label className="text-sm">Early Finish Notifications</Label>
                                                <Switch
                                                    checked={settings.rosterBasedAccessControl?.notificationSettings?.onEarlyFinish || false}
                                                    onCheckedChange={(checked) => {
                                                        const newSettings = {
                                                            ...settings,
                                                            rosterBasedAccessControl: {
                                                                ...settings.rosterBasedAccessControl,
                                                                notificationSettings: {
                                                                    ...settings.rosterBasedAccessControl?.notificationSettings,
                                                                    onEarlyFinish: checked
                                                                }
                                                            }
                                                        };
                                                        updateSettings(newSettings);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Clock-Out Settings */}
                                    <div className="border-t pt-4">
                                        <h4 className="font-medium mb-3">Clock-Out & Early Finish Settings</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center justify-between p-3 rounded-lg border">
                                                <div>
                                                    <Label className="text-sm font-medium">Allow Early Finish</Label>
                                                    <p className="text-xs text-muted-foreground">Allow staff to finish shifts early</p>
                                                </div>
                                                <Switch
                                                    checked={settings.rosterBasedAccessControl?.allowEarlyFinish || false}
                                                    onCheckedChange={(checked) => {
                                                        const newSettings = {
                                                            ...settings,
                                                            rosterBasedAccessControl: {
                                                                ...settings.rosterBasedAccessControl,
                                                                allowEarlyFinish: checked
                                                            }
                                                        };
                                                        updateSettings(newSettings);
                                                    }}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between p-3 rounded-lg border">
                                                <div>
                                                    <Label className="text-sm font-medium">Require Early Finish Reason</Label>
                                                    <p className="text-xs text-muted-foreground">Staff must provide reason for early finish</p>
                                                </div>
                                                <Switch
                                                    checked={settings.rosterBasedAccessControl?.requireEarlyFinishReason || false}
                                                    onCheckedChange={(checked) => {
                                                        const newSettings = {
                                                            ...settings,
                                                            rosterBasedAccessControl: {
                                                                ...settings.rosterBasedAccessControl,
                                                                requireEarlyFinishReason: checked
                                                            }
                                                        };
                                                        updateSettings(newSettings);
                                                    }}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between p-3 rounded-lg border">
                                                <div>
                                                    <Label className="text-sm font-medium">Auto Clock-Out at Shift End</Label>
                                                    <p className="text-xs text-muted-foreground">Automatically clock out when shift ends</p>
                                                </div>
                                                <Switch
                                                    checked={settings.rosterBasedAccessControl?.autoClockOutAtShiftEnd || false}
                                                    onCheckedChange={(checked) => {
                                                        const newSettings = {
                                                            ...settings,
                                                            rosterBasedAccessControl: {
                                                                ...settings.rosterBasedAccessControl,
                                                                autoClockOutAtShiftEnd: checked
                                                            }
                                                        };
                                                        updateSettings(newSettings);
                                                    }}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between p-3 rounded-lg border">
                                                <div>
                                                    <Label className="text-sm font-medium">Allow Manual Clock-Out</Label>
                                                    <p className="text-xs text-muted-foreground">Allow staff to manually clock out</p>
                                                </div>
                                                <Switch
                                                    checked={settings.rosterBasedAccessControl?.allowManualClockOut || false}
                                                    onCheckedChange={(checked) => {
                                                        const newSettings = {
                                                            ...settings,
                                                            rosterBasedAccessControl: {
                                                                ...settings.rosterBasedAccessControl,
                                                                allowManualClockOut: checked
                                                            }
                                                        };
                                                        updateSettings(newSettings);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* Early Finish Grace Period */}
                                        <div className="mt-4 p-3 rounded-lg border">
                                            <Label className="text-sm font-medium">Early Finish Grace Period (minutes)</Label>
                                            <p className="text-xs text-muted-foreground mb-2">
                                                How early staff can finish their shift without requiring approval
                                            </p>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="120"
                                                value={settings.rosterBasedAccessControl?.earlyFinishGracePeriod || 30}
                                                onChange={(e) => {
                                                    const newSettings = {
                                                        ...settings,
                                                        rosterBasedAccessControl: {
                                                            ...settings.rosterBasedAccessControl,
                                                            earlyFinishGracePeriod: parseInt(e.target.value) || 30
                                                        }
                                                    };
                                                    updateSettings(newSettings);
                                                }}
                                                className="w-32"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="terminology" className="space-y-6">
                    {/* Terminology Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Languages className="h-5 w-5" />
                                Terminology & Language Settings
                            </CardTitle>
                            <CardDescription>
                                Customize terminology and language preferences throughout the application
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Core Terms */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Core Terms</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="users">Users</Label>
                                        <Input
                                            id="users"
                                            value={terminology.users}
                                            onChange={(e) => handleTerminologyChange('users', e.target.value)}
                                            placeholder="Users"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="groups">Groups</Label>
                                        <Input
                                            id="groups"
                                            value={terminology.groups}
                                            onChange={(e) => handleTerminologyChange('groups', e.target.value)}
                                            placeholder="Groups"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="roles">Roles</Label>
                                        <Input
                                            id="roles"
                                            value={terminology.roles}
                                            onChange={(e) => handleTerminologyChange('roles', e.target.value)}
                                            placeholder="Roles"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="rights">Rights</Label>
                                        <Input
                                            id="rights"
                                            value={terminology.rights}
                                            onChange={(e) => handleTerminologyChange('rights', e.target.value)}
                                            placeholder="Rights"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="sections">Sections</Label>
                                        <Input
                                            id="sections"
                                            value={terminology.sections}
                                            onChange={(e) => handleTerminologyChange('sections', e.target.value)}
                                            placeholder="Sections"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="forms">Forms</Label>
                                        <Input
                                            id="forms"
                                            value={terminology.forms}
                                            onChange={(e) => handleTerminologyChange('forms', e.target.value)}
                                            placeholder="Forms"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Profile Terms */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Profile Terms</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="basic-info">Basic Information</Label>
                                        <Input
                                            id="basic-info"
                                            value={terminology.basicInfo}
                                            onChange={(e) => handleTerminologyChange('basicInfo', e.target.value)}
                                            placeholder="Basic Information"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="contacts">Contacts & Schedule</Label>
                                        <Input
                                            id="contacts"
                                            value={terminology.contacts}
                                            onChange={(e) => handleTerminologyChange('contacts', e.target.value)}
                                            placeholder="Contacts & Schedule"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="communication">Communication</Label>
                                        <Input
                                            id="communication"
                                            value={terminology.communication}
                                            onChange={(e) => handleTerminologyChange('communication', e.target.value)}
                                            placeholder="Communication"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="goals">Goals</Label>
                                        <Input
                                            id="goals"
                                            value={terminology.goals}
                                            onChange={(e) => handleTerminologyChange('goals', e.target.value)}
                                            placeholder="Goals"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* System Terms */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">System Terms</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="dashboard">Dashboard</Label>
                                        <Input
                                            id="dashboard"
                                            value={terminology.dashboard}
                                            onChange={(e) => handleTerminologyChange('dashboard', e.target.value)}
                                            placeholder="Dashboard"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="settings">Settings</Label>
                                        <Input
                                            id="settings"
                                            value={terminology.settings}
                                            onChange={(e) => handleTerminologyChange('settings', e.target.value)}
                                            placeholder="Settings"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="timesheets">Timesheets</Label>
                                        <Input
                                            id="timesheets"
                                            value={terminology.timesheets}
                                            onChange={(e) => handleTerminologyChange('timesheets', e.target.value)}
                                            placeholder="Timesheets"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="pay-rates">Pay Rates</Label>
                                        <Input
                                            id="pay-rates"
                                            value={terminology.payRates}
                                            onChange={(e) => handleTerminologyChange('payRates', e.target.value)}
                                            placeholder="Pay Rates"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Cultural/Language Settings */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Cultural & Language Settings</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="language">Primary Language</Label>
                                        <Select 
                                            value={terminology.primaryLanguage} 
                                            onValueChange={(value) => handleTerminologyChange('primaryLanguage', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="English">English</SelectItem>
                                                <SelectItem value="Māori">Māori</SelectItem>
                                                <SelectItem value="Spanish">Spanish</SelectItem>
                                                <SelectItem value="French">French</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="enable-maori">Enable Māori Terms</Label>
                                        <Switch
                                            id="enable-maori"
                                            checked={terminology.enableMaoriTerms}
                                            onCheckedChange={(checked) => handleTerminologyChange('enableMaoriTerms', checked)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="enable-cultural">Enable Cultural Terms</Label>
                                        <Switch
                                            id="enable-cultural"
                                            checked={terminology.enableCulturalTerms}
                                            onCheckedChange={(checked) => handleTerminologyChange('enableCulturalTerms', checked)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <Button onClick={handleSaveTerminology}>
                                    Save Terminology
                                </Button>
                                <Button variant="outline" onClick={handleResetToDefault}>
                                    Reset to Default
                                </Button>
                                <Button variant="outline" onClick={handleApplyMaoriPreset}>
                                    Apply Māori Preset
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="twofactor" className="space-y-6">
                    <TwoFactorManagement onConfigChange={handleTwoFactorConfigChange} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
