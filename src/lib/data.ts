import type { User, Client, Staff, Property, Shift, ComplianceItem, Group, AppSection, CustomForm, FormField, FormFieldType } from './types';
import { addDays, addHours, subDays, subHours } from 'date-fns';
import {
  CaseSensitive,
  FileText,
  Square,
  Pilcrow,
  ChevronDownSquare,
  ListChecks,
  ArrowRightLeft,
  CalendarDays,
  Cake,
  RadioTower,
  Clock,
  CheckSquare,
  Hash,
  Binary,
  DollarSign,
  Package,
  Upload,
  Heading1,
  Heading2,
  PenSquare,
  Info,
  RectangleHorizontal,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';


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
  { id: 'sec-dash', name: 'Dashboard', path: '/dashboard', iconName: 'LayoutDashboard', order: 1, status: 'Active' },
  { id: 'sec-roster', name: 'Roster Schedule', path: '/roster', iconName: 'Calendar', order: 2, status: 'Active' },
  { id: 'sec-people', name: 'People We Support', path: '/people', iconName: 'Users', order: 3, status: 'Active', linkedFormId: 'form-1' },
  { id: 'sec-staff', name: 'Staff', path: '/staff', iconName: 'UsersRound', order: 4, status: 'Active' },
  { id: 'sec-loc', name: 'Locations', path: '/locations', iconName: 'Building2', order: 5, status: 'Active', linkedFormId: 'form-3' },
  { id: 'sec-inc', name: 'Incident Reports', path: '#', iconName: 'ShieldAlert', order: 6, status: 'Active', linkedFormId: 'form-2' },
  { id: 'sec-settings', name: 'System Settings', path: '/settings', iconName: 'Settings', order: 99, status: 'Active' },
];

export const mockForms: CustomForm[] = [
    { 
      id: 'form-1', name: 'Client Intake Form', linkedSectionId: 'sec-people', status: 'Active',
      fields: [
        { id: 'field-1-1', name: 'First Name', type: 'text', order: 1, required: true, tooltip: "Client's legal first name." },
        { id: 'field-1-2', name: 'Last Name', type: 'text', order: 2, required: true },
        { id: 'field-1-3', name: 'Date of Birth', type: 'dob', order: 3 },
      ]
    },
    { 
      id: 'form-2', name: 'Incident Report Form', linkedSectionId: 'sec-inc', status: 'Inactive',
      fields: [
        { id: 'field-2-1', name: 'Incident Date', type: 'date', order: 1, required: true },
        { id: 'field-2-2', name: 'Incident Time', type: 'time', order: 2, required: true },
        { id: 'field-2-3', name: 'Detailed Description', type: 'richtext', order: 3 },
      ]
    },
    { 
      id: 'form-3', name: 'Vehicle Check', linkedSectionId: 'sec-loc', status: 'Active',
      fields: []
    },
];


export const fieldTypes: { value: FormFieldType; label: string; icon: LucideIcon }[] = [
    { value: 'text', label: 'Text', icon: CaseSensitive },
    { value: 'textbox', label: 'Text Box', icon: FileText },
    { value: 'textbox-full', label: 'Text Box (full width)', icon: Square },
    { value: 'richtext', label: 'Rich Text', icon: Pilcrow },
    { value: 'dropdown', label: 'Dropdown List', icon: ChevronDownSquare },
    { value: 'multi-select-dropdown', label: 'Multi-Select Dropdown', icon: ListChecks },
    { value: 'dual-select', label: 'Dual-Select List Boxes', icon: ArrowRightLeft },
    { value: 'date', label: 'Date', icon: CalendarDays },
    { value: 'dob', label: 'Date of Birth', icon: Cake },
    { value: 'radio', label: 'Radio List', icon: RadioTower },
    { value: 'time', label: 'Time', icon: Clock },
    { value: 'checkbox', label: 'Checkbox (single)', icon: CheckSquare },
    { value: 'number-whole', label: 'Number (whole)', icon: Hash },
    { value: 'number-decimal', label: 'Number (decimal)', icon: Binary },
    { value: 'currency', label: 'Currency', icon: DollarSign },
    { value: 'service-item', label: 'Service Item', icon: Package },
    { value: 'file-upload', label: 'File Upload', icon: Upload },
    { value: 'headline', label: 'Headline', icon: Heading1 },
    { value: 'sub-headline', label: 'Sub-Headline', icon: Heading2 },
    { value: 'signature', label: 'On-screen Signature', icon: PenSquare },
    { value: 'infobox', label: 'Info Box', icon: Info },
    { value: 'infobox-full', label: 'Info Box (full width)', icon: Info },
    { value: 'spacer', label: 'Single Space', icon: RectangleHorizontal },
];
