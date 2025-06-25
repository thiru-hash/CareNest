"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "../ui/button";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { mockSections, mockForms } from "@/lib/data";
import { Badge } from "../ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { AppSection } from "@/lib/types";
import { CreateEditSectionDialog } from "./CreateEditSectionDialog";
import { iconMap } from "@/lib/icon-map";

export function SectionManager() {
    const [sections, setSections] = useState<AppSection[]>(mockSections.sort((a,b) => a.order - b.order));
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentSection, setCurrentSection] = useState<AppSection | null>(null);

    const handleCreateSection = () => {
        const maxOrder = Math.max(...sections.map(s => s.order), 0);
        setCurrentSection({
            id: '', // Empty ID signifies a new section
            name: "New Section",
            path: "/new-section",
            iconName: "LayoutDashboard",
            order: maxOrder + 10,
            status: "Inactive",
        });
        setIsDialogOpen(true);
    };

    const handleEditSection = (section: AppSection) => {
        setCurrentSection(section);
        setIsDialogOpen(true);
    };

    const handleDeleteSection = (sectionId: string) => {
        // Prevent deleting core sections for demo purposes
        if (['sec-dash', 'sec-settings'].includes(sectionId)) {
            alert("This is a core section and cannot be deleted.");
            return;
        }
        setSections(prev => prev.filter(s => s.id !== sectionId));
    };

    const handleSaveSection = (savedSection: AppSection) => {
        if (sections.some(s => s.id === savedSection.id)) {
            // Update existing
            setSections(prev => prev.map(s => s.id === savedSection.id ? savedSection : s).sort((a, b) => a.order - b.order));
        } else {
            // Create new
            setSections(prev => [...prev, savedSection].sort((a, b) => a.order - b.order));
        }
    };
    
    const getFormName = (formId?: string) => {
        if (!formId) return 'N/A';
        return mockForms.find(f => f.id === formId)?.name || 'N/A';
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>Section Manager</CardTitle>
                            <CardDescription>Create and manage the main navigation sections of the application.</CardDescription>
                        </div>
                        <Button onClick={handleCreateSection}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create Section
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Section Name</TableHead>
                                <TableHead>Icon</TableHead>
                                <TableHead>Linked Form</TableHead>
                                <TableHead>Order</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sections.map((section) => {
                                const Icon = iconMap[section.iconName] || MoreHorizontal;
                                const statusClass = section.status === 'Active' 
                                    ? "bg-green-500/20 text-green-700 border-green-500/30 hover:bg-green-500/30"
                                    : "bg-gray-500/20 text-gray-700 border-gray-500/30 hover:bg-gray-500/30";

                                return (
                                    <TableRow key={section.id}>
                                        <TableCell className="font-medium">{section.name}</TableCell>
                                        <TableCell><Icon className="h-5 w-5 text-muted-foreground" /></TableCell>
                                        <TableCell>{getFormName(section.linkedFormId)}</TableCell>
                                        <TableCell>{section.order}</TableCell>
                                        <TableCell>
                                            <Badge variant={section.status === 'Active' ? 'default' : 'secondary'} className={cn(statusClass)}>{section.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEditSection(section)}>Edit Section</DropdownMenuItem>
                                                    <DropdownMenuItem>Manage Rights</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteSection(section.id)}>Delete</DropdownMenuItem>
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
            <CreateEditSectionDialog 
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                section={currentSection}
                onSave={handleSaveSection}
            />
        </>
    );
}
