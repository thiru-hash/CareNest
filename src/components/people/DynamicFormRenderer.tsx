'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  CheckCircle, 
  Clock, 
  FileText, 
  Download, 
  Plus,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import ClientOverview from "@/components/people/ClientOverview";

interface FormField {
  id: string;
  name: string;
  type: string;
  order: number;
  required?: boolean;
  status: string;
  visibleRoles: string[];
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  validation?: any;
  readonly?: boolean;
  label?: string;
}

interface CustomForm {
  id: string;
  name: string;
  linkedSectionId: string;
  status: string;
  fields: FormField[];
}

interface DynamicFormRendererProps {
  form: CustomForm;
  clientId: string;
  mode: 'view' | 'edit';
  onSave?: (data: any) => void;
  initialData?: Record<string, any>;
  onChange?: (data: Record<string, any>) => void;
  validationErrors?: Record<string, string>;
}

// Mock data for special field types
const mockTasks = [
  {
    id: 1,
    title: "Contact client for outstanding invoices (Monthly)",
    dueDate: "Mon, 16 Aug",
    priority: "high",
    completed: false
  },
  {
    id: 2,
    title: "Share consultation forms before the next appointment",
    dueDate: "Tue, 25 Aug",
    priority: "medium",
    completed: false
  },
  {
    id: 3,
    title: "Schedule next personal consultation",
    dueDate: "Wed, 26 Aug",
    priority: "medium",
    completed: false
  }
];

const mockDocuments = [
  {
    id: 1,
    title: "Client intake form",
    type: "document",
    submittedDate: "15 Apr, 2022",
    color: "blue"
  },
  {
    id: 2,
    title: "Treatment plan",
    type: "document",
    submittedDate: "18 Apr, 2022",
    color: "yellow"
  }
];

const mockActivity = [
  {
    id: 1,
    action: "Leslie Alexander added new file Primary questionnaire",
    time: "1 day ago"
  },
  {
    id: 2,
    action: "Devon Lane updated personal client information",
    time: "3 days ago"
  },
  {
    id: 3,
    action: "Marvin McKinney requested an appointment for Personal consultation service",
    time: "5 days ago"
  }
];

export function DynamicFormRenderer({ 
  form, 
  clientId, 
  mode, 
  onSave, 
  initialData = {}, 
  onChange,
  validationErrors = {}
}: DynamicFormRendererProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);

  // Update formData when initialData changes
  React.useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleFieldChange = React.useCallback((fieldId: string, value: any) => {
    const newData = {
      ...formData,
      [fieldId]: value
    };
    // Only update if the specific field value actually changed
    if (formData[fieldId] !== value) {
      setFormData(newData);
      if (onChange) {
        onChange(newData);
      }
    }
  }, [formData, onChange]);

  // If this is the overview form, render the ClientOverview component
  if (form.id === "client-overview") {
    return (
      <ClientOverview
        clientId={clientId}
        tasks={mockTasks}
        documents={mockDocuments}
        activity={mockActivity}
        mode={mode}
      />
    );
  }

  const renderField = (field: FormField) => {
    const value = formData[field.id] || '';
    const isReadonly = mode === 'view' || field.readonly;
    const hasError = validationErrors[field.id];
    const isRequired = field.required;

    const renderLabel = () => (
      <Label htmlFor={field.id} className={hasError ? "text-red-600" : ""}>
        {field.name}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </Label>
    );

    const renderError = () => (
      hasError && (
        <div className="text-sm text-red-600 mt-1">
          {hasError}
        </div>
      )
    );

    switch (field.type) {
      case 'text':
        return (
          <div key={field.id} className="space-y-2">
            {renderLabel()}
            <Input
              id={field.id}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              disabled={isReadonly}
              required={isRequired}
              placeholder={field.placeholder}
              className={hasError ? "border-red-500 focus:border-red-500" : ""}
            />
            {renderError()}
          </div>
        );

      case 'email':
        return (
          <div key={field.id} className="space-y-2">
            {renderLabel()}
            <Input
              id={field.id}
              type="email"
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              disabled={isReadonly}
              required={isRequired}
              placeholder={field.placeholder}
              className={hasError ? "border-red-500 focus:border-red-500" : ""}
            />
            {renderError()}
          </div>
        );

      case 'tel':
        return (
          <div key={field.id} className="space-y-2">
            {renderLabel()}
            <Input
              id={field.id}
              type="tel"
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              disabled={isReadonly}
              required={isRequired}
              placeholder={field.placeholder}
              className={hasError ? "border-red-500 focus:border-red-500" : ""}
            />
            {renderError()}
          </div>
        );

      case 'date':
        return (
          <div key={field.id} className="space-y-2">
            {renderLabel()}
            <Input
              id={field.id}
              type="date"
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              disabled={isReadonly}
              required={isRequired}
              className={hasError ? "border-red-500 focus:border-red-500" : ""}
            />
            {renderError()}
          </div>
        );

      case 'number':
        return (
          <div key={field.id} className="space-y-2">
            {renderLabel()}
            <Input
              id={field.id}
              type="number"
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              disabled={isReadonly}
              required={isRequired}
              placeholder={field.placeholder}
              className={hasError ? "border-red-500 focus:border-red-500" : ""}
            />
            {renderError()}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            {renderLabel()}
            <Textarea
              id={field.id}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              disabled={isReadonly}
              required={isRequired}
              placeholder={field.placeholder}
              rows={4}
              className={hasError ? "border-red-500 focus:border-red-500" : ""}
            />
            {renderError()}
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            {renderLabel()}
            <Select
              value={value}
              onValueChange={(val) => handleFieldChange(field.id, val)}
              disabled={isReadonly}
            >
              <SelectTrigger className={hasError ? "border-red-500 focus:border-red-500" : ""}>
                <SelectValue placeholder={field.placeholder || `Select ${field.name.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {renderError()}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id} className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={field.id}
                checked={value}
                onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
                disabled={isReadonly}
                required={isRequired}
              />
              <Label htmlFor={field.id} className={`text-sm font-normal ${hasError ? "text-red-600" : ""}`}>
                {field.label || field.name}
                {isRequired && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            {renderError()}
          </div>
        );

      default:
        return (
          <div key={field.id} className="space-y-2">
            {renderLabel()}
            <Input
              id={field.id}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              disabled={isReadonly}
              required={isRequired}
              placeholder={field.placeholder}
              className={hasError ? "border-red-500 focus:border-red-500" : ""}
            />
            {renderError()}
          </div>
        );
    }
  };

  // Sort fields by order if available
  const sortedFields = form.fields.sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedFields.map((field) => renderField(field))}
      </div>
      
      {mode === 'edit' && onSave && (
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => setFormData(initialData)}
          >
            Reset
          </Button>
          <Button
            type="button"
            onClick={() => onSave(formData)}
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );
} 