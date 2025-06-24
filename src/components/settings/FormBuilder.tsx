import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "../ui/button";
import { FileText, MoreHorizontal, PlusCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { mockForms, mockSections } from "@/lib/data";
import { Badge } from "../ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function FormBuilder() {
    return (
        <Card>
            <CardHeader>
                 <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Form Builder</CardTitle>
                        <CardDescription>Design and manage custom forms to link with your sections.</CardDescription>
                    </div>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Form
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Form Name</TableHead>
                            <TableHead>Linked Section</TableHead>
                            <TableHead>Fields</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockForms.map((form) => {
                            const section = mockSections.find(s => s.id === form.linkedSectionId);
                            const statusVariant = form.status === 'Active' ? 'default' : 'secondary';
                             const statusClass = form.status === 'Active' 
                                ? "bg-green-500/20 text-green-700 border-green-500/30 hover:bg-green-500/30"
                                : "bg-gray-500/20 text-gray-700 border-gray-500/30 hover:bg-gray-500/30";

                            return (
                                <TableRow key={form.id}>
                                    <TableCell className="font-medium">{form.name}</TableCell>
                                    <TableCell>{section?.name || 'N/A'}</TableCell>
                                    <TableCell>{form.fieldCount}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariant} className={cn(statusClass)}>{form.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>Edit Form</DropdownMenuItem>
                                                <DropdownMenuItem>Manage Fields</DropdownMenuItem>
                                                <DropdownMenuItem>Permissions</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
