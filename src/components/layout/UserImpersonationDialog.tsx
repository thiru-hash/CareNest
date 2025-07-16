"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Users, Filter, UserCheck, Shield, Clock, DollarSign } from 'lucide-react';
import { mockStaff } from '@/lib/data';
import type { Staff } from '@/lib/types';

interface UserImpersonationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserSelect: (user: Staff) => void;
}

export function UserImpersonationDialog({ open, onOpenChange, onUserSelect }: UserImpersonationDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredUsers, setFilteredUsers] = useState<Staff[]>(mockStaff);

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = mockStaff;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Status filter (based on groupIds for demo)
    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        filtered = filtered.filter(user => user.groupIds.includes('group-all'));
      } else if (statusFilter === 'admin') {
        filtered = filtered.filter(user => user.groupIds.some(g => g.includes('admin')));
      }
    }

    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, statusFilter]);

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'system admin':
        return <Shield className="h-4 w-4" />;
      case 'support worker':
        return <Users className="h-4 w-4" />;
      case 'support manager':
        return <UserCheck className="h-4 w-4" />;
      case 'roster admin':
        return <Clock className="h-4 w-4" />;
      case 'finance admin':
        return <DollarSign className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'system admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'support manager':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'roster admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'finance admin':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleUserSelect = (user: Staff) => {
    onUserSelect(user);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Switch User (Impersonation)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="role-filter" className="text-sm font-medium">Role</Label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="System Admin">System Admin</SelectItem>
                    <SelectItem value="Support Worker">Support Worker</SelectItem>
                    <SelectItem value="Support Manager">Support Manager</SelectItem>
                    <SelectItem value="Roster Admin">Roster Admin</SelectItem>
                    <SelectItem value="Finance Admin">Finance Admin</SelectItem>
                    <SelectItem value="CEO">CEO</SelectItem>
                    <SelectItem value="Human Resources Manager">HR Manager</SelectItem>
                    <SelectItem value="IT Admin">IT Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status-filter" className="text-sm font-medium">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="active">Active Users</SelectItem>
                    <SelectItem value="admin">Admin Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="border rounded-lg">
            <ScrollArea className="h-64">
              <div className="p-2">
                {filteredUsers.length > 0 ? (
                  <div className="space-y-2">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                        onClick={() => handleUserSelect(user)}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatarUrl} alt={user.name} />
                          <AvatarFallback className="bg-green-100 text-green-800 font-semibold">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                              {user.name}
                            </p>
                            <Badge className={`text-xs ${getRoleColor(user.role)}`}>
                              {user.role}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {user.email}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded bg-gray-100 dark:bg-gray-800">
                            {getRoleIcon(user.role)}
                          </div>
                          <Button size="sm" variant="outline">
                            <Users className="h-4 w-4 mr-1" />
                            Switch
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      No users found matching your criteria
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            You will temporarily see the application as this user would see it
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 