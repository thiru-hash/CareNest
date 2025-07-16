
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Settings,
  FileText,
  Building2,
  Clock,
  Shield,
  UserCheck
} from 'lucide-react';
import { getNavigationItems } from '@/lib/terminology';

// Get navigation items with terminology
const getSidebarNavItems = () => {
  const navItems = getNavigationItems();
  
  return [
    {
      title: navItems.find(item => item.id === 'dashboard')?.name || 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: navItems.find(item => item.id === 'people')?.name || 'People We Support',
      href: '/people',
      icon: Users,
    },
    {
      title: navItems.find(item => item.id === 'staff')?.name || 'Staff',
      href: '/staff',
      icon: UserCheck,
    },
    {
      title: navItems.find(item => item.id === 'roster')?.name || 'Roster Schedule',
      href: '/roster',
      icon: Calendar,
    },
    {
      title: 'Timesheets',
      href: '/timesheets',
      icon: Clock,
    },
    {
      title: navItems.find(item => item.id === 'finance')?.name || 'Finance',
      href: '/finance',
      icon: DollarSign,
    },
    {
      title: 'Compliance',
      href: '/compliance',
      icon: Shield,
    },
    {
      title: navItems.find(item => item.id === 'locations')?.name || 'Locations',
      href: '/locations',
      icon: MapPin,
    },
    {
      title: navItems.find(item => item.id === 'settings')?.name || 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];
};

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items?: ReturnType<typeof getSidebarNavItems>;
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();
  const sidebarNavItems = items || getSidebarNavItems();

  return (
    <nav className={cn('flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1', className)} {...props}>
      <ScrollArea className="h-[300px] w-full lg:h-[400px]">
        {sidebarNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                pathname === item.href ? 'bg-accent text-accent-foreground' : 'transparent'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </ScrollArea>
    </nav>
  );
}
