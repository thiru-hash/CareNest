
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SectionTab } from "@/lib/types";
import { mockForms } from "@/lib/data";

interface CreateEditTabDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  tab: SectionTab | null;
  onSave: (tab: SectionTab) => void;
}

export function CreateEditTabDialog({
  isOpen,
  setIsOpen,
  tab,
  onSave,
}: CreateEditTabDialogProps) {
  const [name, setName] = useState("");
  const [order, setOrder] = useState(0);
  const [formId, setFormId] = useState("");

  const isEditMode = !!tab?.id;

  useEffect(() => {
    if (isOpen) {
        if (tab) {
            setName(tab.name);
            setOrder(tab.order);
            setFormId(tab.formId);
        } else {
            // Reset for new tab
            setName("");
            setOrder(0);
            setFormId("");
        }
    }
  }, [tab, isOpen]);

  const handleSave = () => {
    if (!name || !formId) {
        alert("Tab Name and Linked Form are required.");
        return;
    }
    const newTabData: SectionTab = {
      id: tab?.id || '',
      name,
      order,
      formId,
    };
    onSave(newTabData);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Tab" : "Create New Tab"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the details for this tab." : "Configure the new tab."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Tab Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="e.g. Client Intake"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="formId" className="text-right">
              Linked Form
            </Label>
            <Select
              value={formId}
              onValueChange={setFormId}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a form" />
              </SelectTrigger>
              <SelectContent>
                {mockForms.filter(f => f.status === 'Active').map((form) => (
                  <SelectItem key={form.id} value={form.id}>
                    {form.name}
                  </SelectItem>
                ))}
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
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Tab</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
