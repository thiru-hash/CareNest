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
import { MoreHorizontal, UserPlus, ArrowRight } from "lucide-react";
import type { Staff, UserRole } from "@/lib/types"; // Assuming Staff type is in types.ts
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"; // Assuming DropdownMenu is a client component
import { AddStaffFormModal } from "@/components/staff/AddStaffFormModal"; // Assuming AddStaffFormModal is a client component


interface StaffTableClientProps {
 staffToDisplay: Staff[];
 currentUser: { id: string; name: string; email: string; role: UserRole };
}

export function StaffTableClient({ staffToDisplay, currentUser }: StaffTableClientProps) {
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);

  // staffToDisplay is now received as a prop

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Staff Members</CardTitle>
              <CardDescription>View and manage staff members in the system.</CardDescription>
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
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
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
                        <p>{staffMember.name}</p>
                        <p className="text-sm text-muted-foreground">{staffMember.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{staffMember.role}</TableCell>
                  <TableCell>{staffMember.phone}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {/* Assuming you have an edit user modal/page */}
                        {/* <DropdownMenuItem onClick={() => handleEditUser(staffMember)}>Edit User</DropdownMenuItem> */}
                         <DropdownMenuItem asChild>
                          <Link href={`/staff/${staffMember.id}`}>
                            View Profile
                          </Link>
                        </DropdownMenuItem>
                        {currentUser.role === 'System Admin' && (
                           <DropdownMenuItem
                              className="text-destructive"
                             // Assuming you have a delete user handler
                              // onSelect={() => handleDeleteTrigger(staffMember)}
                           >
                             Delete
                           </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No staff records to display.
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