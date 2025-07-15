import { useState, useEffect } from 'react';

export interface DashboardSection {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  required: boolean;
  userLevels: string[];
}

export interface DashboardField {
  id: string;
  name: string;
  description: string;
  sectionId: string;
  enabled: boolean;
  required: boolean;
  userLevels: string[];
}

export interface UserLevel {
  id: string;
  name: string;
  description: string;
  sections: string[];
  fields: string[];
}

export interface DashboardConfig {
  userLevels: UserLevel[];
  dashboardSections: DashboardSection[];
  dashboardFields: DashboardField[];
}

export function useDashboardConfig() {
  const [config, setConfig] = useState<DashboardConfig>({
    userLevels: [
      {
        id: 'admin',
        name: 'System Admin',
        description: 'Full system access and control',
        sections: ['my-shifts', 'open-shifts', 'compliance', 'analytics', 'notifications'],
        fields: ['my-shifts-client', 'my-shifts-status', 'my-shifts-actions', 'open-shifts-client', 'open-shifts-role', 'open-shifts-pay', 'open-shifts-priority', 'open-shifts-actions']
      },
      {
        id: 'client-admin',
        name: 'Client IT Admin',
        description: 'Client organization management',
        sections: ['my-shifts', 'open-shifts', 'compliance', 'analytics'],
        fields: ['my-shifts-client', 'my-shifts-status', 'my-shifts-actions', 'open-shifts-client', 'open-shifts-role', 'open-shifts-pay', 'open-shifts-priority', 'open-shifts-actions']
      },
      {
        id: 'manager',
        name: 'Manager',
        description: 'Team and shift management',
        sections: ['my-shifts', 'open-shifts', 'compliance'],
        fields: ['my-shifts-client', 'my-shifts-status', 'my-shifts-actions', 'open-shifts-client', 'open-shifts-role', 'open-shifts-pay', 'open-shifts-priority', 'open-shifts-actions']
      },
      {
        id: 'caregiver',
        name: 'Caregiver',
        description: 'Direct care staff',
        sections: ['my-shifts', 'compliance'],
        fields: ['my-shifts-client', 'my-shifts-status', 'my-shifts-actions']
      },
      {
        id: 'coordinator',
        name: 'Coordinator',
        description: 'Shift coordination and scheduling',
        sections: ['my-shifts', 'open-shifts', 'compliance'],
        fields: ['my-shifts-client', 'my-shifts-status', 'my-shifts-actions', 'open-shifts-client', 'open-shifts-role', 'open-shifts-pay', 'open-shifts-priority', 'open-shifts-actions']
      }
    ],
    dashboardSections: [
      {
        id: 'my-shifts',
        name: 'My Shifts',
        description: 'Display user\'s assigned and upcoming shifts',
        enabled: true,
        required: true,
        userLevels: ['admin', 'client-admin', 'manager', 'caregiver', 'coordinator']
      },
      {
        id: 'open-shifts',
        name: 'Open Shifts',
        description: 'Show available shifts that can be requested',
        enabled: true,
        required: false,
        userLevels: ['admin', 'client-admin', 'manager', 'coordinator']
      },
      {
        id: 'compliance',
        name: 'Compliance & Training',
        description: 'Display compliance requirements and training status',
        enabled: true,
        required: false,
        userLevels: ['admin', 'client-admin', 'manager', 'caregiver', 'coordinator']
      },
      {
        id: 'analytics',
        name: 'Analytics & Reports',
        description: 'Show performance metrics and reports',
        enabled: false,
        required: false,
        userLevels: ['admin', 'client-admin']
      },
      {
        id: 'notifications',
        name: 'Notifications Center',
        description: 'Display system notifications and alerts',
        enabled: false,
        required: false,
        userLevels: ['admin']
      }
    ],
    dashboardFields: [
      // My Shifts fields
      {
        id: 'my-shifts-client',
        name: 'Client',
        description: 'Show client information in My Shifts table',
        sectionId: 'my-shifts',
        enabled: true,
        required: false,
        userLevels: ['admin', 'client-admin', 'manager', 'caregiver', 'coordinator']
      },
      {
        id: 'my-shifts-status',
        name: 'Status',
        description: 'Show shift status in My Shifts table',
        sectionId: 'my-shifts',
        enabled: true,
        required: false,
        userLevels: ['admin', 'client-admin', 'manager', 'caregiver', 'coordinator']
      },
      {
        id: 'my-shifts-actions',
        name: 'Actions',
        description: 'Show action buttons in My Shifts table',
        sectionId: 'my-shifts',
        enabled: true,
        required: true,
        userLevels: ['admin', 'client-admin', 'manager', 'caregiver', 'coordinator']
      },
      // Open Shifts fields
      {
        id: 'open-shifts-client',
        name: 'Client',
        description: 'Show client information in Open Shifts table',
        sectionId: 'open-shifts',
        enabled: true,
        required: false,
        userLevels: ['admin', 'client-admin', 'manager', 'coordinator']
      },
      {
        id: 'open-shifts-role',
        name: 'Role',
        description: 'Show required role in Open Shifts table',
        sectionId: 'open-shifts',
        enabled: true,
        required: false,
        userLevels: ['admin', 'client-admin', 'manager', 'coordinator']
      },
      {
        id: 'open-shifts-pay',
        name: 'Pay Rate',
        description: 'Show pay rate in Open Shifts table',
        sectionId: 'open-shifts',
        enabled: true,
        required: false,
        userLevels: ['admin', 'client-admin', 'manager', 'coordinator']
      },
      {
        id: 'open-shifts-priority',
        name: 'Priority',
        description: 'Show priority level in Open Shifts table',
        sectionId: 'open-shifts',
        enabled: true,
        required: false,
        userLevels: ['admin', 'client-admin', 'manager', 'coordinator']
      },
      {
        id: 'open-shifts-actions',
        name: 'Actions',
        description: 'Show action buttons in Open Shifts table',
        sectionId: 'open-shifts',
        enabled: true,
        required: true,
        userLevels: ['admin', 'client-admin', 'manager', 'coordinator']
      }
    ]
  });

  const [currentUserLevel, setCurrentUserLevel] = useState<string>('caregiver');

  // Ensure current user level exists in config
  useEffect(() => {
    const userLevelExists = config.userLevels.some(level => level.id === currentUserLevel);
    if (!userLevelExists && config.userLevels.length > 0) {
      if (currentUserLevel !== config.userLevels[0].id) {
        setCurrentUserLevel(config.userLevels[0].id);
      }
    }
    // Only depend on config.userLevels to avoid infinite loop
  }, [config.userLevels]);

  // Load configuration from localStorage or API
  useEffect(() => {
    const savedConfig = localStorage.getItem('dashboard-config');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        // Ensure all required properties exist
        const validatedConfig = {
          userLevels: parsedConfig.userLevels || config.userLevels,
          dashboardSections: parsedConfig.dashboardSections || config.dashboardSections,
          dashboardFields: parsedConfig.dashboardFields || config.dashboardFields
        };
        setConfig(validatedConfig);
      } catch (error) {
        console.error('Error loading dashboard config:', error);
      }
    }

    // Load current user level (in real app, this would come from auth context)
    const savedUserLevel = localStorage.getItem('current-user-level');
    if (savedUserLevel) {
      setCurrentUserLevel(savedUserLevel);
    }
  }, []);

  // Save configuration to localStorage or API
  const saveConfig = (newConfig: DashboardConfig) => {
    setConfig(newConfig);
    localStorage.setItem('dashboard-config', JSON.stringify(newConfig));
  };

  // Get visible sections for current user level
  const getVisibleSections = (): string[] => {
    const userLevel = config.userLevels.find(level => level.id === currentUserLevel);
    if (!userLevel || !userLevel.sections) return [];

    return userLevel.sections.filter(sectionId => {
      const section = config.dashboardSections.find(s => s.id === sectionId);
      return section && section.enabled;
    });
  };

  // Get visible fields for current user level
  const getVisibleFields = (): string[] => {
    const userLevel = config.userLevels.find(level => level.id === currentUserLevel);
    if (!userLevel || !userLevel.fields) return [];

    return userLevel.fields.filter(fieldId => {
      const field = config.dashboardFields.find(f => f.id === fieldId);
      return field && field.enabled;
    });
  };

  // Check if a section is visible for current user
  const isSectionVisible = (sectionId: string): boolean => {
    try {
      return getVisibleSections().includes(sectionId);
    } catch (error) {
      console.error('Error checking section visibility:', error);
      return false;
    }
  };

  // Check if a field is visible for current user
  const isFieldVisible = (fieldId: string): boolean => {
    try {
      return getVisibleFields().includes(fieldId);
    } catch (error) {
      console.error('Error checking field visibility:', error);
      return false;
    }
  };

  // Update section configuration
  const updateSectionConfig = (sectionId: string, updates: Partial<DashboardSection>) => {
    const newConfig = {
      ...config,
      dashboardSections: config.dashboardSections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    };
    saveConfig(newConfig);
  };

  // Update field configuration
  const updateFieldConfig = (fieldId: string, updates: Partial<DashboardField>) => {
    const newConfig = {
      ...config,
      dashboardFields: config.dashboardFields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    };
    saveConfig(newConfig);
  };

  // Update user level configuration
  const updateUserLevelConfig = (userLevelId: string, updates: Partial<UserLevel>) => {
    const newConfig = {
      ...config,
      userLevels: config.userLevels.map(level =>
        level.id === userLevelId ? { ...level, ...updates } : level
      )
    };
    saveConfig(newConfig);
  };

  // Add section to user level
  const addSectionToUserLevel = (userLevelId: string, sectionId: string) => {
    const userLevel = config.userLevels.find(level => level.id === userLevelId);
    if (!userLevel) return;

    const newSections = [...userLevel.sections, sectionId];
    updateUserLevelConfig(userLevelId, { sections: newSections });
  };

  // Remove section from user level
  const removeSectionFromUserLevel = (userLevelId: string, sectionId: string) => {
    const userLevel = config.userLevels.find(level => level.id === userLevelId);
    if (!userLevel) return;

    const newSections = userLevel.sections.filter(s => s !== sectionId);
    updateUserLevelConfig(userLevelId, { sections: newSections });
  };

  // Add field to user level
  const addFieldToUserLevel = (userLevelId: string, fieldId: string) => {
    const userLevel = config.userLevels.find(level => level.id === userLevelId);
    if (!userLevel) return;

    const newFields = [...userLevel.fields, fieldId];
    updateUserLevelConfig(userLevelId, { fields: newFields });
  };

  // Remove field from user level
  const removeFieldFromUserLevel = (userLevelId: string, fieldId: string) => {
    const userLevel = config.userLevels.find(level => level.id === userLevelId);
    if (!userLevel) return;

    const newFields = userLevel.fields.filter(f => f !== fieldId);
    updateUserLevelConfig(userLevelId, { fields: newFields });
  };

  // Set current user level
  const setUserLevel = (userLevelId: string) => {
    setCurrentUserLevel(userLevelId);
    localStorage.setItem('current-user-level', userLevelId);
  };

  return {
    config,
    currentUserLevel,
    visibleSections: getVisibleSections(),
    visibleFields: getVisibleFields(),
    isSectionVisible,
    isFieldVisible,
    updateSectionConfig,
    updateFieldConfig,
    updateUserLevelConfig,
    addSectionToUserLevel,
    removeSectionFromUserLevel,
    addFieldToUserLevel,
    removeFieldFromUserLevel,
    setUserLevel,
    saveConfig
  };
} 