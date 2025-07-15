

"use client";

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import { Bell, Settings, LogOut, User, Search, LayoutDashboard, Clock, Calendar, Shield, Mail, Key, FileText, UserCheck, CalendarDays } from 'lucide-react';
import { NoticeDropdown } from './NoticeDropdown';
import { mockNotices } from '@/lib/data';
import type { Staff } from '@/lib/types';
import Link from 'next/link';

interface HeaderProps {
  currentUser: Staff;
}

export function Header({ currentUser }: HeaderProps) {
  const publishedNotices = mockNotices
    .filter(n => n.status === 'Published')
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side - Logo/Brand */}
        <div className="flex items-center">
          <div className="lg:hidden">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">CareNest</h1>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CN</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">CareNest</span>
          </div>
        </div>

        {/* Center - Search (hidden on mobile, shown on tablet and up) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right side - User menu and notifications */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <NoticeDropdown notices={publishedNotices} />
          
          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-gray-200 dark:border-gray-700">
                  <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                  <AvatarFallback className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 font-semibold text-xs sm:text-sm">
                    {currentUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none text-gray-900 dark:text-white">
                    User Profile
                  </p>
                  <p className="text-sm font-medium leading-none text-gray-900 dark:text-white">
                    {currentUser.name}
                  </p>
                  <p className="text-xs leading-none text-gray-500 dark:text-gray-400">
                    {currentUser.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {/* General Section */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <User className="mr-2 h-4 w-4" />
                  <span>General</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/timesheets">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>Timesheet</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/roster">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Roster</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/availability">
                      <CalendarDays className="mr-2 h-4 w-4" />
                      <span>My Availability</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/two-factor">
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Two-factor Auth.</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {/* Quick Actions */}
              <DropdownMenuItem asChild>
                <Link href="/leave-request">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Leave Request</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/inbox">
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Inbox</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/change-password">
                  <Key className="mr-2 h-4 w-4" />
                  <span>Change Password</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {/* Profile & Settings */}
              <DropdownMenuItem asChild>
                <Link href={`/staff/${currentUser.id}`}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
