'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription } from "../ui/alert";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  UserCheck, 
  Settings, 
  Eye, 
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Save,
  RefreshCw
} from "lucide-react";
import { useDashboardConfig } from "@/lib/hooks/useDashboardConfig";

interface DashboardSection {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  required: boolean;
  userLevels: string[];
}

interface UserLevel {
  id: string;
  name: string;
  description: string;
  sections: string[];
}

export function DashboardCustomization() {
  const {
    config,
    updateSectionConfig,
    updateFieldConfig,
    updateUserLevelConfig,
    addSectionToUserLevel,
    removeSectionFromUserLevel,
    addFieldToUserLevel,
    removeFieldFromUserLevel,
    saveConfig
  } = useDashboardConfig();

  const [selectedUserLevel, setSelectedUserLevel] = useState<string>('caregiver');
  const [hasChanges, setHasChanges] = useState(false);

  // Convert config to local state for UI
  const [userLevels, setUserLevels] = useState<UserLevel[]>(config.userLevels);
  const [dashboardSections, setDashboardSections] = useState<DashboardSection[]>(
    config.dashboardSections.map(section => ({
      ...section,
      icon: getSectionIcon(section.id)
    }))
  );
  const [dashboardFields, setDashboardFields] = useState<DashboardField[]>(
    config.dashboardFields.map(field => ({
      ...field,
      icon: getFieldIcon(field.id)
    }))
  );

  // Helper function to get section icon
  function getSectionIcon(sectionId: string) {
    switch (sectionId) {
      case 'my-shifts':
        return <Calendar className="h-4 w-4" />;
      case 'open-shifts':
        return <Users className="h-4 w-4" />;
      case 'compliance':
        return <UserCheck className="h-4 w-4" />;
      case 'analytics':
        return <LayoutDashboard className="h-4 w-4" />;
      case 'notifications':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <LayoutDashboard className="h-4 w-4" />;
    }
  }

  // Helper function to get field icon
  function getFieldIcon(fieldId: string) {
    switch (fieldId) {
      case 'my-shifts-client':
      case 'open-shifts-client':
        return <UserCheck className="h-4 w-4" />;
      case 'my-shifts-status':
        return <AlertTriangle className="h-4 w-4" />;
      case 'my-shifts-actions':
      case 'open-shifts-actions':
        return <Settings className="h-4 w-4" />;
      case 'open-shifts-role':
        return <Users className="h-4 w-4" />;
      case 'open-shifts-pay':
        return <Calendar className="h-4 w-4" />;
      case 'open-shifts-priority':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <LayoutDashboard className="h-4 w-4" />;
    }
  }

  const handleSectionToggle = (sectionId: string, enabled: boolean) => {
    setDashboardSections(prev => 
      prev.map(section => 
        section.id === sectionId 
          ? { ...section, enabled }
          : section
      )
    );
    updateSectionConfig(sectionId, { enabled });
    setHasChanges(true);
  };

  const handleUserLevelSectionToggle = (userLevelId: string, sectionId: string, enabled: boolean) => {
    setUserLevels(prev => 
      prev.map(level => 
        level.id === userLevelId
          ? {
              ...level,
              sections: enabled 
                ? [...level.sections, sectionId]
                : level.sections.filter(s => s !== sectionId)
            }
          : level
      )
    );
    
    if (enabled) {
      addSectionToUserLevel(userLevelId, sectionId);
    } else {
      removeSectionFromUserLevel(userLevelId, sectionId);
    }
    setHasChanges(true);
  };

  const handleFieldToggle = (fieldId: string, enabled: boolean) => {
    setDashboardFields(prev => 
      prev.map(field => 
        field.id === fieldId 
          ? { ...field, enabled }
          : field
      )
    );
    updateFieldConfig(fieldId, { enabled });
    setHasChanges(true);
  };

  const handleUserLevelFieldToggle = (userLevelId: string, fieldId: string, enabled: boolean) => {
    setUserLevels(prev => 
      prev.map(level => 
        level.id === userLevelId
          ? {
              ...level,
              fields: enabled 
                ? [...level.fields, fieldId]
                : level.fields.filter(f => f !== fieldId)
            }
          : level
      )
    );
    
    if (enabled) {
      addFieldToUserLevel(userLevelId, fieldId);
    } else {
      removeFieldFromUserLevel(userLevelId, fieldId);
    }
    setHasChanges(true);
  };

  const saveChanges = () => {
    // Save the current state to the hook
    const newConfig = {
      userLevels,
      dashboardSections: dashboardSections.map(section => ({
        id: section.id,
        name: section.name,
        description: section.description,
        enabled: section.enabled,
        required: section.required,
        userLevels: section.userLevels
      })),
      dashboardFields: dashboardFields.map(field => ({
        id: field.id,
        name: field.name,
        description: field.description,
        sectionId: field.sectionId,
        enabled: field.enabled,
        required: field.required,
        userLevels: field.userLevels
      }))
    };
    saveConfig(newConfig);
    setHasChanges(false);
  };

  const resetToDefaults = () => {
    // Reset to default configuration
    const defaultSections = dashboardSections.map(section => ({
      ...section,
      enabled: section.required
    }));
    setDashboardSections(defaultSections);
    
    const defaultUserLevels = userLevels.map(level => ({
      ...level,
      sections: level.sections.filter(sectionId => 
        defaultSections.find(s => s.id === sectionId)?.required
      )
    }));
    setUserLevels(defaultUserLevels);
    setHasChanges(false);
  };

  const getSelectedUserLevel = () => {
    return userLevels.find(level => level.id === selectedUserLevel);
  };

  const getSectionForUserLevel = (sectionId: string) => {
    const userLevel = getSelectedUserLevel();
    return userLevel?.sections.includes(sectionId) || false;
  };

  const getFieldForUserLevel = (fieldId: string) => {
    const userLevel = getSelectedUserLevel();
    return userLevel?.fields.includes(fieldId) || false;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard Customization</h2>
          <p className="text-muted-foreground">
            Control which dashboard sections are visible for different user levels
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetToDefaults}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button onClick={saveChanges} disabled={!hasChanges}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* User Level Selector */}
      <Card>
        <CardHeader>
          <CardTitle>User Level Configuration</CardTitle>
          <CardDescription>
            Select a user level to customize their dashboard experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Label htmlFor="user-level">User Level:</Label>
            <Select value={selectedUserLevel} onValueChange={setSelectedUserLevel}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {userLevels.map(level => (
                  <SelectItem key={level.id} value={level.id}>
                    <div className="flex items-center gap-2">
                      <span>{level.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {level.sections.length} sections
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {getSelectedUserLevel() && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold">{getSelectedUserLevel()?.name}</h4>
              <p className="text-sm text-muted-foreground">
                {getSelectedUserLevel()?.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dashboard Sections Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Sections</CardTitle>
          <CardDescription>
            Configure which sections are available and visible for the selected user level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="available" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="available">Available Sections</TabsTrigger>
              <TabsTrigger value="fields">Field Controls</TabsTrigger>
              <TabsTrigger value="user-level">User Level Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="available" className="space-y-4">
              <div className="grid gap-4">
                {dashboardSections.map(section => (
                  <div key={section.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {section.icon}
                        <div>
                          <div className="font-medium">{section.name}</div>
                          <div className="text-sm text-muted-foreground">{section.description}</div>
                        </div>
                      </div>
                      {section.required && (
                        <Badge variant="secondary" className="text-xs">Required</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`section-${section.id}`}
                        checked={section.enabled}
                        onCheckedChange={(enabled) => handleSectionToggle(section.id, enabled)}
                        disabled={section.required}
                      />
                      <Label htmlFor={`section-${section.id}`}>
                        {section.enabled ? 'Enabled' : 'Disabled'}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="fields" className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Configure which table fields are available globally. These controls affect all user levels.
                </AlertDescription>
              </Alert>
              
              <div className="grid gap-4">
                {dashboardFields.map(field => (
                  <div key={field.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {field.icon}
                        <div>
                          <div className="font-medium">{field.name}</div>
                          <div className="text-sm text-muted-foreground">{field.description}</div>
                          <div className="text-xs text-muted-foreground">Section: {field.sectionId}</div>
                        </div>
                      </div>
                      {field.required && (
                        <Badge variant="secondary" className="text-xs">Required</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`field-${field.id}`}
                        checked={field.enabled}
                        onCheckedChange={(enabled) => handleFieldToggle(field.id, enabled)}
                        disabled={field.required}
                      />
                      <Label htmlFor={`field-${field.id}`}>
                        {field.enabled ? 'Enabled' : 'Disabled'}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="user-level" className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Configure which sections are visible for <strong>{getSelectedUserLevel()?.name}</strong> users.
                  Only enabled sections above can be assigned to user levels.
                </AlertDescription>
              </Alert>
              
              <div className="grid gap-4">
                {dashboardSections
                  .filter(section => section.enabled)
                  .map(section => (
                    <div key={section.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-3">
                        {section.icon}
                        <div>
                          <div className="font-medium">{section.name}</div>
                          <div className="text-sm text-muted-foreground">{section.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          id={`user-level-${section.id}`}
                          checked={getSectionForUserLevel(section.id)}
                          onCheckedChange={(enabled) => 
                            handleUserLevelSectionToggle(selectedUserLevel, section.id, enabled)
                          }
                        />
                        <Label htmlFor={`user-level-${section.id}`}>
                          {getSectionForUserLevel(section.id) ? (
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              Visible
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <EyeOff className="h-3 w-3" />
                              Hidden
                            </div>
                          )}
                        </Label>
                      </div>
                    </div>
                  ))}
                
                {/* Field-level controls for the selected user level */}
                <div className="mt-6">
                  <h4 className="font-semibold mb-4">Table Field Controls</h4>
                  <div className="grid gap-3">
                    {dashboardFields
                      .filter(field => field.enabled)
                      .map(field => (
                        <div key={field.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
                          <div className="flex items-center gap-3">
                            {field.icon}
                            <div>
                              <div className="font-medium text-sm">{field.name}</div>
                              <div className="text-xs text-muted-foreground">{field.description}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              id={`user-level-field-${field.id}`}
                              checked={getFieldForUserLevel(field.id)}
                              onCheckedChange={(enabled) => 
                                handleUserLevelFieldToggle(selectedUserLevel, field.id, enabled)
                              }
                            />
                            <Label htmlFor={`user-level-field-${field.id}`} className="text-sm">
                              {getFieldForUserLevel(field.id) ? 'Visible' : 'Hidden'}
                            </Label>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>
            Preview of the dashboard for {getSelectedUserLevel()?.name} users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {dashboardSections
              .filter(section => section.enabled && getSectionForUserLevel(section.id))
              .map(section => (
                <div key={section.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  {section.icon}
                  <span className="font-medium">{section.name}</span>
                  <CheckCircle className="h-4 w-4 text-success ml-auto" />
                </div>
              ))}
            
            {dashboardSections
              .filter(section => section.enabled && !getSectionForUserLevel(section.id))
              .map(section => (
                <div key={section.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg opacity-50">
                  {section.icon}
                  <span className="font-medium">{section.name}</span>
                  <EyeOff className="h-4 w-4 text-muted-foreground ml-auto" />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Changes Alert */}
      {hasChanges && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription>
            You have unsaved changes. Click "Save Changes" to apply your configuration.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
} 