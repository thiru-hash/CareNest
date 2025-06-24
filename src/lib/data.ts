import type { User, Client, Staff, Property, Shift, ComplianceItem } from './types';
import { addDays, addHours, subDays } from 'date-fns';

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
  { id: 'staff-1', name: 'Jane Doe', avatarUrl: 'https://placehold.co/100x100.png', role: 'Support Worker', email: 'jane.d@carenest.com', phone: '555-1234' },
  { id: 'staff-2', name: 'John Smith', avatarUrl: 'https://placehold.co/100x100.png', role: 'Support Worker', email: 'john.s@carenest.com', phone: '555-5678' },
  { id: 'staff-3', name: 'Alice Johnson', avatarUrl: 'https://placehold.co/100x100.png', role: 'Manager', email: 'alice.j@carenest.com', phone: '555-8765' },
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
  { id: 'shift-1', title: 'Morning Shift', start: addHours(now, 2), end: addHours(now, 8), staffId: 'staff-1', propertyId: 'prop-1', status: 'Assigned' },
  { id: 'shift-2', title: 'Afternoon Shift', start: addHours(now, 3), end: addHours(now, 9), staffId: 'staff-2', propertyId: 'prop-1', status: 'Assigned' },
  { id: 'shift-3', title: 'Night Shift', start: addHours(now, 8), end: addHours(now, 16), propertyId: 'prop-2', status: 'Open' },
  { id: 'shift-4', title: 'Morning Cover', start: addDays(now, 1), end: addHours(addDays(now, 1), 8), propertyId: 'prop-2', status: 'Open' },
  { id: 'shift-5', title: 'Completed Shift', start: subDays(now, 1), end: addHours(subDays(now, 1), 8), staffId: 'staff-1', propertyId: 'prop-1', status: 'Completed' },
];

export const mockComplianceItems: ComplianceItem[] = [
  { id: 'comp-1', title: 'First Aid Certificate', staffId: 'staff-1', renewalDate: addDays(now, 30), status: 'Compliant' },
  { id: 'comp-2', title: 'Drivers License', staffId: 'staff-2', renewalDate: addDays(now, 12), status: 'Expiring Soon' },
  { id: 'comp-3', title: 'Background Check', staffId: 'staff-1', renewalDate: subDays(now, 5), status: 'Overdue' },
  { id: 'comp-4', title: 'CPR Certification', staffId: 'staff-3', renewalDate: addDays(now, 90), status: 'Compliant' },
];
