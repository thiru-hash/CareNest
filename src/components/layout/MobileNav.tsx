"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';
import { SidebarNav } from './SidebarNav';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut, LayoutDashboard, Clock, Calendar, Shield, Mail, Key, FileText, UserCheck, CalendarDays } from 'lucide-react';
import type { Staff } from '@/lib/types';
import Link from 'next/link';

interface MobileNavProps {
  currentUser: Staff | undefined;
}

export function MobileNav({ currentUser }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="lg:hidden fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="p-6 border-b border-gray-200">
          <SheetTitle className="text-xl font-bold text-gray-900">CareNest</SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 p-4">
          <SidebarNav />
        </div>
        
        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={currentUser?.avatarUrl} alt={currentUser?.name || 'User'} />
              <AvatarFallback className="bg-green-100 text-green-800 font-semibold">
                {currentUser?.name?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                User Profile
              </p>
              <p className="text-sm font-medium text-gray-900 truncate">
                {currentUser?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {currentUser?.email || 'user@example.com'}
              </p>
            </div>
          </div>
          
          <div className="space-y-1">
            {/* General Section */}
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">General</p>
              <div className="space-y-1">
                <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                  <Link href="/timesheets">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Timesheet</span>
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                  <Link href="/roster">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Roster</span>
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                  <Link href="/availability">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    <span>My Availability</span>
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                  <Link href="/two-factor">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Two-factor Auth.</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quick Actions</p>
              <div className="space-y-1">
                <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                  <Link href="/leave-request">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Leave Request</span>
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                  <Link href="/inbox">
                    <Mail className="mr-2 h-4 w-4" />
                    <span>Inbox</span>
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                  <Link href="/change-password">
                    <Key className="mr-2 h-4 w-4" />
                    <span>Change Password</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Profile & Settings */}
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Account</p>
              <div className="space-y-1">
                <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                  <Link href={`/staff/${currentUser?.id || 'profile'}`}>
                    <UserCheck className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Logout */}
            <div className="pt-2 border-t border-gray-200">
              <Button variant="ghost" size="sm" className="w-full justify-start text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </Button>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              Multi-Tenant Demo
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
} 