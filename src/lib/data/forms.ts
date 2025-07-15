import type { CustomForm, FormField } from '@/lib/types';

export const staffFormConfig: CustomForm = {
  id: 'staff-form',
  name: 'Staff Registration Form',
  description: 'Dynamic staff registration form with customizable fields',
  linkedSectionId: 'staff',
  status: 'Active',
  fields: [
    {
      id: 'personal-info-headline',
      name: 'Personal Information',
      type: 'headline',
      required: false,
      order: 1
    },
    {
      id: 'preferredName',
      name: 'Preferred Name',
      type: 'text',
      required: true,
      order: 2,
      placeholder: 'Enter preferred name'
    },
    {
      id: 'surname',
      name: 'Surname',
      type: 'text',
      required: true,
      order: 3,
      placeholder: 'Enter surname'
    },
    {
      id: 'birthDate',
      name: 'Date of Birth',
      type: 'date',
      required: false,
      order: 4
    },
    {
      id: 'contact-info-headline',
      name: 'Contact Information',
      type: 'headline',
      required: false,
      order: 5
    },
    {
      id: 'companyEmail',
      name: 'Company Email',
      type: 'email',
      required: false,
      order: 6,
      placeholder: 'staff@company.com'
    },
    {
      id: 'phone',
      name: 'Phone Number',
      type: 'phone',
      required: false,
      order: 7,
      placeholder: '+64 21 123 4567'
    },
    {
      id: 'address',
      name: 'Address',
      type: 'textbox',
      required: false,
      order: 8,
      placeholder: 'Enter full address'
    },
    {
      id: 'emergencyContact',
      name: 'Emergency Contact',
      type: 'text',
      required: false,
      order: 9,
      placeholder: 'Name and phone number'
    },
    {
      id: 'employment-info-headline',
      name: 'Employment Details',
      type: 'headline',
      required: false,
      order: 10
    },
    {
      id: 'startDate',
      name: 'Start Date',
      type: 'date',
      required: false,
      order: 11
    },
    {
      id: 'employmentType',
      name: 'Employment Type',
      type: 'dropdown',
      required: false,
      order: 12,
      options: [
        { value: 'Full-Time', label: 'Full-Time' },
        { value: 'Part-Time', label: 'Part-Time' },
        { value: 'Casual', label: 'Casual' },
        { value: 'Contract', label: 'Contract' }
      ]
    },
    {
      id: 'payEquity',
      name: 'Pay Equity Level',
      type: 'dropdown',
      required: true,
      order: 13,
      options: [
        { value: 'Level 0 Pay rate', label: 'Level 0 Pay rate' },
        { value: 'Level 3 Pay rate', label: 'Level 3 Pay rate' },
        { value: 'Level 4 b Pay rate', label: 'Level 4 b Pay rate' },
        { value: 'Not Applicable', label: 'Not Applicable' }
      ]
    },
    {
      id: 'area',
      name: 'Work Area',
      type: 'dropdown',
      required: false,
      order: 14,
      options: [
        { value: 'ACC', label: 'ACC' },
        { value: 'Aspire HQ (103 Tawa)', label: 'Aspire HQ (103 Tawa)' },
        { value: 'Training', label: 'Training' },
        { value: 'EGL', label: 'EGL' },
        { value: '1 Holly Place', label: '1 Holly Place' },
        { value: '1 Waikaka Place (46 Maggie Place)', label: '1 Waikaka Place (46 Maggie Place)' },
        { value: '11 Nevada Road', label: '11 Nevada Road' },
        { value: '11/13 Anglesea Street', label: '11/13 Anglesea Street' },
        { value: '12 Stratford Place', label: '12 Stratford Place' },
        { value: '122 Mardon Road', label: '122 Mardon Road' }
      ]
    },
    {
      id: 'skills-headline',
      name: 'Skills & Qualifications',
      type: 'headline',
      required: false,
      order: 15
    },
    {
      id: 'skills',
      name: 'Skills',
      type: 'textbox',
      required: false,
      order: 16,
      placeholder: 'List key skills (comma separated)'
    },
    {
      id: 'certifications',
      name: 'Certifications',
      type: 'textbox',
      required: false,
      order: 17,
      placeholder: 'List certifications (comma separated)'
    },
    {
      id: 'additional-info-headline',
      name: 'Additional Information',
      type: 'headline',
      required: false,
      order: 18
    },
    {
      id: 'notes',
      name: 'Notes',
      type: 'richtext',
      required: false,
      order: 19,
      placeholder: 'Any additional notes or comments'
    }
  ]
};

