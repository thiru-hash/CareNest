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
import { UserManagement } from "./UserManagement";
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
                    <TabsTrigger value="terminology">Terminology</TabsTrigger>
                    <TabsTrigger value="twofactor">Two-Factor Auth</TabsTrigger>
                    <TabsTrigger value="users">User Management</TabsTrigger>
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
                                            value={terminology.core.users}
                                            onChange={(e) => handleCustomTermChange('core.users', e.target.value)}
                                            placeholder="Users"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="groups">Groups</Label>
                                        <Input
                                            id="groups"
                                            value={terminology.core.groups}
                                            onChange={(e) => handleCustomTermChange('core.groups', e.target.value)}
                                            placeholder="Groups"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="roles">Roles</Label>
                                        <Input
                                            id="roles"
                                            value={terminology.core.roles}
                                            onChange={(e) => handleCustomTermChange('core.roles', e.target.value)}
                                            placeholder="Roles"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="rights">Rights</Label>
                                        <Input
                                            id="rights"
                                            value={terminology.core.rights}
                                            onChange={(e) => handleCustomTermChange('core.rights', e.target.value)}
                                            placeholder="Rights"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="sections">Sections</Label>
                                        <Input
                                            id="sections"
                                            value={terminology.core.sections}
                                            onChange={(e) => handleCustomTermChange('core.sections', e.target.value)}
                                            placeholder="Sections"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="forms">Forms</Label>
                                        <Input
                                            id="forms"
                                            value={terminology.core.forms}
                                            onChange={(e) => handleCustomTermChange('core.forms', e.target.value)}
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
                                        <Label htmlFor="profile">Profile</Label>
                                        <Input
                                            id="profile"
                                            value={terminology.profile.profile}
                                            onChange={(e) => handleCustomTermChange('profile.profile', e.target.value)}
                                            placeholder="Profile"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="personal-details">Personal Details</Label>
                                        <Input
                                            id="personal-details"
                                            value={terminology.profile.personalDetails}
                                            onChange={(e) => handleCustomTermChange('profile.personalDetails', e.target.value)}
                                            placeholder="Personal Details"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="contact-info">Contact Information</Label>
                                        <Input
                                            id="contact-info"
                                            value={terminology.profile.contactInfo}
                                            onChange={(e) => handleCustomTermChange('profile.contactInfo', e.target.value)}
                                            placeholder="Contact Information"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="emergency-contacts">Emergency Contacts</Label>
                                        <Input
                                            id="emergency-contacts"
                                            value={terminology.profile.emergencyContacts}
                                            onChange={(e) => handleCustomTermChange('profile.emergencyContacts', e.target.value)}
                                            placeholder="Emergency Contacts"
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
                                            value={terminology.system.dashboard}
                                            onChange={(e) => handleCustomTermChange('system.dashboard', e.target.value)}
                                            placeholder="Dashboard"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="settings">Settings</Label>
                                        <Input
                                            id="settings"
                                            value={terminology.system.settings}
                                            onChange={(e) => handleCustomTermChange('system.settings', e.target.value)}
                                            placeholder="Settings"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="notifications">Notifications</Label>
                                        <Input
                                            id="notifications"
                                            value={terminology.system.notifications}
                                            onChange={(e) => handleCustomTermChange('system.notifications', e.target.value)}
                                            placeholder="Notifications"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="reports">Reports</Label>
                                        <Input
                                            id="reports"
                                            value={terminology.system.reports}
                                            onChange={(e) => handleCustomTermChange('system.reports', e.target.value)}
                                            placeholder="Reports"
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
                                            value={terminology.cultural.language} 
                                            onValueChange={(value) => handleCustomTermChange('cultural.language', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="en">English</SelectItem>
                                                <SelectItem value="mi">Māori</SelectItem>
                                                <SelectItem value="es">Spanish</SelectItem>
                                                <SelectItem value="fr">French</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="date-format">Date Format</Label>
                                        <Select 
                                            value={terminology.cultural.dateFormat} 
                                            onValueChange={(value) => handleCustomTermChange('cultural.dateFormat', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                                                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                                                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="time-format">Time Format</Label>
                                        <Select 
                                            value={terminology.cultural.timeFormat} 
                                            onValueChange={(value) => handleCustomTermChange('cultural.timeFormat', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="12h">12-hour</SelectItem>
                                                <SelectItem value="24h">24-hour</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="currency">Currency</Label>
                                        <Select 
                                            value={terminology.cultural.currency} 
                                            onValueChange={(value) => handleCustomTermChange('cultural.currency', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="NZD">NZD ($)</SelectItem>
                                                <SelectItem value="USD">USD ($)</SelectItem>
                                                <SelectItem value="EUR">EUR (€)</SelectItem>
                                                <SelectItem value="GBP">GBP (£)</SelectItem>
                                            </SelectContent>
                                        </Select>
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

                <TabsContent value="users" className="space-y-6">
                    <UserManagement />
                </TabsContent>
            </Tabs>
        </div>
    );
}
