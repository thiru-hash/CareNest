import { FormField } from './types/forms';

export interface FormConfig {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  dataModel?: string; // e.g., 'goals', 'notes', 'assessments', etc.
  displayOptions?: {
    showInTable?: boolean;
    tableColumns?: string[];
    defaultSort?: string;
  };
}

export const formConfigs: Record<string, FormConfig> = {
  'form-pws-goals': {
    id: 'form-pws-goals',
    name: 'Goals Form',
    description: 'Track and manage client goals and objectives',
    dataModel: 'goals',
    displayOptions: {
      showInTable: true,
      tableColumns: ['goal_title', 'status', 'target_date', 'responsible_staff'],
      defaultSort: 'target_date'
    },
    fields: [
      { 
        id: 'goal_title', 
        name: 'goal_title', 
        type: 'text', 
        label: 'Goal Title', 
        required: true,
        placeholder: 'Enter the goal title'
      },
      { 
        id: 'goal_description', 
        name: 'goal_description', 
        type: 'textarea', 
        label: 'Goal Description', 
        required: true,
        placeholder: 'Describe the goal in detail'
      },
      { 
        id: 'target_date', 
        name: 'target_date', 
        type: 'date', 
        label: 'Target Date', 
        required: true 
      },
      { 
        id: 'status', 
        name: 'status', 
        type: 'select', 
        label: 'Status', 
        options: [
          { value: 'not_started', label: 'Not Started' },
          { value: 'in_progress', label: 'In Progress' },
          { value: 'achieved', label: 'Achieved' },
          { value: 'on_hold', label: 'On Hold' }
        ], 
        required: true 
      },
      { 
        id: 'progress_notes', 
        name: 'progress_notes', 
        type: 'textarea', 
        label: 'Progress Notes',
        placeholder: 'Add notes about progress made'
      },
      { 
        id: 'responsible_staff', 
        name: 'responsible_staff', 
        type: 'text', 
        label: 'Responsible Staff',
        placeholder: 'Staff member responsible for this goal'
      },
      { 
        id: 'is_active', 
        name: 'is_active', 
        type: 'checkbox', 
        label: 'Is Active',
        defaultValue: true
      }
    ]
  },
  'form-pws-notes': {
    id: 'form-pws-notes',
    name: 'Support Notes',
    description: 'Document support activities and observations',
    dataModel: 'notes',
    displayOptions: {
      showInTable: true,
      tableColumns: ['note_title', 'note_type', 'created_date', 'staff_member'],
      defaultSort: 'created_date'
    },
    fields: [
      { 
        id: 'note_title', 
        name: 'note_title', 
        type: 'text', 
        label: 'Note Title', 
        required: true,
        placeholder: 'Brief title for this note'
      },
      { 
        id: 'note_type', 
        name: 'note_type', 
        type: 'select', 
        label: 'Note Type', 
        options: [
          { value: 'daily_activity', label: 'Daily Activity' },
          { value: 'incident', label: 'Incident Report' },
          { value: 'medication', label: 'Medication' },
          { value: 'behavior', label: 'Behavior Observation' },
          { value: 'progress', label: 'Progress Update' }
        ], 
        required: true 
      },
      { 
        id: 'note_content', 
        name: 'note_content', 
        type: 'textarea', 
        label: 'Note Content', 
        required: true,
        placeholder: 'Detailed description of the activity or observation'
      },
      { 
        id: 'staff_member', 
        name: 'staff_member', 
        type: 'text', 
        label: 'Staff Member',
        placeholder: 'Name of staff member'
      },
      { 
        id: 'location', 
        name: 'location', 
        type: 'text', 
        label: 'Location',
        placeholder: 'Where this activity took place'
      },
      { 
        id: 'is_private', 
        name: 'is_private', 
        type: 'checkbox', 
        label: 'Private Note',
        defaultValue: false
      }
    ]
  },
  'form-pws-assessments': {
    id: 'form-pws-assessments',
    name: 'Assessments',
    description: 'Conduct and record client assessments',
    dataModel: 'assessments',
    displayOptions: {
      showInTable: true,
      tableColumns: ['assessment_type', 'assessment_date', 'assessor', 'status'],
      defaultSort: 'assessment_date'
    },
    fields: [
      { 
        id: 'assessment_type', 
        name: 'assessment_type', 
        type: 'select', 
        label: 'Assessment Type', 
        options: [
          { value: 'initial', label: 'Initial Assessment' },
          { value: 'ongoing', label: 'Ongoing Assessment' },
          { value: 'review', label: 'Review Assessment' },
          { value: 'discharge', label: 'Discharge Assessment' }
        ], 
        required: true 
      },
      { 
        id: 'assessment_date', 
        name: 'assessment_date', 
        type: 'date', 
        label: 'Assessment Date', 
        required: true 
      },
      { 
        id: 'assessor', 
        name: 'assessor', 
        type: 'text', 
        label: 'Assessor',
        placeholder: 'Name of person conducting assessment'
      },
      { 
        id: 'assessment_findings', 
        name: 'assessment_findings', 
        type: 'textarea', 
        label: 'Assessment Findings', 
        required: true,
        placeholder: 'Detailed findings from the assessment'
      },
      { 
        id: 'recommendations', 
        name: 'recommendations', 
        type: 'textarea', 
        label: 'Recommendations',
        placeholder: 'Recommendations based on assessment'
      },
      { 
        id: 'next_review_date', 
        name: 'next_review_date', 
        type: 'date', 
        label: 'Next Review Date'
      },
      { 
        id: 'status', 
        name: 'status', 
        type: 'select', 
        label: 'Status', 
        options: [
          { value: 'draft', label: 'Draft' },
          { value: 'completed', label: 'Completed' },
          { value: 'reviewed', label: 'Reviewed' }
        ], 
        required: true 
      }
    ]
  },
  'form-pws-medications': {
    id: 'form-pws-medications',
    name: 'Medication Management',
    description: 'Track medication administration and management',
    dataModel: 'medications',
    displayOptions: {
      showInTable: true,
      tableColumns: ['medication_name', 'dosage', 'frequency', 'status'],
      defaultSort: 'medication_name'
    },
    fields: [
      { 
        id: 'medication_name', 
        name: 'medication_name', 
        type: 'text', 
        label: 'Medication Name', 
        required: true,
        placeholder: 'Name of the medication'
      },
      { 
        id: 'dosage', 
        name: 'dosage', 
        type: 'text', 
        label: 'Dosage', 
        required: true,
        placeholder: 'e.g., 10mg, 1 tablet'
      },
      { 
        id: 'frequency', 
        name: 'frequency', 
        type: 'select', 
        label: 'Frequency', 
        options: [
          { value: 'daily', label: 'Daily' },
          { value: 'twice_daily', label: 'Twice Daily' },
          { value: 'three_times_daily', label: 'Three Times Daily' },
          { value: 'weekly', label: 'Weekly' },
          { value: 'as_needed', label: 'As Needed' }
        ], 
        required: true 
      },
      { 
        id: 'route', 
        name: 'route', 
        type: 'select', 
        label: 'Route', 
        options: [
          { value: 'oral', label: 'Oral' },
          { value: 'topical', label: 'Topical' },
          { value: 'injection', label: 'Injection' },
          { value: 'inhalation', label: 'Inhalation' }
        ], 
        required: true 
      },
      { 
        id: 'start_date', 
        name: 'start_date', 
        type: 'date', 
        label: 'Start Date', 
        required: true 
      },
      { 
        id: 'end_date', 
        name: 'end_date', 
        type: 'date', 
        label: 'End Date'
      },
      { 
        id: 'prescribed_by', 
        name: 'prescribed_by', 
        type: 'text', 
        label: 'Prescribed By',
        placeholder: 'Name of prescribing doctor'
      },
      { 
        id: 'status', 
        name: 'status', 
        type: 'select', 
        label: 'Status', 
        options: [
          { value: 'active', label: 'Active' },
          { value: 'discontinued', label: 'Discontinued' },
          { value: 'completed', label: 'Completed' }
        ], 
        required: true 
      },
      { 
        id: 'notes', 
        name: 'notes', 
        type: 'textarea', 
        label: 'Notes',
        placeholder: 'Additional notes about this medication'
      }
    ]
  }
};

