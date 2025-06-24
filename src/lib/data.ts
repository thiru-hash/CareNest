import type { User, Client, Staff, Property, Shift, ComplianceItem, Group, AppSection, CustomForm } from './types';
import { addDays, addHours, subDays, subHours } from 'date-fns';
import { LayoutDashboard, Calendar, Users, UsersRound, Building2, ShieldAlert, Settings } from "lucide-react";

const now = new Date();

export const mockUsers: Record<string, User> = {
  'user-1': {
    id: 'user-1',
    name: 'Admin User',
    email: 'admin@carenest.com',
    avatarUrl: 'https://placehold.co/100x100.png',
    role: 'Admin',
  },
};

export const mockProperties: Property[] = [
  { id: 'prop-1', name: 'Oakwood Residence', address: '123 Oak Ave, Springfield', imageUrl: 'https://placehold.co/600x400.png', status: 'Active', "data-ai-hint": "modern house" },
  { id: 'prop-2', name: 'Maple Creek Villa', address: '456 Maple St, Rivertown', imageUrl: 'https://placehold.co/600x400.png', status: 'Active', "data-ai-hint": "suburban home" },
];

export const mockStaff: Staff[] = [
  { id: 'staff-1', name: 'Jane Doe', avatarUrl: 'https://placehold.co/100x100.png', role: 'Support Worker', email: 'jane.d@carenest.com', phone: '555-1234', groupIds: ['group-workers'] },
  { id: 'staff-2', name: 'John Smith', avatarUrl: 'https://placehold.co/100x100.png', role: 'Support Worker', email: 'john.s@carenest.com', phone: '555-5678', groupIds: ['group-workers'] },
  { id: 'staff-3', name: 'Alice Johnson', avatarUrl: 'https://placehold.co/100x100.png', role: 'Support Manager', email: 'alice.j@carenest.com', phone: '555-8765', groupIds: ['group-managers'] },
];

export const mockGroups: Group[] = [
    { id: 'group-admin', name: 'Administrators', description: 'Full system access', userIds: ['user-1'] },
    { id: 'group-managers', name: 'Support Managers', description: 'Manage staff and clients', userIds: ['staff-3'] },
    { id: 'group-workers', name: 'Support Workers', description: 'View shifts and client info', userIds: ['staff-1', 'staff-2'] },
];

export const mockClients: Client[] = [
  {
    id: 'client-1',
    name: 'Peter Jones',
    avatarUrl: 'https://placehold.co/100x100.png',
    status: 'Active',
    propertyId: 'prop-1',
    supportLogs: `[2023-10-26] Client was in good spirits. Participated in morning activities.
[2023-10-27] Seemed a bit withdrawn today. Refused lunch.
[2023-10-28] Had a fall in the bathroom, but no injuries reported. Staff provided assistance. Vital signs are stable.
[2023-10-29] Very cheerful, enjoyed the musical performance in the common area.
[2023-10-30] Complained of a headache in the evening. Administered pain relief as per protocol.`
  },
  {
    id: 'client-2',
    name: 'Mary Williams',
    avatarUrl: 'https://placehold.co/100x100.png',
    status: 'Active',
    propertyId: 'prop-2',
    supportLogs: `[2023-11-01] New client admission. Settling in well.
[2023-11-02] Expressed anxiety about the new environment. Staff spent extra time providing reassurance.
[2023-11-03] Participated in group therapy session and seemed to connect with another resident.
[2023-11-04] Family visit today. Client was very happy to see them.`
  },
];

export const mockShifts: Shift[] = [
  { id: 'shift-1', title: 'Morning Shift', start: subHours(now, 2), end: addHours(now, 4), staffId: 'staff-1', clientId: 'client-1', propertyId: 'prop-1', status: 'In Progress' },
  { id: 'shift-2', title: 'Afternoon Shift', start: addHours(now, 3), end: addHours(now, 9), staffId: 'staff-2', clientId: 'client-1', propertyId: 'prop-1', status: 'Assigned' },
  { id: 'shift-3', title: 'Night Shift', start: addHours(now, 8), end: addHours(now, 16), propertyId: 'prop-2', status: 'Open' },
  { id: 'shift-4', title: 'Morning Cover', start: addDays(now, 1), end: addHours(addDays(now, 1), 8), propertyId: 'prop-2', clientId: 'client-2', status: 'Open' },
  { id: 'shift-5', title: 'Completed Shift', start: subDays(now, 1), end: addHours(subDays(now, 1), 8), staffId: 'staff-1', clientId: 'client-1', propertyId: 'prop-1', status: 'Completed' },
];

export const mockComplianceItems: ComplianceItem[] = [
  { id: 'comp-1', title: 'First Aid Certificate', staffId: 'staff-1', renewalDate: addDays(now, 30), status: 'Compliant' },
  { id: 'comp-2', title: 'Drivers License', staffId: 'staff-2', renewalDate: addDays(now, 12), status: 'Expiring Soon' },
  { id: 'comp-3', title: 'Background Check', staffId: 'staff-1', renewalDate: subDays(now, 5), status: 'Overdue' },
  { id: 'comp-4', title: 'CPR Certification', staffId: 'staff-3', renewalDate: addDays(now, 90), status: 'Compliant' },
];

export const mockSections: AppSection[] = [
  { id: 'sec-dash', name: 'Dashboard', icon: LayoutDashboard, order: 1, status: 'Active' },
  { id: 'sec-roster', name: 'Roster Schedule', icon: Calendar, order: 2, status: 'Active' },
  { id: 'sec-people', name: 'People We Support', icon: Users, order: 3, status: 'Active' },
  { id: 'sec-staff', name: 'Staff', icon: UsersRound, order: 4, status: 'Active' },
  { id: 'sec-loc', name: 'Locations', icon: Building2, order: 5, status: 'Active' },
  { id: 'sec-inc', name: 'Incident Reports', icon: ShieldAlert, order: 6, status: 'Inactive' },
  { id: 'sec-settings', name: 'System Settings', icon: Settings, order: 7, status: 'Active' },
];

export const mockForms: CustomForm[] = [
    { id: 'form-1', name: 'Client Intake Form', linkedSectionId: 'sec-people', fieldCount: 12, status: 'Active' },
    { id: 'form-2', name: 'Incident Report Form', linkedSectionId: 'sec-inc', fieldCount: 25, status: 'Inactive' },
    { id: 'form-3', name: 'Vehicle Check', linkedSectionId: 'sec-loc', fieldCount: 8, status: 'Active' },
];
