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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AppSection } from "@/lib/types";
import { iconMap, iconNames } from "@/lib/icon-map";
import { mockForms } from "@/lib/data";

interface CreateEditSectionDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  section: AppSection | null;
  onSave: (section: AppSection) => void;
}

export function CreateEditSectionDialog({
  isOpen,
  setIsOpen,
  section,
  onSave,
}: CreateEditSectionDialogProps) {
  const [name, setName] = useState("");
  const [iconName, setIconName] = useState("LayoutDashboard");
  const [order, setOrder] = useState(0);
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [linkedFormId, setLinkedFormId] = useState<string | undefined>();

  const isEditMode = !!section?.id;

  useEffect(() => {
    if (section) {
      setName(section.name);
      setIconName(section.iconName || "LayoutDashboard");
      setOrder(section.order);
      setStatus(section.status);
      setLinkedFormId(section.linkedFormId);
    } else {
        // Reset for new section
        setName("");
        setIconName("LayoutDashboard");
        setOrder(0);
        setStatus("Inactive");
        setLinkedFormId(undefined);
    }
  }, [section, isOpen]);

  const handleSave = () => {
    const newSectionData: AppSection = {
      id: section?.id || `sec-${Date.now()}`,
      name,
      iconName,
      order,
      status,
      linkedFormId: linkedFormId === "none" ? undefined : linkedFormId,
    };
    onSave(newSectionData);
    setIsOpen(false);
  };

  const IconComponent = iconMap[iconName];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Section" : "Create New Section"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the details for this section." : "Fill in the details for the new section."}
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
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="iconName" className="text-right">
              Icon
            </Label>
            <Select value={iconName} onValueChange={setIconName}>
              <SelectTrigger className="col-span-3">
                <SelectValue asChild>
                    <div className="flex items-center gap-2">
                        {IconComponent && <IconComponent />}
                        <span>{iconName}</span>
                    </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {iconNames.map((name) => {
                  const Icon = iconMap[name];
                  return (
                    <SelectItem key={name} value={name}>
                      <div className="flex items-center gap-2">
                        <Icon />
                        <span>{name}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="order" className="text-right">
              Order
            </Label>
            <Input
              id="order"
              type="number"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="linkedFormId" className="text-right">
              Linked Form
            </Label>
            <Select
              value={linkedFormId || "none"}
              onValueChange={setLinkedFormId}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a form" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {mockForms.map((form) => (
                  <SelectItem key={form.id} value={form.id}>
                    {form.name}
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
                onCheckedChange={(checked) => setStatus(checked ? 'Active' : 'Inactive')}
                className="col-span-3"
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
