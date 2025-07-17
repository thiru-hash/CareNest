

"use client";

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import { Bell, Settings, LogOut, User, Search, LayoutDashboard, Clock, Calendar, Shield, Mail, Key, FileText, UserCheck, CalendarDays, Users, MapPin, DollarSign, ArrowRight } from 'lucide-react';
import { NoticeDropdown } from './NoticeDropdown';
import { mockNotices, mockClients, mockStaff } from '@/lib/data';
import type { Staff } from '@/lib/types';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  currentUser: Staff | undefined;
}

interface SearchResult {
  id: string;
  type: 'client' | 'staff' | 'document' | 'location' | 'roster' | 'finance';
  title: string;
  subtitle: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function Header({ currentUser }: HeaderProps) {
  const publishedNotices = mockNotices
    .filter(n => n.status === 'Published')
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Search function
  const performSearch = (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    const searchTermLower = term.toLowerCase();
    const results: SearchResult[] = [];

    // Search clients
    mockClients.forEach(client => {
      if (
        client.name.toLowerCase().includes(searchTermLower) ||
        client.email?.toLowerCase().includes(searchTermLower) ||
        client.phone?.toLowerCase().includes(searchTermLower)
      ) {
        results.push({
          id: client.id,
          type: 'client',
          title: client.name,
          subtitle: client.email || client.phone || 'No contact info',
          url: `/people/${client.id}`,
          icon: Users
        });
      }
    });

    // Search staff
    mockStaff.forEach(staff => {
      if (
        staff.name.toLowerCase().includes(searchTermLower) ||
        staff.email.toLowerCase().includes(searchTermLower) ||
        staff.role.toLowerCase().includes(searchTermLower)
      ) {
        results.push({
          id: staff.id,
          type: 'staff',
          title: staff.name,
          subtitle: `${staff.role} • ${staff.email}`,
          url: `/staff/${staff.id}`,
          icon: UserCheck
        });
      }
    });

    // Add mock documents
    if (searchTermLower.includes('document') || searchTermLower.includes('report')) {
      results.push({
        id: 'doc-1',
        type: 'document',
        title: 'Client Care Plan',
        subtitle: 'Document • Updated 2 days ago',
        url: '/documents/care-plan',
        icon: FileText
      });
    }

    // Add mock locations
    if (searchTermLower.includes('location') || searchTermLower.includes('property')) {
      results.push({
        id: 'loc-1',
        type: 'location',
        title: 'Main Office',
        subtitle: 'Location • 123 Main St',
        url: '/locations/main-office',
        icon: MapPin
      });
    }

    // Add mock roster entries
    if (searchTermLower.includes('roster') || searchTermLower.includes('schedule')) {
      results.push({
        id: 'roster-1',
        type: 'roster',
        title: 'Weekly Schedule',
        subtitle: 'Roster • This week',
        url: '/roster',
        icon: Calendar
      });
    }

    // Add mock finance entries
    if (searchTermLower.includes('finance') || searchTermLower.includes('billing')) {
      results.push({
        id: 'finance-1',
        type: 'finance',
        title: 'Monthly Billing',
        subtitle: 'Finance • Current month',
        url: '/finance',
        icon: DollarSign
      });
    }

    setSearchResults(results.slice(0, 5)); // Limit results to 5
  };

  // Handle input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    performSearch(value);
    setSelectedIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        handleResultClick(searchResults[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
      setSearchTerm('');
      setSearchResults([]);
      setSelectedIndex(-1);
    }
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    router.push(result.url);
    setIsSearchOpen(false);
    setSearchTerm('');
    setSearchResults([]);
    setSelectedIndex(-1);
  };

  // Handle focus
  const handleFocus = () => {
    setIsSearchOpen(true);
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
        setSearchTerm('');
        setSearchResults([]);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side - Logo/Brand */}
        <div className="flex items-center">
          <div className="lg:hidden">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">CareNest</h1>
          </div>
          {/* Removed desktop branding here */}
        </div>

        {/* Center - Search (hidden on mobile, shown on tablet and up) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
          <div ref={searchRef} className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              className="w-full pl-10 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />

            {/* Dropdown Results */}
            {isSearchOpen && (searchTerm.trim() || searchResults.length > 0) && (
              <div className="absolute top-full left-0 h-0 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((result, index) => {
                      const Icon = result.icon;
                      const isSelected = index === selectedIndex;
                      
                      return (
                        <button
                          key={`${result.type}-${result.id}`}
                          onClick={() => handleResultClick(result)}
                          className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                            isSelected ? 'bg-gray-50 dark:bg-gray-700' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              <Icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {result.title}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {result.subtitle}
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <ArrowRight className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : searchTerm.trim() ? (
                  <div className="px-4 text-center text-gray-500 dark:text-gray-400">
                    <Search className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">No results found</p>
                    <p className="text-xs mt-1">Try searching for people, staff, or documents</p>
                  </div>
                ) : null}
              </div>
            )}
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
                  <AvatarImage src={currentUser?.avatarUrl} alt={currentUser?.name || 'User'} />
                  <AvatarFallback className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 font-semibold text-xs sm:text-sm">
                    {currentUser?.name?.split(' ').map(n => n[0]).join('') || 'U'}
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
                    {currentUser?.name || 'User'}
                  </p>
                  <p className="text-xs leading-none text-gray-500 dark:text-gray-400">
                    {currentUser?.email || 'user@example.com'}
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
                <Link href={`/staff/${currentUser?.id || 'profile'}`}>
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
