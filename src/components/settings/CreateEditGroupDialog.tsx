
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

const generateAllRights = (): DualListItem[] => {
  return allSections.flatMap(section =>
    PERMISSION_KEYS.map(permission => {
      const pName = permission.charAt(0).toUpperCase() + permission.slice(1);
      return {
        id: `${section.id}:${permission}`,
        name: `${section.name}: ${pName}`,
        details: `Allows ${permission} access for the ${section.name} section`
      }
    })
  );
};

const allPossibleRights = generateAllRights();


export function CreateEditGroupDialog({ isOpen, setIsOpen, group, permissions, onSave }: CreateEditGroupDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  
  const [selectedStaff, setSelectedStaff] = useState<DualListItem[]>([]);
  const [selectedRights, setSelectedRights] = useState<DualListItem[]>([]);

  const isEditMode = !!group?.id;

  useEffect(() => {
    if (isOpen) {
      if (group) {
        setName(group.name);
        setDescription(group.description);
        
        // Set members
        const groupStaff = allStaff.filter(staff => group.userIds.includes(staff.id));
        setSelectedStaff(groupStaff);

        // Set rights
        const groupRights: DualListItem[] = [];
        const currentGroupPermissions = permissions[group.id] || {};
        for (const sectionId in currentGroupPermissions) {
          for (const pKey in currentGroupPermissions[sectionId]) {
            if (currentGroupPermissions[sectionId][pKey as Permission]) {
              const right = allPossibleRights.find(r => r.id === `${sectionId}:${pKey}`);
              if (right) {
                groupRights.push(right);
              }
            }
          }
        }
        setSelectedRights(groupRights);
        
      } else {
        // Reset for new group
        setName("");
        setDescription("");
        setSelectedStaff([]);
        setSelectedRights([]);
      }
    }
  }, [group, isOpen, permissions]);

  const handleSave = () => {
    if (!name) {
      alert("Group Name is required.");
      return;
    }
    const groupData: Partial<Group> = { id: group?.id, name, description };
    const memberIds = selectedStaff.map(s => s.id);

    // Convert flat rights list back to nested permission object
    const newPermissions: { [sectionId: string]: { [key in Permission]?: boolean } } = {};
    selectedRights.forEach(right => {
        const [sectionId, permission] = right.id.split(':');
        if (!newPermissions[sectionId]) {
            newPermissions[sectionId] = {};
        }
        newPermissions[sectionId][permission as Permission] = true;
    });

    onSave(groupData, memberIds, newPermissions);
    setIsOpen(false);
  };
  
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
            <TabsTrigger value="rights">Rights ({selectedRights.length})</TabsTrigger>
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
          
          <TabsContent value="rights" className="h-[calc(100%-40px)]">
             <DualListBox
                available={allPossibleRights}
                selected={selectedRights}
                onSelectionChange={setSelectedRights}
                availableHeader="Available Rights"
                selectedHeader="Assigned Rights"
             />
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
