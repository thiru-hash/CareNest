
"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "../ui/button";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { mockForms, mockSections } from "@/lib/data";
import { Badge } from "../ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { CustomForm, AppSection } from "@/lib/types";
import { CreateEditFormDialog } from "./CreateEditFormDialog";

export function FormBuilder() {
    const [forms, setForms] = useState<CustomForm[]>(mockForms);
    const [sections, setSections] = useState<AppSection[]>(mockSections);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentForm, setCurrentForm] = useState<CustomForm | null>(null);

    const handleCreateForm = () => {
        setCurrentForm(null);
        setIsDialogOpen(true);
    };

    const handleEditForm = (form: CustomForm) => {
        setCurrentForm(form);
        setIsDialogOpen(true);
    };

    const handleDeleteForm = (formId: string) => {
        setForms(prev => prev.filter(form => form.id !== formId));
    };

    const handleSaveForm = (savedForm: CustomForm) => {
        if (forms.some(f => f.id === savedForm.id)) {
            // Update existing
            setForms(prev => prev.map(f => f.id === savedForm.id ? savedForm : f));
        } else {
            // Create new
            setForms(prev => [...prev, { ...savedForm, fields: [] }]);
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>Form Builder</CardTitle>
                            <CardDescription>Design and manage custom forms to link with your sections.</CardDescription>
                        </div>
                        <Button onClick={handleCreateForm}>
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
                            {forms.map((form) => {
                                const section = sections.find(s => s.id === form.linkedSectionId);
                                const statusVariant = form.status === 'Active' ? 'default' : 'secondary';
                                const statusClass = form.status === 'Active'
                                    ? "bg-green-500/20 text-green-700 border-green-500/30 hover:bg-green-500/30"
                                    : "bg-gray-500/20 text-gray-700 border-gray-500/30 hover:bg-gray-500/30";

                                return (
                                    <TableRow key={form.id}>
                                        <TableCell className="font-medium">{form.name}</TableCell>
                                        <TableCell>{section?.name || 'N/A'}</TableCell>
                                        <TableCell>{form.fields.length}</TableCell>
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
                                                    <DropdownMenuItem onClick={() => handleEditForm(form)}>Edit Form</DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/settings/forms/${form.id}`}>Manage Fields</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem disabled>Permissions</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteForm(form.id)}>Delete</DropdownMenuItem>
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
            <CreateEditFormDialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                form={currentForm}
                sections={sections}
                onSave={handleSaveForm}
            />
        </>
    );
}
