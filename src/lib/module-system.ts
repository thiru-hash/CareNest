export interface ModuleConfig {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  dependencies: string[];
  routes: ModuleRoute[];
  components: ModuleComponent[];
  hooks: ModuleHook[];
  permissions: ModulePermissions;
  settings: ModuleSettings;
  data: Record<string, any>;
}

export interface ModuleRoute {
  path: string;
  component: string;
  permissions: string[];
  layout?: string;
  metadata?: Record<string, any>;
}

export interface ModuleComponent {
  id: string;
  name: string;
  type: 'page' | 'component' | 'dialog' | 'form';
  permissions: string[];
  dependencies: string[];
}

export interface ModuleHook {
  id: string;
  name: string;
  type: 'before' | 'after' | 'error';
  permissions: string[];
}

export interface ModulePermissions {
  view: string[];
  create: string[];
  edit: string[];
  delete: string[];
  admin: string[];
}

export interface ModuleSettings {
  enabled: boolean;
  autoLoad: boolean;
  isolated: boolean; // Prevents interference with other modules
  versioning: boolean;
  backup: boolean;
}

class ModuleSystem {
  private modules: Map<string, ModuleConfig> = new Map();
  private moduleInstances: Map<string, any> = new Map();
  private hooks: Map<string, Function[]> = new Map();
  private isolationLayers: Map<string, Set<string>> = new Map();

  // Register a new module
  registerModule(module: ModuleConfig): void {
    // Validate module isolation
    if (module.settings.isolated) {
      this.createIsolationLayer(module.id);
    }

    // Check for conflicts with existing modules
    const conflicts = this.checkModuleConflicts(module);
    if (conflicts.length > 0) {
      throw new Error(`Module ${module.id} has conflicts: ${conflicts.join(', ')}`);
    }

    this.modules.set(module.id, module);
    console.log(`Module registered: ${module.name} v${module.version}`);
  }

  // Unregister a module
  unregisterModule(moduleId: string): void {
    const module = this.modules.get(moduleId);
    if (!module) return;

    // Clean up isolation layer
    if (module.settings.isolated) {
      this.removeIsolationLayer(moduleId);
    }

    // Remove module instance
    this.moduleInstances.delete(moduleId);

    // Clean up hooks
    this.hooks.forEach((hooks, hookName) => {
      this.hooks.set(hookName, hooks.filter(hook => !hook.toString().includes(moduleId)));
    });

    this.modules.delete(moduleId);
    console.log(`Module unregistered: ${moduleId}`);
  }

  // Get module configuration
  getModule(moduleId: string): ModuleConfig | undefined {
    return this.modules.get(moduleId);
  }

  // Get all modules
  getAllModules(): ModuleConfig[] {
    return Array.from(this.modules.values());
  }

  // Get enabled modules
  getEnabledModules(): ModuleConfig[] {
    return Array.from(this.modules.values()).filter(module => module.settings.enabled);
  }

  // Get isolated modules
  getIsolatedModules(): ModuleConfig[] {
    return Array.from(this.modules.values()).filter(module => module.settings.isolated);
  }

  // Create isolation layer for a module
  private createIsolationLayer(moduleId: string): void {
    const isolationLayer = new Set<string>();
    isolationLayer.add(moduleId);
    this.isolationLayers.set(moduleId, isolationLayer);
  }

  // Remove isolation layer
  private removeIsolationLayer(moduleId: string): void {
    this.isolationLayers.delete(moduleId);
  }

  // Check if module is isolated
  isModuleIsolated(moduleId: string): boolean {
    return this.isolationLayers.has(moduleId);
  }

  // Check for module conflicts
  private checkModuleConflicts(newModule: ModuleConfig): string[] {
    const conflicts: string[] = [];

    this.modules.forEach((existingModule, existingId) => {
      // Check route conflicts
      newModule.routes.forEach(newRoute => {
        existingModule.routes.forEach(existingRoute => {
          if (newRoute.path === existingRoute.path) {
            conflicts.push(`Route conflict: ${newRoute.path}`);
          }
        });
      });

      // Check component conflicts
      newModule.components.forEach(newComponent => {
        existingModule.components.forEach(existingComponent => {
          if (newComponent.id === existingComponent.id) {
            conflicts.push(`Component conflict: ${newComponent.id}`);
          }
        });
      });
    });

    return conflicts;
  }

  // Load module instance
  loadModuleInstance(moduleId: string, instance: any): void {
    this.moduleInstances.set(moduleId, instance);
  }

  // Get module instance
  getModuleInstance(moduleId: string): any {
    return this.moduleInstances.get(moduleId);
  }

  // Register hook
  registerHook(hookName: string, callback: Function, moduleId?: string): void {
    if (!this.hooks.has(hookName)) {
      this.hooks.set(hookName, []);
    }

    const hook = moduleId ? 
      (...args: any[]) => {
        try {
          return callback(...args);
        } catch (error) {
          console.error(`Hook error in module ${moduleId}:`, error);
          return null;
        }
      } : callback;

    this.hooks.get(hookName)!.push(hook);
  }

