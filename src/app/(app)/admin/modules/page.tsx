'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Puzzle, 
  Settings, 
  Shield, 
  Activity,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Zap,
  Lock,
  Unlock,
  Database,
  Code
} from 'lucide-react';
import { moduleSystem } from '@/lib/module-system';
import { registerPeopleModule, unregisterPeopleModule } from '@/modules/people';
import { registerFinanceModule, unregisterFinanceModule } from '@/modules/finance';
import { Label } from '@/components/ui/label';

interface ModuleInfo {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  status: 'active' | 'inactive' | 'error';
  isolated: boolean;
  dependencies: string[];
  routes: number;
  components: number;
  hooks: number;
  lastBackup?: Date;
  dataSize?: number;
}

export default function ModuleManagementPage() {
  const [modules, setModules] = useState<ModuleInfo[]>([]);
  const [selectedModule, setSelectedModule] = useState<ModuleInfo | null>(null);
  const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false);

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = () => {
    const allModules = moduleSystem.getAllModules();
    const moduleInfos: ModuleInfo[] = allModules.map(module => ({
      id: module.id,
      name: module.name,
      version: module.version,
      description: module.description,
      author: module.author,
      status: module.settings.enabled ? 'active' : 'inactive',
      isolated: module.settings.isolated,
      dependencies: module.dependencies,
      routes: module.routes.length,
      components: module.components.length,
      hooks: module.hooks.length,
      lastBackup: new Date(), // Mock data
      dataSize: Math.floor(Math.random() * 1000) + 100 // Mock data
    }));

    setModules(moduleInfos);
  };

  const toggleModule = (moduleId: string) => {
    const module = moduleSystem.getModule(moduleId);
    if (module) {
      const newEnabled = !module.settings.enabled;
      moduleSystem.updateModuleSettings(moduleId, { enabled: newEnabled });
      loadModules();
    }
  };

  const backupModule = (moduleId: string) => {
    const instance = moduleSystem.getModuleInstance(moduleId);
    if (instance && typeof instance.exportData === 'function') {
      const backup = instance.exportData();
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${moduleId}-backup.json`;
      a.click();
    }
  };

  const restoreModule = (moduleId: string, backupData: any) => {
    const instance = moduleSystem.getModuleInstance(moduleId);
    if (instance && typeof instance.importData === 'function') {
      instance.importData(backupData);
      console.log(`Module ${moduleId} restored from backup`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getIsolationColor = (isolated: boolean) => {
    return isolated ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Module Management</h1>
          <p className="text-muted-foreground">
            Manage isolated modules and their configurations
          </p>
        </div>
        <Button onClick={() => {
          // Register demo modules
          registerPeopleModule();
          registerFinanceModule();
          loadModules();
        }}>
          <Puzzle className="h-4 w-4 mr-2" />
          Load Demo Modules
        </Button>
      </div>

      {/* Module Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Puzzle className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total Modules</p>
                <p className="text-2xl font-bold">{modules.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Isolated Modules</p>
                <p className="text-2xl font-bold">
                  {modules.filter(m => m.isolated).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Active Modules</p>
                <p className="text-2xl font-bold">
                  {modules.filter(m => m.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Code className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Total Components</p>
                <p className="text-2xl font-bold">
                  {modules.reduce((sum, m) => sum + m.components, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modules Table */}
      <Card>
        <CardHeader>
          <CardTitle>Module Registry</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Module</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Isolation</TableHead>
                <TableHead>Dependencies</TableHead>
                <TableHead>Components</TableHead>
                <TableHead>Last Backup</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modules.map((module) => (
                <TableRow key={module.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{module.name}</div>
                      <div className="text-sm text-muted-foreground">
                        v{module.version} by {module.author}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {module.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(module.status)}>
                      {module.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getIsolationColor(module.isolated)}>
                      {module.isolated ? (
                        <>
                          <Lock className="h-3 w-3 mr-1" />
                          Isolated
                        </>
                      ) : (
                        <>
                          <Unlock className="h-3 w-3 mr-1" />
                          Shared
                        </>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {module.dependencies.length > 0 ? (
                        <div className="space-y-1">
                          {module.dependencies.map(dep => (
                            <Badge key={dep} variant="outline" className="text-xs">
                              {dep}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm space-y-1">
                      <div>Routes: {module.routes}</div>
                      <div>Components: {module.components}</div>
                      <div>Hooks: {module.hooks}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {module.lastBackup ? (
                        module.lastBackup.toLocaleDateString()
                      ) : (
                        'Never'
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedModule(module)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => backupModule(module.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Switch
                        checked={module.status === 'active'}
                        onCheckedChange={() => toggleModule(module.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Module Details Dialog */}
      {selectedModule && (
        <Dialog open={!!selectedModule} onOpenChange={() => setSelectedModule(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedModule.name} - Module Details</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="components">Components</TabsTrigger>
                <TabsTrigger value="routes">Routes</TabsTrigger>
                <TabsTrigger value="hooks">Hooks</TabsTrigger>
                <TabsTrigger value="backup">Backup</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Module ID</Label>
                    <p className="text-sm text-muted-foreground">{selectedModule.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Version</Label>
                    <p className="text-sm text-muted-foreground">{selectedModule.version}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Author</Label>
                    <p className="text-sm text-muted-foreground">{selectedModule.author}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <Badge className={getStatusColor(selectedModule.status)}>
                      {selectedModule.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Isolation</Label>
                    <Badge className={getIsolationColor(selectedModule.isolated)}>
                      {selectedModule.isolated ? 'Isolated' : 'Shared'}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Data Size</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedModule.dataSize} KB
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground">{selectedModule.description}</p>
                </div>
              </TabsContent>

              <TabsContent value="components" className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Module Components</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Array.from({ length: selectedModule.components }, (_, i) => (
                      <div key={i} className="p-2 border rounded">
                        <div className="font-medium">Component {i + 1}</div>
                        <div className="text-sm text-muted-foreground">
                          Type: Component
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="routes" className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Module Routes</h4>
                  <div className="space-y-2">
                    {Array.from({ length: selectedModule.routes }, (_, i) => (
                      <div key={i} className="p-2 border rounded">
                        <div className="font-medium">Route {i + 1}</div>
                        <div className="text-sm text-muted-foreground">
                          Path: /{selectedModule.id}/route-{i + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="hooks" className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Module Hooks</h4>
                  <div className="space-y-2">
                    {Array.from({ length: selectedModule.hooks }, (_, i) => (
                      <div key={i} className="p-2 border rounded">
                        <div className="font-medium">Hook {i + 1}</div>
                        <div className="text-sm text-muted-foreground">
                          Type: Event Handler
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="backup" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Backup & Restore</h4>
                    <p className="text-sm text-muted-foreground">
                      Manage module data backups and restoration
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => backupModule(selectedModule.id)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Create Backup
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsBackupDialogOpen(true)}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Restore from Backup
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Last backup: {selectedModule.lastBackup?.toLocaleString() || 'Never'}</p>
                    <p>Data size: {selectedModule.dataSize} KB</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 