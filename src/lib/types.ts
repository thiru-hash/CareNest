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

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
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

export interface Staff {
  id: string;
  name: string;
  avatarUrl: string;
  role: UserRole;
  email: string;
  phone: string;
  groupIds?: string[];
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

export interface Timesheet {
  id: string;
  staffId: string;
  propertyId: string;
  startTime: Date;
  endTime: Date;
  breakDuration: number; // in minutes
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
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
