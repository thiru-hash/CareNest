
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import type { FormField, FormFieldType } from "@/lib/types";
import { fieldTypes } from "@/lib/data";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "../ui/checkbox";

interface CreateEditFieldDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  field: FormField | null;
  onSave: (field: FormField) => void;
}

const availableRoles = [
  { id: "admin", name: "System Admin" },
  { id: "manager", name: "Support Manager" },
  { id: "worker", name: "Support Worker" },
  { id: "roster-admin", name: "Roster Admin" },
  { id: "finance-admin", name: "Finance Admin" },
  { id: "hr-manager", name: "HR Manager" },
  { id: "ceo", name: "CEO" },
  { id: "reception", name: "Reception" },
];

export function CreateEditFieldDialog({
  isOpen,
  setIsOpen,
  field,
  onSave,
}: CreateEditFieldDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<string>("text"); // CHANGED: string instead of FormFieldType
  const [order, setOrder] = useState(0);
  const [tooltip, setTooltip] = useState("");
  const [required, setRequired] = useState(false);
  const [status, setStatus] = useState<'Active' | 'Inactive'>("Active");
  const [visibleRoles, setVisibleRoles] = useState<string[]>([]);

  const isEditMode = !!field?.id;

  const fieldTypeOptions = useMemo<ComboboxOption[]>(() => {
    return fieldTypes.map(ft => ({
        value: ft.value,
        label: (
            <div className="flex items-center gap-2">
                <ft.icon className="h-5 w-5" />
                <span>{ft.label}</span>
            </div>
        )
    }));
  }, []);

  const fieldTypeHelp = useMemo(() => {
    return fieldTypes.find(ft => ft.value === type)?.description || "";
  }, [type]);

  useEffect(() => {
    if (isOpen) {
        if (field) {
            setName(field.name);
            setType(field.type); // type is now string
            setOrder(field.order);
            setTooltip(field.tooltip || "");
            setRequired(field.required || false);
            setStatus(field.status || 'Active');
            setVisibleRoles(field.visibleRoles || []);
        } else {
            // Reset for new field
            setName("");
            setType("text");
            setOrder(0);
            setTooltip("");
            setRequired(false);
            setStatus('Active');
            setVisibleRoles([]);
        }
    }
  }, [field, isOpen]);

  const handleSave = () => {
    if (!name || !type) {
        alert("Field Name and Type are required.");
        return;
    }
    const newFieldData: FormField = {
      id: field?.id || '',
      name,
      type: type as FormFieldType, // CHANGED: cast to FormFieldType only here
      order,
      tooltip,
      required,
      status,
      visibleRoles,
    };
    onSave(newFieldData);
    setIsOpen(false);
  };

  const handleRoleToggle = (roleId: string) => {
    setVisibleRoles(prev =>
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Field" : "Create New Field"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the details for this field." : "Configure the new field for your form."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                    Field Name
                </Label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g. Client First Name"
                />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fieldType" className="text-right">
                    Field Type
                </Label>
                <div className="col-span-3">
                    <Combobox
                        options={fieldTypeOptions}
                        value={type}
                        onChange={(value) => {
                            console.log('Dialog onChange called with:', value);
                            setType(value);
                        }}
                        placeholder="Select field type..."
                        searchPlaceholder="Search field types..."
                        noResultsMessage="No field type found."
                    />
                    {fieldTypeHelp && (
                      <div className="mt-2 text-xs text-muted-foreground bg-muted p-2 rounded">
                        {fieldTypeHelp}
                      </div>
                    )}

                </div>
            </div>
             <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="tooltip" className="text-right pt-2">
                    Tooltip
                </Label>
                <Textarea
                    id="tooltip"
                    value={tooltip}
                    onChange={(e) => setTooltip(e.target.value)}
                    className="col-span-3"
                    placeholder="Optional help text for users"
                    rows={3}
                />
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
                <Label htmlFor="required" className="text-right">
                    Mandatory
                </Label>
                 <Switch
                    id="required"
                    checked={required}
                    onCheckedChange={setRequired}
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                    Status
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Switch
                    id="status"
                    checked={status === 'Active'}
                    onCheckedChange={(checked) => setStatus(checked ? 'Active' : 'Inactive')}
                  />
                  <span className="text-sm text-muted-foreground">
                    {status === 'Active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Field Visibility</Label>
                <div className="col-span-3 space-y-2">
                  <div className="text-xs text-muted-foreground mb-1">Select which roles can see this field. If none selected, field is visible to all.</div>
                  <div className="flex flex-wrap gap-2">
                    {availableRoles.map(role => (
                      <div key={role.id} className="flex items-center gap-1">
                        <Checkbox
                          id={role.id}
                          checked={visibleRoles.includes(role.id)}
                          onCheckedChange={() => handleRoleToggle(role.id)}
                        />
                        <Label htmlFor={role.id} className="text-xs cursor-pointer">{role.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>
            </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Field</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
