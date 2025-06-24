export type UserRole = 'Admin' | 'Support Manager' | 'Support Worker' | 'Roster Team' | 'Coordinator';

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

export interface AppSection {
    id: string;
    name: string;
    icon: React.ElementType;
    order: number;
    status: 'Active' | 'Inactive';
}

export interface CustomForm {
    id: string;
    name: string;
    linkedSectionId: string;
    fieldCount: number;
    status: 'Active' | 'Inactive';
}
