
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { AppSection } from "@/lib/types";
import { Combobox, type ComboboxOption } from "../ui/combobox";
import * as icons from "lucide-react";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Plus, X, Users, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";

interface CreateEditSectionDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  section: AppSection | null;
  onSave: (section: AppSection) => void;
}

interface SectionTab {
  id: string;
  name: string;
  order: number;
  formId: string;
  description?: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
}

export function CreateEditSectionDialog({
  isOpen,
  setIsOpen,
  section,
  onSave,
}: CreateEditSectionDialogProps) {
  const [name, setName] = useState("");
  const [path, setPath] = useState("");
  const [description, setDescription] = useState("");
  const [iconName, setIconName] = useState("LayoutDashboard");
  const [order, setOrder] = useState(0);
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [iconOptions, setIconOptions] = useState<ComboboxOption[]>([]);
  const [activeTab, setActiveTab] = useState("details");
  const [sectionTabs, setSectionTabs] = useState<SectionTab[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  // Mock roles - in real app this would come from your user management system
  const availableRoles: Role[] = [
    { id: "admin", name: "System Admin", description: "Full system access" },
    { id: "manager", name: "Support Manager", description: "Manage support operations" },
    { id: "worker", name: "Support Worker", description: "Direct support services" },
    { id: "roster-admin", name: "Roster Admin", description: "Manage schedules and rosters" },
    { id: "finance-admin", name: "Finance Admin", description: "Financial management" },
    { id: "hr-manager", name: "HR Manager", description: "Human resources management" },
    { id: "ceo", name: "CEO", description: "Executive oversight" },
    { id: "reception", name: "Reception", description: "Front desk operations" },
  ];

  // Mock forms - in real app this would come from your form builder
  const availableForms = [
    { id: "form-1", name: "Client Intake Form" },
    { id: "form-2", name: "Incident Report Form" },
    { id: "form-3", name: "Vehicle Check Form" },
    { id: "form-4", name: "Progress Note Form" },
    { id: "form-5", name: "Medication Chart Form" },
    { id: "form-6", name: "Daily Diary Form" },
    { id: "form-7", name: "Health Assessment Form" },
    { id: "form-8", name: "Financial Report Form" },
  ];

  const isEditMode = !!section?.id;

  useEffect(() => {
    if (isOpen) {
        if (section) {
            setName(section.name);
            setPath(section.path);
            setIconName(section.iconName || "LayoutDashboard");
            setOrder(section.order);
            setStatus(section.status);
            setDescription(section.description || "");
            
            // Initialize section tabs
            setSectionTabs(section.tabs?.map(tab => ({
              id: tab.id,
              name: tab.name,
              order: tab.order,
              formId: tab.formId,
              description: tab.description
            })) || []);
            
            // Initialize selected roles (mock - in real app this would come from section data)
            setSelectedRoles(["admin", "manager"]);
        } else {
            // Reset for new section
            setName("");
            setPath("");
            setDescription("");
            setIconName("LayoutDashboard");
            setOrder(0);
            setStatus("Inactive");
            setSectionTabs([]);
            setSelectedRoles([]);
        }
    }
  }, [section, isOpen]);

  useEffect(() => {
    const excludedIcons = [
      'default', 'createLucideIcon', 'icons', 'LucideIcon', 'LucideProps', 'IconNode', 'toPascalCase'
    ];
    
    if (typeof window === 'undefined') return;

    try {
      const generatedOptions = Object.keys(icons)
        .filter(name => {
          // Filter out excluded icons and non-component exports
          if (excludedIcons.includes(name) || !/^[A-Z]/.test(name)) {
            return false;
          }
          
          const IconComponent = (icons as any)[name];
          return IconComponent && 
                 typeof IconComponent === 'object' && 
                 IconComponent.$$typeof === Symbol.for('react.forward_ref');
        })
        .map(name => {
          const IconComponent = (icons as any)[name];
          
          return {
            value: name,
            label: (
              <div className="flex items-center gap-2">
                <IconComponent className="h-5 w-5" />
                <span>{name}</span>
              </div>
            )
          };
        })
        .sort((a, b) => a.value.localeCompare(b.value));

      setIconOptions(generatedOptions);
    } catch (error) {
      console.error('Error generating icon options:', error);
      // Fallback to a basic set of icons
      const fallbackIcons = [
        'LayoutDashboard', 'Users', 'Calendar', 'Settings', 'FileText', 
        'Building2', 'Landmark', 'Zap', 'ShieldAlert', 'UsersRound'
      ];
      
      const fallbackOptions = fallbackIcons.map(name => ({
        value: name,
        label: (
          <div className="flex items-center gap-2">
            <span>{name}</span>
          </div>
        )
      }));
      
      setIconOptions(fallbackOptions);
    }
  }, [isOpen]);

  const handleSave = () => {
    console.log('handleSave function called!');
    
    // Basic validation
    if (!name || !path) {
        alert("Section Name and Path are required.");
        return;
    }
    
    console.log('Saving section:', { name, path, iconName, order, status, description, sectionTabs, selectedRoles });
    
    const newSectionData: AppSection = {
      id: section?.id || '',
      name,
      path,
      iconName,
      order,
      status,
      description,
      tabs: sectionTabs,
      // Add role visibility data
      visibleRoles: selectedRoles
    };
    
    console.log('Calling onSave with:', newSectionData);
    onSave(newSectionData);
    setIsOpen(false);
  };

  const addSectionTab = () => {
    const newTab: SectionTab = {
      id: Date.now().toString(),
      name: 'New Tab',
      order: sectionTabs.length + 1,
      formId: '',
      description: ''
    };
    setSectionTabs([...sectionTabs, newTab]);
  };

  const removeSectionTab = (id: string) => {
    setSectionTabs(sectionTabs.filter(tab => tab.id !== id));
  };

  const updateSectionTab = (id: string, field: keyof SectionTab, value: any) => {
    setSectionTabs(sectionTabs.map(tab => 
      tab.id === id ? { ...tab, [field]: value } : tab
    ));
  };

  const handleRoleToggle = (roleId: string) => {
    setSelectedRoles(prev => 
      prev.includes(roleId) 
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Section" : "Create New Section"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the details for this section." : "Fill in the details for the new section."}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Section Details</TabsTrigger>
            <TabsTrigger value="tabs">Tabs & Forms</TabsTrigger>
            <TabsTrigger value="roles">Role Visibility</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dashboard"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="path">Path</Label>
                  <Input
                    id="path"
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                    placeholder="e.g. /dashboard"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter section description..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="iconName">Icon</Label>
                  <Combobox
                    options={iconOptions}
                    value={iconName}
                    onChange={setIconName}
                    placeholder="Select icon..."
                    searchPlaceholder="Search icons..."
                    noResultsMessage="No icon found."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order">Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="status"
                    checked={status === 'Active'}
                    onCheckedChange={(checked) => setStatus(checked ? 'Active' : 'Inactive')}
                  />
                  <span className="text-sm text-muted-foreground">
                    {status === 'Active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tabs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Section Tabs & Forms</h3>
              <Button onClick={addSectionTab} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Tab
              </Button>
            </div>
            
            <div className="space-y-4">
              {sectionTabs.map((tab, index) => (
                <Card key={tab.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">Tab {index + 1}</Badge>
                        <h4 className="font-medium">{tab.name}</h4>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSectionTab(tab.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Tab Name</Label>
                        <Input
                          value={tab.name}
                          onChange={(e) => updateSectionTab(tab.id, 'name', e.target.value)}
                          placeholder="Enter tab name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Order</Label>
                        <Input
                          type="number"
                          value={tab.order}
                          onChange={(e) => updateSectionTab(tab.id, 'order', parseInt(e.target.value, 10) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Attached Form</Label>
                        <select
                          value={tab.formId}
                          onChange={(e) => updateSectionTab(tab.id, 'formId', e.target.value)}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="">Select a form...</option>
                          {availableForms.map(form => (
                            <option key={form.id} value={form.id}>
                              {form.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input
                          value={tab.description || ''}
                          onChange={(e) => updateSectionTab(tab.id, 'description', e.target.value)}
                          placeholder="Tab description"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {sectionTabs.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No tabs added yet. Click "Add Tab" to create the first tab.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="roles" className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Role Visibility</h3>
                <p className="text-sm text-muted-foreground">
                  Select which roles can see this section in the sidebar.
                </p>
              </div>
              
              <div className="grid gap-4">
                {availableRoles.map((role) => (
                  <div key={role.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={role.id}
                      checked={selectedRoles.includes(role.id)}
                      onCheckedChange={() => handleRoleToggle(role.id)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={role.id} className="font-medium cursor-pointer">
                        {role.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </div>
                    <Badge variant={selectedRoles.includes(role.id) ? "default" : "secondary"}>
                      {selectedRoles.includes(role.id) ? "Visible" : "Hidden"}
                    </Badge>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Note:</strong> Sections will only appear in the sidebar for users with the selected roles. 
                  If no roles are selected, the section will be hidden from all users.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button 
            type="button" 
            onClick={() => {
              console.log('Save button clicked!');
              handleSave();
            }}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
