// ===== PEOPLE MODULE TYPES =====

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  status: 'Active' | 'Inactive' | 'Pending';
  dateOfBirth?: Date;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalInfo?: {
    conditions: string[];
    allergies: string[];
    medications: string[];
  };
  supportPlan?: {
    goals: string[];
    preferences: string[];
    restrictions: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  role: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  employmentType: 'Full-time' | 'Part-time' | 'Casual' | 'Contract';
  startDate: Date;
  endDate?: Date;
  payRate: number;
  location: string;
  department: string;
  managerId?: string;
  skills: string[];
  certifications: {
    name: string;
    expiryDate: Date;
    status: 'Valid' | 'Expired' | 'Pending';
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  type: 'Department' | 'Team' | 'Project' | 'Custom';
  members: string[]; // User IDs
  permissions: {
    [moduleId: string]: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface PeopleFilters {
  search?: string;
  status?: string;
  role?: string;
  location?: string;
  department?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface PeopleSort {
  field: 'name' | 'email' | 'role' | 'status' | 'createdAt';
  direction: 'asc' | 'desc';
} 