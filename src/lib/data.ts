

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
];


export const mockGroups: Group[] = [
    { id: 'group-all', name: 'ALL', description: 'Access Core System Functionality (must be assigned to all users)', userIds: mockStaff.map(s => s.id) },
    { id: 'group-system-admin', name: 'System Administrators', description: 'Full system access', userIds: ['staff-admin'] },
    { id: 'group-support-manager', name: 'Support Managers', description: 'Manage staff and clients', userIds: ['staff-3'] },
    { id: 'group-support-worker', name: 'Support Workers', description: 'View shifts and client info', userIds: ['staff-1', 'staff-2'] },
    { id: 'group-roster-admin', name: 'Roster Admin', description: 'Full access to rostering', userIds: ['staff-roster-admin'] },
    { id: 'group-roster-scheduler', name: 'Roster Scheduler', description: 'Can create and edit shifts', userIds: [] },
    { id: 'group-finance-admin', name: 'Finance Admin', description: 'Access to financial data and reports', userIds: ['staff-finance'] },
    { id: 'group-gm-service', name: 'GM Service', description: 'General Manager of Services', userIds: [] },
    { id: 'group-ceo', name: 'CEO', description: 'Chief Executive Officer', userIds: ['staff-ceo'] },
    { id: 'group-reception', name: 'Reception', description: 'Front desk and administrative tasks', userIds: [] },
    { id: 'group-health-safety', name: 'Health and Safety', description: 'Manages H&S incidents and compliance', userIds: [] },
    { id: 'group-risk-management', name: 'Risk Management', description: 'Manages organizational risk', userIds: [] },
    { id: 'group-office-admin', name: 'Office Admin Manager', description: 'Manages office operations', userIds: [] },
    { id: 'group-clinical-advisor', name: 'Clinical Advisor', description: 'Provides clinical guidance', userIds: [] },
    { id: 'group-hr-manager', name: 'Human Resources Manager', description: 'Manages all HR functions', userIds: ['staff-hr'] },
    { id: 'group-hr-admin', 'name': 'HR Admin', 'description': 'Assists with HR administrative tasks', userIds: [] },
    { id: 'group-hr', name: 'HR', description: 'General HR staff', userIds: [] },
    { id: 'group-behavioural-support', name: 'Behavioural Support', description: 'Provides specialist behavioural support', userIds: [] },
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
    { 
      id: 'form-4', name: 'Progress Note Form', linkedSectionId: 'sec-people', status: 'Active',
      fields: [
        { id: 'field-4-1', name: 'Date', type: 'date', order: 10, required: true },
        { id: 'field-4-2', name: 'Note', type: 'richtext', order: 20, required: true },
      ]
    },
    { 
      id: 'form-5', name: 'Medication Chart Form', linkedSectionId: 'sec-people', status: 'Active',
      fields: [
          { id: 'field-5-1', name: 'Medication Name', type: 'text', order: 10, required: true },
          { id: 'field-5-2', name: 'Dosage', type: 'text', order: 20, required: true },
          { id: 'field-5-3', name: 'Time Administered', type: 'time', order: 30, required: true },
          { id: 'field-5-4', name: 'Administered By', type: 'text', order: 40, required: true },
      ]
    },
    // New Forms for PWS Tabs
    {
      id: 'form-pws-info', name: 'PWS Basic Information', linkedSectionId: 'sec-people', status: 'Active',
      fields: [
        { id: 'field-pi-1', name: 'Profile Picture', type: 'file-upload', order: 10 },
        { id: 'field-pi-2', name: 'PWS Basic Information', type: 'headline', order: 20 },
        { id: 'field-pi-3', name: 'First Name', type: 'text', order: 30, required: true },
        { id: 'field-pi-4', name: 'Last Name', type: 'text', order: 40, required: true, tooltip: "Please type last name in UPPER CASE" },
        { id: 'field-pi-5', name: 'Middle Name', type: 'text', order: 50 },
        { id: 'field-pi-6', name: 'Preferred Name', type: 'text', order: 60 },
        { id: 'field-pi-7', name: 'Gender', type: 'dropdown', order: 70 },
        { id: 'field-pi-8', name: 'Date of Birth', type: 'dob', order: 80, required: true },
        { id: 'field-pi-9', name: 'Address', type: 'headline', order: 90, },
        { id: 'field-pi-10', name: 'Home Address', type: 'textbox', order: 100 },
        { id: 'field-pi-11', name: 'Phone', type: 'text', order: 110 },
      ]
    },
    {
      id: 'form-pws-contacts', name: 'Contacts & Schedule', linkedSectionId: 'sec-people', status: 'Active',
      fields: [
        { id: 'field-cs-1', name: 'Next of Kin Name', type: 'text', order: 10 },
        { id: 'field-cs-2', name: 'Next of Kin Contact', type: 'text', order: 20 },
        { id: 'field-cs-3', name: 'Activity Schedule', type: 'richtext', order: 30 },
      ]
    },
    {
      id: 'form-pws-comm', name: 'Communication Form', linkedSectionId: 'sec-people', status: 'Active',
      fields: [
        { id: 'field-co-1', name: 'Communication Needs', type: 'richtext', order: 10 },
        { id: 'field-co-2', name: 'Preferred Method', type: 'dropdown', order: 20 },
      ]
    },
    {
      id: 'form-pws-goals', name: 'Goals Form', linkedSectionId: 'sec-people', status: 'Active',
      fields: [
        { id: 'field-g-1', name: 'Personal Goal', type: 'text', order: 10 },
        { id: 'field-g-2', name: 'Steps to Achieve', type: 'richtext', order: 20 },
      ]
    },
    {
      id: 'form-pws-ot', name: 'Oranga Tamariki Form', linkedSectionId: 'sec-people', status: 'Active',
      fields: [
        { id: 'field-ot-1', name: 'Event Type', type: 'text', order: 10 },
        { id: 'field-ot-2', name: 'Event Date', type: 'date', order: 20 },
      ]
    },
    {
      id: 'form-pws-diary', name: 'Daily Diary Form', linkedSectionId: 'sec-people', status: 'Active',
      fields: [
        { id: 'field-dd-1', name: 'Date', type: 'date', order: 10, required: true },
        { id: 'field-dd-2', name: 'Shift Notes', type: 'richtext', order: 20, required: true },
        { id: 'field-dd-3', name: 'Mood', type: 'dropdown', order: 30 },
      ]
    },
    {
      id: 'form-pws-docs', name: 'Documents Form', linkedSectionId: 'sec-people', status: 'Active',
      fields: [
        { id: 'field-doc-1', name: 'Document Upload', type: 'file-upload', order: 10 },
        { id: 'field-doc-2', name: 'Document Type', type: 'dropdown', order: 20 },
      ]
    },
    {
      id: 'form-pws-health', name: 'Health Form', linkedSectionId: 'sec-people', status: 'Active',
      fields: [
        { id: 'field-h-1', name: 'Allergies', type: 'richtext', order: 10 },
        { id: 'field-h-2', name: 'Medications', type: 'richtext', order: 20 },
        { id: 'field-h-3', name: 'Health Provider Name', type: 'text', order: 30 },
      ]
    },
    {
      id: 'form-pws-financials', name: 'Financials Form', linkedSectionId: 'sec-people', status: 'Active',
      fields: [
        { id: 'field-f-1', name: 'Bank Account Details', type: 'text', order: 10 },
        { id: 'field-f-2', name: 'Budget Plan', type: 'file-upload', order: 20 },
      ]
    },
    {
      id: 'form-pws-report', name: 'Key Worker Report Form', linkedSectionId: 'sec-people', status: 'Active',
      fields: [
        { id: 'field-r-1', name: 'Report Date', type: 'date', order: 10 },
        { id: 'field-r-2', name: 'Summary', type: 'richtext', order: 20 },
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
