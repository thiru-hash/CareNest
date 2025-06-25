"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Waves, MoreHorizontal } from "lucide-react";
import { mockUsers, mockSections } from "@/lib/data";
import { iconMap } from "@/lib/icon-map";
import { UserRole } from "@/lib/types";
import { useMemo } from "react";

const user = mockUsers["user-1"];

const adminRoles: UserRole[] = ["Admin"];

export function SidebarNav() {
  const pathname = usePathname();
  
  const userNavItems = useMemo(() => {
    // In a real app, this data would likely be fetched or come from a context.
    // For now, we filter and sort the mock data.
    if (adminRoles.includes(user.role)) {
      return mockSections
        .filter(section => section.status === 'Active')
        .sort((a, b) => a.order - b.order);
    }
    // Add logic here for non-admin roles if needed
    return [];
  }, []);

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2 justify-center group-data-[collapsible=icon]:justify-center">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <Waves className="h-6 w-6" />
            </div>
            <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
            CareNest
            </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {userNavItems.map((item) => {
            const Icon = iconMap[item.iconName] || MoreHorizontal;
            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.path)}
                  tooltip={{ children: item.name }}
                >
                  <Link href={item.path}>
                    <Icon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
