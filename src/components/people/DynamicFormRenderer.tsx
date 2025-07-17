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
import { getAllForms } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

interface DynamicFormRendererProps {
  formId: string;
  clientId: string;
  mode?: 'view' | 'edit';
}

interface FormField {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'date' | 'email' | 'phone' | 'number';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
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
  mode = 'view'
}: DynamicFormRendererProps) {
  const [formData, setFormData] = useState<FormData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Mock form definition - in real app this would come from the form builder
  const mockFormFields: FormField[] = useMemo(() => {
    const formDefinitions: { [key: string]: FormField[] } = {
      'form-1': [
        { id: 'client_name', name: 'client_name', type: 'text', label: 'Client Name', required: true },
        { id: 'contact_person', name: 'contact_person', type: 'text', label: 'Contact Person', required: true },
        { id: 'phone', name: 'phone', type: 'phone', label: 'Phone Number', required: true },
        { id: 'email', name: 'email', type: 'email', label: 'Email Address' },
        { id: 'address', name: 'address', type: 'textarea', label: 'Address', placeholder: 'Enter full address' },
        { id: 'emergency_contact', name: 'emergency_contact', type: 'text', label: 'Emergency Contact' },
        { id: 'medical_conditions', name: 'medical_conditions', type: 'textarea', label: 'Medical Conditions', placeholder: 'List any medical conditions or allergies' },
        { id: 'preferred_language', name: 'preferred_language', type: 'select', label: 'Preferred Language', options: [
          { value: 'english', label: 'English' },
          { value: 'maori', label: 'Māori' },
          { value: 'samoan', label: 'Samoan' },
          { value: 'tongan', label: 'Tongan' },
          { value: 'other', label: 'Other' }
        ]},
        { id: 'support_needs', name: 'support_needs', type: 'textarea', label: 'Support Needs', placeholder: 'Describe specific support requirements' },
        { id: 'goals', name: 'goals', type: 'textarea', label: 'Client Goals', placeholder: 'What are the client\'s goals?' },
        { id: 'start_date', name: 'start_date', type: 'date', label: 'Service Start Date' },
        { id: 'funding_source', name: 'funding_source', type: 'select', label: 'Funding Source', options: [
          { value: 'ndis', label: 'NDIS' },
          { value: 'acc', label: 'ACC' },
          { value: 'private', label: 'Private' },
          { value: 'other', label: 'Other' }
        ]},
        { id: 'consent_given', name: 'consent_given', type: 'checkbox', label: 'Consent to share information' }
      ],
      'form-2': [
        { id: 'incident_date', name: 'incident_date', type: 'date', label: 'Incident Date', required: true },
        { id: 'incident_time', name: 'incident_time', type: 'text', label: 'Incident Time', placeholder: 'HH:MM' },
        { id: 'location', name: 'location', type: 'text', label: 'Location', required: true },
        { id: 'description', name: 'description', type: 'textarea', label: 'Incident Description', required: true, placeholder: 'Provide a detailed description of what happened' },
        { id: 'people_involved', name: 'people_involved', type: 'textarea', label: 'People Involved', placeholder: 'List all people involved in the incident' },
        { id: 'witnesses', name: 'witnesses', type: 'textarea', label: 'Witnesses', placeholder: 'List any witnesses' },
        { id: 'actions_taken', name: 'actions_taken', type: 'textarea', label: 'Actions Taken', placeholder: 'What actions were taken immediately after the incident?' },
        { id: 'injuries', name: 'injuries', type: 'textarea', label: 'Injuries', placeholder: 'Describe any injuries sustained' },
        { id: 'medical_attention', name: 'medical_attention', type: 'select', label: 'Medical Attention Required', options: [
          { value: 'none', label: 'None' },
          { value: 'first_aid', label: 'First Aid' },
          { value: 'doctor', label: 'Doctor' },
          { value: 'hospital', label: 'Hospital' },
          { value: 'ambulance', label: 'Ambulance' }
        ]},
        { id: 'police_notified', name: 'police_notified', type: 'checkbox', label: 'Police notified' },
        { id: 'family_notified', name: 'family_notified', type: 'checkbox', label: 'Family/Guardian notified' },
        { id: 'reported_to_ndis', name: 'reported_to_ndis', type: 'checkbox', label: 'Reported to NDIS Commission' }
      ],
      'form-3': [
        { id: 'vehicle_id', name: 'vehicle_id', type: 'text', label: 'Vehicle ID', required: true },
        { id: 'check_date', name: 'check_date', type: 'date', label: 'Check Date', required: true },
        { id: 'checker_name', name: 'checker_name', type: 'text', label: 'Checker Name', required: true },
        { id: 'fuel_level', name: 'fuel_level', type: 'select', label: 'Fuel Level', options: [
          { value: 'full', label: 'Full' },
          { value: '3_4', label: '3/4' },
          { value: '1_2', label: '1/2' },
          { value: '1_4', label: '1/4' },
          { value: 'empty', label: 'Empty' }
        ]},
        { id: 'oil_level', name: 'oil_level', type: 'select', label: 'Oil Level', options: [
          { value: 'good', label: 'Good' },
          { value: 'low', label: 'Low' },
          { value: 'needs_change', label: 'Needs Change' }
        ]},
        { id: 'tire_condition', name: 'tire_condition', type: 'select', label: 'Tire Condition', options: [
          { value: 'good', label: 'Good' },
          { value: 'fair', label: 'Fair' },
          { value: 'poor', label: 'Poor' },
          { value: 'needs_replacement', label: 'Needs Replacement' }
        ]},
        { id: 'lights_working', name: 'lights_working', type: 'checkbox', label: 'All lights working' },
        { id: 'wipers_working', name: 'wipers_working', type: 'checkbox', label: 'Wipers working' },
        { id: 'horn_working', name: 'horn_working', type: 'checkbox', label: 'Horn working' },
        { id: 'seatbelts_working', name: 'seatbelts_working', type: 'checkbox', label: 'All seatbelts working' },
        { id: 'interior_clean', name: 'interior_clean', type: 'checkbox', label: 'Interior clean' },
        { id: 'exterior_clean', name: 'exterior_clean', type: 'checkbox', label: 'Exterior clean' },
        { id: 'issues_found', name: 'issues_found', type: 'textarea', label: 'Issues Found', placeholder: 'Describe any issues found during the check' },
        { id: 'action_required', name: 'action_required', type: 'textarea', label: 'Action Required', placeholder: 'What action is required to fix any issues?' }
      ]
    };

    return formDefinitions[formId] || [];
  }, [formId]);

  // Load existing form data
  useEffect(() => {
    const loadFormData = async () => {
      setIsLoading(true);
      try {
        // Mock API call - in real app this would fetch from database
        const mockData: FormData = {
          client_name: 'Dianne Russell',
          contact_person: 'Ms Juliane Cheng',
          phone: '(229) 555-0109',
          email: 'd.russell@gmail.com',
          address: '6301 Elgin St. Celina, Delaware, 10299',
          emergency_contact: 'Ms Juliane Cheng - 0400004335',
          medical_conditions: 'None reported',
          preferred_language: 'english',
          support_needs: 'Personal care and community access support',
          goals: 'Increase independence in daily activities and community participation',
          start_date: '2022-04-15',
          funding_source: 'ndis',
          consent_given: true
        };

        setFormData(mockData);
      } catch (error) {
        console.error('Error loading form data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load form data',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadFormData();
  }, [formId, clientId, toast]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Mock API call - in real app this would save to database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Log the saved data for debugging
      console.log('Form data saved:', formData);

      toast({
        title: 'Success',
        description: 'Form data saved successfully',
      });
    } catch (error) {
      console.error('Error saving form data:', error);
      toast({
        title: 'Error',
        description: 'Failed to save form data',
        variant: 'destructive'
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

  if (mockFormFields.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No form configuration found for this tab.</p>
        <p className="text-sm text-gray-400 mt-2">Configure forms in System Settings > Forms.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockFormFields.map(renderField)}
      </div>
      
      {mode === 'edit' && (
        <div className="flex justify-end space-x-2 pt-6 border-t">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="min-w-[100px]"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      )}
    </div>
  );
} 