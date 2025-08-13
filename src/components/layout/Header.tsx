

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
  name: string;
  type: 'client' | 'staff' | 'notice';
  url: string;
}

export function Header({ currentUser }: HeaderProps) {
  const router = useRouter();
  const publishedNotices = mockNotices
    .filter(n => n.status === 'Published')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle logout
  const handleLogout = () => {
    // Clear cookies
    document.cookie = 'currentUser_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // Clear localStorage
    localStorage.clear();
    // Redirect to login page
    router.push('/');
  };

  // Search functionality
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results: SearchResult[] = [];

    // Search in clients
    mockClients.forEach(client => {
      if (client.name.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          id: client.id,
          name: client.name,
          type: 'client',
          url: `/people/${client.id}`
        });
      }
    });

    // Search in staff
    mockStaff.forEach(staff => {
      if (staff.name.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          id: staff.id,
          name: staff.name,
          type: 'staff',
          url: `/staff/${staff.id}`
        });
      }
    });

    // Search in notices
    mockNotices.forEach(notice => {
      if (notice.title.toLowerCase().includes(query.toLowerCase()) || 
          notice.content.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          id: notice.id,
          name: notice.title,
          type: 'notice',
          url: `/dashboard`
        });
      }
    });

    setSearchResults(results.slice(0, 8));
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSearchIcon = (type: string) => {
    switch (type) {
      case 'client':
        return <Users className="h-4 w-4" />;
      case 'staff':
        return <UserCheck className="h-4 w-4" />;
      case 'notice':
        return <FileText className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {/* Left side - Search */}
        <div className="flex items-center space-x-4 flex-1 max-w-md" ref={searchRef}>
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients, staff, documents..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="pl-8"
            />
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
                {searchResults.map((result) => (
                  <Link
                    key={result.id}
                    href={result.url}
                    onClick={() => {
                      setShowSearchResults(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center space-x-3 p-3 hover:bg-muted transition-colors"
                  >
                    {getSearchIcon(result.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{result.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{result.type}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side - Notifications and User Menu */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <NoticeDropdown notices={publishedNotices} />
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser?.avatarUrl} alt={currentUser?.name} />
                  <AvatarFallback>{currentUser?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{currentUser?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {currentUser?.role}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {/* Quick Actions */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Time & Attendance</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/timesheets">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>My Timesheets</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/roster">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>My Roster</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/availability">
                      <CalendarDays className="mr-2 h-4 w-4" />
                      <span>My Availability</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator />
              
              {/* Settings & Security */}
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/two-factor">
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Two-factor Auth.</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/change-password">
                  <Key className="mr-2 h-4 w-4" />
                  <span>Change Password</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {/* Logout */}
              <DropdownMenuItem onClick={handleLogout}>
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
