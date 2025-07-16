import { useState, useEffect } from 'react';

export interface TerminologySettings {
  // Core Terms
  clients: string;
  staff: string;
  locations: string;
  roster: string;
  finance: string;
  dashboard: string;
  settings: string;
  
  // Client Profile Terms
  basicInfo: string;
  contacts: string;
  communication: string;
  goals: string;
  documents: string;
  health: string;
  financials: string;
  reports: string;
  
  // Staff Terms
  payRates: string;
  shifts: string;
  timesheets: string;
  leave: string;
  
  // System Terms
  sections: string;
  forms: string;
  tabs: string;
  groups: string;
  roles: string;
  rights: string;
  users: string;
  
  // Cultural/Language Settings
  primaryLanguage: string;
  enableMaoriTerms: boolean;
  enableCulturalTerms: boolean;
  customTerminology: { [key: string]: string };
}

const defaultTerminology: TerminologySettings = {
  // Core Terms
  clients: "People We Support",
  staff: "Staff",
  locations: "Locations",
  roster: "Roster Schedule",
  finance: "Finance",
  dashboard: "Dashboard",
  settings: "Settings",
  
  // Client Profile Terms
  basicInfo: "Basic Information",
  contacts: "Contacts & Schedule",
  communication: "Communication",
  goals: "Goals",
  documents: "Documents",
  health: "Health",
  financials: "Financials",
  reports: "Reports",
  
  // Staff Terms
  payRates: "Pay Rates",
  shifts: "Shifts",
  timesheets: "Timesheets",
  leave: "Leave",
  
  // System Terms
  sections: "Sections",
  forms: "Forms",
  tabs: "Tabs",
  groups: "Groups",
  roles: "Roles",
  rights: "Rights",
  users: "Users",
  
  // Cultural/Language Settings
  primaryLanguage: "English",
  enableMaoriTerms: false,
  enableCulturalTerms: false,
  customTerminology: {}
};

export function useTerminology() {
  const [terminology, setTerminology] = useState<TerminologySettings>(defaultTerminology);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load terminology from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('carenest-terminology');
      if (stored) {
        const parsed = JSON.parse(stored);
        setTerminology({ ...defaultTerminology, ...parsed });
      }
    } catch (error) {
      console.error('Error loading terminology settings:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save terminology to localStorage
  const saveTerminology = (newTerminology: TerminologySettings) => {
    try {
      localStorage.setItem('carenest-terminology', JSON.stringify(newTerminology));
      setTerminology(newTerminology);
    } catch (error) {
      console.error('Error saving terminology settings:', error);
    }
  };

  // Update specific terminology term
  const updateTerm = (key: keyof TerminologySettings, value: string | boolean) => {
    const updated = { ...terminology, [key]: value };
    setTerminology(updated);
    saveTerminology(updated);
  };

  // Update custom terminology
  const updateCustomTerm = (key: string, value: string) => {
    const updated = {
      ...terminology,
      customTerminology: {
        ...terminology.customTerminology,
        [key]: value
      }
    };
    setTerminology(updated);
    saveTerminology(updated);
  };

  // Reset to default
  const resetToDefault = () => {
    setTerminology(defaultTerminology);
    localStorage.removeItem('carenest-terminology');
  };

  // Apply Māori preset
  const applyMaoriPreset = () => {
    const maoriTerminology: TerminologySettings = {
      ...defaultTerminology,
      clients: "Tāngata Whaiora",
      staff: "Kaimahi",
      locations: "Wāhi",
      roster: "Rārangi Mahi",
      finance: "Pūtea",
      dashboard: "Papatohu",
      settings: "Tautuhinga",
      basicInfo: "Mōhiohio Matua",
      contacts: "Whakapā & Rārangi",
      communication: "Whakawhiti Kōrero",
      goals: "Whāinga",
      documents: "Tuhinga",
      health: "Hauora",
      financials: "Pūtea",
      reports: "Ripoata",
      payRates: "Utu Kaimahi",
      shifts: "Neke",
      timesheets: "Rārangi Wā",
      leave: "Rēhita",
      sections: "Wāhanga",
      forms: "Puka",
      tabs: "Tāpaenga",
      groups: "Rōpū",
      roles: "Tūranga",
      rights: "Tika",
      users: "Kaiwhakamahi",
      primaryLanguage: "Māori",
      enableMaoriTerms: true,
      enableCulturalTerms: true,
      customTerminology: {}
    };
    setTerminology(maoriTerminology);
    saveTerminology(maoriTerminology);
  };

  // Get term with fallback
  const getTerm = (key: keyof TerminologySettings, fallback?: string): string => {
    const value = terminology[key];
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
    return fallback || defaultTerminology[key] as string;
  };

  // Get custom term
  const getCustomTerm = (key: string, fallback?: string): string => {
    return terminology.customTerminology[key] || fallback || key;
  };

  return {
    terminology,
    isLoaded,
    saveTerminology,
    updateTerm,
    updateCustomTerm,
    resetToDefault,
    applyMaoriPreset,
    getTerm,
    getCustomTerm
  };
} 