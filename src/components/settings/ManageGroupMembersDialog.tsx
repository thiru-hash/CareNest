"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockGroups, mockSections } from "@/lib/data";
import { Button } from "../ui/button";
import { MoreHorizontal, Users, Copy } from "lucide-react";
import type { Group, Permission, PermissionsState } from "@/lib/types";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CreateEditGroupDialog } from "./CreateEditGroupDialog";

const fullAccess = { view: true, create: true, edit: true, delete: true };
const viewOnly = { view: true, create: false, edit: false, delete: false };
const viewCreateEdit = { view: true, create: true, edit: true, delete: false };
const viewCreate = { view: true, create: true, edit: false, delete: false };

const allSectionsForPerms = (permissions: { [key in Permission]?: boolean }) => {
    return Object.fromEntries(mockSections.map(s => [s.id, permissions]));
};

const initialPermissions: PermissionsState = {
    'group-system-admin': allSectionsForPerms(fullAccess),
    'group-support-manager': allSectionsForPerms(viewCreateEdit),
    'group-support-worker': { ...allSectionsForPerms({}), 'sec-dash': viewOnly, 'sec-roster': viewOnly, 'sec-people': viewCreate, 'sec-staff': viewOnly, 'sec-loc': viewOnly, 'sec-inc': viewCreate, },
    'group-roster-admin': { ...allSectionsForPerms({}), 'sec-roster': fullAccess, 'sec-staff': viewOnly, 'sec-people': viewOnly, 'sec-loc': viewOnly, 'sec-dash': viewOnly, },
    'group-roster-scheduler': { ...allSectionsForPerms({}), 'sec-roster': viewCreateEdit, 'sec-staff': viewOnly, 'sec-people': viewOnly, 'sec-loc': viewOnly, 'sec-dash': viewOnly, },
    'group-finance-admin': { ...allSectionsForPerms(viewOnly), 'sec-finance': fullAccess },
    'group-gm-service': allSectionsForPerms(viewCreateEdit),
    'group-ceo': { ...allSectionsForPerms(viewOnly), 'sec-finance': viewOnly },
    'group-reception': { ...allSectionsForPerms({}), 'sec-dash': viewOnly, 'sec-roster': viewOnly, 'sec-staff': viewOnly, 'sec-loc': viewOnly, },
    'group-health-safety': { ...allSectionsForPerms({}), 'sec-inc': fullAccess, 'sec-people': viewOnly, 'sec-staff': viewOnly, 'sec-loc': viewOnly, },
    'group-risk-management': { ...allSectionsForPerms({}), 'sec-inc': fullAccess, },
    'group-office-admin': allSectionsForPerms(viewCreateEdit),
    'group-clinical-advisor': { ...allSectionsForPerms({}), 'sec-people': viewOnly, 'sec-roster': viewOnly, 'sec-inc': viewOnly, },
    'group-hr-manager': { ...allSectionsForPerms({}), 'sec-staff': fullAccess, 'sec-dash': viewOnly, },
    'group-hr-admin': { ...allSectionsForPerms({}), 'sec-staff': viewCreateEdit, 'sec-dash': viewOnly, },
    'group-hr': { ...allSectionsForPerms({}), 'sec-staff': viewOnly, 'sec-dash': viewOnly, },
    'group-behavioural-support': { ...allSectionsForPerms({}), 'sec-people': viewOnly, 'sec-roster': viewOnly, 'sec-inc': viewOnly, },
};


export function GroupManagement() {
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [permissions, setPermissions] = useState<PermissionsState>(initialPermissions);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);

  const handleCreateGroup = () => {
    setCurrentGroup(null);
    setIsDialogOpen(true);
  };

  const handleEditGroup = (group: Group) => {
    setCurrentGroup(group);
    setIsDialogOpen(true);
  };
  
  const handleDeleteTrigger = (group: Group) => {
    setCurrentGroup(group);
    setIsDeleteDialogOpen(true);
  };

  const onSaveGroup = (
    groupData: Partial<Group>, 
    memberIds: string[], 
    rights: { [sectionId: string]: { [key in Permission]?: boolean; } }
  ) => {
    if (groupData.id && groups.some(g => g.id === groupData.id)) { // Editing existing group
      const groupId = groupData.id;
      setGroups(prev => prev.map(g => g.id === groupId ? { ...g, ...groupData, userIds: memberIds } as Group : g));
      setPermissions(prev => ({...prev, [groupId]: rights }));
    } else { // Creating new group
      const newGroupId = `group-${Date.now()}`;
      const newGroup: Group = {
        id: newGroupId,
        name: groupData.name!,
        description: groupData.description!,
        userIds: memberIds,
      };
      setGroups(prev => [...prev, newGroup]);
      setPermissions(prev => ({...prev, [newGroupId]: rights }));
    }
  };
  
  const onConfirmDelete = () => {
    if (currentGroup) {
      setGroups(prev => prev.filter(g => g.id !== currentGroup.id));
      setPermissions(prev => {
        const newPerms = {...prev};
        delete newPerms[currentGroup.id];
        return newPerms;
      })
    }
    setIsDeleteDialogOpen(false);
    setCurrentGroup(null);
  };

  const handleCloneGroup = (groupToClone: Group) => {
    const newGroupId = `group-${Date.now()}`;
    const newGroup: Group = {
      ...groupToClone,
      id: newGroupId,
      name: `Copy of ${groupToClone.name}`,
    };
    setGroups(prev => [...prev, newGroup]);
    setPermissions(prev => ({...prev, [newGroupId]: permissions[groupToClone.id] || {}}));
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
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          group={currentGroup}
          permissions={permissions}
          onSave={onSaveGroup}
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