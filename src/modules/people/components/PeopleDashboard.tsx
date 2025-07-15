"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, UserPlus, UserCheck, UserX, Search, Filter } from 'lucide-react';
import type { Staff, Client, PeopleFilters } from '../types';

interface PeopleDashboardProps {
  currentUser: any;
  clients: Client[];
  staff: Staff[];
}

export default function PeopleDashboard({ currentUser, clients, staff }: PeopleDashboardProps) {
  const [filters, setFilters] = useState<PeopleFilters>({});
  const [activeTab, setActiveTab] = useState<'clients' | 'staff'>('clients');

  const activeClients = clients.filter(c => c.status === 'Active').length;
  const activeStaff = staff.filter(s => s.status === 'Active').length;
  const totalPeople = clients.length + staff.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            People Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage clients, staff, and groups
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add Person
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg bg-white dark:bg-gray-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total People
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalPeople}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white dark:bg-gray-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Clients
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activeClients}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900">
                <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white dark:bg-gray-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Staff
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activeStaff}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
                <UserCheck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Tabs */}
      <Card className="border-0 shadow-lg bg-white dark:bg-gray-900">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex gap-2">
              <Button
                variant={activeTab === 'clients' ? 'default' : 'outline'}
                onClick={() => setActiveTab('clients')}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Clients ({clients.length})
              </Button>
              <Button
                variant={activeTab === 'staff' ? 'default' : 'outline'}
                onClick={() => setActiveTab('staff')}
                className="flex items-center gap-2"
              >
                <UserCheck className="h-4 w-4" />
                Staff ({staff.length})
              </Button>
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search people..."
                  className="pl-10 w-64"
                  value={filters.search || ''}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === 'clients' ? (
            <div className="space-y-4">
              {clients.map((client) => (
                <div key={client.id} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 font-semibold">
                          {client.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">
                          {client.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {client.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={client.status === 'Active' ? 'default' : 'secondary'}
                        className={`text-xs ${
                          client.status === 'Active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}
                      >
                        {client.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {staff.map((member) => (
                <div key={member.id} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                        <span className="text-purple-600 dark:text-purple-400 font-semibold">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">
                          {member.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {member.role} • {member.department}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={member.status === 'Active' ? 'default' : 'secondary'}
                        className={`text-xs ${
                          member.status === 'Active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}
                      >
                        {member.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 