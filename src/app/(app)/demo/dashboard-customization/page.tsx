'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  ArrowRight,
  Info
} from "lucide-react";
import { useDashboardConfig } from '@/lib/hooks/useDashboardConfig';

export default function DashboardCustomizationDemo() {
  const { 
    config, 
    currentUserLevel, 
    setUserLevel, 
    isSectionVisible,
    updateSectionConfig,
    addSectionToUserLevel,
    removeSectionFromUserLevel
  } = useDashboardConfig();

  const [selectedUserLevel, setSelectedUserLevel] = useState(currentUserLevel);

  const userLevels = [
    { id: 'admin', name: 'System Admin', description: 'Full system access and control' },
    { id: 'client-admin', name: 'Client IT Admin', description: 'Client organization management' },
    { id: 'manager', name: 'Manager', description: 'Team and shift management' },
    { id: 'caregiver', name: 'Caregiver', description: 'Direct care staff' },
    { id: 'coordinator', name: 'Coordinator', description: 'Shift coordination and scheduling' }
  ];

  const dashboardSections = [
    { id: 'my-shifts', name: 'My Shifts', icon: <Calendar className="h-4 w-4" />, required: true },
    { id: 'open-shifts', name: 'Open Shifts', icon: <Users className="h-4 w-4" />, required: false },
    { id: 'compliance', name: 'Compliance & Training', icon: <UserCheck className="h-4 w-4" />, required: false },
    { id: 'analytics', name: 'Analytics & Reports', icon: <LayoutDashboard className="h-4 w-4" />, required: false },
    { id: 'notifications', name: 'Notifications Center', icon: <AlertTriangle className="h-4 w-4" />, required: false }
  ];

  const handleUserLevelChange = (userLevelId: string) => {
    setSelectedUserLevel(userLevelId);
    setUserLevel(userLevelId);
  };

  const handleSectionToggle = (sectionId: string, enabled: boolean) => {
    if (enabled) {
      addSectionToUserLevel(selectedUserLevel, sectionId);
    } else {
      removeSectionFromUserLevel(selectedUserLevel, sectionId);
    }
  };

  const getCurrentUserLevel = () => {
    return userLevels.find(level => level.id === selectedUserLevel);
  };

  const getVisibleSectionsForLevel = (userLevelId: string) => {
    const userLevel = config.userLevels.find(level => level.id === userLevelId);
    return userLevel?.sections || [];
  };

  return (
    <div className="min-h-screen bg-muted py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Dashboard Customization Demo</h1>
          <p className="text-xl text-muted-foreground">
            See how Client IT Admins can customize dashboard contents for different user levels
          </p>
        </div>

        {/* User Level Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Test Different User Levels
            </CardTitle>
            <CardDescription>
              Select a user level to see how the dashboard changes for different roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Label htmlFor="user-level">Current User Level:</Label>
              <Select value={selectedUserLevel} onValueChange={handleUserLevelChange}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {userLevels.map(level => (
                    <SelectItem key={level.id} value={level.id}>
                      <div className="flex items-center gap-2">
                        <span>{level.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {getVisibleSectionsForLevel(level.id).length} sections
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {getCurrentUserLevel() && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold">{getCurrentUserLevel()?.name}</h4>
                <p className="text-sm text-muted-foreground">{getCurrentUserLevel()?.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Configuration</CardTitle>
              <CardDescription>
                Configure which sections are visible for the selected user level
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  This simulates the settings panel that Client IT Admins would use to customize dashboards.
                </AlertDescription>
              </Alert>
              
              {dashboardSections.map(section => {
                const isVisible = getVisibleSectionsForLevel(selectedUserLevel).includes(section.id);
                const isEnabled = config.dashboardSections.find(s => s.id === section.id)?.enabled;
                
                return (
                  <div key={section.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      {section.icon}
                      <div>
                        <div className="font-medium">{section.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {section.required ? 'Required' : 'Optional'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={isVisible}
                        onCheckedChange={(enabled) => handleSectionToggle(section.id, enabled)}
                        disabled={section.required || !isEnabled}
                      />
                      <Label>
                        {isVisible ? (
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
                );
              })}
            </CardContent>
          </Card>

          {/* Dashboard Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Preview</CardTitle>
              <CardDescription>
                Preview of how the dashboard looks for the selected user level
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Dashboard Sections</h3>
                <div className="space-y-2">
                  {dashboardSections.map(section => {
                    const isVisible = getVisibleSectionsForLevel(selectedUserLevel).includes(section.id);
                    const isEnabled = config.dashboardSections.find(s => s.id === section.id)?.enabled;
                    
                    if (!isEnabled) return null;
                    
                    return (
                      <div 
                        key={section.id} 
                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                          isVisible 
                            ? 'bg-white border-gray-200' 
                            : 'bg-gray-50 border-gray-100 opacity-50'
                        }`}
                      >
                        {section.icon}
                        <span className="font-medium">{section.name}</span>
                        {isVisible ? (
                          <CheckCircle className="h-4 w-4 text-success ml-auto" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-muted-foreground ml-auto" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">How it works:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Client IT Admins can access System Settings → Dashboard tab</li>
                  <li>• They can enable/disable dashboard sections globally</li>
                  <li>• They can assign sections to specific user levels</li>
                  <li>• Changes apply immediately to all users of that level</li>
                  <li>• Required sections (like My Shifts) cannot be disabled</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Dashboard Link */}
        <Card>
          <CardHeader>
            <CardTitle>Test the Live Dashboard</CardTitle>
            <CardDescription>
              Go to the actual dashboard to see the changes in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Current User Level: {getCurrentUserLevel()?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {getVisibleSectionsForLevel(selectedUserLevel).length} sections visible
                </p>
              </div>
              <Button asChild>
                <a href="/dashboard">
                  View Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 