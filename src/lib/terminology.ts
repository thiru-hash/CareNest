import type { TerminologySettings } from './hooks/useTerminology';

// Default terminology fallbacks
const defaultTerms = {
  clients: "People We Support",
  staff: "Staff",
  locations: "Locations",
  roster: "Roster Schedule",
  finance: "Finance",
  dashboard: "Dashboard",
  settings: "Settings",
  basicInfo: "Basic Information",
  contacts: "Contacts & Schedule",
  communication: "Communication",
  goals: "Goals",
  documents: "Documents",
  health: "Health",
  financials: "Financials",
  reports: "Reports",
  payRates: "Pay Rates",
  shifts: "Shifts",
  timesheets: "Timesheets",
  leave: "Leave",
  sections: "Sections",
  forms: "Forms",
  tabs: "Tabs",
  groups: "Groups",
  roles: "Roles",
  rights: "Rights",
  users: "Users"
};

// Cache for terminology settings
let cachedTerminology: TerminologySettings | null = null;

/**
 * Get terminology settings from localStorage
 */
export function getTerminologySettings(): TerminologySettings {
  if (cachedTerminology) {
    return cachedTerminology;
  }

  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('carenest-terminology');
      if (stored) {
        const parsed = JSON.parse(stored);
        cachedTerminology = { ...defaultTerms, ...parsed };
        return cachedTerminology;
      }
    }
  } catch (error) {
    console.error('Error loading terminology settings:', error);
  }

  // Return default terminology
  cachedTerminology = defaultTerms as TerminologySettings;
  return cachedTerminology;
}

/**
 * Get a specific term with fallback
 */
export function getTerm(key: keyof TerminologySettings, fallback?: string): string {
  const terminology = getTerminologySettings();
  const value = terminology[key];
  
  if (typeof value === 'string' && value.trim()) {
    return value;
  }
  
  return fallback || defaultTerms[key] || key;
}

/**
 * Get a custom term
 */
export function getCustomTerm(key: string, fallback?: string): string {
  const terminology = getTerminologySettings();
  return terminology.customTerminology?.[key] || fallback || key;
}

/**
 * Clear terminology cache (call when settings change)
 */
export function clearTerminologyCache(): void {
  cachedTerminology = null;
}

/**
 * Apply terminology to a string template
 * Usage: applyTerminology("Welcome to {clients} section")
 */
export function applyTerminology(template: string): string {
  const terminology = getTerminologySettings();
  
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const term = terminology[key as keyof TerminologySettings];
    if (typeof term === 'string' && term.trim()) {
      return term;
    }
    return match; // Keep original if term not found
  });
}

/**
 * Get section name with terminology
 */
export function getSectionName(sectionId: string): string {
  const sectionMap: { [key: string]: keyof TerminologySettings } = {
    'dashboard': 'dashboard',
    'roster': 'roster',
    'people': 'clients',
    'staff': 'staff',
    'locations': 'locations',
    'finance': 'finance',
    'settings': 'settings'
  };

  const termKey = sectionMap[sectionId];
  if (termKey) {
    return getTerm(termKey);
  }

  return sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
}

/**
 * Get tab name with terminology
 */
