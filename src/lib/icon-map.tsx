
import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCheck,
  MapPin,
  Settings,
  FileText,
  DollarSign,
  Building2,
  Bell,
  MoreHorizontal,
  Clock,
  Shield,
  Zap,
  Landmark,
  type LucideIcon
} from 'lucide-react';

// Icon mapping for routes
export function getIconForRoute(route: string): LucideIcon | null {
  const iconMap: { [key: string]: LucideIcon } = {
    '/dashboard': LayoutDashboard,
    '/roster': Calendar,
    '/people': Users,
    '/staff': UserCheck,
    '/locations': MapPin,
    '/settings': Settings,
    '/finance': DollarSign,
    '/organisational': Building2,
    '/notices': Bell,
    '/forms': FileText,
  };

  return iconMap[route] || null;
}

// Icon map for section names
export const iconMap: { [key: string]: LucideIcon } = {
  'LayoutDashboard': LayoutDashboard,
  'Calendar': Calendar,
  'Users': Users,
  'UsersRound': UserCheck,
  'MapPin': MapPin,
  'Settings': Settings,
  'FileText': FileText,
  'DollarSign': DollarSign,
  'Building2': Building2,
  'Bell': Bell,
  'MoreHorizontal': MoreHorizontal,
  'Clock': Clock,
  'Shield': Shield,
  'Zap': Zap,
  'Landmark': Landmark,
};

// Function to get icon component by name
export function getIconComponent(iconName: string, props?: any): React.ReactElement | null {
  const IconComponent = iconMap[iconName];
  if (!IconComponent) {
    console.warn(`Icon not found: ${iconName}`);
    return null;
  }
  return <IconComponent {...props} />;
}
