
"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CustomForm, AppSection } from "@/lib/types";

interface CreateEditFormDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  form: CustomForm | null;
  sections: AppSection[];
  onSave: (form: CustomForm) => void;
}

export function CreateEditFormDialog({
  isOpen,
  setIsOpen,
  form,
  sections,
  onSave,
}: CreateEditFormDialogProps) {
  const [name, setName] = useState("");
  const [linkedSectionId, setLinkedSectionId] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Inactive");

  const isEditMode = !!form?.id;

  useEffect(() => {
    if (isOpen) {
        if (form) {
            setName(form.name);
            setLinkedSectionId(form.linkedSectionId);
            setStatus(form.status);
        } else {
            // Reset for new form
            setName("");
            setLinkedSectionId("");
            setStatus("Inactive");
        }
    }
  }, [form, isOpen]);

  const handleSave = useCallback(() => {
    if (!name || !linkedSectionId) {
        alert("Form Name and Linked Section are required.");
        return;
    }
    const newFormData: CustomForm = {
      id: form?.id || `form-${Date.now()}`,
      name,
      linkedSectionId,
      status,
      fields: form?.fields || [], // Preserve fields
    };
    onSave(newFormData);
    setIsOpen(false);
  }, [name, linkedSectionId, status, form, onSave, setIsOpen]);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  const handleStatusChange = useCallback((checked: boolean) => {
    setStatus(checked ? 'Active' : 'Inactive');
  }, []);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} key={`dialog-${isEditMode ? 'edit' : 'create'}`}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Form" : "Create New Form"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the details for this form." : "Fill in the details for the new form."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={handleNameChange}
              className="col-span-3"
              placeholder="e.g. Client Intake Form"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="linkedSectionId" className="text-right">
              Link to Section
            </Label>
            <Select
              value={linkedSectionId}
              onValueChange={setLinkedSectionId}
              key="linked-section-select"
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a section" />
              </SelectTrigger>
              <SelectContent>
                {sections.filter(s => s.status === 'Active').map((section) => (
                  <SelectItem key={section.id} value={section.id}>
                    {section.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Switch
                id="status"
                checked={status === 'Active'}
                onCheckedChange={handleStatusChange}
                className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
