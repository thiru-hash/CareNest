import type { ModuleConfig, TabConfig, Tenant } from './types';

// ===== MODULE REGISTRY =====

export interface ModuleRegistry {
  [moduleId: string]: ModuleConfig;
}

export interface TabRegistry {
  [tabId: string]: TabConfig;
}

// ===== MODULE DEFINITIONS =====

export const MODULE_REGISTRY: ModuleRegistry = {
  'dashboard': {
    id: 'dashboard',
    name: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    isEnabled: true,
    permissions: ['view_dashboard'],
    dependencies: [],
    settings: {
      showComplianceAlerts: true,
      showFinanceOverview: true,
      showUpcomingShifts: true,
      refreshInterval: 300000 // 5 minutes
    }
  },
  'roster': {
    id: 'roster',
    name: 'Roster Schedule',
    path: '/roster',
    icon: 'Calendar',
    isEnabled: true,
    permissions: ['view_roster'],
    dependencies: ['people'],
    settings: {
      allowShiftCreation: true,
      allowShiftEditing: true,
      allowShiftDeletion: true,
      showConflictWarnings: true,
      defaultShiftDuration: 8
    }
  },
  'people': {
    id: 'people',
    name: 'People',
    path: '/people',
    icon: 'Users',
    isEnabled: true,
    permissions: ['view_people'],
    dependencies: [],
    settings: {
      showPersonalDetails: true,
      showEmploymentDetails: true,
      showHRDetails: true,
      allowProfileEditing: true,
      allowDocumentUpload: true
    }
  },
  'finance': {
    id: 'finance',
    name: 'Finance',
    path: '/finance',
    icon: 'DollarSign',
    isEnabled: true,
    permissions: ['view_finance'],
    dependencies: ['people'],
    settings: {
      showClientExpenses: true,
      showOrganizationalExpenses: true,
      allowTransactionCreation: true,
      gstEnabled: true,
      currency: 'NZD'
    }
  },
  'locations': {
    id: 'locations',
    name: 'Locations',
    path: '/locations',
    icon: 'MapPin',
    isEnabled: true,
    permissions: ['view_locations'],
    dependencies: [],
    settings: {
      allowLocationCreation: true,
      allowLocationEditing: true,
      showLocationDetails: true
    }
  },
  'settings': {
    id: 'settings',
    name: 'Settings',
    path: '/settings',
    icon: 'Settings',
    isEnabled: true,
    permissions: ['view_settings'],
    dependencies: [],
    settings: {
      allowSystemConfiguration: true,
      allowUserManagement: true,
      allowFormBuilder: true,
      allowGroupManagement: true
    }
  }
};

export const TAB_REGISTRY: TabRegistry = {
  // Dashboard Tabs
  'dashboard-overview': {
    id: 'dashboard-overview',
    moduleId: 'dashboard',
    name: 'Overview',
    path: '/dashboard',
    isEnabled: true,
    permissions: ['view_dashboard'],
    order: 1
  },
  
  // Roster Tabs
  'roster-calendar': {
    id: 'roster-calendar',
    moduleId: 'roster',
    name: 'Calendar',
    path: '/roster',
    isEnabled: true,
    permissions: ['view_roster'],
    order: 1
  },
  'roster-list': {
    id: 'roster-list',
    moduleId: 'roster',
    name: 'List View',
    path: '/roster/list',
    isEnabled: true,
    permissions: ['view_roster'],
    order: 2
  },
  
  // People Tabs
  'people-staff': {
    id: 'people-staff',
    moduleId: 'people',
    name: 'Staff',
    path: '/people',
    isEnabled: true,
    permissions: ['view_people'],
    order: 1
  },
  'people-clients': {
    id: 'people-clients',
    moduleId: 'people',
    name: 'Clients',
    path: '/people/clients',
    isEnabled: true,
    permissions: ['view_people'],
    order: 2
  },
  
  // Finance Tabs
  'finance-client': {
    id: 'finance-client',
    moduleId: 'finance',
    name: 'Client Expenses',
    path: '/finance/client',
    isEnabled: true,
    permissions: ['view_finance'],
    order: 1
  },
  'finance-organizational': {
    id: 'finance-organizational',
    moduleId: 'finance',
    name: 'Organizational',
    path: '/finance/organisational',
    isEnabled: true,
    permissions: ['view_finance'],
    order: 2
  },
  
  // Settings Tabs
  'settings-general': {
    id: 'settings-general',
    moduleId: 'settings',
    name: 'General',
    path: '/settings',
    isEnabled: true,
    permissions: ['view_settings'],
    order: 1
  },
  'settings-users': {
    id: 'settings-users',
    moduleId: 'settings',
    name: 'Users',
    path: '/settings/users',
    isEnabled: true,
    permissions: ['view_settings'],
    order: 2
  },
  'settings-forms': {
    id: 'settings-forms',
    moduleId: 'settings',
    name: 'Forms',
    path: '/settings/forms',
    isEnabled: true,
    permissions: ['view_settings'],
    order: 3
  }
};

