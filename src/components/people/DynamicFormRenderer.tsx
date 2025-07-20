"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { getFormConfig } from '@/lib/formConfig';
import { useToast } from '@/hooks/use-toast';

interface DynamicFormRendererProps {
  formId: string;
  clientId: string;
  mode?: 'view' | 'edit';
  initialData?: { [key: string]: any };
  onSubmit?: (formData: { [key: string]: any }, action: 'save' | 'submit' | 'draft') => void;
}

interface FormField {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'date' | 'email' | 'phone' | 'number';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  defaultValue?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

interface FormData {
  [key: string]: any;
}

export function DynamicFormRenderer({ 
  formId, 
  clientId, 
  mode = 'view',
  initialData = {},
  onSubmit
}: DynamicFormRendererProps) {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Get form configuration from the universal form config system
  const formConfig = useMemo(() => {
    return getFormConfig(formId);
  }, [formId]);

  // If no form configuration found, show fallback message
  if (!formConfig) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-700">
            Form Configuration Not Found
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">
              This form hasn't been configured yet. Please check the Form Settings.
            </p>
            <p className="text-sm text-gray-400">
              Form ID: {formId}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Initialize form data with default values from form config
  useEffect(() => {
    if (formConfig && Object.keys(initialData).length === 0) {
      const defaultData: FormData = {};
      formConfig.fields.forEach(field => {
        if (field.defaultValue !== undefined) {
          defaultData[field.name] = field.defaultValue;
        }
      });
      setFormData(defaultData);
    }
  }, [formConfig, initialData]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSubmit = async (action: 'save' | 'submit' | 'draft') => {
    setIsSaving(true);
    try {
      // Validate required fields
      const requiredFields = formConfig.fields.filter(field => field.required);
      const missingFields = requiredFields.filter(field => !formData[field.name]);
      
      if (missingFields.length > 0) {
        toast({
          title: "Validation Error",
          description: `Please fill in all required fields: ${missingFields.map(f => f.label).join(', ')}`,
          variant: "destructive",
        });
        return;
      }

      // Add metadata to form data
      const submissionData = {
        ...formData,
        clientId,
        formId,
        submittedAt: new Date().toISOString(),
        status: action === 'draft' ? 'draft' : 'submitted'
      };

      if (onSubmit) {
        await onSubmit(submissionData, action);
      } else {
        // Mock submission - in real app this would go to your API
        console.log('Form submission:', submissionData);
        
        toast({
          title: "Form Submitted",
          description: `Form data has been ${action === 'draft' ? 'saved as draft' : 'submitted'} successfully.`,
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Submission Error",
        description: "There was an error submitting the form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id] || '';
    const isReadOnly = mode === 'view';

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'number':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              readOnly={isReadOnly}
              className={isReadOnly ? 'bg-gray-50' : ''}
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={field.id}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              readOnly={isReadOnly}
              className={isReadOnly ? 'bg-gray-50' : ''}
              rows={4}
            />
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={value}
              onValueChange={(val) => handleFieldChange(field.id, val)}
              disabled={isReadOnly}
            >
              <SelectTrigger className={isReadOnly ? 'bg-gray-50' : ''}>
                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id} className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={value}
              onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
              disabled={isReadOnly}
            />
            <Label htmlFor={field.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
          </div>
        );

      case 'date':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type="date"
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              required={field.required}
              readOnly={isReadOnly}
              className={isReadOnly ? 'bg-gray-50' : ''}
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading form...</div>
      </div>
    );
  }

  if (formConfig.fields.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No fields configured for this form.</p>
        <p className="text-sm text-gray-400 mt-2">Configure fields in System Settings > Forms.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formConfig.fields.map(renderField)}
      </div>
      
      {mode === 'edit' && (
        <div className="flex justify-end space-x-2 pt-6 border-t">
          <Button
            onClick={() => handleSubmit('save')}
            disabled={isSaving}
            className="min-w-[100px]"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button
            onClick={() => handleSubmit('submit')}
            disabled={isSaving}
            className="min-w-[100px]"
          >
            {isSaving ? 'Submitting...' : 'Submit'}
          </Button>
          <Button
            onClick={() => handleSubmit('draft')}
            disabled={isSaving}
            className="min-w-[100px]"
          >
            {isSaving ? 'Drafting...' : 'Draft'}
          </Button>
        </div>
      )}
    </div>
  );
} 