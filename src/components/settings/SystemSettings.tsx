import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Zap, AlertCircle, DollarSign, Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { useSystemSettings } from "@/lib/hooks/useSystemSettings";
import { useToast } from "@/hooks/use-toast";

export function SystemSettings() {
    const { settings, updateSettings } = useSystemSettings();
    const { toast } = useToast();

    const handleSettingChange = (key: keyof typeof settings, value: boolean) => {
        updateSettings({ [key]: value });
        toast({
            title: "Setting Updated",
            description: `The ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} setting has been updated.`,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Manage global features and system-wide configurations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                    <Label htmlFor="ai-features" className="flex flex-col space-y-1">
                        <span>Enable AI Features</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                            Activates AI-powered summaries and suggestions across the app.
                        </span>
                    </Label>
                    <Switch 
                        id="ai-features" 
                        checked={settings.aiFeatures}
                        onCheckedChange={(checked) => handleSettingChange('aiFeatures', checked)}
                    />
                </div>
                <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                    <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                        <span>Allow Dark Mode</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                            Let users choose between light and dark themes. (UI Refresh Required)
                        </span>
                    </Label>
                    <Switch 
                        id="dark-mode" 
                        checked={settings.darkMode}
                        onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
                    />
                </div>
                 <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                    <Label htmlFor="beta-features" className="flex flex-col space-y-1">
                        <span>Enable Beta Features</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                            Get early access to new and experimental features.
                        </span>
                    </Label>
                    <Switch 
                        id="beta-features" 
                        checked={settings.betaFeatures}
                        onCheckedChange={(checked) => handleSettingChange('betaFeatures', checked)}
                    />
                </div>

                {/* Staff Management Settings */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <h3 className="text-lg font-semibold">Staff Management Settings</h3>
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
                        <Label htmlFor="show-pay-rates" className="flex flex-col space-y-1">
                            <span className="font-medium">Show Pay Rates</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                Display hourly pay rates in staff listings and profiles. When disabled, pay rates are hidden from all users except HR and Finance admins.
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
                            <span>Allow Staff Self-Editing</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                Allow staff members to edit their own basic profile information.
                            </span>
                        </Label>
                        <Switch 
                            id="allow-staff-editing" 
                            checked={settings.allowStaffEditing}
                            onCheckedChange={(checked) => handleSettingChange('allowStaffEditing', checked)}
                        />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                        <Label htmlFor="dynamic-forms" className="flex flex-col space-y-1">
                            <span>Enable Dynamic Forms</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                Allow custom forms created in System Settings to be displayed in staff profiles.
                            </span>
                        </Label>
                        <Switch 
                            id="dynamic-forms" 
                            checked={settings.enableDynamicForms}
                            onCheckedChange={(checked) => handleSettingChange('enableDynamicForms', checked)}
                        />
                    </div>
                    
                    <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                        <Eye className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800 dark:text-green-200">
                            <strong>Pay Rate Visibility:</strong> When disabled, pay rates are automatically hidden from staff listings, 
                            profiles, and reports. HR and Finance administrators can still view pay information in their respective modules.
                        </AlertDescription>
                    </Alert>
                </div>

                {/* Automation Settings */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-indigo-600" />
                        <h3 className="text-lg font-semibold">Automation Settings</h3>
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
                        <Label htmlFor="automation-enabled" className="flex flex-col space-y-1">
                            <span className="font-medium">Enable System Automation</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                Allow IT admins and technical teams to create and manage automated workflows for clients.
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
                            <span>Client-Specific Automation</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                Allow client IT teams to create automations specific to their organization.
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
                </div>
            </CardContent>
        </Card>
    );
}
