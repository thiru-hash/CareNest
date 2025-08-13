import { 
  Users, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

// Stat cards data
export const statCardsData = [
  {
    title: 'Total Staff',
    value: '1,234',
    icon: Users,
    change: '+12%',
    changeType: 'positive' as const,
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    title: 'Revenue',
    value: '$45,678',
    icon: DollarSign,
    change: '+8.2%',
    changeType: 'positive' as const,
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    iconColor: 'text-green-600 dark:text-green-400'
  },
  {
    title: 'Active Shifts',
    value: '89',
    icon: Calendar,
    change: '-3%',
    changeType: 'negative' as const,
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    iconColor: 'text-purple-600 dark:text-purple-400'
  },
  {
    title: 'Compliance Rate',
    value: '94.2%',
    icon: TrendingUp,
    change: '+2.1%',
    changeType: 'positive' as const,
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    iconColor: 'text-orange-600 dark:text-orange-400'
  }
];

// Recent activity data
export const recentActivityData = [
  {
    id: 1,
    staff: 'Sarah Johnson',
    action: 'Clock In',
    time: '09:00 AM',
    status: 'completed',
    location: 'Main Building'
  },
  {
    id: 2,
    staff: 'Mike Chen',
    action: 'Shift Completed',
    time: '08:45 AM',
    status: 'completed',
    location: 'East Wing'
  },
  {
    id: 3,
    staff: 'Emily Davis',
    action: 'Late Arrival',
    time: '08:30 AM',
    status: 'warning',
    location: 'West Wing'
  },
  {
    id: 4,
    staff: 'David Wilson',
    action: 'Overtime Request',
    time: '08:15 AM',
    status: 'pending',
    location: 'Main Building'
  },
  {
    id: 5,
    staff: 'Lisa Brown',
    action: 'Break Started',
    time: '08:00 AM',
    status: 'completed',
    location: 'East Wing'
  }
];

// Upcoming shifts data
export const upcomingShiftsData = [
  {
    id: 1,
    staff: 'Sarah Johnson',
    role: 'Registered Nurse',
    startTime: '10:00 AM',
    endTime: '06:00 PM',
    location: 'Main Building - Floor 3',
    status: 'confirmed'
  },
  {
    id: 2,
    staff: 'Mike Chen',
    role: 'Care Assistant',
    startTime: '02:00 PM',
    endTime: '10:00 PM',
    location: 'East Wing - Floor 2',
    status: 'pending'
  },
  {
    id: 3,
    staff: 'Emily Davis',
    role: 'Registered Nurse',
    startTime: '06:00 PM',
    endTime: '02:00 AM',
    location: 'West Wing - Floor 1',
    status: 'confirmed'
  },
  {
    id: 4,
    staff: 'David Wilson',
    role: 'Care Assistant',
    startTime: '10:00 PM',
    endTime: '06:00 AM',
    location: 'Main Building - Floor 4',
    status: 'open'
  }
];

// Chart data for revenue
export const revenueData = [
  { month: 'Jan', revenue: 42000 },
  { month: 'Feb', revenue: 38000 },
  { month: 'Mar', revenue: 45000 },
  { month: 'Apr', revenue: 52000 },
  { month: 'May', revenue: 48000 },
  { month: 'Jun', revenue: 55000 },
  { month: 'Jul', revenue: 58000 },
  { month: 'Aug', revenue: 62000 },
  { month: 'Sep', revenue: 59000 },
  { month: 'Oct', revenue: 65000 },
  { month: 'Nov', revenue: 68000 },
  { month: 'Dec', revenue: 72000 }
];

// Chart data for staff distribution
export const staffDistributionData = [
  { role: 'Registered Nurses', count: 45, color: '#3B82F6' },
  { role: 'Care Assistants', count: 32, color: '#10B981' },
  { role: 'Support Staff', count: 18, color: '#F59E0B' },
  { role: 'Administrative', count: 12, color: '#EF4444' },
  { role: 'Specialists', count: 8, color: '#8B5CF6' }
];

// Compliance data
export const complianceData = [
  { category: 'Training Certificates', completed: 89, total: 95, status: 'good' },
  { category: 'Background Checks', completed: 92, total: 95, status: 'good' },
  { category: 'Health Assessments', completed: 87, total: 95, status: 'warning' },
  { category: 'License Renewals', completed: 94, total: 95, status: 'good' },
  { category: 'Insurance Updates', completed: 91, total: 95, status: 'good' }
];

// Table columns configuration
export const activityColumns = [
  { key: 'staff', label: 'Staff Member', sortable: true },
  { key: 'action', label: 'Action', sortable: true },
  { key: 'time', label: 'Time', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'location', label: 'Location', sortable: true }
];

export const shiftsColumns = [
  { key: 'staff', label: 'Staff Member', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'startTime', label: 'Start Time', sortable: true },
  { key: 'endTime', label: 'End Time', sortable: true },
  { key: 'location', label: 'Location', sortable: true },
  { key: 'status', label: 'Status', sortable: true }
]; 