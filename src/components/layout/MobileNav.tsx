"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';
import { SidebarNav } from './SidebarNav';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut } from 'lucide-react';
import type { Staff } from '@/lib/types';

interface MobileNavProps {
  currentUser: Staff;
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
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback className="bg-green-100 text-green-800 font-semibold">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {currentUser.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {currentUser.email}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {currentUser.role}
              </p>
            </div>
          </div>
          
          <div className="space-y-1">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </Button>
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