export function getTabName(tabId: string): string {
  const tabMap: { [key: string]: keyof TerminologySettings } = {
    'basic-info': 'basicInfo',
    'contacts': 'contacts',
    'communication': 'communication',
    'goals': 'goals',
    'documents': 'documents',
    'health': 'health',
    'financials': 'financials',
    'reports': 'reports'
  };

  const termKey = tabMap[tabId];
  if (termKey) {
    return getTerm(termKey);
  }

  return tabId.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

/**
 * Get form name with terminology
 */
export function getFormName(formId: string): string {
  // Check if it's a custom form with terminology
  const customTerm = getCustomTerm(formId);
  if (customTerm !== formId) {
    return customTerm;
  }

  // Try to extract meaningful name from form ID
  const name = formId.replace(/^form-/, '').split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return name || formId;
}

/**
 * Get navigation items with terminology
 */
export function getNavigationItems() {
  const terminology = getTerminologySettings();
  
  return [
    {
      id: 'dashboard',
      name: terminology.dashboard || 'Dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard'
    },
    {
      id: 'roster',
      name: terminology.roster || 'Roster Schedule',
      path: '/roster',
      icon: 'Calendar'
    },
    {
      id: 'people',
      name: terminology.clients || 'People We Support',
      path: '/people',
      icon: 'Users'
    },
    {
      id: 'staff',
      name: terminology.staff || 'Staff',
      path: '/staff',
      icon: 'UsersRound'
    },
    {
      id: 'locations',
      name: terminology.locations || 'Locations',
      path: '/locations',
      icon: 'Building2'
    },
    {
      id: 'finance',
      name: terminology.finance || 'Finance',
      path: '/finance',
      icon: 'Landmark'
    },
    {
      id: 'settings',
      name: terminology.settings || 'Settings',
      path: '/settings',
      icon: 'Settings'
    }
  ];
}

/**
 * Auto-detect new sections and add them to terminology
 */
export function autoDetectNewSections(sections: any[]): void {
  try {
    const terminology = getTerminologySettings();
    let hasChanges = false;
    
    sections.forEach(section => {
      const sectionKey = `section_${section.id}`;
      if (!terminology.customTerminology[sectionKey]) {
        terminology.customTerminology[sectionKey] = section.name;
        hasChanges = true;
      }
    });
    
    if (hasChanges && typeof window !== 'undefined') {
      localStorage.setItem('carenest-terminology', JSON.stringify(terminology));
      clearTerminologyCache();
    }
  } catch (error) {
    console.error('Error auto-detecting sections:', error);
  }
}

/**
 * Auto-detect new forms and add them to terminology
 */
export function autoDetectNewForms(forms: any[]): void {
  try {
    const terminology = getTerminologySettings();
    let hasChanges = false;
    
    forms.forEach(form => {
      const formKey = `form_${form.id}`;
      if (!terminology.customTerminology[formKey]) {
        terminology.customTerminology[formKey] = form.name;
        hasChanges = true;
      }
    });
    
    if (hasChanges && typeof window !== 'undefined') {
      localStorage.setItem('carenest-terminology', JSON.stringify(terminology));
      clearTerminologyCache();
    }
  } catch (error) {
    console.error('Error auto-detecting forms:', error);
  }
}

/**
 * Auto-detect new tabs and add them to terminology
 */
export function autoDetectNewTabs(tabs: any[]): void {
  try {
    const terminology = getTerminologySettings();
    let hasChanges = false;
    
    tabs.forEach(tab => {
      const tabKey = `tab_${tab.id}`;
      if (!terminology.customTerminology[tabKey]) {
        terminology.customTerminology[tabKey] = tab.name;
        hasChanges = true;
      }
    });
    
    if (hasChanges && typeof window !== 'undefined') {
      localStorage.setItem('carenest-terminology', JSON.stringify(terminology));
      clearTerminologyCache();
    }
  } catch (error) {
    console.error('Error auto-detecting tabs:', error);
  }
}

/**
 * Get all available terminology keys for the settings interface
 */
export function getAllTerminologyKeys(): { 
  sections: string[], 
  forms: string[], 
  tabs: string[], 
  customTerms: string[] 
} {
  try {
    const terminology = getTerminologySettings();
    const sections: string[] = [];
    const forms: string[] = [];
    const tabs: string[] = [];
    const customTerms: string[] = [];
    
    Object.keys(terminology.customTerminology).forEach(key => {
      if (key.startsWith('section_')) {
        sections.push(key.replace('section_', ''));
      } else if (key.startsWith('form_')) {
        forms.push(key.replace('form_', ''));
      } else if (key.startsWith('tab_')) {
        tabs.push(key.replace('tab_', ''));
      } else {
        customTerms.push(key);
      }
    });
    
    return { sections, forms, tabs, customTerms };
  } catch (error) {
    console.error('Error getting terminology keys:', error);
    return { sections: [], forms: [], tabs: [], customTerms: [] };
  }
}

/**
 * Update terminology for a specific item
 */
export function updateItemTerminology(itemType: 'section' | 'form' | 'tab', itemId: string, newName: string): void {
  try {
    const terminology = getTerminologySettings();
    const key = `${itemType}_${itemId}`;
    
    terminology.customTerminology[key] = newName;
    if (typeof window !== 'undefined') {
      localStorage.setItem('carenest-terminology', JSON.stringify(terminology));
      clearTerminologyCache();
    }
  } catch (error) {
    console.error('Error updating item terminology:', error);
  }
}

/**
 * Remove terminology for a specific item
 */
export function removeItemTerminology(itemType: 'section' | 'form' | 'tab', itemId: string): void {
  try {
    const terminology = getTerminologySettings();
    const key = `${itemType}_${itemId}`;
    
    delete terminology.customTerminology[key];
    if (typeof window !== 'undefined') {
      localStorage.setItem('carenest-terminology', JSON.stringify(terminology));
      clearTerminologyCache();
    }
  } catch (error) {
    console.error('Error removing item terminology:', error);
  }
} 