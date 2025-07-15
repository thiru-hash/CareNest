
"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockGroups } from "@/lib/data";
import { MoreHorizontal, Users, Copy, Search, Filter, Plus, Shield, UserCheck, Settings } from "lucide-react";
import type { Group } from "@/lib/types";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CreateEditGroupDialog } from "./CreateEditGroupDialog";

// Group categories for better organization
const groupCategories = [
  { id: 'all', name: 'All Groups', icon: <Users className="h-4 w-4" /> },
  { id: 'admin', name: 'Administrative', icon: <Settings className="h-4 w-4" /> },
  { id: 'role', name: 'Role-Based', icon: <UserCheck className="h-4 w-4" /> },
  { id: 'feature', name: 'Feature-Specific', icon: <Shield className="h-4 w-4" /> },
  { id: 'support', name: 'Support Roles', icon: <Users className="h-4 w-4" /> }
];

const getGroupCategory = (group: Group) => {
  if (group.name.includes('Admin') || group.name.includes('ADMIN')) return 'admin';
  if (group.name.startsWith('_Role:')) return 'role';
  if (group.name.includes('Feature:') || group.name.includes('Drive:') || group.name.includes('Reports:')) return 'feature';
  if (group.name.includes('Support') || group.name.includes('Facilitator') || group.name.includes('Manager')) return 'support';
  return 'role';
};

export function GroupManagement() {
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);

  // Filter groups based on search and category
  const filteredGroups = useMemo(() => {
    let filtered = groups;

    if (searchTerm) {
      filtered = filtered.filter(group => 
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(group => getGroupCategory(group) === selectedCategory);
    }

    return filtered;
  }, [groups, searchTerm, selectedCategory]);

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

  const onSaveGroup = (groupData: Partial<Group>) => {
    if (groupData.id && groups.some(g => g.id === groupData.id)) {
      // Editing existing group
      setGroups(prev => prev.map(g => g.id === groupData.id ? { ...g, ...groupData } as Group : g));
    } else {
      // Creating new group
      const newGroupId = `group-${Date.now()}`;
      const newGroup: Group = {
        id: newGroupId,
        name: groupData.name!,
        description: groupData.description!,
        userIds: groupData.userIds || [],
      };
      setGroups(prev => [...prev, newGroup]);
    }
  };
  
  const onConfirmDelete = () => {
    if (currentGroup) {
      setGroups(prev => prev.filter(g => g.id !== currentGroup.id));
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
  };

  const getCategoryBadge = (group: Group) => {
    const category = getGroupCategory(group);
    const categoryInfo = groupCategories.find(c => c.id === category);
    
    const variants = {
      admin: 'destructive',
      role: 'default',
      feature: 'secondary',
      support: 'outline'
    } as const;

    return (
      <Badge variant={variants[category]} className="text-xs">
        {categoryInfo?.name}
      </Badge>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Enhanced Group Management
              </CardTitle>
              <CardDescription>
                Create and manage user groups for granular permission control. Groups can be created dynamically for new sections, forms, and tabs.
              </CardDescription>
            </div>
            <Button onClick={handleCreateGroup}>
              <Plus className="mr-2 h-4 w-4" />
              Add Group
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search and Filter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Groups</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Filter by Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {groupCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        {category.icon}
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Quick Actions</label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  <Filter className="mr-1 h-3 w-3" />
                  Export
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <Copy className="mr-1 h-3 w-3" />
                  Import
                </Button>
              </div>
            </div>
          </div>

          {/* Groups Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Group Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGroups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span>{group.name}</span>
                        {group.name === 'ALL' && (
                          <Badge variant="default" className="text-xs">Core</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div 
                        className="text-sm text-gray-600 dark:text-gray-400"
                        dangerouslySetInnerHTML={{ __html: group.description }}
                      />
                    </TableCell>
                    <TableCell>
                      {getCategoryBadge(group)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{group.userIds.length}</span>
                        <span className="text-sm text-gray-500">users</span>
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
                          <DropdownMenuItem onClick={() => handleEditGroup(group)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCloneGroup(group)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Clone
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onSelect={() => handleDeleteTrigger(group)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium mb-2">Group Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Total Groups:</span>
                <span className="ml-2 font-medium">{filteredGroups.length}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Administrative:</span>
                <span className="ml-2 font-medium">
                  {filteredGroups.filter(g => getGroupCategory(g) === 'admin').length}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Role-Based:</span>
                <span className="ml-2 font-medium">
                  {filteredGroups.filter(g => getGroupCategory(g) === 'role').length}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Feature-Specific:</span>
                <span className="ml-2 font-medium">
                  {filteredGroups.filter(g => getGroupCategory(g) === 'feature').length}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <CreateEditGroupDialog 
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        group={currentGroup}
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
