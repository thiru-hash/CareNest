import { useState, useEffect } from 'react';

export interface SystemSettings {
  aiFeatures: boolean;
  darkMode: boolean;
  betaFeatures: boolean;
  automationEnabled: boolean;
  clientAutomation: boolean;
  globalAutomation: boolean;
  // Staff Management Settings
  showPayRates: boolean;
  allowStaffEditing: boolean;
  enableDynamicForms: boolean;
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