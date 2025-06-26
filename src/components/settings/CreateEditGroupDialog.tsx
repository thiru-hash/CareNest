
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Group } from "@/lib/types";

interface CreateEditGroupDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  group: Group | null;
  onSave: (group: Partial<Group>) => void;
}

export function CreateEditGroupDialog({
  isOpen,
  setIsOpen,
  group,
  onSave,
}: CreateEditGroupDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const isEditMode = !!group?.id;

  useEffect(() => {
    if (isOpen) {
        if (group) {
            setName(group.name);
            setDescription(group.description);
        } else {
            // Reset for new group
            setName("");
            setDescription("");
        }
    }
  }, [group, isOpen]);

  const handleSave = () => {
    if (!name) {
        alert("Group Name is required.");
        return;
    }
    const newGroupData: Partial<Group> = {
      id: group?.id,
      name,
      description,
    };
    onSave(newGroupData);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Group" : "Create New Group"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the details for this group." : "Fill in the details for the new group."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Group Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="e.g. Support Workers"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
             <Label htmlFor="description" className="text-right pt-2">
                Description
            </Label>
            <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                placeholder="A short description of the group's purpose."
                rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
