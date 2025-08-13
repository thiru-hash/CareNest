// Core types for the role-based dashboard system

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
}

export type UserRole = 
  | 'Support Worker'
  | 'Support Manager' 
  | 'Finance Manager'
  | 'IT Admin'
  | 'System Admin'
  | 'HR Manager'
  | 'Clinical Manager'
  | 'Service Delivery GM'
  | 'CEO';

export interface Shift {
  id: string;
  title: string;
  clientName: string;
  clientId: string;
  location: string;
  propertyId: string;
  startTime: Date;
  endTime: Date;
  totalHours: number;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  isClockedIn: boolean;
  clockInTime?: Date;
  clockOutTime?: Date;
  earlyClockOffReason?: string;
  staffId: string;
  staffName: string;
  canClockIn: boolean;
  canClockOut: boolean;
}

export interface ComplianceItem {
  id: string;
  name: string;
  type: 'certification' | 'police_check' | 'training' | 'medical' | 'other';
  expiryDate: Date;
  status: 'valid' | 'expiring' | 'expired';
  daysUntilExpiry: number;
  staffId: string;
  staffName: string;
  documentUrl?: string;
  notes?: string;
}

export interface HoursSummary {
  week: {
    completed: number;
    rostered: number;
    remaining: number;
  };
  fortnight: {
    completed: number;
    rostered: number;
    remaining: number;
  };
  payPeriod: {
    completed: number;
    rostered: number;
    remaining: number;
  };
}

// Support Worker Dashboard
export interface SupportWorkerDashboard {
  currentShift?: Shift;
  nextShifts: Shift[];
  complianceItems: ComplianceItem[];
  hoursSummary: HoursSummary;
  recentActivities: Activity[];
}

// Support Manager Dashboard
export interface SupportManagerDashboard {
  propertiesCount: number;
  totalStaff: number;
  totalRosteredHours: number;
  unassignedHours: number;
  complianceSummary: {
    total: number;
    valid: number;
    expiring: number;
    expired: number;
  };
  tasks: Task[];
  staffUnderSupervision: StaffSummary[];
}

export interface StaffSummary {
  id: string;
  name: string;
  role: string;
  isActive: boolean;
  currentShift?: Shift;
  complianceStatus: 'compliant' | 'non_compliant' | 'expiring';
  totalHoursThisWeek: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'appointment' | 'follow_up' | 'care_plan' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  dueDate: Date;
  assignedTo: string;
  clientId?: string;
  clientName?: string;
}

// Finance Dashboard
export interface FinanceDashboard {
  payrollSummary: PayrollSummary;
  rosterCosts: RosterCosts;
  overtimeReports: OvertimeReport[];
  pendingPayments: Payment[];
  pendingInvoices: Invoice[];
}

export interface PayrollSummary {
  totalPayroll: number;
  processedPayroll: number;
  pendingPayroll: number;
  payPeriod: string;
  staffCount: number;
}

export interface RosterCosts {
  totalCost: number;
  hourlyRate: number;
  totalHours: number;
  overtimeCost: number;
  period: string;
}

export interface OvertimeReport {
  id: string;
  staffId: string;
  staffName: string;
  date: Date;
  regularHours: number;
  overtimeHours: number;
  overtimeRate: number;
  totalCost: number;
}

export interface Payment {
  id: string;
  amount: number;
  type: 'invoice' | 'salary' | 'expense';
  status: 'pending' | 'processing' | 'completed';
  dueDate: Date;
  description: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: Date;
  issueDate: Date;
}

// IT Dashboard
export interface ITDashboard {
  systemHealth: SystemHealth;
  userAccounts: UserAccount[];
  deviceInventory: Device[];
  supportTickets: SupportTicket[];
}

export interface SystemHealth {
  database: 'online' | 'offline' | 'warning';
  api: 'online' | 'offline' | 'warning';
  backup: 'online' | 'offline' | 'warning';
  lastBackup: Date;
  uptime: number;
  activeUsers: number;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  lastLogin: Date;
  isActive: boolean;
  failedLogins: number;
  needsPasswordReset: boolean;
}

export interface Device {
  id: string;
  name: string;
  type: 'laptop' | 'desktop' | 'tablet' | 'mobile' | 'other';
  status: 'active' | 'inactive' | 'maintenance' | 'retired';
  assignedTo?: string;
  lastSeen: Date;
  os: string;
  version: string;
}

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// HR Dashboard
export interface HRDashboard {
  employeeCount: number;
  activeEmployees: number;
  pendingRequests: number;
  complianceAlerts: number;
  recentHires: Employee[];
  upcomingReviews: PerformanceReview[];
  leaveRequests: LeaveRequest[];
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  hireDate: Date;
  status: 'active' | 'inactive' | 'terminated';
  department: string;
  manager?: string;
  complianceStatus: 'compliant' | 'non_compliant' | 'expiring';
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  reviewDate: Date;
  status: 'pending' | 'in_progress' | 'completed';
  reviewer: string;
  rating?: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'annual' | 'sick' | 'personal' | 'other';
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  requestedAt: Date;
}

// Clinical Dashboard
export interface ClinicalDashboard {
  clientCount: number;
  activeCarePlans: number;
  incidentsThisWeek: number;
  upcomingAppointments: Appointment[];
  carePlans: CarePlan[];
  incidents: Incident[];
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  type: string;
  date: Date;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface CarePlan {
  id: string;
  clientId: string;
  clientName: string;
  status: 'active' | 'review' | 'completed';
  lastUpdated: Date;
  nextReview: Date;
  careManager: string;
}

export interface Incident {
  id: string;
  type: 'health' | 'safety' | 'behavioral' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'investigating' | 'resolved';
  clientId?: string;
  clientName?: string;
  staffId?: string;
  staffName?: string;
  date: Date;
  description: string;
}

// Service Delivery GM & CEO Dashboard
export interface ExecutiveDashboard {
  totalProperties: number;
  totalStaff: number;
  totalClients: number;
  totalRevenue: number;
  kpiMetrics: KPIMetrics;
  serviceQuality: ServiceQualityMetrics;
  complianceOverview: ComplianceOverview;
}

export interface KPIMetrics {
  staffUtilization: number;
  clientSatisfaction: number;
  complianceRate: number;
  revenueGrowth: number;
  costPerHour: number;
}

export interface ServiceQualityMetrics {
  averageRating: number;
  complaintsThisMonth: number;
  resolvedComplaints: number;
  responseTime: number;
}

export interface ComplianceOverview {
  totalComplianceItems: number;
  compliantItems: number;
  expiringItems: number;
  expiredItems: number;
  complianceRate: number;
}

// Activity and Navigation
export interface Activity {
  id: string;
  type: 'shift' | 'compliance' | 'finance' | 'hr' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  userId: string;
  userName: string;
  severity: 'info' | 'warning' | 'error' | 'success';
}

export interface NavigationItem {
  id: string;
  title: string;
  href: string;
  icon: string;
  role: UserRole[];
  children?: NavigationItem[];
  badge?: number;
  isExpanded?: boolean;
}

export interface DashboardConfig {
  role: UserRole;
  title: string;
  description: string;
  navigation: NavigationItem[];
  widgets: WidgetConfig[];
}

export interface WidgetConfig {
  id: string;
  type: 'stats' | 'chart' | 'table' | 'list' | 'form';
  title: string;
  size: 'small' | 'medium' | 'large' | 'full';
  position: { x: number; y: number };
  config: any;
} 