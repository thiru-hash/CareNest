'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { AppSection, SectionTab } from './types';

interface TabContextType {
  sections: Map<string, AppSection>;
  getSectionTabs: (sectionId: string) => SectionTab[];
  addTab: (sectionId: string, tab: Omit<SectionTab, 'id'>) => void;
  updateTab: (sectionId: string, tabId: string, updates: Partial<SectionTab>) => void;
  deleteTab: (sectionId: string, tabId: string) => void;
  reorderTabs: (sectionId: string, tabIds: string[]) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

// Initialize with default sections
const defaultSections = new Map<string, AppSection>();

// Add People We Support section with default tabs
defaultSections.set('sec-people', {
  id: 'sec-people',
  name: 'People We Support',
  path: '/people',
  order: 1,
  status: 'Active',
  iconName: 'Users',
  description: 'Manage people we support',
  tabs: [
    {
      id: 'tab-people-notes',
      name: 'Notes',
      order: 10,
      formId: 'form-pws-notes',
      description: 'Client notes and observations'
    },
    {
      id: 'tab-people-documents',
      name: 'Documents',
      order: 20,
      formId: 'form-pws-documents',
      description: 'Important documents and files'
    },
    {
      id: 'tab-people-contacts',
      name: 'Contacts',
      order: 30,
      formId: 'form-pws-contacts',
      description: 'Emergency contacts and family members'
    }
  ]
});

export function TabProvider({ children }: { children: ReactNode }) {
  const [sections, setSections] = useState<Map<string, AppSection>>(defaultSections);

  // Load sections from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('carenest_sections');
        if (stored) {
          const parsed = JSON.parse(stored);
          const sectionsMap = new Map(Object.entries(parsed)) as Map<string, AppSection>;
          setSections(sectionsMap);
        }
      } catch (error) {
        console.error('Error loading sections from localStorage:', error);
      }
    }
  }, []);

  // Save sections to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const sectionsObj = Object.fromEntries(sections);
        localStorage.setItem('carenest_sections', JSON.stringify(sectionsObj));
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('carenest-sections-updated'));
      } catch (error) {
        console.error('Error saving sections to localStorage:', error);
      }
    }
  }, [sections]);

  const getSectionTabs = (sectionId: string): SectionTab[] => {
    const section = sections.get(sectionId);
    return section?.tabs?.sort((a, b) => a.order - b.order) || [];
  };

  const addTab = (sectionId: string, tab: Omit<SectionTab, 'id'>) => {
    setSections(prev => {
      const newSections = new Map(prev);
      const section = newSections.get(sectionId);
      
      if (section) {
        const newTab: SectionTab = {
          ...tab,
          id: `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };
        
        const updatedSection = {
          ...section,
          tabs: [...(section.tabs || []), newTab].sort((a, b) => a.order - b.order)
        };
        
        newSections.set(sectionId, updatedSection);
      }
      
      return newSections;
    });
  };

  const updateTab = (sectionId: string, tabId: string, updates: Partial<SectionTab>) => {
    setSections(prev => {
      const newSections = new Map(prev);
      const section = newSections.get(sectionId);
      
      if (section) {
        const updatedTabs = section.tabs?.map(tab => 
          tab.id === tabId ? { ...tab, ...updates } : tab
        ) || [];
        
        const updatedSection = {
          ...section,
          tabs: updatedTabs.sort((a, b) => a.order - b.order)
        };
        
        newSections.set(sectionId, updatedSection);
      }
      
      return newSections;
    });
  };

  const deleteTab = (sectionId: string, tabId: string) => {
    setSections(prev => {
      const newSections = new Map(prev);
      const section = newSections.get(sectionId);
      
      if (section) {
        const updatedTabs = section.tabs?.filter(tab => tab.id !== tabId) || [];
        
        const updatedSection = {
          ...section,
          tabs: updatedTabs.sort((a, b) => a.order - b.order)
        };
        
        newSections.set(sectionId, updatedSection);
      }
      
      return newSections;
    });
  };

  const reorderTabs = (sectionId: string, tabIds: string[]) => {
    setSections(prev => {
      const newSections = new Map(prev);
      const section = newSections.get(sectionId);
      
      if (section && section.tabs) {
        const updatedTabs = tabIds.map((tabId, index) => {
          const tab = section.tabs!.find(t => t.id === tabId);
          return tab ? { ...tab, order: (index + 1) * 10 } : tab;
        }).filter(Boolean) as SectionTab[];
        
        const updatedSection = {
          ...section,
          tabs: updatedTabs
        };
        
        newSections.set(sectionId, updatedSection);
      }
      
      return newSections;
    });
  };

  const value: TabContextType = {
    sections,
    getSectionTabs,
    addTab,
    updateTab,
    deleteTab,
    reorderTabs
  };

  return (
    <TabContext.Provider value={value}>
      {children}
    </TabContext.Provider>
  );
}

export function useTabContext() {
  const context = useContext(TabContext);
  if (context === undefined) {
    throw new Error('useTabContext must be used within a TabProvider');
  }
  return context;
} 