  // Unregister hook
  unregisterHook(hookName: string, callback: Function): void {
    const hooks = this.hooks.get(hookName);
    if (hooks) {
      const index = hooks.indexOf(callback);
      if (index > -1) {
        hooks.splice(index, 1);
      }
    }
  }

  // Call hooks
  callHook(hookName: string, ...args: any[]): any[] {
    const hooks = this.hooks.get(hookName) || [];
    return hooks.map(hook => hook(...args));
  }

  // Get module routes
  getModuleRoutes(moduleId: string): ModuleRoute[] {
    const module = this.modules.get(moduleId);
    return module?.routes || [];
  }

  // Get all routes
  getAllRoutes(): ModuleRoute[] {
    const routes: ModuleRoute[] = [];
    this.modules.forEach(module => {
      routes.push(...module.routes);
    });
    return routes;
  }

  // Get module components
  getModuleComponents(moduleId: string): ModuleComponent[] {
    const module = this.modules.get(moduleId);
    return module?.components || [];
  }

  // Get all components
  getAllComponents(): ModuleComponent[] {
    const components: ModuleComponent[] = [];
    this.modules.forEach(module => {
      components.push(...module.components);
    });
    return components;
  }

  // Check module permissions
  checkModulePermission(moduleId: string, action: string, userRole: string): boolean {
    const module = this.modules.get(moduleId);
    if (!module) return false;

    const permissions = module.permissions[action as keyof ModulePermissions];
    return permissions?.includes(userRole) || permissions?.includes('*') || false;
  }

  // Update module settings
  updateModuleSettings(moduleId: string, settings: Partial<ModuleSettings>): void {
    const module = this.modules.get(moduleId);
    if (module) {
      module.settings = { ...module.settings, ...settings };
    }
  }

  // Get module dependencies
  getModuleDependencies(moduleId: string): string[] {
    const module = this.modules.get(moduleId);
    return module?.dependencies || [];
  }

  // Get modules that depend on this module
  getModuleDependents(moduleId: string): string[] {
    const dependents: string[] = [];
    this.modules.forEach((module, id) => {
      if (module.dependencies.includes(moduleId)) {
        dependents.push(id);
      }
    });
    return dependents;
  }

  // Validate module dependencies
  validateModuleDependencies(moduleId: string): string[] {
    const module = this.modules.get(moduleId);
    if (!module) return ['Module not found'];

    const missingDeps: string[] = [];
    module.dependencies.forEach(depId => {
      if (!this.modules.has(depId)) {
        missingDeps.push(depId);
      }
    });

    return missingDeps;
  }

  // Get module statistics
  getModuleStats() {
    return {
      totalModules: this.modules.size,
      enabledModules: this.getEnabledModules().length,
      isolatedModules: this.getIsolatedModules().length,
      totalRoutes: this.getAllRoutes().length,
      totalComponents: this.getAllComponents().length,
      totalHooks: this.hooks.size
    };
  }

  // Backup module data
  backupModuleData(moduleId: string): any {
    const module = this.modules.get(moduleId);
    const instance = this.moduleInstances.get(moduleId);
    
    return {
      config: module,
      instance: instance,
      timestamp: new Date().toISOString()
    };
  }

  // Restore module data
  restoreModuleData(moduleId: string, backup: any): void {
    if (backup.config) {
      this.modules.set(moduleId, backup.config);
    }
    if (backup.instance) {
      this.moduleInstances.set(moduleId, backup.instance);
    }
  }
}

// Create singleton instance
export const moduleSystem = new ModuleSystem();

// Utility functions for module creation
export const createModule = (config: Partial<ModuleConfig>): ModuleConfig => {
  return {
    id: '',
    name: '',
    version: '1.0.0',
    description: '',
    author: '',
    dependencies: [],
    routes: [],
    components: [],
    hooks: [],
    permissions: {
      view: ['*'],
      create: ['*'],
      edit: ['*'],
      delete: ['*'],
      admin: ['*']
    },
    settings: {
      enabled: true,
      autoLoad: true,
      isolated: true, // Default to isolated
      versioning: true,
      backup: true
    },
    data: {},
    ...config
  };
};

// Module isolation utilities
export const createIsolatedModule = (config: Partial<ModuleConfig>): ModuleConfig => {
  return createModule({
    ...config,
    settings: {
      ...config.settings,
      isolated: true
    }
  });
};

// Module validation
export const validateModule = (module: ModuleConfig): string[] => {
  const errors: string[] = [];

  if (!module.id) errors.push('Module ID is required');
  if (!module.name) errors.push('Module name is required');
  if (!module.version) errors.push('Module version is required');

  // Check for circular dependencies
  const checkCircularDeps = (moduleId: string, visited: Set<string> = new Set()): boolean => {
    if (visited.has(moduleId)) return true;
    visited.add(moduleId);

    const module = moduleSystem.getModule(moduleId);
    if (!module) return false;

    for (const dep of module.dependencies) {
      if (checkCircularDeps(dep, new Set(visited))) {
        return true;
      }
    }
    return false;
  };

  if (checkCircularDeps(module.id)) {
    errors.push('Circular dependency detected');
  }

  return errors;
}; 