// ===== MODULE MANAGEMENT =====

export class ModuleManager {
  private static instance: ModuleManager;
  private moduleRegistry: ModuleRegistry = MODULE_REGISTRY;
  private tabRegistry: TabRegistry = TAB_REGISTRY;
  private loadedModules: Set<string> = new Set();

  static getInstance(): ModuleManager {
    if (!ModuleManager.instance) {
      ModuleManager.instance = new ModuleManager();
    }
    return ModuleManager.instance;
  }

  /**
   * Gets all enabled modules for a tenant
   */
  getEnabledModules(tenant: Tenant): ModuleConfig[] {
    return Object.values(this.moduleRegistry)
      .filter(module => module.isEnabled)
      .filter(module => this.hasModulePermission(module, tenant))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Gets all enabled tabs for a specific module
   */
  getEnabledTabs(moduleId: string, tenant: Tenant): TabConfig[] {
    return Object.values(this.tabRegistry)
      .filter(tab => tab.moduleId === moduleId)
      .filter(tab => tab.isEnabled)
      .filter(tab => this.hasTabPermission(tab, tenant))
      .sort((a, b) => a.order - b.order);
  }

  /**
   * Checks if user has permission to access a module
   */
  hasModulePermission(module: ModuleConfig, tenant: Tenant): boolean {
    // In a real app, this would check user permissions against tenant settings
    return module.permissions.every(permission => 
      tenant.license.features.includes(permission) || 
      permission.startsWith('view_')
    );
  }

  /**
   * Checks if user has permission to access a tab
   */
  hasTabPermission(tab: TabConfig, tenant: Tenant): boolean {
    // In a real app, this would check user permissions against tenant settings
    return tab.permissions.every(permission => 
      tenant.license.features.includes(permission) || 
      permission.startsWith('view_')
    );
  }

  /**
   * Lazy loads a module and its dependencies
   */
  async loadModule(moduleId: string): Promise<ModuleConfig> {
    if (this.loadedModules.has(moduleId)) {
      return this.moduleRegistry[moduleId];
    }

    const module = this.moduleRegistry[moduleId];
    if (!module) {
      throw new Error(`Module ${moduleId} not found`);
    }

    // Load dependencies first
    for (const dependencyId of module.dependencies) {
      await this.loadModule(dependencyId);
    }

    // Mark module as loaded
    this.loadedModules.add(moduleId);

    return module;
  }

  /**
   * Gets module configuration
   */
  getModuleConfig(moduleId: string): ModuleConfig | null {
    return this.moduleRegistry[moduleId] || null;
  }

  /**
   * Gets tab configuration
   */
  getTabConfig(tabId: string): TabConfig | null {
    return this.tabRegistry[tabId] || null;
  }

  /**
   * Updates module settings for a tenant
   */
  updateModuleSettings(moduleId: string, settings: Record<string, any>): void {
    const module = this.moduleRegistry[moduleId];
    if (module) {
      module.settings = { ...module.settings, ...settings };
    }
  }

  /**
   * Enables/disables a module
   */
  setModuleEnabled(moduleId: string, enabled: boolean): void {
    const module = this.moduleRegistry[moduleId];
    if (module) {
      module.isEnabled = enabled;
    }
  }

  /**
   * Enables/disables a tab
   */
  setTabEnabled(tabId: string, enabled: boolean): void {
    const tab = this.tabRegistry[tabId];
    if (tab) {
      tab.isEnabled = enabled;
    }
  }
}

// ===== MODULE UTILITIES =====

export function getModuleByPath(path: string): ModuleConfig | null {
  return Object.values(MODULE_REGISTRY).find(module => 
    path.startsWith(module.path)
  ) || null;
}

export function getTabByPath(path: string): TabConfig | null {
  return Object.values(TAB_REGISTRY).find(tab => 
    path === tab.path
  ) || null;
}

export function isModuleEnabled(moduleId: string): boolean {
  const module = MODULE_REGISTRY[moduleId];
  return module?.isEnabled || false;
}

export function isTabEnabled(tabId: string): boolean {
  const tab = TAB_REGISTRY[tabId];
  return tab?.isEnabled || false;
} 