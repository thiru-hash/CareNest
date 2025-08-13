'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ChevronDown, 
  ChevronRight,
  LayoutDashboard,
  Calendar,
  Clock,
  Shield,
  User,
  Users,
  CheckSquare,
  BarChart3,
  DollarSign,
  FileText,
  Receipt,
  Settings,
  Activity,
  Monitor,
  MessageSquare,
  Database,
  Code,
  HardDrive,
  GraduationCap,
  UserPlus,
  Star,
  Building,
  AlertTriangle
} from 'lucide-react';
import { NavigationItem, UserRole } from '@/lib/types/dashboard';
import { getNavigationForRole } from '@/lib/config/navigation';

interface RoleBasedSidebarProps {
  userRole: UserRole;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const iconMap: Record<string, any> = {
  LayoutDashboard,
  Calendar,
  Clock,
  Shield,
  User,
  Users,
  CheckSquare,
  BarChart3,
  DollarSign,
  FileText,
  Receipt,
  Settings,
  Activity,
  Monitor,
  MessageSquare,
  Database,
  Code,
  HardDrive,
  GraduationCap,
  UserPlus,
  Star,
  Building,
  AlertTriangle,
};

interface NavigationItemProps {
  item: NavigationItem;
  isActive: boolean;
  isCollapsed: boolean;
  level?: number;
}

const NavigationItemComponent = ({ item, isActive, isCollapsed, level = 0 }: NavigationItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const Icon = iconMap[item.icon] || User;

  const handleToggle = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div>
      <Link href={item.href} onClick={handleToggle}>
        <div
          className={cn(
            'flex items-center justify-between px-4 py-3 rounded-lg transition-colors group',
            'hover:bg-gray-100 hover:text-gray-900',
            isActive && 'bg-blue-50 text-blue-700 border-r-2 border-blue-700',
            level > 0 && 'ml-4',
            isCollapsed && 'justify-center px-3'
          )}
        >
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <Icon className={cn(
              'h-5 w-5 flex-shrink-0',
              isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700',
              isCollapsed && 'mx-auto'
            )} />
            {!isCollapsed && (
              <span className="truncate font-medium text-sm">
                {item.title}
              </span>
            )}
          </div>
          
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              {item.badge && item.badge > 0 && (
                <Badge variant="secondary" className="h-5 px-1.5 text-xs bg-red-100 text-red-700">
                  {item.badge}
                </Badge>
              )}
              {hasChildren && (
                <ChevronDown 
                  className={cn(
                    'h-4 w-4 transition-transform',
                    isExpanded && 'rotate-180'
                  )} 
                />
              )}
            </div>
          )}
        </div>
      </Link>

      {hasChildren && isExpanded && !isCollapsed && (
        <div className="mt-1 space-y-1">
          {item.children!.map((child) => (
            <NavigationItemComponent
              key={child.id}
              item={child}
              isActive={false} // You can implement active state logic here
              isCollapsed={isCollapsed}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export function RoleBasedSidebar({ userRole, isCollapsed = false, onToggle }: RoleBasedSidebarProps) {
  const pathname = usePathname();
  const navigationItems = getNavigationForRole(userRole);

  return (
    <div className={cn(
      'flex flex-col bg-white border-r border-gray-200 shadow-sm',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CN</span>
            </div>
            <div>
              <span className="font-bold text-gray-900 text-lg">CareNest</span>
              <p className="text-xs text-gray-500">{userRole}</p>
            </div>
          </div>
        )}
        
        {onToggle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            
            return (
              <NavigationItemComponent
                key={item.id}
                item={item}
                isActive={isActive}
                isCollapsed={isCollapsed}
              />
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userRole}
              </p>
              <p className="text-xs text-gray-500 truncate">
                Active
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 