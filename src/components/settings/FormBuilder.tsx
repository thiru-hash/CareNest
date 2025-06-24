import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "../ui/button";
import { FileText, PlusCircle } from "lucide-react";

export function FormBuilder() {
    return (
        <Card>
            <CardHeader>
                 <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Form Builder</CardTitle>
                        <CardDescription>Design and build custom forms to link with your sections.</CardDescription>
                    </div>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Form
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center text-center p-12">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">Custom Form Builder</h3>
                <p className="text-muted-foreground mt-2">
                    Create forms with various field types to capture the data you need.
                </p>
            </CardContent>
        </Card>
    );
}
