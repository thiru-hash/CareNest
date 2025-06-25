
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
import { mockForms } from "@/lib/data";
import { Combobox, type ComboboxOption } from "../ui/combobox";
import * as icons from "lucide-react";
import React from "react";

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
  const [path, setPath] = useState("");
  const [iconName, setIconName] = useState("LayoutDashboard");
  const [order, setOrder] = useState(0);
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [linkedFormId, setLinkedFormId] = useState<string | undefined>();
  const [iconOptions, setIconOptions] = useState<ComboboxOption[]>([]);


  const isEditMode = !!section?.id;

  useEffect(() => {
    if (isOpen) {
        if (section) {
            setName(section.name);
            setPath(section.path);
            setIconName(section.iconName || "LayoutDashboard");
            setOrder(section.order);
            setStatus(section.status);
            setLinkedFormId(section.linkedFormId);
        } else {
            // Reset for new section
            setName("");
            setPath("");
            setIconName("LayoutDashboard");
            setOrder(0);
            setStatus("Inactive");
            setLinkedFormId(undefined);
        }
    }
  }, [section, isOpen]);

  useEffect(() => {
    const excludedIcons = [
      'default', 'createLucideIcon', 'icons', 'LucideIcon', 'LucideProps', 'IconNode', 'toPascalCase'
    ];
    
    if (!icons || typeof icons !== 'object') {
        setIconOptions([]);
        return;
    }

    const generatedOptions = Object.keys(icons).map(name => {
        const IconComponent = (icons as any)[name];

        const isComponent = IconComponent && typeof IconComponent === 'object' && IconComponent.$$typeof === Symbol.for('react.forward_ref');

        if (!isComponent || excludedIcons.includes(name) || !/^[A-Z]/.test(name) ) {
            return null;
        }

        return {
            value: name,
            label: (
                <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5" />
                    <span>{name}</span>
                </div>
            )
        };
    }).filter((option): option is ComboboxOption => option !== null)
    .sort((a, b) => a.value.localeCompare(b.value));

    setIconOptions(generatedOptions);

  }, []);


  const handleSave = () => {
    // Basic validation
    if (!name || !path) {
        alert("Section Name and Path are required.");
        return;
    }
    const newSectionData: AppSection = {
      id: section?.id || `sec-${Date.now()}`,
      name,
      path,
      iconName,
      order,
      status,
      linkedFormId: linkedFormId === "none" ? undefined : linkedFormId,
    };
    onSave(newSectionData);
    setIsOpen(false);
  };
  
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
              placeholder="e.g. Dashboard"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="path" className="text-right">
              Path
            </Label>
            <Input
              id="path"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              className="col-span-3"
              placeholder="e.g. /dashboard"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="iconName" className="text-right">
              Icon
            </Label>
            <div className="col-span-3">
                <Combobox
                    options={iconOptions}
                    value={iconName}
                    onChange={setIconName}
                    placeholder="Select icon..."
                    searchPlaceholder="Search icons..."
                    noResultsMessage="No icon found."
                />
            </div>
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
