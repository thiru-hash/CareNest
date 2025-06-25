
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Notice } from "@/lib/types";

interface CreateEditNoticeDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  notice: Notice | null;
  onSave: (notice: Partial<Notice>) => void;
}

export function CreateEditNoticeDialog({
  isOpen,
  setIsOpen,
  notice,
  onSave,
}: CreateEditNoticeDialogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<Notice['type']>("Info");
  const [status, setStatus] = useState<Notice['status']>("Draft");

  const isEditMode = !!notice?.id;

  useEffect(() => {
    if (isOpen) {
      if (notice) {
        setTitle(notice.title);
        setContent(notice.content);
        setType(notice.type);
        setStatus(notice.status);
      } else {
        // Reset for new notice
        setTitle("");
        setContent("");
        setType("Info");
        setStatus("Draft");
      }
    }
  }, [notice, isOpen]);

  const handleSave = () => {
    if (!title || !content) {
      alert("Title and Content are required.");
      return;
    }
    const newNoticeData: Partial<Notice> = {
      id: notice?.id,
      title,
      content,
      type,
      status,
    };
    onSave(newNoticeData);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Notice" : "Create New Notice"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the details for this notice." : "Fill in the details for the new notice."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              placeholder="e.g. System Maintenance"
            />
          </div>
           <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="content" className="text-right pt-2">
                Content
            </Label>
            <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="col-span-3"
                placeholder="Enter the full notice message here..."
                rows={5}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as Notice['type'])}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a notice type" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="Info">Info</SelectItem>
                  <SelectItem value="Warning">Warning</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <div className="flex items-center gap-2 col-span-3">
                <Switch
                    id="status"
                    checked={status === 'Published'}
                    onCheckedChange={(checked) => setStatus(checked ? 'Published' : 'Draft')}
                />
                <span>{status}</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Notice</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
