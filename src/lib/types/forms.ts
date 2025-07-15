export interface FormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'select' | 'textarea' | 'date' | 'checkbox' | 'radio' | 'file' | 'phone' | 'address';
  required: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  permissions: {
    view: string[]; // Role IDs that can view this field
    edit: string[]; // Role IDs that can edit this field
  };
  defaultValue?: any;
  order: number;
  width?: 'full' | 'half' | 'third' | 'quarter';
  group?: string; // For grouping fields
}

export interface FormTab {
  id: string;
  name: string;
  label: string;
  icon?: string;
  order: number;
  permissions: {
    view: string[]; // Role IDs that can view this tab
  };
  fields: FormField[];
}

export interface DynamicForm {
  id: string;
  name: string;
  description?: string;
  tenantId: string;
  sectionId: string;
  tabs: FormTab[];
  permissions: {
    view: string[];
    create: string[];
    edit: string[];
    delete: string[];
  };
  settings: {
    allowCreate: boolean;
    allowEdit: boolean;
    allowDelete: boolean;
    showTabs: boolean;
    layout: 'single' | 'tabs' | 'accordion';
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface FormSubmission {
  id: string;
  formId: string;
  tenantId: string;
  submittedBy: string;
  data: Record<string, any>;
  submittedAt: Date;
  updatedAt: Date;
}

export interface FormBuilderState {
  selectedTab: string | null;
  selectedField: string | null;
  isEditing: boolean;
  formData: Partial<DynamicForm>;
} 