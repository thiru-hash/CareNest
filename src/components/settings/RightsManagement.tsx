
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

const fullAccess = { view: true, create: true, edit: true, delete: true };
const viewOnly = { view: true, create: false, edit: false, delete: false };
const viewCreateEdit = { view: true, create: true, edit: true, delete: false };
const viewCreate = { view: true, create: true, edit: false, delete: false };

const allSections = (permissions: { [key in Permission]?: boolean }) => {
    return Object.fromEntries(mockSections.map(s => [s.id, permissions]));
};

const initialPermissions: PermissionsState = {
    'group-system-admin': allSections(fullAccess),
    'group-support-manager': allSections(viewCreateEdit),
    'group-support-worker': {
        ...allSections({}),
        'sec-dash': viewOnly,
        'sec-roster': viewOnly,
        'sec-people': viewCreate,
        'sec-staff': viewOnly,
        'sec-loc': viewOnly,
        'sec-inc': viewCreate,
    },
    'group-roster-admin': {
        ...allSections({}),
        'sec-roster': fullAccess,
        'sec-staff': viewOnly,
        'sec-people': viewOnly,
        'sec-loc': viewOnly,
        'sec-dash': viewOnly,
    },
    'group-roster-scheduler': {
        ...allSections({}), 
        'sec-roster': viewCreateEdit,
        'sec-staff': viewOnly,
        'sec-people': viewOnly,
        'sec-loc': viewOnly,
        'sec-dash': viewOnly,
    },
    'group-finance-admin': allSections(viewOnly),
    'group-gm-service': allSections(viewCreateEdit),
    'group-ceo': allSections(viewOnly),
    'group-reception': {
        ...allSections({}),
        'sec-dash': viewOnly,
        'sec-roster': viewOnly,
        'sec-staff': viewOnly,
        'sec-loc': viewOnly,
    },
    'group-health-safety': {
        ...allSections({}),
        'sec-inc': fullAccess,
        'sec-people': viewOnly,
        'sec-staff': viewOnly,
        'sec-loc': viewOnly,
    },
    'group-risk-management': {
        ...allSections({}),
        'sec-inc': fullAccess,
    },
    'group-office-admin': allSections(viewCreateEdit),
    'group-clinical-advisor': {
        ...allSections({}),
        'sec-people': viewOnly,
        'sec-roster': viewOnly,
        'sec-inc': viewOnly,
    },
    'group-hr-manager': {
        ...allSections({}),
        'sec-staff': fullAccess,
        'sec-dash': viewOnly,
    },
    'group-hr-admin': {
        ...allSections({}),
        'sec-staff': viewCreateEdit,
        'sec-dash': viewOnly,
    },
    'group-hr': {
        ...allSections({}),
        'sec-staff': viewOnly,
        'sec-dash': viewOnly,
    },
    'group-behavioural-support': {
        ...allSections({}),
        'sec-people': viewOnly,
        'sec-roster': viewOnly,
        'sec-inc': viewOnly,
    },
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
