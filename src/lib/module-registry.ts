// ===== MODULE REGISTRY SYSTEM =====
// This system manages all modules, their configurations, and role-based access

import type { ModuleConfig, UserRole } from '@/lib/types';
import { CORE_MODULES, PLATFORM_MODULES, ROLE_MODULE_ACCESS } from '@/modules';

export interface Module {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  dependencies: string[];
  permissions: {
    view: string[];
    create: string[];
    edit: string[];
    delete: string[];
  };
  settings: {
    enabled: boolean;
    autoLoad: boolean;
    requiresApproval: boolean;
  };
  components: {
    [key: string]: React.ComponentType<any>;
  };
  hooks: {
    [key: string]: (...args: any[]) => any;
  };
  routes: {
    path: string;
    component: React.ComponentType<any>;
    permissions: string[];
  }[];
  data: {
    [key: string]: any;
  };
}

export interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  type: 'feature' | 'integration' | 'theme' | 'widget';
  dependencies: string[];
  permissions: string[];
  settings: Record<string, any>;
  enabled: boolean;
  installed: boolean;
}

class ModuleRegistry {
  private modules: Map<string, Module> = new Map();
  private plugins: Map<string, Plugin> = new Map();
  private hooks: Map<string, Function[]> = new Map();

  // Module Management
  registerModule(module: Module): void {
    // Validate dependencies
    const missingDeps = module.dependencies.filter(dep => !this.modules.has(dep));
    if (missingDeps.length > 0) {
      throw new Error(`Module ${module.id} has missing dependencies: ${missingDeps.join(', ')}`);
    }

    this.modules.set(module.id, module);
    console.log(`Module registered: ${module.name} v${module.version}`);
  }

  unregisterModule(moduleId: string): void {
    // Check if other modules depend on this one
    const dependents = Array.from(this.modules.values()).filter(
      module => module.dependencies.includes(moduleId)
    );

    if (dependents.length > 0) {
      throw new Error(
        `Cannot unregister module ${moduleId}. Other modules depend on it: ${dependents.map(m => m.name).join(', ')}`
      );
    }

    this.modules.delete(moduleId);
    console.log(`Module unregistered: ${moduleId}`);
  }

  getModule(moduleId: string): Module | undefined {
    return this.modules.get(moduleId);
  }

  getAllModules(): Module[] {
    return Array.from(this.modules.values());
  }

  getEnabledModules(): Module[] {
    return Array.from(this.modules.values()).filter(module => module.settings.enabled);
  }

  // Plugin Management
  registerPlugin(plugin: Plugin): void {
    this.plugins.set(plugin.id, plugin);
    console.log(`Plugin registered: ${plugin.name} v${plugin.version}`);
  }

  unregisterPlugin(pluginId: string): void {
    this.plugins.delete(pluginId);
    console.log(`Plugin unregistered: ${pluginId}`);
  }

  getPlugin(pluginId: string): Plugin | undefined {
    return this.plugins.get(pluginId);
  }

  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  getEnabledPlugins(): Plugin[] {
    return Array.from(this.plugins.values()).filter(plugin => plugin.enabled);
  }

  // Component Management
  getComponent(moduleId: string, componentName: string): React.ComponentType<any> | undefined {
    const module = this.modules.get(moduleId);
    return module?.components[componentName];
  }

  getComponentsByType(type: string): React.ComponentType<any>[] {
    const components: React.ComponentType<any>[] = [];
    
    this.modules.forEach(module => {
      Object.entries(module.components).forEach(([name, component]) => {
        if (name.includes(type)) {
          components.push(component);
        }
      });
    });

    return components;
  }

  // Hook Management
  registerHook(hookName: string, callback: Function): void {
    if (!this.hooks.has(hookName)) {
      this.hooks.set(hookName, []);
    }
    this.hooks.get(hookName)!.push(callback);
  }

  unregisterHook(hookName: string, callback: Function): void {
    const hooks = this.hooks.get(hookName);
    if (hooks) {
      const index = hooks.indexOf(callback);
      if (index > -1) {
        hooks.splice(index, 1);
      }
    }
  }

  callHook(hookName: string, ...args: any[]): any[] {
    const hooks = this.hooks.get(hookName) || [];
    return hooks.map(hook => hook(...args));
  }

  // Route Management
  getRoutes(): { path: string; component: React.ComponentType<any>; permissions: string[] }[] {
    const routes: { path: string; component: React.ComponentType<any>; permissions: string[] }[] = [];
    
    this.modules.forEach(module => {
      routes.push(...module.routes);
    });

    return routes;
  }

