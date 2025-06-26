
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockGroups, mockStaff } from "@/lib/data";
import { Button } from "../ui/button";
import { MoreHorizontal, Users, Copy } from "lucide-react";
import type { Group } from "@/lib/types";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "../ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CreateEditGroupDialog } from "./CreateEditGroupDialog";
import { ManageGroupMembersDialog } from "./ManageGroupMembersDialog";

export function GroupManagement() {
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);

  // Handlers for opening dialogs
  const handleCreateGroup = () => {
    setCurrentGroup(null);
    setIsEditDialogOpen(true);
  };

  const handleEditGroup = (group: Group) => {
    setCurrentGroup(group);
    setIsEditDialogOpen(true);
  };
  
  const handleManageMembers = (group: Group) => {
    setCurrentGroup(group);
    setIsMembersDialogOpen(true);
  };

  const handleDeleteTrigger = (group: Group) => {
    setCurrentGroup(group);
    setIsDeleteDialogOpen(true);
  };

  // Handlers for saving/confirming actions
  const onSaveGroup = (groupData: Partial<Group>) => {
    if (groupData.id) { // Editing existing group
      setGroups(prev => prev.map(g => g.id === groupData.id ? { ...g, ...groupData } as Group : g));
    } else { // Creating new group
      const newGroup: Group = {
        id: `group-${Date.now()}`,
        name: groupData.name!,
        description: groupData.description!,
        userIds: [],
      };
      setGroups(prev => [...prev, newGroup]);
    }
  };
  
  const onSaveMembers = (groupId: string, userIds: string[]) => {
    setGroups(prev => prev.map(g => g.id === groupId ? { ...g, userIds } : g));
  };
  
  const onConfirmDelete = () => {
    if (currentGroup) {
      setGroups(prev => prev.filter(g => g.id !== currentGroup.id));
    }
    setIsDeleteDialogOpen(false);
    setCurrentGroup(null);
  };

  const handleCloneGroup = (groupToClone: Group) => {
    const newGroup: Group = {
      ...groupToClone,
      id: `group-${Date.now()}`,
      name: `Copy of ${groupToClone.name}`,
    };
    setGroups(prev => [...prev, newGroup]);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Group Management</CardTitle>
              <CardDescription>Create and manage user groups for permissioning.</CardDescription>
            </div>
            <Button onClick={handleCreateGroup}>
              <Users className="mr-2 h-4 w-4" />
              Add Group
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Members</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell className="font-medium">{group.name}</TableCell>
                  <TableCell>{group.description}</TableCell>
                  <TableCell>{group.userIds.length}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditGroup(group)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleManageMembers(group)}>Manage Members</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCloneGroup(group)}>
                            <Copy className="mr-2 h-4 w-4" />
                            <span>Clone</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onSelect={() => handleDeleteTrigger(group)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <CreateEditGroupDialog 
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          group={currentGroup}
          onSave={onSaveGroup}
      />
      
      <ManageGroupMembersDialog 
          isOpen={isMembersDialogOpen}
          setIsOpen={setIsMembersDialogOpen}
          group={currentGroup}
          onSave={onSaveMembers}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the <b>{currentGroup?.name}</b> group and remove all associated member permissions.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setCurrentGroup(null)}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onConfirmDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
