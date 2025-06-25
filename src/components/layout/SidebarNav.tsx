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
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Calendar,
  Users,
  UsersRound,
  Building2,
  Settings,
  LogOut,
  Waves,
} from "lucide-react";
import { mockUsers } from "@/lib/data";
import { UserRole } from "@/lib/types";

const user = mockUsers["user-1"];

const navItems: { href: string; icon: React.ElementType; label: string }[] = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/roster", icon: Calendar, label: "Roster Schedule" },
    { href: "/people", icon: Users, label: "People We Support" },
    { href: "/staff", icon: UsersRound, label: "Staff" },
    { href: "/locations", icon: Building2, label: "Locations" },
    { href: "/settings", icon: Settings, label: "System Settings" },
];

const adminRoles: UserRole[] = ["Admin"];

export function SidebarNav() {
  const pathname = usePathname();
  // For now, we assume admin has all nav items. This can be expanded with the rights system.
  const userNavItems = adminRoles.includes(user.role) ? navItems : [];

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
          {userNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={{ children: item.label }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="group-data-[collapsible=icon]:-ml-1">
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={{children: 'Logout'}}>
                    <Link href="/">
                        <LogOut/>
                        <span>Logout</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
