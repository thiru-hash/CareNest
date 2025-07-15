import type { User, Client, Staff, Property, Shift, ComplianceItem, Group, AppSection, CustomForm, FormField, FormFieldType, Timesheet, Notice, Invoice, Payroll as PayrollType, ClientFunding, ClientTransaction } from './types';
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
  Landmark,
  Zap,
  Link,
  Lock,
  Percent,
  Star,
  Calendar,
  CalendarRange,
  ToggleLeft,
  Tag,
  Search,
  Users,
  Link2,
  Database,
  Globe,
  Calculator,
  TrendingUp,
  CalendarPlus,
  Image,
  MapPin,
  Eye,
  ListOrdered,
  BarChart3,
  Code,
  QrCode,
  Palette,
  RefreshCw,
  User,
  Activity,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';


const now = new Date();
const midnight = new Date();
midnight.setHours(23, 59, 59, 999);


export const mockProperties: Property[] = [
  { id: 'prop-1', name: 'Oakwood Residence', address: '123 Oak Ave, Springfield', imageUrl: 'https://placehold.co/600x400.png', status: 'Active', "data-ai-hint": "modern house" },
  { id: 'prop-2', name: 'Maple Creek Villa', address: '456 Maple St, Rivertown', imageUrl: 'https://placehold.co/600x400.png', status: 'Active', "data-ai-hint": "suburban home" },
  { id: 'prop-training', name: 'Training Center', address: '789 Learn St, Knowledgeton', imageUrl: 'https://placehold.co/600x400.png', status: 'Active', "data-ai-hint": "modern office" },
];

export const mockStaff: Staff[] = [
  { 
    id: 'staff-admin', 
    name: 'Admin User', 
    avatarUrl: 'https://placehold.co/100x100.png', 
    role: 'System Admin', 
    email: 'admin@carenest.com', 
    phone: '555-0000', 
    groupIds: ['group-system-admin', 'group-all'],
    propertyIds: ['prop-1', 'prop-2', 'prop-training'],
    personalDetails: { dob: new Date('1980-01-01'), address: '100 Admin Way, System City' },
    employmentDetails: { startDate: new Date('2010-05-10'), employmentType: 'Full-time', payRate: 90.00 },
    hrDetails: {
      interviewNotes: "Exemplary candidate, deep system knowledge.",
      documents: [{ id: 'doc-admin-1', name: 'Admin_Contract.pdf', type: 'Contract', uploadDate: new Date('2010-05-10'), url: '#' }]
    }
  },
  { 
    id: 'staff-1', 
    name: 'Jane Doe', 
    avatarUrl: 'https://placehold.co/100x100.png', 
    role: 'Support Worker', 
    email: 'jane.d@carenest.com', 
    phone: '555-1234', 
    groupIds: ['group-support-worker', 'group-all'],
    propertyIds: ['prop-1'],
    personalDetails: { dob: new Date('1992-05-20'), address: '12 Support St, Caretown' },
    employmentDetails: { startDate: new Date('2021-03-15'), employmentType: 'Full-time', payRate: 28.50 },
    hrDetails: {
      interviewNotes: "Great empathy shown during the interview process.",
      documents: [
        { id: 'doc-jane-1', name: 'JaneDoe_Contract.pdf', type: 'Contract', uploadDate: new Date('2021-03-15'), url: '#' },
        { id: 'doc-jane-2', name: 'FirstAid_Cert.pdf', type: 'Certification', uploadDate: new Date('2023-08-01'), url: '#' }
      ]
    }
  },
  { 
    id: 'staff-2', 
    name: 'John Smith', 
    avatarUrl: 'https://placehold.co/100x100.png', 
    role: 'Support Worker', 
    email: 'john.s@carenest.com', 
    phone: '555-5678', 
    groupIds: ['group-support-worker', 'group-all'],
    propertyIds: [],
    personalDetails: { dob: new Date('1995-11-30'), address: '45 Helper Ave, Communityville' },
    employmentDetails: { startDate: new Date('2022-07-22'), employmentType: 'Part-time', payRate: 27.75 },
     hrDetails: { interviewNotes: "", documents: [] }
  },
  { 
    id: 'staff-3', 
    name: 'Alice Johnson', 
    avatarUrl: 'https://placehold.co/100x100.png', 
    role: 'Support Manager', 
    email: 'alice.j@carenest.com', 
    phone: '555-8765', 
    groupIds: ['group-support-manager', 'group-all'],
    propertyIds: [],
    personalDetails: { dob: new Date('1985-02-10'), address: '8 Management Mews, Leadsville' },
    employmentDetails: { startDate: new Date('2018-01-20'), employmentType: 'Full-time', payRate: 45.00 },
     hrDetails: {
      interviewNotes: "Strong leadership skills and excellent references.",
      documents: [{ id: 'doc-alice-1', name: 'AliceJ_Contract.pdf', type: 'Contract', uploadDate: new Date('2018-01-20'), url: '#' }]
    }
  },
  { 
    id: 'staff-roster-admin', 
    name: 'Rory Roster', 
    avatarUrl: 'https://placehold.co/100x100.png', 
    role: 'Roster Admin', 
    email: 'rory.r@carenest.com', 
    phone: '555-1001', 
    groupIds: ['group-roster-admin', 'group-all'],
    propertyIds: [],
    personalDetails: { dob: new Date('1988-06-25'), address: '9 Schedule St, Timely Town' },
    employmentDetails: { startDate: new Date('2019-11-01'), employmentType: 'Full-time', payRate: 38.00 },
    hrDetails: { interviewNotes: "", documents: [] }
  },
  { 
    id: 'staff-finance', 
    name: 'Fiona Finance', 
    avatarUrl: 'https://placehold.co/100x100.png', 
    role: 'Finance Admin', 
    email: 'fiona.f@carenest.com', 
    phone: '555-1002', 
    groupIds: ['group-finance-admin', 'group-all'],
    propertyIds: [],
    personalDetails: { dob: new Date('1990-09-15'), address: '10 Ledger Lane, Accountsville' },
    employmentDetails: { startDate: new Date('2020-02-10'), employmentType: 'Full-time', payRate: 42.50 },
    hrDetails: { interviewNotes: "", documents: [] }
  },
  { 
    id: 'staff-ceo', 
    name: 'Charles Executive', 
    avatarUrl: 'https://placehold.co/100x100.png', 
    role: 'CEO', 
    email: 'charles.e@carenest.com', 
    phone: '555-1003', 
    groupIds: ['group-ceo', 'group-all'],
    propertyIds: [],
    personalDetails: { dob: new Date('1975-03-12'), address: '1 Executive Drive, Corp Heights' },
    employmentDetails: { startDate: new Date('2015-08-01'), employmentType: 'Full-time', payRate: 150.00 },
    hrDetails: { interviewNotes: "", documents: [] }
  },
  { 
    id: 'staff-hr', 
    name: 'Holly Resources', 
    avatarUrl: 'https://placehold.co/100x100.png', 
    role: 'Human Resources Manager', 
    email: 'holly.r@carenest.com', 
    phone: '555-1004', 
    groupIds: ['group-hr-manager', 'group-all'],
    propertyIds: [],
    personalDetails: { dob: new Date('1989-07-22'), address: '22 People Plaza, Staffington' },
    employmentDetails: { startDate: new Date('2019-04-15'), employmentType: 'Full-time', payRate: 48.00 },
    hrDetails: {
      interviewNotes: "Excellent candidate for managing HR functions.",
      documents: [{ id: 'doc-holly-1', name: 'HollyR_Contract.pdf', type: 'Contract', uploadDate: new Date('2019-04-15'), url: '#' }]
    }
  },
  { 
    id: 'staff-it-admin', 
    name: 'Ian Technical', 
    avatarUrl: 'https://placehold.co/100x100.png', 
    role: 'IT Admin', 
    email: 'ian.t@carenest.com', 
    phone: '555-1005', 
    groupIds: ['group-it-admin', 'group-all'],
    propertyIds: [],
    personalDetails: { dob: new Date('1987-12-03'), address: '15 Tech Street, Digital City' },
    employmentDetails: { startDate: new Date('2020-06-01'), employmentType: 'Full-time', payRate: 65.00 },
    hrDetails: {
      interviewNotes: "Strong technical background with excellent system administration skills.",
      documents: [{ id: 'doc-ian-1', name: 'IanT_Contract.pdf', type: 'Contract', uploadDate: new Date('2020-06-01'), url: '#' }]
    }
  },
  { 
    id: 'staff-tech-admin', 
    name: 'Tara Systems', 
    avatarUrl: 'https://placehold.co/100x100.png', 
    role: 'Technical Admin', 
    email: 'tara.s@carenest.com', 
    phone: '555-1006', 
    groupIds: ['group-tech-admin', 'group-all'],
    propertyIds: [],
    personalDetails: { dob: new Date('1991-04-18'), address: '8 Code Lane, Developer Town' },
    employmentDetails: { startDate: new Date('2021-09-15'), employmentType: 'Full-time', payRate: 58.00 },
    hrDetails: {
      interviewNotes: "Excellent problem-solving skills and deep understanding of healthcare systems.",
      documents: [{ id: 'doc-tara-1', name: 'TaraS_Contract.pdf', type: 'Contract', uploadDate: new Date('2021-09-15'), url: '#' }]
    }
  },
  { 
    id: 'staff-client-it', 
    name: 'Carl Client', 
    avatarUrl: 'https://placehold.co/100x100.png', 
    role: 'Client IT Admin', 
    email: 'carl.c@carenest.com', 
    phone: '555-1007', 
    groupIds: ['group-client-it-admin', 'group-all'],
    propertyIds: [],
    personalDetails: { dob: new Date('1986-08-25'), address: '42 Client Road, Support City' },
    employmentDetails: { startDate: new Date('2022-03-10'), employmentType: 'Full-time', payRate: 52.00 },
    hrDetails: {
      interviewNotes: "Great customer service skills with strong technical background.",
      documents: [{ id: 'doc-carl-1', name: 'CarlC_Contract.pdf', type: 'Contract', uploadDate: new Date('2022-03-10'), url: '#' }]
    }
  },
];


