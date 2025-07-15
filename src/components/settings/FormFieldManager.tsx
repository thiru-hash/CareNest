
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { fieldTypes } from "@/lib/data";
import type { CustomForm, FormField } from "@/lib/types";
import { CreateEditFieldDialog } from "./CreateEditFieldDialog";
import React from "react";
import { Badge } from "@/components/ui/badge";

export function FormFieldManager({ form: initialForm }: { form: CustomForm }) {
    const [fields, setFields] = useState<FormField[]>((initialForm.fields || []).slice().sort((a, b) => a.order - b.order));
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentField, setCurrentField] = useState<FormField | null>(null);

    const handleCreateField = () => {
        const maxOrder = Math.max(0, ...fields.map(f => f.order));
        setCurrentField({
            id: '',
            name: "New Field",
            type: 'text',
            order: maxOrder + 10,
            required: false,
            tooltip: '',
            status: 'Active',
            visibleRoles: [],
        });
        setIsDialogOpen(true);
    };

    const handleEditField = (field: FormField) => {
        setCurrentField(field);
        setIsDialogOpen(true);
    };

    const handleDeleteField = (fieldId: string) => {
        setFields(prev => prev.filter(field => field.id !== fieldId));
    };

    const handleInactivateField = (fieldId: string) => {
        setFields(prev => prev.map(field => field.id === fieldId ? { ...field, status: 'Inactive' } : field));
    };

    const handleActivateField = (fieldId: string) => {
        setFields(prev => prev.map(field => field.id === fieldId ? { ...field, status: 'Active' } : field));
    };

    const handleSaveField = (savedField: FormField) => {
        if (fields.some(f => f.id === savedField.id)) {
            // Update existing
            setFields(prev => prev.map(f => f.id === savedField.id ? savedField : f).sort((a,b) => a.order - b.order));
        } else {
            // Create new
             const newField = { ...savedField, id: `field-${Date.now()}` };
            setFields(prev => [...prev, newField].sort((a, b) => a.order - b.order));
        }
    };
    
    const getFieldTypeName = (type: FormField['type']) => {
        return fieldTypes.find(ft => ft.value === type)?.label || type;
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>Form Fields</CardTitle>
                            <CardDescription>A list of fields in the "{initialForm.name}" form.</CardDescription>
                        </div>
                        <Button onClick={handleCreateField}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Field
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order</TableHead>
                                <TableHead>Field Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Visibility</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fields.length > 0 ? fields.map((field) => {
                                const Icon = fieldTypes.find(ft => ft.value === field.type)?.icon || MoreHorizontal;
                                return (
                                    <TableRow key={field.id}>
                                        <TableCell>{field.order}</TableCell>
                                        <TableCell className="font-medium">
                                            {field.name}
                                            {field.required && <span className="text-destructive ml-1">*</span>}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Icon className="h-4 w-4 text-muted-foreground" />
                                                <span>{getFieldTypeName(field.type)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={field.status === 'Active' ? 'default' : 'secondary'}>
                                                {field.status || 'Active'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {field.visibleRoles && field.visibleRoles.length > 0
                                                ? field.visibleRoles.join(', ')
                                                : <span className="text-muted-foreground">All</span>}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEditField(field)}>Edit Field</DropdownMenuItem>
                                                    {field.status === 'Active' ? (
                                                        <DropdownMenuItem onClick={() => handleInactivateField(field.id)}>Inactivate</DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem onClick={() => handleActivateField(field.id)}>Activate</DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteField(field.id)}>Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            }) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No fields created yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <CreateEditFieldDialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                field={currentField}
                onSave={handleSaveField}
            />
        </>
    );
}