/**
 * Get form configuration by form ID
 * @param formId - The form ID to look up
 * @returns FormConfig if found, undefined otherwise
 */
export function getFormConfig(formId: string): FormConfig | undefined {
  return formConfigs[formId];
}

/**
 * Get all available form configurations
 * @returns Array of all form configurations
 */
export function getAllFormConfigs(): FormConfig[] {
  return Object.values(formConfigs);
}

/**
 * Check if a form configuration exists
 * @param formId - The form ID to check
 * @returns true if form exists, false otherwise
 */
export function hasFormConfig(formId: string): boolean {
  return formId in formConfigs;
}

/**
 * Get form configuration for a tab
 * @param tabId - The tab ID to get form for
 * @returns FormConfig if tab has a linked form, undefined otherwise
 */
export function getFormConfigForTab(tabId: string): FormConfig | undefined {
  // This would typically look up the tab's formId from your tab management system
  // For now, we'll use a simple mapping
  const tabFormMapping: Record<string, string> = {
    'tab-pws-goals': 'form-pws-goals',
    'tab-pws-notes': 'form-pws-notes',
    'tab-pws-assessments': 'form-pws-assessments',
    'tab-pws-medications': 'form-pws-medications'
  };
  
  const formId = tabFormMapping[tabId];
  return formId ? getFormConfig(formId) : undefined;
}

/**
 * Register a new form configuration
 * @param formConfig - The form configuration to register
 * @returns true if registration successful, false if form ID already exists
 */
export function registerFormConfig(formConfig: FormConfig): boolean {
  if (formConfigs[formConfig.id]) {
    return false; // Form already exists
  }
  
  formConfigs[formConfig.id] = formConfig;
  return true;
}

/**
 * Auto-discover and register forms from system settings
 * This function can be called when the system settings are loaded
 * to ensure all forms are properly registered
 */
export function autoRegisterForms(): void {
  // This would typically scan the system settings for forms
  // and register any that aren't already in the config
  console.log('Auto-registering forms...');
  
  // Example: If you have forms in localStorage or settings that aren't in formConfigs,
  // you could add them here
}

/**
 * Get available form IDs for dropdowns in system settings
 * @returns Array of form IDs and names for selection
 */
export function getAvailableFormOptions(): { value: string; label: string }[] {
  return Object.values(formConfigs).map(config => ({
    value: config.id,
    label: config.name
  }));
} 