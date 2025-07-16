
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
  UserCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useEffect, useState } from 'react';

const defaultNavItems = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'People We Support', href: '/people', icon: Users },
  { title: 'Staff', href: '/staff', icon: UserCheck },
  { title: 'Roster Schedule', href: '/roster', icon: Calendar },
  { title: 'Timesheets', href: '/timesheets', icon: Clock },
  { title: 'Finance', href: '/finance', icon: DollarSign },
  { title: 'Compliance', href: '/compliance', icon: Shield },
  { title: 'Locations', href: '/locations', icon: MapPin },
  { title: 'Settings', href: '/settings', icon: Settings },
];

const getSidebarNavItems = () => {
  try {
    if (typeof window !== 'undefined') {
      const { getNavigationItems } = require('@/lib/terminology');
      const navItems = getNavigationItems();
      return [
        { title: navItems.find(item => item.id === 'dashboard')?.name || 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { title: navItems.find(item => item.id === 'people')?.name || 'People We Support', href: '/people', icon: Users },
        { title: navItems.find(item => item.id === 'staff')?.name || 'Staff', href: '/staff', icon: UserCheck },
        { title: navItems.find(item => item.id === 'roster')?.name || 'Roster Schedule', href: '/roster', icon: Calendar },
        { title: 'Timesheets', href: '/timesheets', icon: Clock },
        { title: navItems.find(item => item.id === 'finance')?.name || 'Finance', href: '/finance', icon: DollarSign },
        { title: 'Compliance', href: '/compliance', icon: Shield },
        { title: navItems.find(item => item.id === 'locations')?.name || 'Locations', href: '/locations', icon: MapPin },
        { title: navItems.find(item => item.id === 'settings')?.name || 'Settings', href: '/settings', icon: Settings },
      ];
    }
  } catch (error) {
    console.error('Error loading navigation items:', error);
  }
  return defaultNavItems;
};

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items?: ReturnType<typeof getSidebarNavItems>;
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
  onSwitchUser?: () => void;
}

export function SidebarNav({ className, items, collapsed, setCollapsed, onSwitchUser, ...props }: SidebarNavProps) {
  const pathname = usePathname();
  const [sidebarNavItems, setSidebarNavItems] = useState(defaultNavItems);

  useEffect(() => {
    if (items) {
      setSidebarNavItems(items);
    } else {
      setSidebarNavItems(getSidebarNavItems());
    }
  }, [items]);

  return (
    <aside
      className={cn(
        'h-screen flex flex-col transition-all duration-300 bg-gray-900 dark:bg-gray-950',
        'relative lg:relative', // relative on desktop
        collapsed ? 'w-16' : 'w-56',
        className
      )}
      {...props}
    >
      {/* Top: Brand & Toggle */}
      <div className={cn('flex items-center justify-between px-4 py-4', collapsed ? 'justify-center' : '')}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CN</span>
            </div>
            <span className="text-lg font-bold text-white">CareNest</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn('ml-auto text-white hover:bg-gray-800', collapsed ? 'mx-auto' : '')}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <ScrollArea className="h-full w-full">
          <ul className="space-y-1 px-2">
            {sidebarNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-green-700 text-white shadow'
                        : 'text-gray-300 hover:bg-green-800 hover:text-white',
                      collapsed ? 'justify-center px-2' : ''
                    )}
                    title={collapsed ? item.title : undefined}
                  >
                    <Icon className="h-5 w-5" />
                    {!collapsed && <span className="truncate">{item.title}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      </nav>
      
      {/* Bottom: Switch User for Admins */}
      {!collapsed && (
        <div className={cn('px-2 py-4 flex flex-col gap-2')}>
          <Button
            variant="outline"
            size="sm"
            className={cn('w-full text-white border-gray-600 hover:bg-gray-800', 'justify-start')}
            onClick={onSwitchUser}
          >
            <Users className="h-5 w-5 mr-0.5" />
            <span>Switch User</span>
          </Button>
        </div>
      )}
    </aside>
  );
}
