
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { mockForms } from "@/lib/data";
import type { AppSection, SectionTab } from "@/lib/types";
import { CreateEditTabDialog } from "./CreateEditTabDialog";
import { useTabContext } from "@/lib/tab-context";

export function TabManager({ section: initialSection }: { section: AppSection }) {
    const { getSectionTabs, addTab, updateTab, deleteTab } = useTabContext();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentTab, setCurrentTab] = useState<SectionTab | null>(null);

    // Get current tabs from context
    const tabs = getSectionTabs(initialSection.id);

    const handleCreateTab = () => {
        const maxOrder = Math.max(0, ...tabs.map(t => t.order));
        setCurrentTab({
            id: '',
            name: "New Tab",
            order: maxOrder + 10,
            formId: '',
            description: ''
        });
        setIsDialogOpen(true);
    };

    const handleEditTab = (tab: SectionTab) => {
        setCurrentTab(tab);
        setIsDialogOpen(true);
    };

    const handleDeleteTab = (tabId: string) => {
        deleteTab(initialSection.id, tabId);
    };

    const handleSaveTab = (savedTab: SectionTab) => {
        if (tabs.some(t => t.id === savedTab.id)) {
            // Update existing
            updateTab(initialSection.id, savedTab.id, savedTab);
        } else {
            // Create new
            addTab(initialSection.id, {
                name: savedTab.name,
                order: savedTab.order,
                formId: savedTab.formId,
                description: savedTab.description || ''
            });
        }
        setIsDialogOpen(false);
        setCurrentTab(null);
    };
    
    const getFormName = (formId: string) => {
        return mockForms.find(f => f.id === formId)?.name || 'N/A';
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>Section Tabs</CardTitle>
                            <CardDescription>A list of tabs in the "{initialSection.name}" section.</CardDescription>
                        </div>
                        <Button onClick={handleCreateTab}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Tab
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order</TableHead>
                                <TableHead>Tab Name</TableHead>
                                <TableHead>Linked Form</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tabs.length > 0 ? tabs.map((tab) => (
                                <TableRow key={tab.id}>
                                    <TableCell>{tab.order}</TableCell>
                                    <TableCell className="font-medium">{tab.name}</TableCell>
                                    <TableCell>{getFormName(tab.formId)}</TableCell>
                                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                                        {tab.description || '-'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEditTab(tab)}>Edit Tab</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteTab(tab.id)}>Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No tabs created yet for this section.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <CreateEditTabDialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                tab={currentTab}
                onSave={handleSaveTab}
            />
        </>
    );
}
