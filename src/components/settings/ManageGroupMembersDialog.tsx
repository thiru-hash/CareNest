
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { Group } from "@/lib/types";
import { mockStaff } from "@/lib/data";

interface ManageGroupMembersDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  group: Group | null;
  onSave: (groupId: string, userIds: string[]) => void;
}

export function ManageGroupMembersDialog({
  isOpen,
  setIsOpen,
  group,
  onSave,
}: ManageGroupMembersDialogProps) {
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (group?.userIds) {
      setSelectedUserIds(new Set(group.userIds));
    } else {
      setSelectedUserIds(new Set());
    }
    // Reset search on dialog open
    setSearchTerm("");
  }, [group, isOpen]);

  const filteredStaff = useMemo(() => {
    if (!searchTerm) return mockStaff;
    return mockStaff.filter(staff => 
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleToggleUser = (userId: string, checked: boolean) => {
    setSelectedUserIds(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(userId);
      } else {
        newSet.delete(userId);
      }
      return newSet;
    });
  };

  const handleSelectAllFiltered = (checked: boolean) => {
    const filteredIds = filteredStaff.map(s => s.id);
    if (checked) {
        setSelectedUserIds(prev => new Set([...prev, ...filteredIds]));
    } else {
        setSelectedUserIds(prev => {
            const newSet = new Set(prev);
            filteredIds.forEach(id => newSet.delete(id));
            return newSet;
        });
    }
  };

  const handleSave = () => {
    if (group) {
      onSave(group.id, Array.from(selectedUserIds));
      setIsOpen(false);
    }
  };

  const allFilteredSelected = filteredStaff.length > 0 && filteredStaff.every(s => selectedUserIds.has(s.id));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Members: {group?.name}</DialogTitle>
          <DialogDescription>
            Add or remove staff members from this group. ({selectedUserIds.size} / {mockStaff.length} total members)
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Search by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
            />
        </div>

        <ScrollArea className="h-72 w-full rounded-md border">
          <div className="p-4 space-y-1">
             <div className="flex items-center space-x-3 border-b pb-3 mb-3 sticky top-0 bg-background/95 backdrop-blur-sm z-10 -m-4 p-4">
                <Checkbox
                  id="select-all"
                  checked={allFilteredSelected}
                  onCheckedChange={handleSelectAllFiltered}
                />
                <Label htmlFor="select-all" className="font-semibold text-sm cursor-pointer">
                  {allFilteredSelected ? "Deselect" : "Select"} All ({filteredStaff.length} shown)
                </Label>
              </div>

            {filteredStaff.length > 0 ? filteredStaff.map(staff => (
              <div key={staff.id} className="flex items-center space-x-3 rounded-md p-2 hover:bg-muted/50">
                <Checkbox
                  id={`user-${staff.id}`}
                  checked={selectedUserIds.has(staff.id)}
                  onCheckedChange={(checked) => handleToggleUser(staff.id, !!checked)}
                />
                <Label htmlFor={`user-${staff.id}`} className="flex-1 cursor-pointer flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={staff.avatarUrl} alt={staff.name} />
                      <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium leading-tight">{staff.name}</p>
                      <p className="text-xs text-muted-foreground">{staff.role}</p>
                    </div>
                </Label>
              </div>
            )) : (
                <p className="text-sm text-muted-foreground text-center py-10">No staff members match your search.</p>
            )}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Members</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
