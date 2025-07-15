"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, UserPlus, ArrowRight, Mail, Phone, MapPin, Calendar, Building, Users } from "lucide-react";
import type { Staff, UserRole } from "@/lib/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AddStaffFormModal } from "@/components/staff/AddStaffFormModal";

interface StaffTableClientProps {
  staffToDisplay: Staff[];
  currentUser: { id: string; name: string; email: string; role: UserRole };
}

export function StaffTableClient({ staffToDisplay, currentUser }: StaffTableClientProps) {
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);

  const getStatusBadge = (staff: Staff) => {
    // Determine status based on employment details
    const hasActiveEmployment = staff.employmentDetails?.startDate && 
      (!staff.employmentDetails.endDate || staff.employmentDetails.endDate > new Date());
    
    if (hasActiveEmployment) {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    } else {
      return <Badge variant="secondary">Inactive</Badge>;
    }
  };

  const getEmploymentTypeBadge = (staff: Staff) => {
    const type = staff.employmentDetails?.employmentType || 'Unknown';
    const colorMap = {
      'Full-time': 'bg-blue-100 text-blue-800',
      'Part-time': 'bg-yellow-100 text-yellow-800',
      'Casual': 'bg-purple-100 text-purple-800',
      'Contract': 'bg-orange-100 text-orange-800'
    };
    
    return (
      <Badge className={colorMap[type as keyof typeof colorMap] || 'bg-gray-100 text-gray-800'}>
        {type}
      </Badge>
    );
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Not specified';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Staff Members</CardTitle>
              <CardDescription>
                View and manage staff members in the system. 
                {currentUser.role === 'System Admin' && ' You can add new staff members and manage all records.'}
              </CardDescription>
            </div>
            {currentUser.role === 'System Admin' && (
              <Button onClick={() => setIsAddStaffModalOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Staff
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Member</TableHead>
                <TableHead>Role & Status</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Employment</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffToDisplay.length > 0 ? staffToDisplay.map((staffMember) => (
                <TableRow key={staffMember.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={staffMember.avatarUrl} alt={staffMember.name} />
                        <AvatarFallback>{staffMember.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{staffMember.name}</p>
                        <p className="text-sm text-muted-foreground">ID: {staffMember.id}</p>
                        {staffMember.personalDetails?.address && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate max-w-[200px]">{staffMember.personalDetails.address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{staffMember.role}</p>
                      {getStatusBadge(staffMember)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="truncate max-w-[150px]">{staffMember.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span>{staffMember.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {getEmploymentTypeBadge(staffMember)}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Started: {formatDate(staffMember.employmentDetails?.startDate)}</span>
                      </div>
                      {staffMember.employmentDetails?.payRate && (
                        <div className="text-xs text-muted-foreground">
                          ${staffMember.employmentDetails.payRate}/hr
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/staff/${staffMember.id}`}>
                            <ArrowRight className="mr-2 h-4 w-4" />
                            View Profile
                          </Link>
                        </DropdownMenuItem>
                        {currentUser.role === 'System Admin' && (
                          <>
                            <DropdownMenuItem asChild>
                              <Link href={`/staff/${staffMember.id}/edit`}>
                                Edit Profile
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              // onClick={() => handleDeleteStaff(staffMember.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No staff records to display.</p>
                      {currentUser.role === 'System Admin' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setIsAddStaffModalOpen(true)}
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          Add First Staff Member
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddStaffFormModal isOpen={isAddStaffModalOpen} setIsOpen={setIsAddStaffModalOpen} />
    </>
  );
}