export const mockGroups: Group[] = [
  {
    id: 'group-all',
    name: 'ALL',
    description: 'Access Core System Functionality (must be assigned to all users)',
    userIds: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5', 'user-6', 'user-7', 'user-8', 'user-9', 'user-10', 'user-11']
  },
  {
    id: 'group-system-admin',
    name: 'FLOWLOGIC ADMIN',
    description: 'Flowlogic Admin Functions',
    userIds: ['user-1']
  },
  {
    id: 'group-roster-admin',
    name: 'ROSTER ADMIN',
    description: 'Group for Administrators of Roster/Schedule of this organisation',
    userIds: ['user-2']
  },
  {
    id: 'group-roster-manager',
    name: 'ROSTER MANAGER',
    description: 'Manager Functions for Roster/Schedule',
    userIds: ['user-3']
  },
  {
    id: 'group-leave-admin',
    name: 'Leave Requests: Admin',
    description: 'Administration Functions for Leave Requests',
    userIds: ['user-4']
  },
  {
    id: 'group-timesheets-admin',
    name: 'Timesheets: Admin',
    description: 'Administration Functions for Timesheets (view, add, set status)',
    userIds: ['user-5']
  },
  {
    id: 'group-drive-admin',
    name: 'Drive: Admin',
    description: 'Administration Functions for Drive (add, edit, delete, set folder permissions)',
    userIds: ['user-6']
  },
  {
    id: 'group-reports-admin',
    name: 'Reports: Admin',
    description: 'Administration Functions for Report (add, edit, delete, export)',
    userIds: ['user-7']
  },
  {
    id: 'group-user-admin',
    name: 'User Management: Admin',
    description: 'Administration Functions for User Management (add, edit, delete, user logs, geo logs)',
    userIds: ['user-8']
  },
  {
    id: 'group-config-admin',
    name: 'Configuration: Admin',
    description: 'Administration Functions for Configuration (site, regions)',
    userIds: ['user-9']
  },
  {
    id: 'group-form-admin',
    name: 'Form/Section: Admin',
    description: 'Administration Functions for Forms/Sections (add, edit, delete)',
    userIds: ['user-10']
  },
  {
    id: 'group-messenger-admin',
    name: 'Messenger: Admin',
    description: 'Administration Functions for Messenger (messenger admin, mail logs)',
    userIds: ['user-11']
  },
  {
    id: 'group-drive-user',
    name: 'Drive: User',
    description: 'User Functions for Drive (view)',
    userIds: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5', 'user-6', 'user-7', 'user-8', 'user-9', 'user-10', 'user-11']
  },
  {
    id: 'group-reports-user',
    name: 'Reports: User',
    description: 'User Functions for Reports (view, export)',
    userIds: ['user-1', 'user-2']
  },
  {
    id: 'group-sms-feature',
    name: 'Feature: Send SMS',
    description: 'Access SMS Feature',
    userIds: ['user-1', 'user-2']
  },
  {
    id: 'group-records-admin',
    name: 'Records: Admin',
    description: 'Administration Functions for Records (view access locks/revisions/logs, create record locks)',
    userIds: ['user-3']
  },
  {
    id: 'group-funding-admin',
    name: 'Funding: Admin',
    description: 'Administration Functions for Funding (price management, export prices)',
    userIds: ['user-4']
  },
  {
    id: 'group-finance-admin',
    name: 'Finance: Admin',
    description: 'Administration Functions for Finance',
    userIds: ['user-5']
  },
  {
    id: 'group-staff',
    name: 'Staff',
    description: 'By Default: Able to view/create own Communication Book and Incident Report records',
    userIds: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5', 'user-6', 'user-7', 'user-8', 'user-9', 'user-10', 'user-11']
  },
  {
    id: 'group-management',
    name: '_Role: Management',
    description: 'By Default: Able to view all staff/client records and edit primary staff/client records',
    userIds: ['user-1']
  },
  {
    id: 'group-hr',
    name: '_Role: Human Resources',
    description: 'Human Resources role with HR-specific permissions',
    userIds: []
  },
  {
    id: 'group-executive',
    name: '_Role: Executive Management',
    description: 'By Default: Able to view/edit all staff/client records',
    userIds: ['user-1']
  },
  {
    id: 'group-ceo',
    name: '_Role: CEO',
    description: 'Chief Executive Officer with full system access',
    userIds: ['user-1']
  },
  {
    id: 'group-support-facilitator',
    name: 'Support Facilitator',
    description: 'Support Facilitators ONLY',
    userIds: ['user-2', 'user-3']
  },
  {
    id: 'group-support-manager',
    name: 'Support Manager',
    description: 'Support Managers and Others',
    userIds: ['user-4']
  },
  {
    id: 'group-house-lead',
    name: 'House Lead',
    description: 'House Lead and Senior Support Facilitator ONLY',
    userIds: ['user-5']
  },
  {
    id: 'group-gm-ce',
    name: 'GM/CE',
    description: 'General Manager and Chief Executive ONLY',
    userIds: ['user-6']
  },
  {
    id: 'group-finance-admin-role',
    name: 'Finance & Admin',
    description: 'Finance & Admin ONLY',
    userIds: ['user-7']
  },
  {
    id: 'group-reporting',
    name: 'Reporting Group',
    description: 'Users with reporting access',
    userIds: ['user-8']
  },
  {
    id: 'group-property',
    name: 'Property Management',
    description: 'Property management functions',
    userIds: ['user-9']
  },
  {
    id: 'group-admin-assistant',
    name: 'Admin Assistant',
    description: 'Administrative assistant functions',
    userIds: ['user-10']
  },
  {
    id: 'group-support-manager-advanced',
    name: 'Support Manager Advanced',
    description: 'Advanced support manager functions',
    userIds: ['user-11']
  },
  {
    id: 'group-resource-oncall',
    name: 'Resource (OnCall)',
    description: 'On-call resource functions',
    userIds: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5', 'user-6', 'user-7', 'user-8', 'user-9']
  },
  {
    id: 'group-advanced-user',
    name: 'Advanced User',
    description: 'Advanced user functions',
    userIds: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5']
  },
  {
    id: 'group-health-safety',
    name: 'Health & Safety',
    description: 'Health and safety management',
    userIds: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5', 'user-6', 'user-7', 'user-8', 'user-9', 'user-10', 'user-11', 'user-12', 'user-13', 'user-14', 'user-15', 'user-16']
  },
  {
    id: 'group-super-switcher',
    name: 'Super Switcher',
    description: 'Super user switching functions',
    userIds: ['user-1', 'user-2', 'user-3']
  },
  {
    id: 'group-hrt-pht-chair',
    name: 'HRT PHT Chair',
    description: 'HRT PHT Chair functions',
    userIds: []
  },
  {
    id: 'group-incident-hs-manager',
    name: 'Incident report Health & Safety Manager – Board reporting',
    description: 'Health & Safety incident reporting for board',
    userIds: ['user-1', 'user-2', 'user-3']
  },
  {
    id: 'group-vehicle-management',
    name: 'Vehicle Management',
    description: 'Create, View, edit permissions',
    userIds: ['user-1']
  },
  {
    id: 'group-hr-manager',
    name: 'HR Manager',
    description: 'HR Manager functions',
    userIds: ['user-1']
  },
  {
    id: 'group-volunteer',
    name: 'Volunteer',
    description: 'By Default: Able to view/create own Communication Book',
    userIds: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5', 'user-6', 'user-7', 'user-8', 'user-9', 'user-10', 'user-11', 'user-12', 'user-13', 'user-14', 'user-15', 'user-16', 'user-17', 'user-18', 'user-19', 'user-20', 'user-21', 'user-22', 'user-23', 'user-24', 'user-25', 'user-26', 'user-27', 'user-28', 'user-29', 'user-30']
  },
  {
    id: 'group-compliments-complaints',
    name: 'Compliments and Complaints Register',
    description: 'Compliments and Complaints Register',
    userIds: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5', 'user-6', 'user-7']
  },
  {
    id: 'group-new-shift-view',
    name: 'New Shift View',
    description: 'Grants the view to preview the new shift modal',
    userIds: []
  },
  {
    id: 'group-new-roster-view',
    name: 'New Roster View',
    description: 'Show new roster view for anyone in this group',
    userIds: []
  },
  {
    id: 'group-pws-communications',
    name: 'PWS Communications',
    description: 'PWS Communications',
    userIds: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5', 'user-6', 'user-7', 'user-8', 'user-9', 'user-10', 'user-11', 'user-12', 'user-13', 'user-14', 'user-15', 'user-16', 'user-17', 'user-18', 'user-19', 'user-20', 'user-21', 'user-22', 'user-23', 'user-24', 'user-25', 'user-26', 'user-27', 'user-28', 'user-29']
  }
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
  // A currently active shift for Jane Doe (staff-1) for testing purposes.
  { id: 'shift-active-jd', title: 'Mid-day Support', start: subHours(now, 2), end: addHours(now, 2), staffId: 'staff-1', clientId: 'client-1', propertyId: 'prop-1', status: 'Assigned', billable: true, rate: 55, serviceType: "Core", isInvoiced: true, isClaimed: true, isPaid: true },
  
  // An upcoming shift for another staff member
  { id: 'shift-2', title: 'Afternoon Community Access', start: addHours(now, 3), end: addHours(now, 7), staffId: 'staff-2', clientId: 'client-2', propertyId: 'prop-2', status: 'Assigned', billable: true, rate: 55, serviceType: "Capacity", isInvoiced: true, isClaimed: false, isPaid: false },
  
  // An open shift for later today
  { id: 'shift-3', title: 'Evening Cover', start: addHours(now, 8), end: addHours(now, 12), propertyId: 'prop-2', status: 'Open', billable: true, rate: 65, serviceType: "Core", isInvoiced: false, isClaimed: false, isPaid: false },

  // An open shift for tomorrow
  { id: 'shift-4', title: 'Weekend Morning Shift', start: addDays(addHours(now, 1), 1), end: addHours(addDays(now, 1), 9), propertyId: 'prop-1', clientId: 'client-1', status: 'Open', billable: true, rate: 65, serviceType: "Core", isInvoiced: false, isClaimed: false, isPaid: false },
  
  // A completed shift from yesterday
  { id: 'shift-5', title: 'Yesterday Evening Shift', start: subHours(subDays(now, 1), 4), end: subDays(now, 1), staffId: 'staff-1', clientId: 'client-2', propertyId: 'prop-2', status: 'Completed', billable: true, rate: 55, serviceType: "Capacity", isInvoiced: true, isClaimed: true, isPaid: false },

  // A shift for Jane Doe to test clock-in/out
  { id: 'shift-6', title: 'Morning Shift', start: new Date(new Date().setHours(9, 0, 0, 0)), end: new Date(new Date().setHours(17, 0, 0, 0)), staffId: 'staff-1', clientId: 'client-1', propertyId: 'prop-1', status: 'Assigned', billable: true, rate: 55, serviceType: "Core", isInvoiced: false, isClaimed: false, isPaid: false },

  // New shift for admin user
  { id: 'shift-admin-cover', title: 'Evening Admin Cover', start: now, end: midnight, staffId: 'staff-admin', clientId: 'client-1', propertyId: 'prop-1', status: 'Assigned', billable: true, rate: 70, serviceType: "Core", isInvoiced: false, isClaimed: false, isPaid: false },
];

