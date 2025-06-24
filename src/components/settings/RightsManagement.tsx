import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export function RightsManagement() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Rights Management</CardTitle>
                <CardDescription>Define what users and groups can see and do within the system.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center text-center p-12">
                <ShieldCheck className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">Coming Soon</h3>
                <p className="text-muted-foreground mt-2">
                    Detailed permission controls for sections, forms, and actions will be available here.
                </p>
            </CardContent>
        </Card>
    );
}
