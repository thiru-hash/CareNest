// ===== MODULE REGISTRY =====
// This file manages all feature modules and their configurations

import type { ModuleConfig, UserRole } from '@/lib/types';

export interface ModuleRegistry {
  [key: string]: ModuleConfig;
}

// ===== CORE MODULES =====
export const CORE_MODULES: ModuleRegistry = {
  dashboard: {
    id: 'dashboard',
    name: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    isEnabled: true,
    permissions: ['view'],
    dependencies: [],
    settings: {
      widgets: ['finance', 'shifts', 'compliance', 'notifications'],
      layout: 'grid'
    }
  },
  people: {
    id: 'people',
    name: 'People',
    path: '/people',
    icon: 'Users',
    isEnabled: true,
    permissions: ['view', 'create', 'edit', 'delete'],
    dependencies: [],
    settings: {
      sections: ['clients', 'staff', 'groups'],
      forms: ['client-profile', 'staff-onboarding']
    }
  },
  roster: {
    id: 'roster',
    name: 'Roster',
    path: '/roster',
    icon: 'Calendar',
    isEnabled: true,
    permissions: ['view', 'create', 'edit', 'delete'],
    dependencies: ['people'],
    settings: {
      features: ['shift-scheduling', 'time-tracking', 'availability'],
      integrations: ['calendar', 'notifications']
    }
  },
  finance: {
    id: 'finance',
    name: 'Finance',
    path: '/finance',
    icon: 'DollarSign',
    isEnabled: true,
    permissions: ['view', 'create', 'edit', 'delete'],
    dependencies: ['people', 'roster'],
    settings: {
      sections: ['invoicing', 'expenses', 'budgets', 'reports'],
      integrations: ['accounting', 'payroll']
    }
  },
  compliance: {
    id: 'compliance',
    name: 'Compliance',
    path: '/compliance',
    icon: 'Shield',
    isEnabled: true,
    permissions: ['view', 'create', 'edit', 'delete'],
    dependencies: ['people'],
    settings: {
      features: ['certifications', 'background-checks', 'training'],
      alerts: ['expiry-notifications', 'compliance-reports']
    }
  },
  locations: {
    id: 'locations',
    name: 'Locations',
    path: '/locations',
    icon: 'MapPin',
    isEnabled: true,
    permissions: ['view', 'create', 'edit', 'delete'],
    dependencies: [],
    settings: {
      features: ['property-management', 'facility-tracking'],
      integrations: ['maps', 'maintenance']
    }
  },
  settings: {
    id: 'settings',
    name: 'Settings',
    path: '/settings',
    icon: 'Settings',
    isEnabled: true,
    permissions: ['view', 'edit'],
    dependencies: [],
    settings: {
      sections: ['users', 'groups', 'forms', 'branding', 'automation'],
      features: ['role-management', 'form-builder', 'theme-customization']
    }
  }
};

// ===== PLATFORM ADMIN MODULES =====
export const PLATFORM_MODULES: ModuleRegistry = {
  platformAdmin: {
    id: 'platform-admin',
    name: 'Platform Admin',
    path: '/platform-admin',
    icon: 'Server',
    isEnabled: true,
    permissions: ['view', 'create', 'edit', 'delete'],
    dependencies: [],
    settings: {
      sections: ['tenants', 'licenses', 'support', 'analytics'],
      features: ['tenant-management', 'license-configuration', 'support-tools']
    }
  }
};

// ===== ROLE-BASED MODULE ACCESS =====
export const ROLE_MODULE_ACCESS: Record<UserRole, string[]> = {
  'System Admin': Object.keys(CORE_MODULES),
  'Support Manager': ['dashboard', 'people', 'roster', 'compliance', 'locations'],
  'Support Worker': ['dashboard', 'roster'],
  'Roster Admin': ['dashboard', 'roster', 'people'],
  'Roster Scheduler': ['dashboard', 'roster'],
  'Finance Admin': ['dashboard', 'finance', 'people'],
  'GM Service': ['dashboard', 'people', 'roster', 'compliance'],
  'CEO': Object.keys(CORE_MODULES),
  'Reception': ['dashboard', 'people', 'locations'],
  'Health and Safety': ['dashboard', 'compliance', 'people'],
  'Risk Management': ['dashboard', 'compliance', 'people'],
  'Office Admin Manager': Object.keys(CORE_MODULES),
  'Clinical Advisor': ['dashboard', 'people', 'compliance'],
  'Human Resources Manager': ['dashboard', 'people', 'compliance', 'roster'],
  'HR Admin': ['dashboard', 'people', 'compliance'],
  'HR': ['dashboard', 'people', 'compliance'],
  'Behavioural Support': ['dashboard', 'people', 'roster']
};

// ===== MODULE FEATURE FLAGS =====
export const MODULE_FEATURES = {
  dashboard: {
    widgets: {
      finance: ['System Admin', 'Finance Admin', 'CEO', 'Office Admin Manager'],
      shifts: ['*'], // All roles
      compliance: ['*'],
      notifications: ['*']
    }
  },
  people: {
    sections: {
      clients: ['*'],
      staff: ['System Admin', 'HR Admin', 'HR', 'Office Admin Manager'],
      groups: ['System Admin', 'HR Admin', 'HR']
    }
  },
  finance: {
    sections: {
      invoicing: ['System Admin', 'Finance Admin', 'CEO'],
      expenses: ['System Admin', 'Finance Admin', 'CEO'],
      budgets: ['System Admin', 'Finance Admin', 'CEO'],
      reports: ['System Admin', 'Finance Admin', 'CEO']
    }
  },
  compliance: {
    sections: {
      certifications: ['*'],
      'background-checks': ['System Admin', 'HR Admin', 'HR'],
      training: ['System Admin', 'HR Admin', 'HR']
    }
  }
};

// ===== HELPER FUNCTIONS =====
export function getModulesForRole(role: UserRole): ModuleConfig[] {
  const moduleIds = ROLE_MODULE_ACCESS[role] || [];
  return moduleIds.map(id => CORE_MODULES[id]).filter(Boolean);
}

export function isModuleEnabledForRole(moduleId: string, role: UserRole): boolean {
  const moduleIds = ROLE_MODULE_ACCESS[role] || [];
  return moduleIds.includes(moduleId);
}

export function getModuleFeatures(moduleId: string, role: UserRole): string[] {
  const features = MODULE_FEATURES[moduleId as keyof typeof MODULE_FEATURES];
  if (!features) return [];
  
  const enabledFeatures: string[] = [];
  
  Object.entries(features).forEach(([section, roles]) => {
    if (roles.includes('*') || roles.includes(role)) {
      enabledFeatures.push(section);
    }
  });
  
  return enabledFeatures;
} 