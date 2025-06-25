
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

interface CreateEditFieldDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  field: FormField | null;
  onSave: (field: FormField) => void;
}

export function CreateEditFieldDialog({
  isOpen,
  setIsOpen,
  field,
  onSave,
}: CreateEditFieldDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<FormFieldType>("text");
  const [order, setOrder] = useState(0);

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

  useEffect(() => {
    if (isOpen) {
        if (field) {
            setName(field.name);
            setType(field.type);
            setOrder(field.order);
        } else {
            // Reset for new field
            setName("");
            setType("text");
            setOrder(0);
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
      type,
      order,
    };
    onSave(newFieldData);
    setIsOpen(false);
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
                <Label htmlFor="fieldType" className="text-right">
                    Field Type
                </Label>
                <div className="col-span-3">
                    <Combobox
                        options={fieldTypeOptions}
                        value={type}
                        onChange={(value) => setType(value as FormFieldType)}
                        placeholder="Select field type..."
                        searchPlaceholder="Search field types..."
                        noResultsMessage="No field type found."
                    />
                </div>
            </div>
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
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Field</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
