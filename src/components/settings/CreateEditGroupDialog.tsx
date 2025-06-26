
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import type { Group, Staff, AppSection, Permission, PermissionsState } from "@/lib/types";
import { mockStaff, mockSections } from "@/lib/data";

interface CreateEditGroupDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  group: Group | null;
  permissions: PermissionsState;
  onSave: (group: Partial<Group>, members: string[], rights: { [sectionId: string]: { [key in Permission]?: boolean; } }) => void;
}

const allStaff = mockStaff;
const allSections = mockSections.filter(s => s.status === 'Active');
const PERMISSION_KEYS: Permission[] = ['view', 'create', 'edit', 'delete'];

export function CreateEditGroupDialog({ isOpen, setIsOpen, group, permissions, onSave }: CreateEditGroupDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [groupPermissions, setGroupPermissions] = useState<{ [sectionId: string]: { [key in Permission]?: boolean; } }>({});
  const [searchTerm, setSearchTerm] = useState("");

  const isEditMode = !!group?.id;

  useEffect(() => {
    if (isOpen) {
      if (group) {
        setName(group.name);
        setDescription(group.description);
        setSelectedUserIds(new Set(group.userIds));
        setGroupPermissions(permissions[group.id] || {});
      } else {
        // Reset for new group
        setName("");
        setDescription("");
        setSelectedUserIds(new Set());
        setGroupPermissions({});
      }
      setSearchTerm("");
    }
  }, [group, isOpen, permissions]);

  const filteredStaff = useMemo(() => {
    if (!searchTerm) return allStaff;
    return allStaff.filter(staff =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleToggleUser = (userId: string, checked: boolean) => {
    setSelectedUserIds(prev => {
      const newSet = new Set(prev);
      if (checked) newSet.add(userId);
      else newSet.delete(userId);
      return newSet;
    });
  };

  const handlePermissionChange = (sectionId: string, permission: Permission, checked: boolean) => {
    setGroupPermissions(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [permission]: checked
      }
    }));
  };

  const handleSave = () => {
    if (!name) {
      alert("Group Name is required.");
      return;
    }
    const groupData: Partial<Group> = { id: group?.id, name, description };
    onSave(groupData, Array.from(selectedUserIds), groupPermissions);
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Group" : "Create New Group"}</DialogTitle>
          <DialogDescription>
            Manage group details, assigned members, and system rights all in one place.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="members">Members ({selectedUserIds.size})</TabsTrigger>
            <TabsTrigger value="rights">Rights</TabsTrigger>
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

          <TabsContent value="members">
            <div className="py-4 space-y-4">
               <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search staff..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
               </div>
               <ScrollArea className="h-72 w-full rounded-md border">
                  <div className="p-4 space-y-1">
                    {filteredStaff.map(staff => (
                      <div key={staff.id} className="flex items-center space-x-3 rounded-md p-2 hover:bg-muted/50">
                        <Checkbox id={`user-${staff.id}`} checked={selectedUserIds.has(staff.id)} onCheckedChange={(checked) => handleToggleUser(staff.id, !!checked)} />
                        <Label htmlFor={`user-${staff.id}`} className="flex-1 cursor-pointer flex items-center gap-3">
                          <Avatar className="h-8 w-8"><AvatarImage src={staff.avatarUrl} alt={staff.name} /><AvatarFallback>{staff.name.charAt(0)}</AvatarFallback></Avatar>
                          <div>
                            <p className="font-medium leading-tight">{staff.name}</p>
                            <p className="text-xs text-muted-foreground">{staff.role}</p>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
               </ScrollArea>
            </div>
          </TabsContent>
          
          <TabsContent value="rights">
            <ScrollArea className="h-[400px] w-full rounded-md border mt-4">
                <Table>
                    <TableHeader className="sticky top-0 bg-muted/95 backdrop-blur-sm z-10">
                        <TableRow>
                            <TableHead>Section</TableHead>
                            {PERMISSION_KEYS.map(p => <TableHead key={p} className="text-center capitalize">{p}</TableHead>)}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allSections.map(section => (
                            <TableRow key={section.id}>
                                <TableCell className="font-medium">{section.name}</TableCell>
                                {PERMISSION_KEYS.map(p => (
                                    <TableCell key={p} className="text-center">
                                        <Checkbox checked={groupPermissions[section.id]?.[p] || false} onCheckedChange={(checked) => handlePermissionChange(section.id, p, !!checked)} />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
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
