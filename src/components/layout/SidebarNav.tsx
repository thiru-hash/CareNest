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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

const navItems: { [key in UserRole]: { href: string; icon: React.ElementType; label: string }[] } = {
  Admin: [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/roster", icon: Calendar, label: "Roster Schedule" },
    { href: "/people", icon: Users, label: "People We Support" },
    { href: "/staff", icon: UsersRound, label: "Staff" },
    { href: "/locations", icon: Building2, label: "Locations" },
  ],
  "Support Manager": [],
  "Support Worker": [],
  "Roster Team": [],
};

export function SidebarNav() {
  const pathname = usePathname();
  const userNavItems = navItems[user.role] || [];

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
                <SidebarMenuButton asChild tooltip={{children: 'Settings'}}>
                    <Link href="#">
                        <Settings/>
                        <span>Settings</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
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
