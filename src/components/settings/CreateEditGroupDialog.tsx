
"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { Group, Staff, AppSection, Permission, PermissionsState } from "@/lib/types";
import { mockStaff, mockSections } from "@/lib/data";
import { DualListBox, type DualListItem } from "./DualListBox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";


interface CreateEditGroupDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  group: Group | null;
  permissions: PermissionsState;
  onSave: (group: Partial<Group>, members: string[], rights: { [sectionId: string]: { [key in Permission]?: boolean; } }) => void;
}

const allStaff: DualListItem[] = mockStaff.map(s => ({ id: s.id, name: s.name, details: s.role }));
const allSections = mockSections.filter(s => s.status === 'Active');
const PERMISSION_KEYS: Permission[] = ['view', 'create', 'edit', 'delete'];

export function CreateEditGroupDialog({ isOpen, setIsOpen, group, permissions, onSave }: CreateEditGroupDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  
  const [selectedStaff, setSelectedStaff] = useState<DualListItem[]>([]);
  const [groupPermissions, setGroupPermissions] = useState<PermissionsState[string]>({});

  const isEditMode = !!group?.id;

  useEffect(() => {
    if (isOpen) {
      if (group) {
        setName(group.name);
        setDescription(group.description);
        
        const groupStaff = allStaff.filter(staff => group.userIds.includes(staff.id));
        setSelectedStaff(groupStaff);
        
        setGroupPermissions(permissions[group.id] || {});
        
      } else {
        // Reset for new group
        setName("");
        setDescription("");
        setSelectedStaff([]);
        setGroupPermissions({});
      }
    }
  }, [group, isOpen, permissions]);
  
  const handlePermissionChange = (sectionId: string, permission: Permission, checked: boolean) => {
    setGroupPermissions(prev => {
        const newPerms = JSON.parse(JSON.stringify(prev));
        if (!newPerms[sectionId]) {
            newPerms[sectionId] = {};
        }
        newPerms[sectionId][permission] = checked;
        return newPerms;
    });
  };
  
  const handleSelectAllForRow = (sectionId: string, checked: boolean) => {
    setGroupPermissions(prev => {
        const newPerms = JSON.parse(JSON.stringify(prev));
        newPerms[sectionId] = {
            view: checked,
            create: checked,
            edit: checked,
            delete: checked,
        };
        return newPerms;
    });
  };

  const handleSave = () => {
    if (!name) {
      alert("Group Name is required.");
      return;
    }
    const groupData: Partial<Group> = { id: group?.id, name, description };
    const memberIds = selectedStaff.map(s => s.id);

    onSave(groupData, memberIds, groupPermissions);
    setIsOpen(false);
  };
  
  const assignedRightsCount = useMemo(() => {
    return Object.values(groupPermissions).reduce((total, sectionPerms) => {
        return total + Object.values(sectionPerms).filter(Boolean).length;
    }, 0);
  }, [groupPermissions]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEditMode ? `Edit Group: ${name}` : "Create New Group"}</DialogTitle>
          <DialogDescription>
            Manage group details, assigned members, and system rights all in one place.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="w-full flex-grow min-h-0">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="members">Members ({selectedStaff.length})</TabsTrigger>
            <TabsTrigger value="rights">Rights ({assignedRightsCount})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="pt-4">
             <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right pt-2">Description</Label>
                  <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" rows={3} />
                </div>
             </div>
          </TabsContent>

          <TabsContent value="members" className="h-[calc(100%-40px)]">
             <DualListBox
                available={allStaff}
                selected={selectedStaff}
                onSelectionChange={setSelectedStaff}
                availableHeader="Available Staff"
                selectedHeader="Assigned Staff"
             />
          </TabsContent>
          
          <TabsContent value="rights" className="h-[calc(100%-40px)] pt-2 overflow-hidden">
             <ScrollArea className="h-full pr-4">
                <Table>
                    <TableHeader className="sticky top-0 bg-background z-10">
                        <TableRow>
                            <TableHead>Section</TableHead>
                            <TableHead className="text-center">View</TableHead>
                            <TableHead className="text-center">Create</TableHead>
                            <TableHead className="text-center">Edit</TableHead>
                            <TableHead className="text-center">Delete</TableHead>
                            <TableHead className="text-center">All</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allSections.map((section) => {
                             const areAllSelectedForRow = PERMISSION_KEYS.every(p => groupPermissions[section.id]?.[p]);
                             return (
                                <TableRow key={section.id}>
                                    <TableCell className="font-medium">{section.name}</TableCell>
                                    {PERMISSION_KEYS.map(p => (
                                        <TableCell key={p} className="text-center">
                                            <Checkbox 
                                                checked={groupPermissions[section.id]?.[p] || false}
                                                onCheckedChange={(checked) => handlePermissionChange(section.id, p, !!checked)}
                                            />
                                        </TableCell>
                                    ))}
                                    <TableCell className="text-center">
                                         <Checkbox 
                                            checked={areAllSelectedForRow}
                                            onCheckedChange={(checked) => handleSelectAllForRow(section.id, !!checked)}
                                        />
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
             </ScrollArea>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Group</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
