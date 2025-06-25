
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockGroups, mockSections } from "@/lib/data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import type { Group, AppSection } from "@/lib/types";

type Permission = 'view' | 'create' | 'edit' | 'delete';
type PermissionsState = {
    [groupId: string]: {
        [sectionId: string]: {
            [key in Permission]?: boolean;
        }
    }
};

const initialPermissions: PermissionsState = {
    'group-admin': Object.fromEntries(mockSections.map(s => [s.id, { view: true, create: true, edit: true, delete: true }])),
    'group-managers': Object.fromEntries(mockSections.map(s => [s.id, { view: true, create: true, edit: true, delete: false }])),
    'group-workers': Object.fromEntries(mockSections.map(s => [s.id, { view: true, create: false, edit: false, delete: false }])),
};


export function RightsManagement() {
    const [selectedGroup, setSelectedGroup] = useState<string>(mockGroups[0].id);
    const [permissions, setPermissions] = useState<PermissionsState>(initialPermissions);

    const handlePermissionChange = (sectionId: string, permission: Permission, checked: boolean) => {
        setPermissions(prev => ({
            ...prev,
            [selectedGroup]: {
                ...prev[selectedGroup],
                [sectionId]: {
                    ...prev[selectedGroup]?.[sectionId],
                    [permission]: checked
                }
            }
        }));
    };

    const PERMISSION_KEYS: Permission[] = ['view', 'create', 'edit', 'delete'];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Rights Management</CardTitle>
                <CardDescription>Define what user groups can see and do within each section of the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="max-w-xs">
                    <Label>Select a group to manage their rights</Label>
                    <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a group" />
                        </SelectTrigger>
                        <SelectContent>
                            {mockGroups.map((group) => (
                                <SelectItem key={group.id} value={group.id}>
                                    {group.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Section</TableHead>
                                {PERMISSION_KEYS.map(p => (
                                    <TableHead key={p} className="text-center capitalize">{p}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockSections.filter(s => s.status === 'Active').map((section) => (
                                <TableRow key={section.id}>
                                    <TableCell className="font-medium">{section.name}</TableCell>
                                    {PERMISSION_KEYS.map(p => (
                                        <TableCell key={p} className="text-center">
                                            <Checkbox 
                                                checked={permissions[selectedGroup]?.[section.id]?.[p] || false}
                                                onCheckedChange={(checked) => handlePermissionChange(section.id, p, !!checked)}
                                            />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
