// System-wide settings configuration
export interface SystemSettings {
  aiFeatures: boolean;
  darkMode: boolean;
  betaFeatures: boolean;
  automationEnabled: boolean;
  clientAutomation: boolean;
  globalAutomation: boolean;
  showPayRates: boolean;
  allowStaffEditing: boolean;
  enableDynamicForms: boolean;
  
  // Roster-Based Access Control Settings
  rosterBasedAccessControl: {
    enabled: boolean;
    autoGrantAccess: boolean;
    autoRevokeAccess: boolean;
    requireClockIn: boolean;
    allowManualOverride: boolean;
    auditLogging: boolean;
    notificationSettings: {
      onClockIn: boolean;
      onClockOut: boolean;
      onAccessGranted: boolean;
      onAccessRevoked: boolean;
    };
  };
  
  // Tenant-specific RBAC settings
  tenantRBAC: {
    enabled: boolean;
    strictMode: boolean;
    gracePeriodMinutes: number;
    allowedRoles: string[];
    excludedRoles: string[];
  };
}

// Default settings
export const defaultSettings: SystemSettings = {
  aiFeatures: true,
  darkMode: false,
  betaFeatures: false,
  automationEnabled: true,
  clientAutomation: true,
  globalAutomation: true,
  showPayRates: true,
  allowStaffEditing: true,
  enableDynamicForms: true,
  rosterBasedAccessControl: {
    enabled: true,
    autoGrantAccess: true,
    autoRevokeAccess: true,
    requireClockIn: true,
    allowManualOverride: false,
    auditLogging: true,
    notificationSettings: {
      onClockIn: true,
      onClockOut: true,
      onAccessGranted: true,
      onAccessRevoked: true,
    },
  },
  tenantRBAC: {
    enabled: true,
    strictMode: false,
    gracePeriodMinutes: 15,
    allowedRoles: ['Support Worker', 'Support Manager', 'Roster Admin'],
    excludedRoles: ['System Admin', 'CEO'],
  },
};

// In a real application, these would be stored in a database
// For now, we'll use a simple in-memory store
let currentSettings: SystemSettings = {
  aiFeatures: true,
  darkMode: true,
  betaFeatures: true,
  automationEnabled: true,
  clientAutomation: true,
  globalAutomation: true,
  showPayRates: true,
  allowStaffEditing: true,
  enableDynamicForms: true,
  rosterBasedAccessControl: {
    enabled: true,
    autoGrantAccess: true,
    autoRevokeAccess: true,
    requireClockIn: true,
    allowManualOverride: false,
    auditLogging: true,
    notificationSettings: {
      onClockIn: true,
      onClockOut: true,
      onAccessGranted: true,
      onAccessRevoked: true,
    },
  },
  tenantRBAC: {
    enabled: true,
    strictMode: false,
    gracePeriodMinutes: 15,
    allowedRoles: ['Support Worker', 'Support Manager', 'Roster Admin'],
    excludedRoles: ['System Admin', 'CEO'],
  },
};

export function getSystemSettings(): SystemSettings {
  return { ...currentSettings };
}

export function updateSystemSettings(newSettings: Partial<SystemSettings>): void {
  currentSettings = { ...currentSettings, ...newSettings };
}

export function getRBACSettings() {
  return currentSettings.rosterBasedAccessControl;
}

export function getTenantRBACSettings() {
  return currentSettings.tenantRBAC;
}

export function isAutomationEnabled(): boolean {
  return currentSettings.automationEnabled;
}

export function isClientAutomationEnabled(): boolean {
  return currentSettings.automationEnabled && currentSettings.clientAutomation;
}

export function isGlobalAutomationEnabled(): boolean {
  return currentSettings.automationEnabled && currentSettings.globalAutomation;
} 