export const mockComplianceItems: ComplianceItem[] = [
  { id: 'comp-1', title: 'First Aid Certificate', staffId: 'staff-1', renewalDate: addDays(now, 30), status: 'Compliant' },
  { id: 'comp-2', title: 'Drivers License', staffId: 'staff-2', renewalDate: addDays(now, 12), status: 'Expiring Soon' },
  { id: 'comp-3', title: 'Background Check', staffId: 'staff-1', renewalDate: subDays(now, 5), status: 'Overdue' },
  { id: 'comp-4', title: 'CPR Certification', staffId: 'staff-3', renewalDate: addDays(now, 90), status: 'Compliant' },
  { id: 'comp-5', title: 'Police Vetting', staffId: 'staff-hr', renewalDate: addDays(now, 25), status: 'Expiring Soon' },
  { id: 'comp-6', title: 'First Aid Certificate', staffId: 'staff-admin', renewalDate: addDays(now, 300), status: 'Compliant' },
];

export const mockSections: AppSection[] = [
  { id: 'sec-dash', name: 'Dashboard', path: '/dashboard', iconName: 'LayoutDashboard', order: 10, status: 'Active', tabs: [] },
  { id: 'sec-roster', name: 'Roster Schedule', path: '/roster', iconName: 'Calendar', order: 20, status: 'Active', tabs: [] },
  { 
    id: 'sec-people', 
    name: 'People We Support', 
    path: '/people', 
    iconName: 'Users', 
    order: 30, 
    status: 'Active',
    tabs: [
      { id: 'tab-pws-1', name: 'PWS Basic Information', order: 10, formId: 'form-pws-info' },
      { id: 'tab-pws-2', name: 'Contacts & Schedule', order: 20, formId: 'form-pws-contacts' },
      { id: 'tab-pws-3', name: 'Communication', order: 30, formId: 'form-pws-comm' },
      { id: 'tab-pws-4', name: 'Goals', order: 40, formId: 'form-pws-goals' },
      { id: 'tab-pws-5', name: 'Oranga Tamariki', order: 50, formId: 'form-pws-ot' },
      { id: 'tab-pws-6', name: 'Daily Diary', order: 60, formId: 'form-pws-diary' },
      { id: 'tab-pws-7', name: 'Documents', order: 70, formId: 'form-pws-docs' },
      { id: 'tab-pws-8', name: 'Health', order: 80, formId: 'form-pws-health' },
      { id: 'tab-pws-9', name: 'Financials', order: 90, formId: 'form-pws-financials' },
      { id: 'tab-pws-10', name: 'Key Worker Report', order: 100, formId: 'form-pws-report' },
    ]
  },
  { id: 'sec-staff', name: 'Staff', path: '/staff', iconName: 'UsersRound', order: 40, status: 'Active', tabs: [] },
  { 
    id: 'sec-loc', 
    name: 'Locations', 
    path: '/locations', 
    iconName: 'Building2', 
    order: 50, 
    status: 'Active',
    tabs: [
        { id: 'tab-loc-1', name: 'Vehicle Check', order: 10, formId: 'form-3' }
    ]
  },
   { id: 'sec-finance', name: 'Finance', path: '/finance', iconName: 'Landmark', order: 55, status: 'Active', tabs: [] },
  { 
    id: 'sec-automation', 
    name: 'System Automation', 
    path: '/automation', 
    iconName: 'Zap', 
    order: 56, 
    status: 'Active',
    tabs: []
  },
  { 
    id: 'sec-inc', 
    name: 'Incident Reports', 
    path: '#', 
    iconName: 'ShieldAlert', 
    order: 60, 
    status: 'Active',
    tabs: [
        { id: 'tab-inc-1', name: 'Incident Form', order: 10, formId: 'form-2' }
    ]
  },
  { id: 'sec-settings', name: 'System Settings', path: '/settings', iconName: 'Settings', order: 999, status: 'Active', tabs: [] },
];

