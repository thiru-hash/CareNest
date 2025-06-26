"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockStaff, mockGroups, mockProperties } from "@/lib/data";
import { Button } from "../ui/button";
import { MoreHorizontal, UserPlus } from "lucide-react";
import type { Staff, Group, Property } from "@/lib/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { CreateEditStaffDialog } from "./CreateEditStaffDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export function UserManagement() {
  const [users, setUsers] = useState<Staff[]>(mockStaff);
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Staff | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Staff | null>(null);


  const handleAddUser = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
  };

  const handleEditUser = (user: Staff) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  }

  const handleDeleteTrigger = (user: Staff) => {
    if (user.id === 'staff-admin') {
      alert("Cannot delete the primary administrator.");
      return;
    }
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  }

  const handleSaveUser = (userData: Partial<Staff>) => {
    if (userData.id && users.some(u => u.id === userData.id)) {
      // Update existing user
      setUsers(prev => prev.map(u => u.id === userData.id ? { ...u, ...userData } as Staff : u));
    } else {
      // Create new user
      const newUser: Staff = {
        id: `staff-${Date.now()}`,
        name: userData.name || 'New Staff Member',
        email: userData.email || 'new.staff@carenest.com',
        role: userData.role || 'Support Worker',
        phone: '555-0000',
        avatarUrl: 'https://placehold.co/100x100.png',
        groupIds: userData.groupIds || [],
        propertyIds: userData.propertyIds || [],
      };
      setUsers(prev => [...prev, newUser]);
    }
    setIsDialogOpen(false);
  };
  
  const handleConfirmDelete = () => {
    if (userToDelete) {
        setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
    }
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  }

  return (
    <>
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
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>Edit User</DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive" 
                          onSelect={() => handleDeleteTrigger(user)}
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

      <CreateEditStaffDialog 
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        staff={editingUser}
        onSave={handleSaveUser}
        allGroups={groups}
        allProperties={properties}
      />
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account for <b>{userToDelete?.name}</b>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Delete User</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}