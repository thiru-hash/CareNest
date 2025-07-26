"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../ui/table";
import { mockForms, mockSections, getAllForms, getAllSections, setStoredForms, getStoredForms } from "@/lib/data";
import { Badge } from "../ui/badge";
import { autoDetectNewForms } from "@/lib/terminology";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { CustomForm, AppSection, FormField } from "@/lib/types";
import { CreateEditFormDialog } from "./CreateEditFormDialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../ui/select";

type FormBuilderProps = {
  form?: CustomForm;
  onSubmit?: (formData: { [key: string]: any }) => void;
  initialData?: { [key: string]: any };
  readonly?: boolean;
  onDatabaseCreation?: (sectionName: string, formData: any) => Promise<void>;
};

export function FormBuilder({ 
  form, 
  onSubmit, 
  initialData = {}, 
  readonly = false,
  onDatabaseCreation 
}: FormBuilderProps) {
  const [forms, setForms] = useState<CustomForm[]>(() => getAllForms());
  const [sections, setSections] = useState<AppSection[]>(() => getAllSections());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState<CustomForm | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: any }>(initialData);
  
  // Use ref to track if we've already processed the initialData
  const initialDataRef = useRef<string>('');

  // Update formData when initialData changes - with proper dependency management
  useEffect(() => {
    const initialDataString = JSON.stringify(initialData);
    
    // Only update if initialData is actually different from what we've processed before
    if (initialDataString !== initialDataRef.current) {
      initialDataRef.current = initialDataString;
      setFormData(initialData);
    }
  }, [initialData]); // Remove formData from dependencies to prevent infinite loop

  const handleCreateForm = useCallback(() => setIsDialogOpen(true), []);
  
  const handleEditForm = useCallback((form: CustomForm) => {
    setCurrentForm(form);
    setIsDialogOpen(true);
  }, []);

  const handleDeleteForm = useCallback((formId: string) => {
    const updatedForms = forms.filter((form) => form.id !== formId);
    setForms(updatedForms);
    
    // Update localStorage
    const newForms = updatedForms.filter(form => 
      !mockForms.some(mockForm => mockForm.id === form.id)
    );
    setStoredForms(newForms);
  }, [forms]);

  const handleSaveForm = useCallback((savedForm: CustomForm) => {
    let updatedForms: CustomForm[];
    
    if (forms.some((f) => f.id === savedForm.id)) {
      updatedForms = forms.map((f) => (f.id === savedForm.id ? savedForm : f));
    } else {
      updatedForms = [...forms, { ...savedForm, fields: [] }];
      
      // Auto-detect new form for terminology
      autoDetectNewForms([savedForm]);
    }
    
    setForms(updatedForms);
    
    // Store only the new forms (not the mock forms) in localStorage
    const storedForms = getStoredForms();
    const newForms = updatedForms.filter(form => 
      !mockForms.some(mockForm => mockForm.id === form.id)
    );
    setStoredForms(newForms);
    
    // Dispatch custom event to update any components that depend on forms
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('carenest-forms-updated'));
    }
  }, [forms]);

  const handleInputChange = useCallback((fieldId: string, value: any) => {
    if (!readonly) {
      setFormData((prev) => ({ ...prev, [fieldId]: value }));
    }
  }, [readonly]);

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    if (onSubmit && !readonly) onSubmit(formData);
  }, [onSubmit, readonly, formData]);

  // 🔘 Render Dynamic Form if `form` is passed
  if (form) {
    return (
      <form onSubmit={handleSubmit} className="grid gap-6 py-6 max-w-3xl mx-auto">
        {form.fields.map((field) => (
          <div key={field.id} className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={field.id} className="text-right col-span-1">
              {field.name}
            </Label>
            <div className="col-span-3">
              {["text", "textbox", "textbox-full", "currency", "number-whole", "number-decimal", "phone", "email"].includes(field.type) ? (
                <Input
                  id={field.id}
                  type={
                    ["number-whole", "number-decimal", "currency"].includes(field.type)
                      ? "number"
                      : field.type === "email"
                      ? "email"
                      : field.type === "phone"
                      ? "tel"
                      : "text"
                  }
                  value={formData[field.id] || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  disabled={readonly || field.readonly}
                  className={readonly || field.readonly ? "bg-gray-50 cursor-not-allowed" : ""}
                  placeholder={field.placeholder}
                />
              ) : field.type === "dropdown" ? (
                <Select 
                  onValueChange={(value) => handleInputChange(field.id, value)}
                  disabled={readonly || field.readonly}
                  value={formData[field.id] || ""}
                  key={field.id}
                >
                  <SelectTrigger className={readonly || field.readonly ? "bg-gray-50 cursor-not-allowed" : ""}>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {/* @ts-ignore */}
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === "date" || field.type === "dob" ? (
                <Input
                  id={field.id}
                  type="date"
                  value={formData[field.id] || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  disabled={readonly || field.readonly}
                  className={readonly || field.readonly ? "bg-gray-50 cursor-not-allowed" : ""}
                />
              ) : field.type === "richtext" ? (
                <textarea
                  id={field.id}
                  value={formData[field.id] || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className={`border rounded p-2 w-full ${readonly || field.readonly ? "bg-gray-50 cursor-not-allowed" : ""}`}
                  rows={4}
                  disabled={readonly || field.readonly}
                  placeholder={field.placeholder}
                />
              ) : field.type === "headline" ? (
                <h2 className="col-span-4 text-lg font-semibold mt-4 mb-2">
                  {field.name}
                </h2>
              ) : field.type === "sub-headline" ? (
                <h3 className="col-span-4 text-md font-semibold mt-3 mb-1">
                  {field.name}
                </h3>
              ) : (
                <span className="text-gray-500">Unsupported Field Type</span>
              )}
            </div>
          </div>
        ))}

        {!readonly && (
          <div className="col-span-4 text-right">
            <Button type="submit">Submit</Button>
          </div>
        )}
      </form>
    );
  }

  // 🧩 Default Form Management Interface
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Form Builder</CardTitle>
              <CardDescription>
                Design and manage custom forms to link with your sections.
              </CardDescription>
            </div>
            <Button onClick={handleCreateForm}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Form
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Form Name</TableHead>
                <TableHead>Linked Section</TableHead>
                <TableHead>Fields</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forms.map((form) => {
                const section = sections.find((s) => s.id === form.linkedSectionId);
                const statusVariant = form.status === "Active" ? "default" : "secondary";
                const statusClass =
                  form.status === "Active"
                    ? "bg-green-500/20 text-green-700 border-green-500/30 hover:bg-green-500/30"
                    : "bg-gray-500/20 text-gray-700 border-gray-500/30 hover:bg-gray-500/30";

                return (
                  <TableRow key={form.id}>
                    <TableCell className="font-medium">{form.name}</TableCell>
                    <TableCell>{section?.name || "N/A"}</TableCell>
                    <TableCell>{form.fields.length}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant} className={cn(statusClass)}>
                        {form.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditForm(form)}>
                            Edit Form
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/settings/forms/${form.id}`}>Manage Fields</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled>Permissions</DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteForm(form.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateEditFormDialog
        key={`form-dialog-${isDialogOpen ? 'open' : 'closed'}`}
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        form={currentForm}
        sections={sections}
        onSave={handleSaveForm}
      />
    </>
  );
}
