'use server';

import type { AppSection, SectionTab } from './types';

// In-memory storage for development (in production, this would be a database)
let dynamicTabs: Map<string, SectionTab[]> = new Map();

// Initialize with default tabs for People We Support section
const defaultPeopleTabs: SectionTab[] = [
  {
    id: 'tab-people-notes',
    name: 'Notes',
    order: 20,
    formId: 'form-pws-notes'
  },
  {
    id: 'tab-people-documents',
    name: 'Documents',
    order: 30,
    formId: 'form-pws-documents'
  },
  {
    id: 'tab-people-contacts',
    name: 'Contacts',
    order: 40,
    formId: 'form-pws-contacts'
  }
];

// Initialize the People We Support section with default tabs
dynamicTabs.set('sec-people', defaultPeopleTabs);

/**
 * Get tabs for a specific section
 */
export async function getSectionTabs(sectionId: string): Promise<SectionTab[]> {
  const tabs = dynamicTabs.get(sectionId) || [];
  return tabs.sort((a, b) => a.order - b.order);
}

/**
 * Add a new tab to a section
 */
export async function addSectionTab(sectionId: string, tab: Omit<SectionTab, 'id'>): Promise<SectionTab> {
  const newTab: SectionTab = {
    ...tab,
    id: `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  };
  
  const existingTabs = dynamicTabs.get(sectionId) || [];
  const updatedTabs = [...existingTabs, newTab].sort((a, b) => a.order - b.order);
  dynamicTabs.set(sectionId, updatedTabs);
  
  return newTab;
}

/**
 * Update an existing tab
 */
export async function updateSectionTab(sectionId: string, tabId: string, updates: Partial<SectionTab>): Promise<SectionTab | null> {
  const existingTabs = dynamicTabs.get(sectionId) || [];
  const tabIndex = existingTabs.findIndex(t => t.id === tabId);
  
  if (tabIndex === -1) return null;
  
  const updatedTab = { ...existingTabs[tabIndex], ...updates };
  const updatedTabs = [...existingTabs];
  updatedTabs[tabIndex] = updatedTab;
  updatedTabs.sort((a, b) => a.order - b.order);
  
  dynamicTabs.set(sectionId, updatedTabs);
  return updatedTab;
}

/**
 * Delete a tab from a section
 */
export async function deleteSectionTab(sectionId: string, tabId: string): Promise<boolean> {
  const existingTabs = dynamicTabs.get(sectionId) || [];
  const updatedTabs = existingTabs.filter(t => t.id !== tabId);
  
  if (updatedTabs.length === existingTabs.length) {
    return false; // Tab not found
  }
  
  dynamicTabs.set(sectionId, updatedTabs);
  return true;
}

/**
 * Get all sections with their tabs
 */
export async function getAllSectionsWithTabs(): Promise<Map<string, SectionTab[]>> {
  return new Map(dynamicTabs);
}

/**
 * Revalidate tabs for a specific section
 */
export async function revalidateSectionTabs(sectionId: string): Promise<void> {
  // In a real app, this would trigger Next.js revalidation
  // For now, we'll just return as the in-memory store is already updated
} 