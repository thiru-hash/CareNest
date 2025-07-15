// Core tenant types for multi-tenant architecture
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  status: 'active' | 'inactive' | 'suspended';
  settings: TenantSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantSettings {
  branding: {
    logo?: string;
    primaryColor: string;
    secondaryColor: string;
    companyName: string;
  };
  features: {
    automation: boolean;
    advancedReporting: boolean;
    customForms: boolean;
    apiAccess: boolean;
  };
  limits: {
    maxUsers: number;
    maxClients: number;
    maxLocations: number;
    storageGB: number;
  };
  modules: {
    roster: boolean;
    people: boolean;
    finance: boolean;
    timesheet: boolean;
    compliance: boolean;
    automation: boolean;
  };
}

export interface TenantContext {
  tenant: Tenant;
  user: User;
  permissions: PermissionMatrix;
  sections: Section[];
  forms: Form[];
}

// User types
export interface User {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  groups: string[];
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 
  | 'System Admin'
  | 'Tenant Admin'
  | 'Manager'
  | 'Support Worker'
  | 'HR Manager'
  | 'Finance Admin'
  | 'IT Admin'
  | 'Client IT Admin'
  | 'Technical Admin'
  | 'CEO'
  | 'Office Admin Manager'
  | 'Human Resources Manager'
  | 'HR Admin'
  | 'HR'
  | 'Roster Admin'
  | 'Finance Admin';

// Group types
export interface Group {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  permissions: PermissionMatrix;
  userIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Permission types
export interface PermissionMatrix {
  [sectionId: string]: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    fields?: FieldPermissions;
  };
}

export interface FieldPermissions {
  [fieldId: string]: {
    view: boolean;
    edit: boolean;
  };
}

// Section types
export interface Section {
  id: string;
  tenantId: string;
  name: string;
  path: string;
  iconName: string;
  order: number;
  status: 'active' | 'inactive';
  tabs: Tab[];
  permissions: PermissionMatrix;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tab {
  id: string;
  sectionId: string;
  name: string;
  order: number;
  formId?: string;
  permissions: PermissionMatrix;
  createdAt: Date;
  updatedAt: Date;
}

// Form types
export interface Form {
  id: string;
  tenantId: string;
  sectionId: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'draft';
  fields: FormField[];
  permissions: PermissionMatrix;
  createdAt: Date;
  updatedAt: Date;
}

export interface FormField {
  id: string;
  formId: string;
  name: string;
  type: FormFieldType;
  order: number;
  required: boolean;
  tooltip?: string;
  options?: FormFieldOption[];
  permissions: FieldPermissions;
  validation?: FieldValidation;
  createdAt: Date;
  updatedAt: Date;
}

export type FormFieldType = 
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'phone'
  | 'date'
  | 'time'
  | 'datetime'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'file'
  | 'image'
  | 'richtext'
  | 'headline'
  | 'divider'
  | 'location'
  | 'person'
  | 'custom';

export interface FormFieldOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
  required?: boolean;
  custom?: string;
}

// Location and shift types
export interface Location {
  id: string;
  tenantId: string;
  name: string;
  address: string;
  type: 'residential' | 'commercial' | 'office' | 'other';
  status: 'active' | 'inactive';
  staffIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Shift {
  id: string;
  tenantId: string;
  locationId: string;
  staffId?: string;
  startTime: Date;
  endTime: Date;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  type: 'regular' | 'overtime' | 'on-call' | 'training';
  createdAt: Date;
  updatedAt: Date;
}

// Access control types
export interface AccessControl {
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canViewFields: string[];
  canEditFields: string[];
}

export interface RouteGuard {
  requiredPermissions: string[];
  requiredRole?: UserRole;
  requiredGroups?: string[];
  checkLocation?: boolean;
  checkShift?: boolean;
}

// Context types
export interface TenantContextType {
  tenant: Tenant;
  user: User;
  permissions: PermissionMatrix;
  sections: Section[];
  forms: Form[];
  locations: Location[];
  shifts: Shift[];
  groups: Group[];
}

// Utility types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
} 