
"use client";

import { useState, useEffect } from "react";
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
import type { Group, Staff } from "@/lib/types";
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

  useEffect(() => {
    if (group?.userIds) {
      setSelectedUserIds(new Set(group.userIds));
    } else {
      setSelectedUserIds(new Set());
    }
  }, [group]);

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

  const handleSave = () => {
    if (group) {
      onSave(group.id, Array.from(selectedUserIds));
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Members: {group?.name}</DialogTitle>
          <DialogDescription>
            Select the staff members who should belong to this group.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-72 w-full rounded-md border p-4">
          <div className="space-y-4">
            {mockStaff.map(staff => (
              <div key={staff.id} className="flex items-center space-x-3">
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
                      <p className="font-medium">{staff.name}</p>
                      <p className="text-xs text-muted-foreground">{staff.role}</p>
                    </div>
                </Label>
              </div>
            ))}
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
