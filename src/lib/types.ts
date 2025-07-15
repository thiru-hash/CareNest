

export type UserRole =
  | 'System Admin'
  | 'Support Manager'
  | 'Support Worker'
  | 'Roster Admin'
  | 'Roster Scheduler'
  | 'Finance Admin'
  | 'GM Service'
  | 'CEO'
  | 'Reception'
  | 'Health and Safety'
  | 'Risk Management'
  | 'Office Admin Manager'
  | 'Clinical Advisor'
  | 'Human Resources Manager'
  | 'HR Admin'
  | 'HR'
  | 'Behavioural Support';

export type Permission = 'view' | 'create' | 'edit' | 'delete';

export type PermissionsState = {
    [groupId: string]: {
        [sectionId: string]: {
            [key in Permission]?: boolean;
        }
    }
};

// ===== LICENSING & TENANT MANAGEMENT =====

export type LicenseModel = 'per_user' | 'pooled' | 'unlimited';

export interface TenantLicense {
  id: string;
  tenantId: string;
  model: LicenseModel;
  maxUsers: number;
  activeUsers: number;
  totalUsers: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  features: string[];
  restrictions: {
    maxProperties?: number;
    maxClients?: number;
    maxShiftsPerMonth?: number;
    storageLimitGB?: number;
  };
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  logo?: string;
  primaryColor?: string;
  license: TenantLicense;
  settings: {
    timezone: string;
    dateFormat: string;
    currency: string;
    gstEnabled: boolean;
    gstRate: number;
    defaultLanguage: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface LicenseUsage {
  userId: string;
  tenantId: string;
  sessionStart: Date;
  sessionEnd?: Date;
  isActive: boolean;
  deviceInfo?: {
    userAgent: string;
    ipAddress: string;
    location?: string;
  };
}

// ===== MODULE ARCHITECTURE TYPES =====

export interface ModuleConfig {
  id: string;
  name: string;
  path: string;
  icon: string;
  isEnabled: boolean;
  permissions: string[];
  dependencies: string[];
  settings: Record<string, any>;
}

export interface TabConfig {
  id: string;
  moduleId: string;
  name: string;
  path: string;
  isEnabled: boolean;
  permissions: string[];
  order: number;
}

// ===== ENHANCED USER TYPES =====

export interface User extends Staff {
  tenantId: string;
  licenseUsage?: LicenseUsage;
  lastActive: Date;
  loginCount: number;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
}

export interface Group {
  id: string;
  name: string;
  description: string;
  userIds: string[];
}

export interface Client {
  id: string;
  name: string;
  avatarUrl: string;
  status: 'Active' | 'Inactive';
  propertyId: string;
  supportLogs: string;
}

export interface StaffDocument {
  id: string;
  name: string;
  type: 'Contract' | 'Policy' | 'Certification' | 'Other';
  uploadDate: Date;
  url: string;
}

export interface Staff {
  id: string;
  name: string;
  avatarUrl: string;
  role: UserRole;
  email: string;
  phone: string;
  groupIds?: string[];
  propertyIds?: string[];
  // New detailed fields
  personalDetails?: {
    dob: Date;
    address: string;
  };
  employmentDetails?: {
    startDate?: Date;
    employmentType: 'Full-time' | 'Part-time' | 'Casual';
    payRate: number; // for Finance/Admin
  };
  hrDetails?: {
    interviewNotes: string; // for HR/Admin
    documents: StaffDocument[]; // for HR/Admin
  };
}


export interface Property {
  id: string;
  name: string;
  address: string;
  imageUrl: string;
  status: 'Active' | 'Maintenance';
}

export interface Shift {
  id: string;
  title: string;
  start: Date;
  end: Date;
  staffId?: string;
  clientId?: string;
  propertyId: string;
  status: 'Open' | 'Assigned' | 'Completed' | 'In Progress';
  // Finance integration fields
  billable: boolean;
  rate: number;
  serviceType: string;
  isInvoiced: boolean;
  isClaimed: boolean;
  isPaid: boolean;
}

export interface ComplianceItem {
  id: string;
  title: string;
  staffId: string;
  renewalDate: Date;
  status: 'Compliant' | 'Expiring Soon' | 'Overdue';
}

export interface SectionTab {
    id: string;
    name: string;
    order: number;
    formId: string;
}

export interface AppSection {
    id: string;
    name: string;
    path: string;
    iconName: string;
    order: number;
    status: 'Active' | 'Inactive';
    tabs?: SectionTab[];
}

export type FormFieldType = 
    | 'text' | 'textbox' | 'textbox-full' | 'richtext' 
    | 'dropdown' | 'multi-select-dropdown' | 'dual-select'
    | 'date' | 'dob' | 'radio' | 'time' | 'checkbox'
    | 'number-whole' | 'number-decimal' | 'currency'
    | 'service-item' | 'file-upload' | 'headline' | 'sub-headline'
    | 'signature' | 'infobox' | 'infobox-full' | 'spacer';

export interface FormField {
    id: string;
    name: string;
    type: FormFieldType;
    order: number;
    tooltip?: string;
    required?: boolean;
}

export interface CustomForm {
    id: string;
    name: string;
    linkedSectionId: string;
    fields: FormField[];
    status: 'Active' | 'Inactive';
}

export interface TravelLogEntry {
  startLocation: string;
  endLocation: string;
  distance: number;
}

export interface Timesheet {
  id: string;
  staffId: string;
  shiftId: string;
  propertyId: string;
  startTime: Date;
  endTime: Date;
  hoursWorked: number;
  breakDuration: number; // in minutes
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
  notes?: string;
  travelLog?: TravelLogEntry[];
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
  status: 'Published' | 'Draft';
  type: 'Info' | 'Warning' | 'Urgent';
}

// --- Enhanced Finance Types ---

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
    id: string;
    invoiceNumber: string;
    clientId: string;
    status: 'Paid' | 'Pending' | 'Overdue' | 'Draft';
    dateIssued: Date;
    dueDate: Date;
    amount: number;
    tax: number;
    lineItems: InvoiceLineItem[];
    xeroExported: boolean;
}

export interface Payroll {
    id: string;
    staffId: string;
    periodStart: Date;
    periodEnd: Date;
    hoursWorked: number;
    payRate: number;
    grossPay: number;
    deductions: number;
    netPay: number;
    status: 'Paid' | 'Pending';
}

export interface OrganisationalBudget {
    id: string;
    type: 'Income' | 'Expense';
    category: string;
    amountAllocated: number;
    amountUsed: number;
    financialYear: string;
    notes?: string;
}

export interface ClientFunding {
    clientId: string;
    coreBudget: number;
    coreSpent: number;
    capacityBudget: number;
    capacitySpent: number;
    capitalBudget: number;
    capitalSpent: number;
    startDate: Date;
    endDate: Date;
}

export interface ServiceBooking {
    id: string;
    clientId: string;
    shiftId: string;
    date: Date;
    supportWorker: string;
    rate: number;
    fundingStream: 'Core' | 'Capacity' | 'Capital';
    invoiced: boolean;
}

export interface ClientTransaction {
    id: string;
    clientId: string;
    date: Date;
    description: string;
    type: 'Expense' | 'Payment';
    amount: number;
    gst: number;
    category: 'Transport' | 'Groceries' | 'Equipment' | 'Utilities' | 'Other';
    attachmentName?: string;
}