  // Data Management
  getModuleData(moduleId: string, key: string): any {
    const module = this.modules.get(moduleId);
    return module?.data[key];
  }

  setModuleData(moduleId: string, key: string, value: any): void {
    const module = this.modules.get(moduleId);
    if (module) {
      module.data[key] = value;
    }
  }

  // Permission Management
  checkPermission(moduleId: string, action: string, userRole: string): boolean {
    const module = this.modules.get(moduleId);
    if (!module) return false;

    const permissions = module.permissions[action as keyof typeof module.permissions];
    return permissions?.includes(userRole) || permissions?.includes('*') || false;
  }

  // Module Lifecycle
  async loadModule(moduleId: string): Promise<void> {
    const module = this.modules.get(moduleId);
    if (!module) {
      throw new Error(`Module ${moduleId} not found`);
    }

    if (!module.settings.enabled) {
      throw new Error(`Module ${moduleId} is disabled`);
    }

    // Call module load hook
    this.callHook('module:load', module);

    console.log(`Module loaded: ${module.name}`);
  }

  async unloadModule(moduleId: string): Promise<void> {
    const module = this.modules.get(moduleId);
    if (!module) return;

    // Call module unload hook
    this.callHook('module:unload', module);

    console.log(`Module unloaded: ${module.name}`);
  }

  // Plugin Lifecycle
  async installPlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`);
    }

    // Check dependencies
    const missingDeps = plugin.dependencies.filter(dep => !this.modules.has(dep));
    if (missingDeps.length > 0) {
      throw new Error(`Plugin ${pluginId} has missing dependencies: ${missingDeps.join(', ')}`);
    }

    plugin.installed = true;
    this.callHook('plugin:install', plugin);

    console.log(`Plugin installed: ${plugin.name}`);
  }

  async uninstallPlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) return;

    plugin.installed = false;
    this.callHook('plugin:uninstall', plugin);

    console.log(`Plugin uninstalled: ${plugin.name}`);
  }

  // Validation
  validateModule(module: Module): string[] {
    const errors: string[] = [];

    if (!module.id) errors.push('Module ID is required');
    if (!module.name) errors.push('Module name is required');
    if (!module.version) errors.push('Module version is required');
    if (!module.author) errors.push('Module author is required');

    // Check for circular dependencies
    const visited = new Set<string>();
    const checkCircular = (moduleId: string, path: string[] = []): boolean => {
      if (path.includes(moduleId)) {
        errors.push(`Circular dependency detected: ${path.join(' -> ')} -> ${moduleId}`);
        return true;
      }

      if (visited.has(moduleId)) return false;
      visited.add(moduleId);

      const module = this.modules.get(moduleId);
      if (!module) return false;

      for (const dep of module.dependencies) {
        if (checkCircular(dep, [...path, moduleId])) {
          return true;
        }
      }

      return false;
    };

    checkCircular(module.id);

    return errors;
  }

  // Utility Methods
  getModuleDependencies(moduleId: string): Module[] {
    const module = this.modules.get(moduleId);
    if (!module) return [];

    return module.dependencies
      .map(depId => this.modules.get(depId))
      .filter(Boolean) as Module[];
  }

  getModuleDependents(moduleId: string): Module[] {
    return Array.from(this.modules.values()).filter(
      module => module.dependencies.includes(moduleId)
    );
  }

  // Statistics
  getStats() {
    return {
      totalModules: this.modules.size,
      enabledModules: this.getEnabledModules().length,
      totalPlugins: this.plugins.size,
      enabledPlugins: this.getEnabledPlugins().length,
      totalHooks: this.hooks.size,
      totalComponents: Array.from(this.modules.values()).reduce(
        (total, module) => total + Object.keys(module.components).length, 0
      )
    };
  }
}

// Create singleton instance
export const moduleRegistry = new ModuleRegistry();

// Export types for external use
export type { Module, Plugin };

// Utility functions
export const createModule = (config: Partial<Module>): Module => {
  return {
    id: '',
    name: '',
    description: '',
    version: '1.0.0',
    author: '',
    dependencies: [],
    permissions: {
      view: ['*'],
      create: ['*'],
      edit: ['*'],
      delete: ['*']
    },
    settings: {
      enabled: true,
      autoLoad: true,
      requiresApproval: false
    },
    components: {},
    hooks: {},
    routes: [],
    data: {},
    ...config
  };
};

export const createPlugin = (config: Partial<Plugin>): Plugin => {
  return {
    id: '',
    name: '',
    description: '',
    version: '1.0.0',
    author: '',
    type: 'feature',
    dependencies: [],
    permissions: [],
    settings: {},
    enabled: true,
    installed: false,
    ...config
  };
}; 