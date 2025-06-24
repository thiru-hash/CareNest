import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

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
            </CardContent>
        </Card>
    );
}
