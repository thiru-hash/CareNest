// RBAC System Types

export interface Organization {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  logoUrl?: string;
  primaryColor?: string;
  settings: OrganizationSettings;
  rbacEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationSettings {
  timezone: string;
  dateFormat: string;
  currency: string;
  gstEnabled: boolean;
  gstRate: number;
  defaultLanguage: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  rbac: {
    enabled: boolean;
    strictMode: boolean;
    gracePeriodMinutes: number;
    requireLocation: boolean;
    maxDistanceMeters: number;
  };
}

export interface Role {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  rbacEnabled: boolean;
  permissions: Record<string, boolean>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Staff {
  id: string;
  organizationId: string;
  userId: string;
  roleId: string;
  name: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive' | 'suspended';
  rbacEnabled: boolean;
  role?: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface Property {
  id: string;
  organizationId: string;
  name: string;
  address: string;
  type: 'residential' | 'community' | 'office';
  status: 'active' | 'inactive' | 'maintenance';
  settings: PropertySettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertySettings {
  maxOccupancy: number;
  supportLevel: 'low' | 'medium' | 'high';
  accessibility: string[];
  emergencyContacts: EmergencyContact[];
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

export interface Client {
  id: string;
  organizationId: string;
  propertyId: string;
  name: string;
  status: 'active' | 'inactive' | 'discharged';
  supportPlan: SupportPlan;
  property?: Property;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupportPlan {
  level: 'low' | 'medium' | 'high';
  needs: string[];
  goals: string[];
  medications: Medication[];
  allergies: string[];
  emergencyContacts: EmergencyContact[];
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: string[];
  notes?: string;
}

export interface RosterEntry {
  id: string;
  organizationId: string;
  staffId: string;
  propertyId: string;
  startTime: Date;
  endTime: Date;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  notes?: string;
  staff?: Staff;
  property?: Property;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClockEvent {
  id: string;
  organizationId: string;
  staffId: string;
  rosterEntryId: string;
  eventType: 'clock_in' | 'clock_out';
  timestamp: Date;
  locationLat?: number;
  locationLng?: number;
  notes?: string;
  staff?: Staff;
  rosterEntry?: RosterEntry;
  createdAt: Date;
}

export interface AccessGrant {
  id: string;
  organizationId: string;
  staffId: string;
  propertyId: string;
  rosterEntryId: string;
  clockEventId?: string;
  grantType: 'rbac_automatic' | 'manual' | 'temporary';
  grantedAt: Date;
  revokedAt?: Date;
  expiresAt?: Date;
  staff?: Staff;
  property?: Property;
  rosterEntry?: RosterEntry;
  clockEvent?: ClockEvent;
  createdAt: Date;
}

export interface AccessAuditLog {
  id: string;
  organizationId: string;
  staffId?: string;
  action: 'access_granted' | 'access_revoked' | 'access_denied' | 'access_requested';
  resourceType: 'property' | 'client' | 'document' | 'roster';
  resourceId?: string;
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
  staff?: Staff;
  createdAt: Date;
}

// RBAC Access Control Types
export interface RBACAccess {
  staffId: string;
  propertyId: string;
  rosterEntryId: string;
  grantedAt: Date;
  expiresAt?: Date;
  staffName: string;
  propertyName: string;
  organizationName: string;
}

export interface CurrentRBACAccess {
  staffId: string;
  staffName: string;
  propertyId: string;
  propertyName: string;
  rosterEntryId: string;
  startTime: Date;
  endTime: Date;
  lastClockEvent?: Date;
  accessGrantedAt?: Date;
}

// RBAC Configuration Types
export interface RBACConfig {
  organizationEnabled: boolean;
  roleConfigurations: RoleRBACConfig[];
  globalSettings: GlobalRBACSettings;
}

export interface RoleRBACConfig {
  roleId: string;
  roleName: string;
  rbacEnabled: boolean;
  permissions: string[];
}

export interface GlobalRBACSettings {
  strictMode: boolean;
  gracePeriodMinutes: number;
  requireLocation: boolean;
  maxDistanceMeters: number;
  auditLogging: boolean;
  notifications: {
    onClockIn: boolean;
    onClockOut: boolean;
    onAccessGranted: boolean;
    onAccessRevoked: boolean;
  };
}

// RBAC Service Types
export interface RBACService {
  // Access Control
  getAccessibleProperties(staffId: string): Promise<Property[]>;
  getAccessibleClients(staffId: string): Promise<Client[]>;
  canAccessProperty(staffId: string, propertyId: string): Promise<boolean>;
  canAccessClient(staffId: string, clientId: string): Promise<boolean>;
  
  // Clock Events
  clockIn(staffId: string, rosterEntryId: string, location?: { lat: number; lng: number }): Promise<void>;
  clockOut(staffId: string, rosterEntryId: string, location?: { lat: number; lng: number }): Promise<void>;
  
  // Access Management
  grantAccess(staffId: string, propertyId: string, rosterEntryId: string, grantType: AccessGrant['grantType']): Promise<void>;
  revokeAccess(staffId: string, propertyId: string): Promise<void>;
  
  // Configuration
  updateRBACConfig(organizationId: string, config: RBACConfig): Promise<void>;
  getRBACConfig(organizationId: string): Promise<RBACConfig>;
  
  // Monitoring
  getCurrentAccess(organizationId: string): Promise<CurrentRBACAccess[]>;
  getAccessHistory(organizationId: string, filters?: AccessHistoryFilters): Promise<AccessAuditLog[]>;
}

export interface AccessHistoryFilters {
  staffId?: string;
  propertyId?: string;
  action?: AccessAuditLog['action'];
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

// RBAC Event Types
export interface RBACEvent {
  type: 'access_granted' | 'access_revoked' | 'clock_in' | 'clock_out';
  staffId: string;
  propertyId?: string;
  rosterEntryId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// RBAC Validation Types
export interface RBACValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface RBACAccessRequest {
  staffId: string;
  propertyId: string;
  rosterEntryId?: string;
  reason?: string;
  requestType: 'automatic' | 'manual' | 'emergency';
} 