"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockStaff } from "@/lib/data";
import { Button } from "../ui/button";
import { MoreHorizontal, UserPlus } from "lucide-react";
import type { Staff } from "@/lib/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

export function UserManagement() {
  const allUsers: Staff[] = [...mockStaff];
  const [users, setUsers] = useState<Staff[]>(allUsers);

  const handleAddUser = () => {
    const newUser: Staff = {
        id: `staff-${Date.now()}`,
        name: 'New Staff Member',
        email: 'new.staff@carenest.com',
        role: 'Support Worker',
        phone: '555-0000',
        avatarUrl: 'https://placehold.co/100x100.png',
        groupIds: [],
    };
    setUsers(prev => [...prev, newUser]);
  }

  const handleDeleteUser = (userId: string) => {
    // Prevent deleting the main admin user for now
    if (userId === 'staff-admin') {
        alert("Cannot delete the primary administrator.");
        return;
    }
    setUsers(prev => prev.filter(u => u.id !== userId));
  }


  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Add, edit, and manage system users and their roles.</CardDescription>
            </div>
            <Button onClick={handleAddUser}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
            </Button>
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
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p>{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{(user as Staff).phone || 'N/A'}</TableCell>
                 <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Change Role</DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive" 
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={user.id === 'staff-admin'}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
