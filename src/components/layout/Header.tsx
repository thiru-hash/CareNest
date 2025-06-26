

"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LogOut, Settings, User } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import type { UserRole, Staff, Notice } from "@/lib/types";
import { logout } from "@/app/actions";
import { NoticeDropdown } from "./NoticeDropdown";

const adminRoles: UserRole[] = ["System Admin"];

const pageTitles: { [key: string]: string } = {
  "/dashboard": "Dashboard",
  "/roster": "Roster Schedule",
  "/people": "People We Support",
  "/staff": "Staff",
  "/locations": "Locations",
  "/settings": "System Settings",
};

export function Header({ user, notices }: { user: Staff, notices: Notice[] }) {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  
  const getPageTitle = () => {
    if (pathname.startsWith('/staff/')) return "Staff Profile";
    const matchedPath = Object.keys(pageTitles).find(path => pathname.startsWith(path));
    return matchedPath ? pageTitles[matchedPath] : "CareNest";
  };

  const isAdmin = adminRoles.includes(user.role);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-2 sm:gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      {isMobile && <SidebarTrigger />}
      <h1 className="text-lg sm:text-xl font-semibold">{getPageTitle()}</h1>
      <div className="ml-auto flex items-center gap-2">
        <NoticeDropdown notices={notices} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/staff/${user.id}`}>
                <User className="mr-2" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            {isAdmin && (
                <DropdownMenuItem asChild>
                <Link href="/settings">
                    <Settings className="mr-2" />
                    <span>System Settings</span>
                </Link>
                </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <form action={logout}>
              <DropdownMenuItem asChild>
                <button type="submit" className="w-full">
                  <LogOut className="mr-2" />
                  <span>Logout</span>
                </button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
