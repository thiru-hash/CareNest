import { useState, useEffect } from 'react';

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
    // Clock-off and early finish settings
    allowEarlyFinish: boolean;
    requireEarlyFinishReason: boolean;
    earlyFinishGracePeriod: number; // minutes
    autoClockOutAtShiftEnd: boolean;
    allowManualClockOut: boolean;
    notificationSettings: {
      onClockIn: boolean;
      onClockOut: boolean;
      onEarlyFinish: boolean;
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

const defaultSettings: SystemSettings = {
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
    allowEarlyFinish: true,
    requireEarlyFinishReason: true,
    earlyFinishGracePeriod: 30, // 30 minutes grace period
    autoClockOutAtShiftEnd: false,
    allowManualClockOut: true,
    notificationSettings: {
      onClockIn: true,
      onClockOut: true,
      onEarlyFinish: true,
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

export function useSystemSettings() {
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load settings from localStorage or API
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem('system-settings');
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings({ ...defaultSettings, ...parsedSettings });
        }
      } catch (error) {
        console.error('Error loading system settings:', error);
      }
      setIsLoading(false);
    };

    loadSettings();
  }, []);

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    // Save to localStorage
    try {
      localStorage.setItem('system-settings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error saving system settings:', error);
    }
  };

  const canViewPayRates = (userRole: string) => {
    if (settings.showPayRates) return true;
    
    // HR and Finance roles can always view pay rates
    const privilegedRoles = [
      'System Admin',
      'HR Manager', 
      'HR Admin',
      'HR',
      'Finance Admin',
      'Finance Manager'
    ];
    
    return privilegedRoles.includes(userRole);
  };

  const canEditStaff = (userRole: string, isOwnProfile: boolean = false) => {
    if (isOwnProfile && settings.allowStaffEditing) return true;
    
    const adminRoles = [
      'System Admin',
      'HR Manager',
      'HR Admin',
      'Support Manager'
    ];
    
    return adminRoles.includes(userRole);
  };

  return {
    settings,
    updateSettings,
    canViewPayRates,
    canEditStaff,
    isLoading
  };
} 