
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
  Building2
} from 'lucide-react';

const sidebarNavItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Staff',
    href: '/staff',
    icon: Users,
  },
  {
    title: 'Roster',
    href: '/roster',
    icon: Calendar,
  },
  {
    title: 'Finance',
    href: '/finance',
    icon: DollarSign,
  },
  {
    title: 'Locations',
    href: '/locations',
    icon: MapPin,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items?: typeof sidebarNavItems;
}

export function SidebarNav({ className, items = sidebarNavItems, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn('flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1', className)} {...props}>
      <ScrollArea className="h-[300px] w-full lg:h-[400px]">
        {items.map((item) => {
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
