"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Menu, User, Settings, Shield, Key, Clock, Calendar, CalendarDays, FileText, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Staff } from '@/lib/types';

interface MobileNavProps {
  currentUser: Staff;
}

export function MobileNav({ currentUser }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Handle logout
  const handleLogout = () => {
    // Clear cookies
    document.cookie = 'currentUser_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // Clear localStorage
    localStorage.clear();
    // Close mobile nav
    setIsOpen(false);
    // Redirect to login page
    router.push('/');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <div className="flex flex-col h-full">
          {/* User Info */}
          <div className="flex items-center space-x-3 p-4 border-b">
            <Avatar className="h-10 w-10">
              <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground truncate">{currentUser.role}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-6">
            {/* Main Navigation */}
            <div>
              <p className="
                text-xs font-semibold text-gray-500 dark:text-gray-400 
                uppercase tracking-wide mb-3
              ">
                Main Navigation
              </p>
              <div className="space-y-1">
                <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    <User className="mr-3 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                  <Link href="/people" onClick={() => setIsOpen(false)}>
                    <User className="mr-3 h-4 w-4" />
                    <span>People</span>
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                  <Link href="/roster" onClick={() => setIsOpen(false)}>
                    <Calendar className="mr-3 h-4 w-4" />
                    <span>Roster</span>
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                  <Link href="/finance" onClick={() => setIsOpen(false)}>
                    <FileText className="mr-3 h-4 w-4" />
                    <span>Finance</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Time & Attendance */}
            <div>
              <p className="
                text-xs font-semibold text-gray-500 dark:text-gray-400 
                uppercase tracking-wide mb-3
              ">
                Time & Attendance
              </p>
              <div className="space-y-1">
                <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                  <Link href="/timesheets" onClick={() => setIsOpen(false)}>
                    <FileText className="mr-3 h-4 w-4" />
                    <span>My Timesheets</span>
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                  <Link href="/roster" onClick={() => setIsOpen(false)}>
                    <Calendar className="mr-3 h-4 w-4" />
                    <span>My Roster</span>
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                  <Link href="/availability" onClick={() => setIsOpen(false)}>
                    <CalendarDays className="mr-3 h-4 w-4" />
                    <span>My Availability</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Settings & Security */}
            <div>
              <p className="
                text-xs font-semibold text-gray-500 dark:text-gray-400 
                uppercase tracking-wide mb-3
              ">
                Settings & Security
              </p>
              <div className="space-y-1">
                <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                  <Link href="/profile" onClick={() => setIsOpen(false)}>
                    <User className="mr-3 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                  <Link href="/settings" onClick={() => setIsOpen(false)}>
                    <Settings className="mr-3 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                  <Link href="/two-factor" onClick={() => setIsOpen(false)}>
                    <Shield className="mr-3 h-4 w-4" />
                    <span>Two-factor Auth.</span>
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                  <Link href="/change-password" onClick={() => setIsOpen(false)}>
                    <Key className="mr-3 h-4 w-4" />
                    <span>Change Password</span>
                  </Link>
                </Button>
              </div>
            </div>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
} 