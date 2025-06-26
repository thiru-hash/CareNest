
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

import type { Group, Staff, UserRole } from "@/lib/types";
import { mockStaff, mockSections } from "@/lib/data";
import { DualListBox, type DualListItem } from "./DualListBox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { userRoles } from "@/lib/roles";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";


interface CreateEditUserDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: Staff | null;
  onSave: (user: Partial<Staff>) => void;
  allGroups: Group[];
}

export function CreateEditUserDialog({ isOpen, setIsOpen, user, onSave, allGroups }: CreateEditUserDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("Support Worker");
  
  const [selectedGroups, setSelectedGroups] = useState<DualListItem[]>([]);

  const isEditMode = !!user?.id;
  
  const allGroupItems: DualListItem[] = useMemo(() => {
    return allGroups.map(g => ({ id: g.id, name: g.name, details: g.description }));
  }, [allGroups]);

  useEffect(() => {
    if (isOpen) {
      if (user) {
        setName(user.name);
        setEmail(user.email);
        setRole(user.role);
        
        const userGroups = allGroupItems.filter(groupItem => user.groupIds?.includes(groupItem.id));
        setSelectedGroups(userGroups);
        
      } else {
        // Reset for new user
        setName("");
        setEmail("");
        setRole("Support Worker");
        setSelectedGroups([]);
      }
    }
  }, [user, isOpen, allGroupItems]);

  const handleSave = () => {
    if (!name || !email) {
      alert("User Name and Email are required.");
      return;
    }
    const groupIds = selectedGroups.map(g => g.id);
    const userData: Partial<Staff> = { id: user?.id, name, email, role, groupIds };

    onSave(userData);
    setIsOpen(false);
  };
  
  const assignedGroupsCount = selectedGroups.length;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEditMode ? `Edit User: ${name}` : "Create New User"}</DialogTitle>
          <DialogDescription>
            Manage user details and group assignments.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="w-full flex-grow min-h-0">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="groups">Group Assignments ({assignedGroupsCount})</TabsTrigger>
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
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save User</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
