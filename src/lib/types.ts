export type UserRole = 'Admin' | 'Support Manager' | 'Support Worker' | 'Roster Team';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
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
  role: 'Support Worker' | 'Manager' | 'Coordinator';
  email: string;
  phone: string;
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
