import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "../ui/button";
import { PanelLeftOpen, PlusCircle } from "lucide-react";

export function SectionManager() {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Section Manager</CardTitle>
                        <CardDescription>Create, configure, and manage custom sidebar sections.</CardDescription>
                    </div>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Section
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center text-center p-12">
                <PanelLeftOpen className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">Dynamic Sidebar Sections</h3>
                <p className="text-muted-foreground mt-2">
                    Create new navigation items that will appear in the main sidebar for authorized users.
                </p>
            </CardContent>
        </Card>
    );
}
