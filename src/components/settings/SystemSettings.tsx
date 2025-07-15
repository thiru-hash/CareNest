import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Zap, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";

export function SystemSettings() {
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
                    <Switch id="ai-features" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                    <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                        <span>Allow Dark Mode</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                            Let users choose between light and dark themes. (UI Refresh Required)
                        </span>
                    </Label>
                    <Switch id="dark-mode" />
                </div>
                
                <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                    <Label htmlFor="beta-features" className="flex flex-col space-y-1">
                        <span>Enable Beta Features</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                            Get early access to new and experimental features.
                        </span>
                    </Label>
                    <Switch id="beta-features" />
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
                        <Switch id="automation-enabled" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                        <Label htmlFor="client-automation" className="flex flex-col space-y-1">
                            <span>Client-Specific Automation</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                Allow client IT teams to create automations specific to their organization.
                            </span>
                        </Label>
                        <Switch id="client-automation" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                        <Label htmlFor="global-automation" className="flex flex-col space-y-1">
                            <span>Global Automation Rules</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                Enable system-wide automation rules that apply to all clients.
                            </span>
                        </Label>
                        <Switch id="global-automation" defaultChecked />
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
