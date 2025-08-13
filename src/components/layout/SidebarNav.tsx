
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
  ChevronRight,
  Zap,
  ShieldAlert,
  Landmark
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAllSections } from '@/lib/data';

// Icon mapping for dynamic sections
const iconMap: { [key: string]: any } = {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  Clock,
  DollarSign,
  Landmark,
  MapPin,
  Building2,
  Settings,
  Shield,
  ShieldAlert,
  Zap,
  FileText
};

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
    // Get dynamic sections from settings
    const sections = getAllSections();
    
    // Filter only active sections and convert to nav items
    const navItems = sections
      .filter(section => section.status === 'Active')
      .sort((a, b) => a.order - b.order)
      .map(section => {
        const Icon = iconMap[section.iconName] || LayoutDashboard;
        return {
          title: section.name,
          href: section.path,
          icon: Icon
        };
      });

    return navItems.length > 0 ? navItems : defaultNavItems;
  } catch (error) {
    console.error('Error loading navigation items:', error);
    return defaultNavItems;
  }
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

  // Function to refresh navigation items
  const refreshNavItems = () => {
    if (items) {
      setSidebarNavItems(items);
    } else {
      setSidebarNavItems(getSidebarNavItems());
    }
  };

  useEffect(() => {
    refreshNavItems();
  }, [items]);

  // Listen for localStorage changes to update navigation
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'carenest_sections' || e.key === 'carenest-forms') {
        refreshNavItems();
      }
    };

    // Listen for storage events from other tabs/windows
    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom events (for same-tab updates)
    const handleCustomStorageChange = () => {
      refreshNavItems();
    };
    window.addEventListener('carenest-sections-updated', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('carenest-sections-updated', handleCustomStorageChange);
    };
  }, [items]);

  return (
    <aside
      className={cn(
        'h-screen flex flex-col transition-all duration-300 ease-in-out',
        'bg-gray-900 dark:bg-gray-950 border-r border-gray-800 dark:border-gray-700',
        'relative lg:relative', // relative on desktop
        // Responsive width handling for different screen sizes
        collapsed 
          ? 'w-14 sm:w-16 lg:w-16 xl:w-16' 
          : 'w-56 sm:w-64 lg:w-64 xl:w-72 2xl:w-80',
        className
      )}
      {...props}
    >
      {/* Top: Brand & Toggle - Responsive design */}
      <div className={cn(
        'flex items-center justify-between px-2 sm:px-3 lg:px-4 py-3 sm:py-4',
        'border-b border-gray-800 dark:border-gray-700',
        collapsed ? 'justify-center px-1 sm:px-2' : ''
      )}>
        {!collapsed && (
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs sm:text-sm">CN</span>
            </div>
            <span className="text-sm sm:text-base lg:text-lg font-bold text-white truncate">
              CareNest
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'text-white hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors',
            'h-8 w-8 sm:h-9 sm:w-9',
            collapsed ? 'mx-auto' : 'ml-auto'
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          ) : (
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </Button>
      </div>
      
      {/* Navigation - Responsive scroll area */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden">
        <ScrollArea className="h-full w-full">
          <ul className="space-y-1 px-1 sm:px-2 lg:px-3 py-2">
            {sidebarNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 sm:py-2.5',
                      'text-sm sm:text-sm font-medium transition-all duration-200',
                      'hover:bg-gray-800 dark:hover:bg-gray-700',
                      isActive
                        ? 'bg-green-700 dark:bg-green-600 text-white shadow-md'
                        : 'text-gray-300 hover:text-white',
                      collapsed 
                        ? 'justify-center px-1 sm:px-2' 
                        : 'justify-start'
                    )}
                    title={collapsed ? item.title : undefined}
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    {!collapsed && (
                      <span className="truncate text-sm sm:text-sm">
                        {item.title}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      </nav>
      
      {/* Bottom: Switch User for Admins - Responsive design */}
      {!collapsed && (
        <div className={cn(
          'px-2 sm:px-3 lg:px-4 py-3 sm:py-4',
          'border-t border-gray-800 dark:border-gray-700'
        )}>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'flex items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2',
              'text-sm font-medium transition-colors w-full',
              'text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-700 hover:text-white',
              'justify-start'
            )}
            onClick={onSwitchUser}
          >
            <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span className="truncate text-sm sm:text-sm">
              Switch User
            </span>
          </Button>
        </div>
      )}
    </aside>
  );
}