export const staffViewFormConfig: CustomForm = {
  id: 'staff-view-form',
  name: 'Staff Details View',
  description: 'Read-only staff details form',
  linkedSectionId: 'staff',
  status: 'Active',
  fields: [
    {
      id: 'personal-info-headline',
      name: 'Personal Information',
      type: 'headline',
      required: false,
      order: 1
    },
    {
      id: 'preferredName',
      name: 'Preferred Name',
      type: 'text',
      required: false,
      order: 2,
      readonly: true
    },
    {
      id: 'surname',
      name: 'Surname',
      type: 'text',
      required: false,
      order: 3,
      readonly: true
    },
    {
      id: 'birthDate',
      name: 'Date of Birth',
      type: 'date',
      required: false,
      order: 4,
      readonly: true
    },
    {
      id: 'contact-info-headline',
      name: 'Contact Information',
      type: 'headline',
      required: false,
      order: 5
    },
    {
      id: 'companyEmail',
      name: 'Company Email',
      type: 'email',
      required: false,
      order: 6,
      readonly: true
    },
    {
      id: 'phone',
      name: 'Phone Number',
      type: 'phone',
      required: false,
      order: 7,
      readonly: true
    },
    {
      id: 'address',
      name: 'Address',
      type: 'textbox',
      required: false,
      order: 8,
      readonly: true
    },
    {
      id: 'emergencyContact',
      name: 'Emergency Contact',
      type: 'text',
      required: false,
      order: 9,
      readonly: true
    },
    {
      id: 'employment-info-headline',
      name: 'Employment Details',
      type: 'headline',
      required: false,
      order: 10
    },
    {
      id: 'startDate',
      name: 'Start Date',
      type: 'date',
      required: false,
      order: 11,
      readonly: true
    },
    {
      id: 'employmentType',
      name: 'Employment Type',
      type: 'dropdown',
      required: false,
      order: 12,
      readonly: true,
      options: [
        { value: 'Full-Time', label: 'Full-Time' },
        { value: 'Part-Time', label: 'Part-Time' },
        { value: 'Casual', label: 'Casual' },
        { value: 'Contract', label: 'Contract' }
      ]
    },
    {
      id: 'payEquity',
      name: 'Pay Equity Level',
      type: 'dropdown',
      required: false,
      order: 13,
      readonly: true,
      options: [
        { value: 'Level 0 Pay rate', label: 'Level 0 Pay rate' },
        { value: 'Level 3 Pay rate', label: 'Level 3 Pay rate' },
        { value: 'Level 4 b Pay rate', label: 'Level 4 b Pay rate' },
        { value: 'Not Applicable', label: 'Not Applicable' }
      ]
    },
    {
      id: 'area',
      name: 'Work Area',
      type: 'dropdown',
      required: false,
      order: 14,
      readonly: true,
      options: [
        { value: 'ACC', label: 'ACC' },
        { value: 'Aspire HQ (103 Tawa)', label: 'Aspire HQ (103 Tawa)' },
        { value: 'Training', label: 'Training' },
        { value: 'EGL', label: 'EGL' },
        { value: '1 Holly Place', label: '1 Holly Place' },
        { value: '1 Waikaka Place (46 Maggie Place)', label: '1 Waikaka Place (46 Maggie Place)' },
        { value: '11 Nevada Road', label: '11 Nevada Road' },
        { value: '11/13 Anglesea Street', label: '11/13 Anglesea Street' },
        { value: '12 Stratford Place', label: '12 Stratford Place' },
        { value: '122 Mardon Road', label: '122 Mardon Road' }
      ]
    }
  ]
}; 