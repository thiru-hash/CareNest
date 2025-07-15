
"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { mockGroups, mockRights, permissionPresets } from "@/lib/data";
import { HelpCircle, Search, Filter, Zap, Eye, Edit, Plus, Trash2, Settings } from "lucide-react";
import type { Group, Right, RightsState, RightCategory, RightType } from "@/lib/types";

// Helper function to get rights by category
const getRightsByCategory = (rights: Right[], category: RightCategory) => {
  return rights.filter(right => right.category === category && right.isActive);
};

// Helper function to get rights by type
const getRightsByType = (rights: Right[], type: RightType) => {
  return rights.filter(right => right.type === type && right.isActive);
};

export function RightsManagement() {
  const [selectedGroup, setSelectedGroup] = useState<string>(mockGroups[0].id);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<RightCategory | 'all'>('all');
  const [selectedType, setSelectedType] = useState<RightType | 'all'>('all');
  const [rights, setRights] = useState<RightsState>({});

  // Filter rights based on search, category, and type
  const filteredRights = useMemo(() => {
    let filtered = mockRights;

    if (searchTerm) {
      filtered = filtered.filter(right => 
        right.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        right.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(right => right.category === selectedCategory);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(right => right.type === selectedType);
    }

    return filtered;
  }, [searchTerm, selectedCategory, selectedType]);

  const handleRightChange = (rightId: string, checked: boolean) => {
    setRights(prev => ({
      ...prev,
      [selectedGroup]: {
        ...prev[selectedGroup],
        [rightId]: checked
      }
    }));
  };

  const applyPreset = (preset: typeof permissionPresets[0]) => {
    setRights(prev => ({
      ...prev,
      [selectedGroup]: {
        ...prev[selectedGroup],
        ...preset.permissions
      }
    }));
  };

  const getRightStatus = (rightId: string) => {
    return rights[selectedGroup]?.[rightId] || false;
  };

  const getCategoryIcon = (category: RightCategory) => {
    switch (category) {
      case 'dashboard': return <Eye className="h-4 w-4" />;
      case 'roster': return <Edit className="h-4 w-4" />;
      case 'people': return <Plus className="h-4 w-4" />;
      case 'finance': return <Settings className="h-4 w-4" />;
      case 'system': return <Settings className="h-4 w-4" />;
      case 'forms': return <Plus className="h-4 w-4" />;
      case 'reports': return <Eye className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: RightType) => {
    const variants = {
      site: 'default',
      ajax: 'secondary',
      element: 'outline',
      other: 'destructive'
    } as const;

    return (
      <Badge variant={variants[type]} className="text-xs">
        {type.toUpperCase()}
      </Badge>
    );
  };

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Enhanced Rights Management
          </CardTitle>
          <CardDescription>
            Define granular permissions for user groups with detailed control over features and access levels.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Group Selection */}
          <div className="max-w-xs">
            <Label>Select a group to manage their rights</Label>
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent>
                {mockGroups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Permission Presets */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Quick Permission Presets</Label>
            <div className="flex flex-wrap gap-2">
              {permissionPresets.map((preset) => (
                <Tooltip key={preset.name}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => applyPreset(preset)}
                      className="text-xs"
                    >
                      <Zap className="mr-1 h-3 w-3" />
                      {preset.name}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{preset.description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Search Rights</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search rights..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Filter by Category</Label>
              <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as RightCategory | 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="dashboard">Dashboard</SelectItem>
                  <SelectItem value="roster">Roster</SelectItem>
                  <SelectItem value="people">People</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="forms">Forms</SelectItem>
                  <SelectItem value="reports">Reports</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Filter by Type</Label>
              <Select value={selectedType} onValueChange={(value) => setSelectedType(value as RightType | 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="site">Site</SelectItem>
                  <SelectItem value="ajax">AJAX</SelectItem>
                  <SelectItem value="element">Element</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Rights Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8">
                    <Checkbox 
                      checked={filteredRights.every(right => getRightStatus(right.id))}
                      onCheckedChange={(checked) => {
                        filteredRights.forEach(right => {
                          handleRightChange(right.id, !!checked);
                        });
                      }}
                    />
                  </TableHead>
                  <TableHead>Right Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-center">Access</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRights.map((right) => (
                  <TableRow key={right.id}>
                    <TableCell>
                      <Checkbox 
                        checked={getRightStatus(right.id)}
                        onCheckedChange={(checked) => handleRightChange(right.id, !!checked)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{right.name}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="flex items-start gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {right.description}
                        </span>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{right.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(right.category)}
                        <span className="text-sm capitalize">{right.category}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getTypeBadge(right.type)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getRightStatus(right.id) ? "default" : "secondary"}>
                        {getRightStatus(right.id) ? "Granted" : "Denied"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium mb-2">Permission Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Total Rights:</span>
                <span className="ml-2 font-medium">{filteredRights.length}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Granted:</span>
                <span className="ml-2 font-medium text-green-600">
                  {filteredRights.filter(right => getRightStatus(right.id)).length}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Denied:</span>
                <span className="ml-2 font-medium text-red-600">
                  {filteredRights.filter(right => !getRightStatus(right.id)).length}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Group:</span>
                <span className="ml-2 font-medium">
                  {mockGroups.find(g => g.id === selectedGroup)?.name}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
