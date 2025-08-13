import type { Staff, Property, Client, RosterEntry } from '../types/rbac';

// Mock Organizations
export const mockOrganizations = [
  {
    id: 'org_1',
    name: 'CareNest Disability Services',
    slug: 'carenest',
    domain: 'carenest.com',
    logoUrl: '/logo.png',
    primaryColor: '#34D399',
    settings: {
      timezone: 'Pacific/Auckland',
      dateFormat: 'DD/MM/YYYY',
      currency: 'NZD',
      gstEnabled: true,
      gstRate: 0.15,
      defaultLanguage: 'en',
      notifications: {
        email: true,
        sms: true,
        push: true
      },
      rbac: {
        enabled: true,
        strictMode: false,
        gracePeriodMinutes: 15,
        requireLocation: true,
        maxDistanceMeters: 100
      }
    },
    rbacEnabled: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Mock Roles
export const mockRoles = [
  {
    id: 'role_1',
    organizationId: 'org_1',
    name: 'Support Facilitator',
    description: 'Direct support staff working with clients',
    rbacEnabled: true,
    permissions: {
      'view_clients': true,
      'edit_clients': true,
      'view_properties': true,
      'clock_in_out': true,
      'manage_staff': false,
      'view_all': false,
      'edit_all': false,
      'manage_system': false
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'role_2',
    organizationId: 'org_1',
    name: 'House Lead',
    description: 'Senior staff managing specific properties',
    rbacEnabled: true,
    permissions: {
      'view_clients': true,
      'edit_clients': true,
      'view_properties': true,
      'manage_staff': true,
      'clock_in_out': true,
      'view_all': false,
      'edit_all': false,
      'manage_system': false
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'role_3',
    organizationId: 'org_1',
    name: 'Office Admin',
    description: 'Administrative staff with full access',
    rbacEnabled: false,
    permissions: {
      'view_clients': false,
      'edit_clients': false,
      'view_properties': false,
      'clock_in_out': false,
      'manage_staff': false,
      'view_all': true,
      'edit_all': true,
      'manage_system': true
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Mock Staff
export const mockStaff: Staff[] = [
  {
    id: 'staff_1',
    organizationId: 'org_1',
    userId: 'user_1',
    roleId: 'role_1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@carenest.com',
    phone: '+64 21 123 4567',
    status: 'active',
    rbacEnabled: true,
    role: mockRoles[0],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'staff_2',
    organizationId: 'org_1',
    userId: 'user_2',
    roleId: 'role_2',
    name: 'Michael Chen',
    email: 'michael.chen@carenest.com',
    phone: '+64 21 234 5678',
    status: 'active',
    rbacEnabled: true,
    role: mockRoles[1],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'staff_3',
    organizationId: 'org_1',
    userId: 'user_3',
    roleId: 'role_3',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@carenest.com',
    phone: '+64 21 345 6789',
    status: 'active',
    rbacEnabled: false,
    role: mockRoles[2],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Mock Properties
export const mockProperties: Property[] = [
  {
    id: 'property_1',
    organizationId: 'org_1',
    name: 'Sunrise House',
    address: '123 Sunrise Street, Auckland',
    type: 'residential',
    status: 'active',
    settings: {
      maxOccupancy: 4,
      supportLevel: 'high',
      accessibility: ['wheelchair', 'hearing_loop', 'visual_aids'],
      emergencyContacts: [
        {
          name: 'Dr. Smith',
          phone: '+64 9 123 4567',
          relationship: 'GP',
          isPrimary: true
        }
      ]
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'property_2',
    organizationId: 'org_1',
    name: 'Community Hub',
    address: '456 Community Road, Auckland',
    type: 'community',
    status: 'active',
    settings: {
      maxOccupancy: 8,
      supportLevel: 'medium',
      accessibility: ['wheelchair', 'ramp'],
      emergencyContacts: [
        {
          name: 'Nurse Williams',
          phone: '+64 9 234 5678',
          relationship: 'Nurse',
          isPrimary: true
        }
      ]
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'property_3',
    organizationId: 'org_1',
    name: 'Independence Villa',
    address: '789 Independence Lane, Auckland',
    type: 'residential',
    status: 'active',
    settings: {
      maxOccupancy: 2,
      supportLevel: 'low',
      accessibility: ['wheelchair'],
      emergencyContacts: [
        {
          name: 'Dr. Brown',
          phone: '+64 9 345 6789',
          relationship: 'GP',
          isPrimary: true
        }
      ]
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Mock Clients
export const mockClients: Client[] = [
  {
    id: 'client_1',
    organizationId: 'org_1',
    propertyId: 'property_1',
    name: 'Emma Wilson',
    status: 'active',
    supportPlan: {
      level: 'high',
      needs: ['personal_care', 'medication_management', 'mobility_support'],
      goals: ['increase_independence', 'community_participation'],
      medications: [
        {
          name: 'Insulin',
          dosage: '10 units',
          frequency: 'twice daily',
          timeOfDay: ['morning', 'evening'],
          notes: 'Before meals'
        }
      ],
      allergies: ['nuts', 'shellfish'],
      emergencyContacts: [
        {
          name: 'John Wilson',
          phone: '+64 21 111 1111',
          relationship: 'Father',
          isPrimary: true
        }
      ]
    },
    property: mockProperties[0],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'client_2',
    organizationId: 'org_1',
    propertyId: 'property_1',
    name: 'David Lee',
    status: 'active',
    supportPlan: {
      level: 'high',
      needs: ['personal_care', 'communication_support', 'behavioral_support'],
      goals: ['improve_communication', 'reduce_anxiety'],
      medications: [
        {
          name: 'Sertraline',
          dosage: '50mg',
          frequency: 'daily',
          timeOfDay: ['morning'],
          notes: 'With breakfast'
        }
      ],
      allergies: ['dairy'],
      emergencyContacts: [
        {
          name: 'Maria Lee',
          phone: '+64 21 222 2222',
          relationship: 'Mother',
          isPrimary: true
        }
      ]
    },
    property: mockProperties[0],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'client_3',
    organizationId: 'org_1',
    propertyId: 'property_2',
    name: 'Sophie Anderson',
    status: 'active',
    supportPlan: {
      level: 'medium',
      needs: ['social_support', 'life_skills', 'community_access'],
      goals: ['develop_friendships', 'learn_cooking'],
      medications: [],
      allergies: [],
      emergencyContacts: [
        {
          name: 'Robert Anderson',
          phone: '+64 21 333 3333',
          relationship: 'Brother',
          isPrimary: true
        }
      ]
    },
    property: mockProperties[1],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Mock Roster Entries
export const mockRosterEntries: RosterEntry[] = [
  {
    id: 'roster_1',
    organizationId: 'org_1',
    staffId: 'staff_1',
    propertyId: 'property_1',
    startTime: new Date('2024-01-15T08:00:00Z'),
    endTime: new Date('2024-01-15T16:00:00Z'),
    status: 'scheduled',
    notes: 'Morning shift - high support needs',
    staff: mockStaff[0],
    property: mockProperties[0],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: 'roster_2',
    organizationId: 'org_1',
    staffId: 'staff_2',
    propertyId: 'property_1',
    startTime: new Date('2024-01-15T16:00:00Z'),
    endTime: new Date('2024-01-15T22:00:00Z'),
    status: 'scheduled',
    notes: 'Evening shift - house lead',
    staff: mockStaff[1],
    property: mockProperties[0],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: 'roster_3',
    organizationId: 'org_1',
    staffId: 'staff_1',
    propertyId: 'property_2',
    startTime: new Date('2024-01-16T09:00:00Z'),
    endTime: new Date('2024-01-16T17:00:00Z'),
    status: 'scheduled',
    notes: 'Community hub support',
    staff: mockStaff[0],
    property: mockProperties[1],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: 'roster_4',
    organizationId: 'org_1',
    staffId: 'staff_2',
    propertyId: 'property_3',
    startTime: new Date('2024-01-15T10:00:00Z'),
    endTime: new Date('2024-01-15T18:00:00Z'),
    status: 'scheduled',
    notes: 'Independence support',
    staff: mockStaff[1],
    property: mockProperties[2],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  }
]; 