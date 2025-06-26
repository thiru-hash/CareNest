
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { Group, Staff, UserRole, Property } from "@/lib/types";
import { userRoles } from "@/lib/roles";
import { DualListBox, type DualListItem } from "./DualListBox";

interface CreateEditStaffDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  staff: Staff | null;
  onSave: (user: Partial<Staff>) => void;
  allGroups: Group[];
  allProperties: Property[];
}

export function CreateEditStaffDialog({ isOpen, setIsOpen, staff, onSave, allGroups, allProperties }: CreateEditStaffDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("Support Worker");
  
  const [selectedGroups, setSelectedGroups] = useState<DualListItem[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<DualListItem[]>([]);

  const isEditMode = !!staff?.id;

  const allGroupItems: DualListItem[] = useMemo(() => {
    return allGroups.map(g => ({ id: g.id, name: g.name, details: g.description }));
  }, [allGroups]);
  
  const allPropertyItems: DualListItem[] = useMemo(() => {
      return allProperties.map(p => ({ id: p.id, name: p.name, details: p.address }));
  }, [allProperties]);


  useEffect(() => {
    if (isOpen) {
      if (staff) { // Edit mode
        setName(staff.name);
        setEmail(staff.email);
        setRole(staff.role);
        
        const userGroups = allGroupItems.filter(groupItem => staff.groupIds?.includes(groupItem.id));
        setSelectedGroups(userGroups);

        const userProperties = allPropertyItems.filter(propItem => staff.propertyIds?.includes(propItem.id));
        setSelectedProperties(userProperties);
        
      } else { // Create mode
        setName("");
        setEmail("");
        setRole("Support Worker");
        
        // Default assignments
        const allGroup = allGroupItems.find(g => g.id === 'group-all');
        const trainingProperty = allPropertyItems.find(p => p.id === 'prop-training');
        
        setSelectedGroups(allGroup ? [allGroup] : []);
        setSelectedProperties(trainingProperty ? [trainingProperty] : []);
      }
    }
  }, [staff, isOpen, allGroupItems, allPropertyItems]);

  const handleSave = () => {
    if (!name || !email) {
      alert("User Name and Email are required.");
      return;
    }
    const groupIds = selectedGroups.map(g => g.id);
    const propertyIds = selectedProperties.map(p => p.id);

    const staffData: Partial<Staff> = { 
        id: staff?.id, 
        name, 
        email, 
        role, 
        groupIds,
        propertyIds
    };

    onSave(staffData);
    setIsOpen(false);
  };
  
  const assignedGroupsCount = selectedGroups.length;
  const assignedPropertiesCount = selectedProperties.length;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEditMode ? `Edit User: ${name}` : "Create New User"}</DialogTitle>
          <DialogDescription>
            Manage user details, group assignments, and area access.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="w-full flex-grow min-h-0">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="groups">Groups ({assignedGroupsCount})</TabsTrigger>
            <TabsTrigger value="areas">Areas ({assignedPropertiesCount})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="pt-4">
             <div className="grid gap-4 py-4 max-w-lg mx-auto">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">Role</Label>
                    <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                            {userRoles.map((r) => (
                                <SelectItem key={r} value={r}>{r}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
             </div>
          </TabsContent>

          <TabsContent value="groups" className="h-[calc(100%-40px)]">
             <DualListBox
                available={allGroupItems}
                selected={selectedGroups}
                onSelectionChange={setSelectedGroups}
                availableHeader="Available Groups"
                selectedHeader="Assigned Groups"
             />
          </TabsContent>
          <TabsContent value="areas" className="h-[calc(100%-40px)]">
             <DualListBox
                available={allPropertyItems}
                selected={selectedProperties}
                onSelectionChange={setSelectedProperties}
                availableHeader="Available Areas"
                selectedHeader="Assigned Areas"
             />
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>{isEditMode ? "Save Changes" : "Create User"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