export const mockForms: CustomForm[] = [
    { 
      id: 'form-1', name: 'Client Intake Form', linkedSectionId: 'sec-people', status: 'Inactive',
      fields: [
        { id: 'field-1-1', name: 'First Name', type: 'text', order: 1, required: true, tooltip: "Client's legal first name.", status: 'Active', visibleRoles: [] },
        { id: 'field-1-2', name: 'Last Name', type: 'text', order: 2, required: true, status: 'Active', visibleRoles: [] },
        { id: 'field-1-3', name: 'Date of Birth', type: 'dob', order: 3, status: 'Active', visibleRoles: [] },
      ]
    },
    { 
      id: 'form-2', name: 'Incident Report Form', linkedSectionId: 'sec-inc', status: 'Inactive',
      fields: [
        { id: 'field-2-1', name: 'Incident Date', type: 'date', order: 1, required: true, status: 'Active', visibleRoles: [] },
        { id: 'field-2-2', name: 'Incident Time', type: 'time', order: 2, required: true, status: 'Active', visibleRoles: [] },
        { id: 'field-2-3', name: 'Detailed Description', type: 'richtext', order: 3, status: 'Active', visibleRoles: [] },
      ]
    },
    { 
      id: 'form-3', name: 'Vehicle Check', linkedSectionId: 'sec-loc', status: 'Active',
      fields: []
    },
    { 
      id: 'form-4', name: 'Progress Note Form', linkedSectionId: 'sec-people', status: 'Active',
      fields: [
        { id: 'field-4-1', name: 'Date', type: 'date', order: 10, required: true, status: 'Active', visibleRoles: [] },
        { id: 'field-4-2', name: 'Note', type: 'richtext', order: 20, required: true, status: 'Active', visibleRoles: [] },
      ]
    },
    { 
      id: 'form-5', name: 'Medication Chart Form', linkedSectionId: 'sec-people', status: 'Active',
      fields: [
          { id: 'field-5-1', name: 'Medication Name', type: 'text', order: 10, required: true, status: 'Active', visibleRoles: [] },
          { id: 'field-5-2', name: 'Dosage', type: 'text', order: 20, required: true, status: 'Active', visibleRoles: [] },
          { id: 'field-5-3', name: 'Time Administered', type: 'time', order: 30, required: true, status: 'Active', visibleRoles: [] },
          { id: 'field-5-4', name: 'Administered By', type: 'text', order: 40, required: true, status: 'Active', visibleRoles: [] },
      ]
    },
    // New Forms for PWS Tabs
    {
      id: 'form-pws-info', name: 'PWS Basic Information', linkedSectionId: 'sec-people', status: 'Active',
      fields: [
        { id: 'field-pi-1', name: 'Profile Picture', type: 'file-upload', order: 10, status: 'Active', visibleRoles: [] },
        { id: 'field-pi-2', name: 'PWS Basic Information', type: 'headline', order: 20, status: 'Active', visibleRoles: [] },
        { id: 'field-pi-3', name: 'First Name', type: 'text', order: 30, required: true, status: 'Active', visibleRoles: [] },
        { id: 'field-pi-4', name: 'Last Name', type: 'text', order: 40, required: true, tooltip: "Please type last name in UPPER CASE", status: 'Active', visibleRoles: [] },
        { id: 'field-pi-5', name: 'Middle Name', type: 'text', order: 50, status: 'Active', visibleRoles: [] },
        { id: 'field-pi-6', name: 'Preferred Name', type: 'text', order: 60, status: 'Active', visibleRoles: [] },
        { id: 'field-pi-7', name: 'Gender', type: 'dropdown', order: 70, status: 'Active', visibleRoles: [] },
        { id: 'field-pi-8', name: 'Date of Birth', type: 'dob', order: 80, required: true, status: 'Active', visibleRoles: [] },
        { id: 'field-pi-9', name: 'Address', type: 'headline', order: 90, status: 'Active', visibleRoles: [] },
        { id: 'field-pi-10', name: 'Home Address', type: 'textbox', order: 100, status: 'Active', visibleRoles: [] },
        { id: 'field-pi-11', name: 'Phone', type: 'text', order: 110, status: 'Active', visibleRoles: [] },
      ]
    },
    {
      id: 'form-pws-contacts', name: 'Contacts & Schedule', linkedSectionId: 'sec-people', status: 'Active',
      fields: [
        { id: 'field-cs-1', name: 'Next of Kin Name', type: 'text', order: 10, status: 'Active', visibleRoles: [] },
        { id: 'field-cs-2', name: 'Next of Kin Contact', type: 'text', order: 20, status: 'Active', visibleRoles: [] },
        { id: 'field-cs-3', name: 'Activity Schedule', type: 'richtext', order: 30, status: 'Active', visibleRoles: [] },
      ]
    },
    {
      id: 'form-pws-comm', name: 'Communication Form', linkedSectionId: 'sec-people', status: 'Active',
      fields: [
        { id: 'field-co-1', name: 'Communication Needs', type: 'richtext', order: 10, status: 'Active', visibleRoles: [] },
        { id: 'field-co-2', name: 'Preferred Method', type: 'dropdown', order: 20, status: 'Active', visibleRoles: [] },
      ]
    },
    {
      id: 'form-pws-goals', name: 'Goals Form', linkedSectionId: 'sec-people', status: 'Active',
      fields: [
        { id: 'field-g-1', name: 'Personal Goal', type: 'text', order: 10, status: 'Active', visibleRoles: [] },
        { id: 'field-g-2', name: 'Steps to Achieve', type: 'richtext', order: 20, status: 'Active', visibleRoles: [] },
      ]
    },
    {
      id: 'form-pws-ot', name: 'Oranga Tamariki Form', linkedSectionId: 'sec-people', status: 'Active',
      fields: [
        { id: 'field-ot-1', name: 'Event Type', type: 'text', order: 10, status: 'Active', visibleRoles: [] },
        { id: 'field-ot-2', name: 'Event Date', type: 'date', order: 20, status: 'Active', visibleRoles: [] },
      ]
    },
    {
      id: 'form-pws-diary', name: 'Daily Diary Form', linkedSectionId: 'sec-people', status: 'Active',
      fields: [
        { id: 'field-dd-1', name: 'Date', type: 'date', order: 10, required: true, status: 'Active', visibleRoles: [] },
        { id: 'field-dd-2', name: 'Shift Notes', type: 'richtext', order: 20, required: true, status: 'Active', visibleRoles: [] },
        { id: 'field-dd-3', name: 'Mood', type: 'dropdown', order: 30, status: 'Active', visibleRoles: [] },
      ]
    },
    {
      id: 'form-pws-docs', name: 'Documents Form', linkedSectionId: 'sec-people', status: 'Active',
      fields: [
        { id: 'field-doc-1', name: 'Document Upload', type: 'file-upload', order: 10, status: 'Active', visibleRoles: [] },
        { id: 'field-doc-2', name: 'Document Type', type: 'dropdown', order: 20, status: 'Active', visibleRoles: [] },
      ]
    },
    {
      id: 'form-pws-health', name: 'Health Form', linkedSectionId: 'sec-people', status: 'Active',
      fields: [
        { id: 'field-h-1', name: 'Allergies', type: 'richtext', order: 10, status: 'Active', visibleRoles: [] },
        { id: 'field-h-2', name: 'Medications', type: 'richtext', order: 20, status: 'Active', visibleRoles: [] },
        { id: 'field-h-3', name: 'Health Provider Name', type: 'text', order: 30, status: 'Active', visibleRoles: [] },
      ]
    },
    {
      id: 'form-pws-financials', name: 'Financials Form', linkedSectionId: 'sec-people', status: 'Active',
      fields: [
        { id: 'field-f-1', name: 'Bank Account Details', type: 'text', order: 10, status: 'Active', visibleRoles: [] },
        { id: 'field-f-2', name: 'Budget Plan', type: 'file-upload', order: 20, status: 'Active', visibleRoles: [] },
      ]
    },
    {
      id: 'form-pws-report', name: 'Key Worker Report Form', linkedSectionId: 'sec-people', status: 'Active',
      fields: [
        { id: 'field-r-1', name: 'Report Date', type: 'date', order: 10, status: 'Active', visibleRoles: [] },
        { id: 'field-r-2', name: 'Summary', type: 'richtext', order: 20, status: 'Active', visibleRoles: [] },
      ]
    },
    {
      id: 'form-staff-basic-details', name: 'Staff Basic Details', linkedSectionId: 'sec-settings', status: 'Active',
      fields: [
        { id: 'field-sbd-1', name: 'Profile Picture', type: 'file-upload', order: 10, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-2', name: 'Staff Basic Information', type: 'headline', order: 20, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-3', name: 'First Name', type: 'text', order: 30, required: true, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-4', name: 'Preferred Name', type: 'text', order: 40, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-5', name: 'Middle Name', type: 'text', order: 50, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-6', name: 'Surname', type: 'text', order: 60, required: true, status: 'Active', visibleRoles: [] },
        {
          id: 'field-sbd-7', name: 'Sites orientated in', type: 'multi-select-dropdown', order: 70, status: 'Active', visibleRoles: [],
          options: [
            { value: 'site-1', label: '1 Bayswater Court' }, { value: 'site-2', label: '1 Dalmont Place' },
            { value: 'site-3', label: '1 Holly Place' }, { value: 'site-4', label: '1 Waikaka Place (46 Maggie Place)' },
            { value: 'site-5', label: '1/90 Lake Rd' }, { value: 'site-6', label: '11 Nevada Road' },
            { value: 'site-7', label: '11/13 Anglesea Street' }, { value: 'site-8', label: '12 Stratford Place' },
            { value: 'site-9', label: '122 Mardon Road' }, { value: 'site-10', label: '13 Allgood Place' },
            { value: 'site-11', label: '15 Bremworth Avenue' }, { value: 'site-12', label: '16 Lindsay Crescent' },
            { value: 'site-13', label: '1768 River Road' }, { value: 'site-14', label: '18 Poaka Avenue' },
            { value: 'site-15', label: '2/90 Lake Rd' }, { value: 'site-16', label: '20 Sirius Crescent' },
            { value: 'site-17', label: '23 Chalgrove Road' }, { value: 'site-18', label: '23 Moonlight Drive' },
            { value: 'site-19', label: '232 Thomas Road' }, { value: 'site-20', label: '235 Clarkin Road' },
            { value: 'site-21', label: '250 Tramway Road' }, { value: 'site-22', label: '3/90 Lake Rd' },
            { value: 'site-23', label: '31 Bellona Place' }, { value: 'site-24', label: '34 Chequers Ave' },
            { value: 'site-25', label: '36 Saxbys Road' }, { value: 'site-26', label: '36 Winslow Court' },
            { value: 'site-27', label: '39 Somerton Drive' }, { value: 'site-28', label: '4 Poaka Ave' },
            { value: 'site-29', label: '4 Shrule Place' }, { value: 'site-30', label: '4/90 Lake Rd' },
            { value: 'site-31', label: '40 Barrington' }, { value: 'site-32', label: '41 Maanihi Drive' },
            { value: 'site-33', label: '41 Ravenscourt Place' }, { value: 'site-34', label: '41 The Esplanade' },
            { value: 'site-35', label: '43 Ravenscourt Place' }, { value: 'site-36', label: '43A Burns Street' },
            { value: 'site-37', label: '5/90 Lake Rd' }, { value: 'site-38', label: '55 Moonlight Drive' },
            { value: 'site-39', label: '57 Barrington Drive' }, { value: 'site-40', label: '64 Horsham Downs' },
            { value: 'site-41', label: '78 Palmerston Street' }, { value: 'site-42', label: '8 Farringdon Avenue' },
            { value: 'site-43', label: '9 Glenwarrick Court' }, { value: 'site-44', label: '90 Lake Rd' },
            { value: 'site-45', label: '93 Clarence Street' }, { value: 'site-46', label: 'Flat4 - Anglesea(ZF)' },
            { value: 'site-47', label: 'General' }, { value: 'site-48', label: 'Head Office' },
            { value: 'site-49', label: 'SILtest' }, { value: 'site-50', label: 'Test' }, { value: 'site-51', label: 'Volunteer' },
          ]
        },
        {
          id: 'field-sbd-8', name: 'Sites currently contracted to', type: 'multi-select-dropdown', order: 80, status: 'Active', visibleRoles: [],
          options: [
             { value: 'site-1', label: '1 Bayswater Court' }, { value: 'site-2', label: '1 Dalmont Place' },
            { value: 'site-3', label: '1 Holly Place' }, { value: 'site-4', label: '1 Waikaka Place (46 Maggie Place)' },
            { value: 'site-5', label: '1/90 Lake Rd' }, { value: 'site-6', label: '11 Nevada Road' },
            { value: 'site-7', label: '11/13 Anglesea Street' }, { value: 'site-8', label: '12 Stratford Place' },
            { value: 'site-9', label: '122 Mardon Road' }, { value: 'site-10', label: '13 Allgood Place' },
            { value: 'site-11', label: '15 Bremworth Avenue' }, { value: 'site-12', label: '16 Lindsay Crescent' },
            { value: 'site-13', label: '1768 River Road' }, { value: 'site-14', label: '18 Poaka Avenue' },
            { value: 'site-15', label: '2/90 Lake Rd' }, { value: 'site-16', label: '20 Sirius Crescent' },
            { value: 'site-17', label: '23 Chalgrove Road' }, { value: 'site-18', label: '23 Moonlight Drive' },
            { value: 'site-19', label: '232 Thomas Road' }, { value: 'site-20', label: '235 Clarkin Road' },
            { value: 'site-21', label: '250 Tramway Road' }, { value: 'site-22', label: '3/90 Lake Rd' },
            { value: 'site-23', label: '31 Bellona Place' }, { value: 'site-24', label: '34 Chequers Ave' },
            { value: 'site-25', label: '36 Saxbys Road' }, { value: 'site-26', label: '36 Winslow Court' },
            { value: 'site-27', label: '39 Somerton Drive' }, { value: 'site-28', label: '4 Poaka Ave' },
            { value: 'site-29', label: '4 Shrule Place' }, { value: 'site-30', label: '4/90 Lake Rd' },
            { value: 'site-31', label: '40 Barrington' }, { value: 'site-32', label: '41 Maanihi Drive' },
            { value: 'site-33', label: '41 Ravenscourt Place' }, { value: 'site-34', label: '41 The Esplanade' },
            { value: 'site-35', label: '43 Ravenscourt Place' }, { value: 'site-36', label: '43A Burns Street' },
            { value: 'site-37', label: '5/90 Lake Rd' }, { value: 'site-38', label: '55 Moonlight Drive' },
            { value: 'site-39', label: '57 Barrington Drive' }, { value: 'site-40', label: '64 Horsham Downs' },
            { value: 'site-41', label: '78 Palmerston Street' }, { value: 'site-42', label: '8 Farringdon Avenue' },
            { value: 'site-43', label: '9 Glenwarrick Court' }, { value: 'site-44', label: '90 Lake Rd' },
            { value: 'site-45', label: '93 Clarence Street' }, { value: 'site-46', label: 'Flat4 - Anglesea(ZF)' },
            { value: 'site-47', label: 'General' }, { value: 'site-48', label: 'Head Office' },
            { value: 'site-49', label: 'SILtest' }, { value: 'site-50', label: 'Test' }, { value: 'site-51', label: 'Volunteer' },
          ]
        },
        { id: 'field-sbd-9', name: 'Birth Date', type: 'date', order: 90, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-10', name: 'Gender', type: 'radio', order: 100, status: 'Active', visibleRoles: [], options: [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }] },
        {
          id: 'field-sbd-11', name: 'Ethnicity', type: 'dropdown', order: 110, status: 'Active', visibleRoles: [],
          options: [
            { value: 'nz-european', label: 'NZ European' }, { value: 'other-european', label: 'Other European' },
            { value: 'nz-maori', label: 'NZ Maori' }, { value: 'niuean', label: 'Niuean' },
            { value: 'tokelauan', label: 'Tokelauan' }, { value: 'fijian', label: 'Fijian' },
            { value: 'other-pacific', label: 'Other Pacific Island' }, { value: 'southeast-asian', label: 'Southeast Asian' },
            { value: 'chinese', label: 'Chinese' }, { value: 'indian', label: 'Indian' },
            { value: 'other-asian', label: 'Other Asian' }, { value: 'middle-eastern', label: 'Middle Eastern' },
            { value: 'latin-hispanic', label: 'Latin American / Hispanic' }, { value: 'african', label: 'African' },
            { value: 'other-ethnicity', label: 'Other Ethnicity' }, { value: 'not-stated', label: 'Not Stated' },
          ]
        },
        { id: 'field-sbd-12', name: 'Contact Details', type: 'headline', order: 120, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-13', name: 'Home Phone Number', type: 'text', order: 130, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-14', name: 'Mobile Number', type: 'text', order: 140, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-15', name: 'Work Number', type: 'text', order: 150, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-16', name: 'Company Email', type: 'text', order: 160, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-17', name: 'E-mail', type: 'text', order: 170, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-18', name: 'Address', type: 'headline', order: 180, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-19', name: 'Street Number', type: 'text', order: 190, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-20', name: 'Street Name', type: 'text', order: 200, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-21', name: 'Street Suburb', type: 'text', order: 210, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-22', name: 'State', type: 'text', order: 220, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-23', name: 'Postcode', type: 'text', order: 230, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-24', name: 'Emergency Contact', type: 'headline', order: 240, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-25', name: 'Name', type: 'text', order: 250, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-26', name: 'Relationship to Client', type: 'text', order: 260, status: 'Active', visibleRoles: [] }, // Assuming this should be Relationship to Staff?
        { id: 'field-sbd-27', name: 'Contact Number', type: 'text', order: 270, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-28', name: 'Service Details', type: 'headline', order: 280, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-29', name: 'Start Date', type: 'date', order: 290, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-30', name: 'Finish Date', type: 'date', order: 300, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-31', name: 'Employment Type', type: 'radio', order: 310, status: 'Active', visibleRoles: [], options: [{ value: 'casual', label: 'Casual' }, { value: 'temp', label: 'Temp' }, { value: 'full-time', label: 'Full-Time' }, { value: 'part-time', label: 'Part-Time' }, { value: 'other', label: 'Other' }] },
        { id: 'field-sbd-32', name: 'Probation Period End', type: 'date', order: 320, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-33', name: 'Active Status', type: 'checkbox', order: 330, status: 'Active', visibleRoles: [], label: 'Inactive' }, // Assuming checkbox for active/inactive
        { id: 'field-sbd-34', name: 'Staff Financial Information', type: 'headline', order: 340, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-35', name: 'Standard', type: 'sub-headline', order: 350, status: 'Active', visibleRoles: [] }, // Assuming this is a sub-section title
        { id: 'field-sbd-36', name: 'Occupation', type: 'dropdown', order: 360, status: 'Active', visibleRoles: [], options: [{ value: 'select', label: 'Select form list' }] }, // Placeholder option
        { id: 'field-sbd-37', name: 'Pay Point', type: 'dropdown', order: 370, status: 'Active', visibleRoles: [], options: [{ value: '100-admin', label: '100 - Admin' }] }, // Placeholder option
        { id: 'field-sbd-38', name: 'Costing Code', type: 'dropdown', order: 380, status: 'Active', visibleRoles: [], options: [{ value: 'select', label: 'Select from list' }] }, // Placeholder option
        { id: 'field-sbd-39', name: 'Employee No.', type: 'text', order: 390, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-40', name: 'Payment', type: 'sub-headline', order: 400, status: 'Active', visibleRoles: [] }, // Assuming this is a sub-section title
        { id: 'field-sbd-41', name: 'Pay Frequency', type: 'radio', order: 410, status: 'Active', visibleRoles: [], options: [{ value: 'weekly', label: 'Weekly' }, { value: 'fortnightly', label: 'Fortnightly' }, { value: 'monthly', label: 'Monthly' }, { value: 'half-monthly', label: 'Half Monthly' }, { value: 'four-weekly', label: 'Four Weekly' }] },
        { id: 'field-sbd-42', name: 'Employee Type', type: 'radio', order: 420, status: 'Active', visibleRoles: [], options: [{ value: 'wage-hour', label: 'Wage [per Hour]' }, { value: 'wage-pay', label: 'Wage [per Pay]' }] },
        { id: 'field-sbd-43', name: 'IRD Number', type: 'text', order: 430, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-44', name: 'Tax Code', type: 'dropdown', order: 440, status: 'Active', visibleRoles: [], options: [{ value: 'm', label: 'M' }] }, // Placeholder option
        { id: 'field-sbd-45', name: 'Payment Method', type: 'radio', order: 450, status: 'Active', visibleRoles: [], options: [{ value: 'bank', label: 'Bank' }] }, // Only Bank option provided
        { id: 'field-sbd-46', name: 'Bank Account', type: 'text', order: 460, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-47', name: 'Bank Ref', type: 'text', order: 470, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-48', name: 'Bank Code', type: 'text', order: 480, status: 'Active', visibleRoles: [] }, // Assuming text input for bank code
        { id: 'field-sbd-49', name: 'Pay Equity', type: 'dropdown', order: 490, status: 'Active', visibleRoles: [], options: [{ value: 'select', label: 'Please Select' }] }, // Placeholder option
        { id: 'field-sbd-50', name: 'Pay Equity Qualification', type: 'file-upload', order: 500, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-51', name: 'Long Service Details', type: 'headline', order: 510, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-52', name: 'Long Service Start Date', type: 'date', order: 520, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-53', name: '5 Yr Date', type: 'date', order: 530, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-54', name: '10 Yr Date', type: 'date', order: 540, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-55', name: '15 Yr Date', type: 'date', order: 550, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-56', name: '20 Yr Date', type: 'date', order: 560, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-57', name: 'KiwiSaver', type: 'headline', order: 570, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-58', name: 'KiwiSaver Entry Status', type: 'radio', order: 580, status: 'Active', visibleRoles: [], options: [{ value: 'not-eligible', label: 'Not Eligible' }, { value: 'auto-enrol', label: 'Auto Enrol' }, { value: 'opt-in', label: 'Opt In' }, { value: 'existing', label: 'Existing' }] },
        { id: 'field-sbd-59', name: 'KiwiSaver Opt In Date', type: 'date', order: 590, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-60', name: 'KiwiSaver Employee Percentage', type: 'radio', order: 600, status: 'Active', visibleRoles: [], options: [{ value: '3', label: '3' }, { value: '4', label: '4' }, { value: '6', label: '6' }, { value: '8', label: '8' }, { value: '10', label: '10' }, { value: 'n/a', label: 'N/A' }] },
        { id: 'field-sbd-61', name: 'KiwiSaver Opt Out', type: 'radio', order: 610, status: 'Active', visibleRoles: [], options: [{ value: 'yes', label: 'YES' }, { value: 'no', label: 'NO' }] },
        { id: 'field-sbd-62', name: 'KiwiSaver Opt Out Date', type: 'date', order: 620, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-63', name: 'General/Notes', type: 'headline', order: 630, status: 'Active', visibleRoles: [] },
        { id: 'field-sbd-64', name: 'Notes', type: 'richtext', order: 640, status: 'Active', visibleRoles: [] },
      ]
    }
];

export const mockNotices: Notice[] = [
  {
    id: 'notice-1',
    title: 'System Maintenance Scheduled',
    content: 'Please be aware that there will be a scheduled system maintenance on Friday at 10 PM. The system may be unavailable for up to 1 hour. We apologize for any inconvenience.',
    authorId: 'staff-admin',
    createdAt: subDays(now, 1),
    status: 'Published',
    type: 'Urgent',
  },
  {
    id: 'notice-2',
    title: 'New Policy for Leave Requests',
    content: 'All leave requests must now be submitted at least 2 weeks in advance. Please see the updated policy document in the Drive for more details.',
    authorId: 'staff-admin',
    createdAt: subDays(now, 3),
    status: 'Published',
    type: 'Info',
  },
  {
    id: 'notice-3',
    title: 'Parking Lot Resurfacing',
    content: 'The north parking lot will be closed for resurfacing from Monday to Wednesday next week. Please use the south lot during this time.',
    authorId: 'staff-admin',
    createdAt: subDays(now, 5),
    status: 'Published',
    type: 'Warning',
  },
  {
    id: 'notice-4',
    title: 'Draft: End of Year Party',
    content: 'Details to be confirmed for the end of year celebration.',
    authorId: 'staff-admin',
    createdAt: subDays(now, 2),
    status: 'Draft',
    type: 'Info',
  },
];


export const fieldTypes: { value: FormFieldType; label: string; icon: LucideIcon; description?: string }[] = [
    // Text-Based Fields
    { value: 'text', label: 'Text', icon: CaseSensitive, description: 'Single line text input for short text like names, titles, etc.' },
    { value: 'textbox', label: 'Text Box', icon: FileText, description: 'Multi-line text area for longer content like descriptions, notes, etc.' },
    { value: 'textbox-full', label: 'Text Box (full width)', icon: Square, description: 'Full-width multi-line text area for extensive content.' },
    { value: 'richtext', label: 'Rich Text', icon: Pilcrow, description: 'Rich text editor with formatting options like bold, italic, lists, etc.' },
    { value: 'email', label: 'Email', icon: FileText, description: 'Email input with format validation and auto-complete.' },
    { value: 'url', label: 'URL', icon: Link, description: 'Web address input with protocol validation.' },
    { value: 'password', label: 'Password', icon: Lock, description: 'Hidden input with strength meter and validation.' },
    
    // Numeric Fields
    { value: 'number-whole', label: 'Number (whole)', icon: Hash, description: 'Numeric input for whole numbers only.' },
    { value: 'number-decimal', label: 'Number (decimal)', icon: Binary, description: 'Numeric input for decimal numbers with precision.' },
    { value: 'currency', label: 'Currency', icon: DollarSign, description: 'Currency input with proper formatting and validation.' },
    { value: 'percent', label: 'Percentage', icon: Percent, description: 'Percentage input with % suffix and decimal support.' },
    { value: 'auto_number', label: 'Auto Number', icon: Hash, description: 'Auto-increment field with prefix, padding, and start value.' },
    { value: 'rating', label: 'Rating', icon: Star, description: 'Star or numeric rating system with customizable max value.' },
    
    // Date & Time Fields
    { value: 'date', label: 'Date', icon: CalendarDays, description: 'Date picker for selecting a specific date.' },
    { value: 'dob', label: 'Date of Birth', icon: Cake, description: 'Specialized date picker optimized for birth date selection with age calculation.' },
    { value: 'time', label: 'Time', icon: Clock, description: 'Time picker for selecting a specific time of day.' },
    { value: 'datetime', label: 'Date & Time', icon: Calendar, description: 'Combined date and time picker with timezone awareness.' },
    { value: 'daterange', label: 'Date Range', icon: CalendarRange, description: 'Start and end date picker with predefined ranges.' },
    
    // Choice / Boolean Fields
    { value: 'dropdown', label: 'Dropdown List', icon: ChevronDownSquare, description: 'Single selection from a predefined list of options.' },
    { value: 'multi-select-dropdown', label: 'Multi-Select Dropdown', icon: ListChecks, description: 'Multiple selections from a predefined list of options.' },
    { value: 'dual-select', label: 'Dual-Select List Boxes', icon: ArrowRightLeft, description: 'Two side-by-side list boxes for moving items between available and selected options.' },
    { value: 'radio', label: 'Radio List', icon: RadioTower, description: 'Single selection from a list of radio button options.' },
    { value: 'checkbox', label: 'Checkbox (single)', icon: CheckSquare, description: 'Single checkbox for yes/no or true/false responses.' },
    { value: 'toggle', label: 'Toggle Switch', icon: ToggleLeft, description: 'Modern switch style checkbox with on/off labels.' },
    { value: 'tags', label: 'Tags', icon: Tag, description: 'Select or add new labels/tags with suggestions.' },
    
    // Relational & Reference Fields
    { value: 'lookup', label: 'Lookup', icon: Search, description: 'Lookup another record in the system with search functionality.' },
    { value: 'user', label: 'User Selector', icon: Users, description: 'User selector with team and role filtering.' },
    { value: 'reference', label: 'Reference', icon: Link2, description: 'Link to another form or object in the system.' },
    { value: 'foreign_key', label: 'Foreign Key', icon: Database, description: 'Link to external database ID, read-only or editable.' },
    { value: 'external_select', label: 'External Select', icon: Globe, description: 'Dropdown populated from external API endpoint.' },
    
    // Computed / Formula Fields
    { value: 'formula', label: 'Formula', icon: Calculator, description: 'Auto-calculated field based on other field values.' },
    { value: 'rollup', label: 'Rollup', icon: TrendingUp, description: 'Sum/Average from child records with aggregation types.' },
    { value: 'datecalc', label: 'Date Calculation', icon: CalendarPlus, description: 'Date calculations like Due Date = Start + X days.' },
    { value: 'conditional_text', label: 'Conditional Text', icon: FileText, description: 'Show text based on conditional logic rules.' },
    
    // Location & File Upload Fields
    { value: 'file-upload', label: 'File Upload', icon: Upload, description: 'File upload field for documents, images, or other files.' },
    { value: 'image', label: 'Image Upload', icon: Image, description: 'Image upload with thumbnail generation and cropping.' },
    { value: 'signature', label: 'On-screen Signature', icon: PenSquare, description: 'Digital signature capture field for electronic signatures.' },
    { value: 'geolocation', label: 'Geolocation', icon: MapPin, description: 'Lat/Long coordinates or map pin with auto-detect.' },
    { value: 'address', label: 'Address', icon: MapPin, description: 'Composite address field with autocomplete integration.' },
    
    // Smart / Dynamic Fields
    { value: 'condition_field', label: 'Conditional Field', icon: Eye, description: 'Show/hide field based on conditional logic.' },
    { value: 'stepper', label: 'Stepper', icon: ListOrdered, description: 'Multi-step wizard field with step progression.' },
    { value: 'progress_bar', label: 'Progress Bar', icon: BarChart3, description: 'Show form completion percentage based on required fields.' },
    { value: 'json_editor', label: 'JSON Editor', icon: Code, description: 'Structured key/value editor with schema or freeform.' },
    { value: 'barcode_scanner', label: 'Barcode Scanner', icon: QrCode, description: 'Scan QR codes or barcodes from mobile devices.' },
    { value: 'color_picker', label: 'Color Picker', icon: Palette, description: 'Color selection with HEX, RGB format support.' },
    
    // System/Internal Fields
    { value: 'created_at', label: 'Created At', icon: Clock, description: 'Auto-timestamp for record creation (read-only).' },
    { value: 'updated_at', label: 'Updated At', icon: RefreshCw, description: 'Auto-updated timestamp on save (read-only).' },
    { value: 'created_by', label: 'Created By', icon: User, description: 'Auto-set user who created the record (read-only).' },
    { value: 'record_id', label: 'Record ID', icon: Hash, description: 'Unique identifier for the record (read-only).' },
    { value: 'status', label: 'Status', icon: Activity, description: 'System status field with predefined options.' },
    
    // Service & Specialized Fields
    { value: 'service-item', label: 'Service Item', icon: Package, description: 'Specialized field for selecting service items with pricing.' },
    { value: 'headline', label: 'Headline', icon: Heading1, description: 'Section header for organizing form content into groups.' },
    { value: 'sub-headline', label: 'Sub-Headline', icon: Heading2, description: 'Subsection header for further organizing form content.' },
    { value: 'infobox', label: 'Info Box', icon: Info, description: 'Information display box for showing help text or important notices.' },
    { value: 'infobox-full', label: 'Info Box (full width)', icon: Info, description: 'Full-width information display box for prominent notices.' },
    { value: 'spacer', label: 'Single Space', icon: RectangleHorizontal, description: 'Visual spacing element to improve form layout and readability.' },
];

export const mockTimesheets: Timesheet[] = [];

export const mockInvoices: Invoice[] = [
  { id: 'inv-1', invoiceNumber: 'INV-00123', clientId: 'client-1', dateIssued: subDays(now, 10), dueDate: addDays(now, 20), amount: 4500.00, status: 'Pending', tax: 450.00, lineItems: [], xeroExported: false },
  { id: 'inv-2', invoiceNumber: 'INV-00124', clientId: 'client-2', dateIssued: subDays(now, 5), dueDate: addDays(now, 25), amount: 750.50, status: 'Pending', tax: 75.05, lineItems: [], xeroExported: true },
  { id: 'inv-3', invoiceNumber: 'INV-00121', clientId: 'client-1', dateIssued: subDays(now, 45), dueDate: subDays(now, 15), amount: 12500.00, status: 'Paid', tax: 1250.00, lineItems: [], xeroExported: true },
  { id: 'inv-4', invoiceNumber: 'INV-00120', clientId: 'client-2', dateIssued: subDays(now, 62), dueDate: subDays(now, 32), amount: 1200.75, status: 'Overdue', tax: 120.08, lineItems: [], xeroExported: false },
  { id: 'inv-5', invoiceNumber: 'INV-00119', clientId: 'client-1', dateIssued: subDays(now, 90), dueDate: subDays(now, 60), amount: 8200.00, status: 'Paid', tax: 820.00, lineItems: [], xeroExported: true },
];

export const mockPayrollRuns: PayrollType[] = [
    { id: 'pr-1', periodStart: subDays(now, 14), periodEnd: subDays(now, 1), status: 'Paid', staffId: 'staff-1', hoursWorked: 80, payRate: 55, grossPay: 4400, deductions: 1200, netPay: 3200},
    { id: 'pr-2', periodStart: subDays(now, 28), periodEnd: subDays(now, 15), status: 'Paid', staffId: 'staff-2', hoursWorked: 75, payRate: 55, grossPay: 4125, deductions: 1100, netPay: 3025},
    { id: 'pr-3', periodStart: subDays(now, 14), periodEnd: subDays(now, 1), status: 'Pending', staffId: 'staff-3', hoursWorked: 80, payRate: 65, grossPay: 5200, deductions: 1500, netPay: 3700},
];

export const mockClientBudgets: ClientFunding[] = [
    {
        clientId: 'client-1',
        coreBudget: 25000,
        coreSpent: 23500, // Nearing 90%
        capacityBudget: 15000,
        capacitySpent: 16200, // Overspent
        capitalBudget: 10000,
        capitalSpent: 5000,
        startDate: new Date(now.getFullYear(), 0, 1),
        endDate: new Date(now.getFullYear(), 11, 31),
    },
    {
        clientId: 'client-2',
        coreBudget: 30000,
        coreSpent: 12000,
        capacityBudget: 20000,
        capacitySpent: 8500,
        capitalBudget: 5000,
        capitalSpent: 0,
        startDate: new Date(now.getFullYear(), 0, 1),
        endDate: new Date(now.getFullYear(), 11, 31),
    }
];

export const mockTransactions: ClientTransaction[] = [
    { id: 'txn-1', clientId: 'client-1', date: subDays(now, 15), description: 'NDIS Payment Received', type: 'Payment', amount: 5000, gst: 0, category: 'Other', attachmentName: 'NDIS_Statement_Oct.pdf'},
    { id: 'txn-2', clientId: 'client-1', date: subDays(now, 14), description: 'Woolworths Groceries', type: 'Expense', amount: 150.75, gst: 13.70, category: 'Groceries', attachmentName: 'woolies_receipt_1410.jpg'},
    { id: 'txn-3', clientId: 'client-1', date: subDays(now, 12), description: 'Transport to Appointment', type: 'Expense', amount: 45.50, gst: 4.14, category: 'Transport' },
    { id: 'txn-4', clientId: 'client-1', date: subDays(now, 10), description: 'Equipment Purchase: Wheelchair', type: 'Expense', amount: 1200, gst: 0, category: 'Equipment', attachmentName: 'wheelchair_invoice.pdf'},
    { id: 'txn-5', clientId: 'client-1', date: subDays(now, 5), description: 'Chemist Warehouse', type: 'Expense', amount: 88.95, gst: 8.09, category: 'Other' },
    { id: 'txn-6', clientId: 'client-2', date: subDays(now, 20), description: 'NDIS Payment Received', type: 'Payment', amount: 7500, gst: 0, category: 'Other' },
    { id: 'txn-7', clientId: 'client-2', date: subDays(now, 18), description: 'Art Supplies', type: 'Expense', amount: 75, gst: 6.82, category: 'Other' },
    { id: 'txn-8', clientId: 'client-2', date: subDays(now, 15), description: 'Event Ticket: Concert', type: 'Expense', amount: 120, gst: 10.91, category: 'Other' },
];

// Local storage keys
const FORMS_STORAGE_KEY = 'carenest_forms';
const SECTIONS_STORAGE_KEY = 'carenest_sections';

// Helper functions for localStorage
export const getStoredForms = (): CustomForm[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(FORMS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading forms from localStorage:', error);
    return [];
  }
};

export const setStoredForms = (forms: CustomForm[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(FORMS_STORAGE_KEY, JSON.stringify(forms));
  } catch (error) {
    console.error('Error writing forms to localStorage:', error);
  }
};

export const getStoredSections = (): AppSection[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(SECTIONS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading sections from localStorage:', error);
    return [];
  }
};

export const setStoredSections = (sections: AppSection[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(SECTIONS_STORAGE_KEY, JSON.stringify(sections));
  } catch (error) {
    console.error('Error writing sections to localStorage:', error);
  }
};

// Get all forms (mock + stored)
export const getAllForms = (): CustomForm[] => {
  const storedForms = getStoredForms();
  const allForms = [...mockForms, ...storedForms];
  
  // Remove duplicates (stored forms take precedence)
  const uniqueForms = allForms.filter((form, index, self) => 
    index === self.findIndex(f => f.id === form.id)
  );
  
  return uniqueForms;
};

// Get all sections (mock + stored)
export const getAllSections = (): AppSection[] => {
  const storedSections = getStoredSections();
  const allSections = [...mockSections, ...storedSections];
  
  // Remove duplicates (stored sections take precedence)
  const uniqueSections = allSections.filter((section, index, self) => 
    index === self.findIndex(s => s.id === section.id)
  );
  
  return uniqueSections;
};

// Enhanced Rights Data
export const mockRights: Right[] = [
  // Dashboard Rights
  {
    id: 'right-dashboard-view',
    name: 'Dashboard View',
    description: 'Access to view dashboard and basic widgets',
    type: 'site',
    category: 'dashboard',
    defaultValue: true,
    isActive: true
  },
  {
    id: 'right-dashboard-edit',
    name: 'Dashboard Customization',
    description: 'Ability to customize dashboard layout and widgets',
    type: 'element',
    category: 'dashboard',
    defaultValue: false,
    isActive: true
  },
  {
    id: 'right-dashboard-reports',
    name: 'Dashboard Reports',
    description: 'Access to dashboard reporting and analytics',
    type: 'site',
    category: 'dashboard',
    defaultValue: false,
    isActive: true
  },

  // Roster Rights
  {
    id: 'right-roster-view',
    name: 'Roster View',
    description: 'View roster schedules and shifts',
    type: 'site',
    category: 'roster',
    defaultValue: true,
    isActive: true
  },
  {
    id: 'right-roster-create',
    name: 'Create Shifts',
    description: 'Create new roster shifts and schedules',
    type: 'element',
    category: 'roster',
    defaultValue: false,
    isActive: true
  },
  {
    id: 'right-roster-edit',
    name: 'Edit Shifts',
    description: 'Modify existing roster shifts and schedules',
    type: 'element',
    category: 'roster',
    defaultValue: false,
    isActive: true
  },
  {
    id: 'right-roster-delete',
    name: 'Delete Shifts',
    description: 'Remove roster shifts and schedules',
    type: 'element',
    category: 'roster',
    defaultValue: false,
    isActive: true
  },
  {
    id: 'right-roster-approve',
    name: 'Approve Shifts',
    description: 'Approve or reject roster changes',
    type: 'element',
    category: 'roster',
    defaultValue: false,
    isActive: true
  },

  // People Rights
  {
    id: 'right-people-view',
    name: 'People View',
    description: 'View people records and basic information',
    type: 'site',
    category: 'people',
    defaultValue: true,
    isActive: true
  },
  {
    id: 'right-people-create',
    name: 'Create People Records',
    description: 'Add new people records to the system',
    type: 'element',
    category: 'people',
    defaultValue: false,
    isActive: true
  },
  {
    id: 'right-people-edit',
    name: 'Edit People Records',
    description: 'Modify existing people records',
    type: 'element',
    category: 'people',
    defaultValue: false,
    isActive: true
  },
  {
    id: 'right-people-delete',
    name: 'Delete People Records',
    description: 'Remove people records from the system',
    type: 'element',
    category: 'people',
    defaultValue: false,
    isActive: true
  },

  // Finance Rights
  {
    id: 'right-finance-view',
    name: 'Finance View',
    description: 'View financial data and reports',
    type: 'site',
    category: 'finance',
    defaultValue: false,
    isActive: true
  },
  {
    id: 'right-finance-manage',
    name: 'Finance Management',
    description: 'Manage financial transactions and settings',
    type: 'element',
    category: 'finance',
    defaultValue: false,
    isActive: true
  },
  {
    id: 'right-finance-export',
    name: 'Finance Export',
    description: 'Export financial data to external systems',
    type: 'element',
    category: 'finance',
    defaultValue: false,
    isActive: true
  },

  // System Rights
  {
    id: 'right-system-settings',
    name: 'System Settings',
    description: 'Access to system configuration and settings',
    type: 'site',
    category: 'system',
    defaultValue: false,
    isActive: true
  },
  {
    id: 'right-system-users',
    name: 'User Management',
    description: 'Manage users, groups, and permissions',
    type: 'site',
    category: 'system',
    defaultValue: false,
    isActive: true
  },
  {
    id: 'right-system-forms',
    name: 'Form Management',
    description: 'Create and manage custom forms',
    type: 'site',
    category: 'system',
    defaultValue: false,
    isActive: true
  },
  {
    id: 'right-system-sections',
    name: 'Section Management',
    description: 'Create and manage application sections',
    type: 'site',
    category: 'system',
    defaultValue: false,
    isActive: true
  },

  // Form Rights
  {
    id: 'right-forms-view',
    name: 'View Forms',
    description: 'View and use custom forms',
    type: 'site',
    category: 'forms',
    defaultValue: true,
    isActive: true
  },
  {
    id: 'right-forms-create',
    name: 'Create Forms',
    description: 'Create new custom forms',
    type: 'element',
    category: 'forms',
    defaultValue: false,
    isActive: true
  },
  {
    id: 'right-forms-edit',
    name: 'Edit Forms',
    description: 'Modify existing custom forms',
    type: 'element',
    category: 'forms',
    defaultValue: false,
    isActive: true
  },
  {
    id: 'right-forms-delete',
    name: 'Delete Forms',
    description: 'Remove custom forms from the system',
    type: 'element',
    category: 'forms',
    defaultValue: false,
    isActive: true
  },

  // Report Rights
  {
    id: 'right-reports-view',
    name: 'View Reports',
    description: 'Access to view system reports',
    type: 'site',
    category: 'reports',
    defaultValue: false,
    isActive: true
  },
  {
    id: 'right-reports-create',
    name: 'Create Reports',
    description: 'Create custom reports and analytics',
    type: 'element',
    category: 'reports',
    defaultValue: false,
    isActive: true
  },
  {
    id: 'right-reports-export',
    name: 'Export Reports',
    description: 'Export reports to various formats',
    type: 'element',
    category: 'reports',
    defaultValue: false,
    isActive: true
  }
];

// Permission Presets for Quick Assignment
export const permissionPresets: PermissionPreset[] = [
  {
    name: 'View Only',
    description: 'Can view data but cannot modify anything',
    permissions: {
      'right-dashboard-view': true,
      'right-roster-view': true,
      'right-people-view': true,
      'right-forms-view': true
    }
  },
  {
    name: 'Standard User',
    description: 'Basic user with limited create/edit permissions',
    permissions: {
      'right-dashboard-view': true,
      'right-roster-view': true,
      'right-roster-create': true,
      'right-people-view': true,
      'right-people-create': true,
      'right-forms-view': true
    }
  },
  {
    name: 'Manager',
    description: 'Manager with broader permissions including editing',
    permissions: {
      'right-dashboard-view': true,
      'right-dashboard-edit': true,
      'right-roster-view': true,
      'right-roster-create': true,
      'right-roster-edit': true,
      'right-roster-approve': true,
      'right-people-view': true,
      'right-people-create': true,
      'right-people-edit': true,
      'right-forms-view': true,
      'right-reports-view': true
    }
  },
  {
    name: 'Administrator',
    description: 'Full administrative access to all features',
    permissions: {
      'right-dashboard-view': true,
      'right-dashboard-edit': true,
      'right-dashboard-reports': true,
      'right-roster-view': true,
      'right-roster-create': true,
      'right-roster-edit': true,
      'right-roster-delete': true,
      'right-roster-approve': true,
      'right-people-view': true,
      'right-people-create': true,
      'right-people-edit': true,
      'right-people-delete': true,
      'right-finance-view': true,
      'right-finance-manage': true,
      'right-finance-export': true,
      'right-forms-view': true,
      'right-forms-create': true,
      'right-forms-edit': true,
      'right-forms-delete': true,
      'right-reports-view': true,
      'right-reports-create': true,
      'right-reports-export': true,
      'right-system-settings': true,
      'right-system-users': true,
      'right-system-forms': true,
      'right-system-sections': true
    }
  }
];
