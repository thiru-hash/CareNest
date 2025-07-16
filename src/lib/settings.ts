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
};

export function getSystemSettings(): SystemSettings {
  return { ...currentSettings };
}

export function updateSystemSettings(settings: Partial<SystemSettings>): void {
  currentSettings = { ...currentSettings, ...settings };
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