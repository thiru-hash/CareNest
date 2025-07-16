"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, User, MapPin, Phone, Mail, Hash, DollarSign, Star, Upload, Image, PenSquare, Globe, Database, Calculator, TrendingUp, Clock, RefreshCw, Activity, Package, Heading1, Heading2, Info, Square, Pilcrow, Link, Lock, Binary, Percent, ListOrdered, BarChart3, Code, QrCode, Palette, Eye } from 'lucide-react';
import type { CustomForm, FormField } from '@/lib/types';

interface DynamicFormRendererProps {
  form: CustomForm;
  clientId?: string;
  mode?: 'view' | 'edit';
  onSave?: (data: any) => void;
}

const fieldTypeIcons: { [key: string]: any } = {
  text: FileText,
  email: Mail,
  phone: Phone,
  date: Calendar,
  dob: Calendar,
  time: Clock,
  datetime: Clock,
  number: Hash,
  currency: DollarSign,
  percent: Percent,
  textbox: FileText,
  'textbox-full': Square,
  richtext: Pilcrow,
  url: Link,
  password: Lock,
  'number-whole': Hash,
  'number-decimal': Binary,
  dropdown: ListOrdered,
  'multi-select-dropdown': ListOrdered,
  'dual-select': ListOrdered,
  radio: Star,
  checkbox: Star,
  toggle: Star,
  tags: Package,
  lookup: Database,
  user: User,
  reference: Link,
  'foreign_key': Database,
  'external_select': Globe,
  formula: Calculator,
  rollup: TrendingUp,
  datecalc: Clock,
  'conditional_text': FileText,
  'file-upload': Upload,
  image: Image,
  signature: PenSquare,
  geolocation: MapPin,
  address: MapPin,
  'condition_field': Eye,
  stepper: ListOrdered,
  'progress_bar': BarChart3,
  'json_editor': Code,
  'barcode_scanner': QrCode,
  'color_picker': Palette,
  'created_at': Clock,
  'updated_at': RefreshCw,
  'created_by': User,
  'record_id': Hash,
  status: Activity,
  'service-item': Package,
  headline: Heading1,
  'sub-headline': Heading2,
  infobox: Info,
  'infobox-full': Info,
  spacer: Square
};

export function DynamicFormRenderer({ 
  form, 
  clientId, 
  mode = 'view',
  onSave 
}: DynamicFormRendererProps) {
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [isEditing, setIsEditing] = useState(mode === 'edit');

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const renderField = (field: FormField) => {
    const IconComponent = fieldTypeIcons[field.type] || FileText;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'url':
      case 'password':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
              placeholder={field.placeholder || `Enter ${field.name.toLowerCase()}`}
              value={formData[field.id] || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              disabled={!isEditing}
              className="w-full"
            />
          </div>
        );

      case 'date':
      case 'dob':
      case 'time':
      case 'datetime':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type={field.type === 'time' ? 'time' : 'date'}
              value={formData[field.id] || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              disabled={!isEditing}
              className="w-full"
            />
          </div>
        );

      case 'number':
      case 'number-whole':
      case 'number-decimal':
      case 'currency':
      case 'percent':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type="number"
              step={field.type === 'number-decimal' ? '0.01' : '1'}
              placeholder={field.placeholder || `Enter ${field.name.toLowerCase()}`}
              value={formData[field.id] || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              disabled={!isEditing}
              className="w-full"
            />
          </div>
        );

      case 'textbox':
      case 'textbox-full':
      case 'richtext':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={field.id}
              placeholder={field.placeholder || `Enter ${field.name.toLowerCase()}`}
              value={formData[field.id] || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              disabled={!isEditing}
              rows={field.type === 'textbox-full' ? 6 : 3}
              className="w-full"
            />
          </div>
        );

      case 'dropdown':
      case 'multi-select-dropdown':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={formData[field.id] || ''}
              onValueChange={(value) => handleFieldChange(field.id, value)}
              disabled={!isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${field.name.toLowerCase()}`} />
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
              checked={formData[field.id] || false}
              onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
              disabled={!isEditing}
            />
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
          </div>
        );

      case 'radio':
        return (
          <div key={field.id} className="space-y-2">
            <Label className="text-sm font-medium">
              {field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <RadioGroup
              value={formData[field.id] || ''}
              onValueChange={(value) => handleFieldChange(field.id, value)}
              disabled={!isEditing}
            >
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} />
                  <Label htmlFor={`${field.id}-${option.value}`} className="text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 'headline':
      case 'sub-headline':
        return (
          <div key={field.id} className="py-2">
            <h3 className={`font-semibold text-gray-900 dark:text-gray-100 ${
              field.type === 'headline' ? 'text-lg' : 'text-base'
            }`}>
              {field.name}
            </h3>
          </div>
        );

      case 'infobox':
      case 'infobox-full':
        return (
          <div key={field.id} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium mb-1">{field.name}</p>
                {field.placeholder && (
                  <p className="text-blue-700 dark:text-blue-300">{field.placeholder}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 'spacer':
        return <div key={field.id} className="h-4" />;

      default:
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-800">
              <IconComponent className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {field.type} field - {field.name}
              </span>
            </div>
          </div>
        );
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
    setFormData({});
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            {form.name}
          </CardTitle>
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Edit Form
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {form.fields.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                No fields configured for this form
              </p>
              <p className="text-sm text-gray-400">
                Add fields in Settings → Forms Management
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {form.fields
                .sort((a, b) => a.order - b.order)
                .map(renderField)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 