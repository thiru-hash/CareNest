import type {
  Staff,
  Property,
  Client,
  RosterEntry,
  ClockEvent,
  AccessGrant,
  AccessAuditLog,
  RBACConfig,
  CurrentRBACAccess,
  RBACAccessRequest,
  RBACValidationResult,
  AccessHistoryFilters
} from '../types/rbac';

// Mock data for demonstration - in production, this would be database calls
import { mockStaff, mockProperties, mockClients, mockRosterEntries } from '../data/rbac-mock-data';

export class RBACService {
  private static instance: RBACService;
  private accessGrants: AccessGrant[] = [];
  private clockEvents: ClockEvent[] = [];
  private auditLogs: AccessAuditLog[] = [];

  static getInstance(): RBACService {
    if (!RBACService.instance) {
      RBACService.instance = new RBACService();
    }
    return RBACService.instance;
  }

  // ===== ACCESS CONTROL METHODS =====

  async getAccessibleProperties(staffId: string): Promise<Property[]> {
    const staff = mockStaff.find(s => s.id === staffId);
    if (!staff) return [];

    // Check if RBAC is enabled for this staff member
    if (!staff.rbacEnabled) {
      // Return all properties if RBAC is disabled
      return mockProperties;
    }

    // Get active access grants for this staff member
    const activeGrants = this.accessGrants.filter(
      grant => grant.staffId === staffId && !grant.revokedAt
    );

    const propertyIds = [...new Set(activeGrants.map(grant => grant.propertyId))];
    return mockProperties.filter(property => propertyIds.includes(property.id));
  }

  async getAccessibleClients(staffId: string): Promise<Client[]> {
    const accessibleProperties = await this.getAccessibleProperties(staffId);
    const propertyIds = accessibleProperties.map(p => p.id);
    
    return mockClients.filter(client => propertyIds.includes(client.propertyId));
  }

  async canAccessProperty(staffId: string, propertyId: string): Promise<boolean> {
    const accessibleProperties = await this.getAccessibleProperties(staffId);
    return accessibleProperties.some(property => property.id === propertyId);
  }

  async canAccessClient(staffId: string, clientId: string): Promise<boolean> {
    const client = mockClients.find(c => c.id === clientId);
    if (!client) return false;
    
    return await this.canAccessProperty(staffId, client.propertyId);
  }

  // ===== CLOCK EVENT METHODS =====

  async clockIn(
    staffId: string, 
    rosterEntryId: string, 
    location?: { lat: number; lng: number }
  ): Promise<void> {
    const staff = mockStaff.find(s => s.id === staffId);
    const rosterEntry = mockRosterEntries.find(r => r.id === rosterEntryId);
    
    if (!staff || !rosterEntry) {
      throw new Error('Staff or roster entry not found');
    }

    // Create clock event
    const clockEvent: ClockEvent = {
      id: `ce_${Date.now()}`,
      organizationId: staff.organizationId,
      staffId,
      rosterEntryId,
      eventType: 'clock_in',
      timestamp: new Date(),
      locationLat: location?.lat,
      locationLng: location?.lng,
      createdAt: new Date()
    };

    this.clockEvents.push(clockEvent);

    // Grant access if RBAC is enabled
    if (staff.rbacEnabled) {
      await this.grantAccess(staffId, rosterEntry.propertyId, rosterEntryId, 'rbac_automatic');
    }

    // Log audit event
    await this.logAuditEvent({
      organizationId: staff.organizationId,
      staffId,
      action: 'access_granted',
      resourceType: 'property',
      resourceId: rosterEntry.propertyId,
      reason: 'Clock-in event triggered automatic access grant'
    });

    console.log(`Staff ${staff.name} clocked in for roster entry ${rosterEntryId}`);
  }

  async clockOut(
    staffId: string, 
    rosterEntryId: string, 
    location?: { lat: number; lng: number }
  ): Promise<void> {
    const staff = mockStaff.find(s => s.id === staffId);
    const rosterEntry = mockRosterEntries.find(r => r.id === rosterEntryId);
    
    if (!staff || !rosterEntry) {
      throw new Error('Staff or roster entry not found');
    }

    // Create clock event
    const clockEvent: ClockEvent = {
      id: `ce_${Date.now()}`,
      organizationId: staff.organizationId,
      staffId,
      rosterEntryId,
      eventType: 'clock_out',
      timestamp: new Date(),
      locationLat: location?.lat,
      locationLng: location?.lng,
      createdAt: new Date()
    };

    this.clockEvents.push(clockEvent);

    // Revoke access if RBAC is enabled
    if (staff.rbacEnabled) {
      await this.revokeAccess(staffId, rosterEntry.propertyId);
    }

    // Log audit event
    await this.logAuditEvent({
      organizationId: staff.organizationId,
      staffId,
      action: 'access_revoked',
      resourceType: 'property',
      resourceId: rosterEntry.propertyId,
      reason: 'Clock-out event triggered automatic access revocation'
    });

    console.log(`Staff ${staff.name} clocked out for roster entry ${rosterEntryId}`);
  }

  // ===== ACCESS MANAGEMENT METHODS =====

  async grantAccess(
    staffId: string, 
    propertyId: string, 
    rosterEntryId: string, 
    grantType: AccessGrant['grantType']
  ): Promise<void> {
    const staff = mockStaff.find(s => s.id === staffId);
    const property = mockProperties.find(p => p.id === propertyId);
    const rosterEntry = mockRosterEntries.find(r => r.id === rosterEntryId);

    if (!staff || !property || !rosterEntry) {
      throw new Error('Staff, property, or roster entry not found');
    }

    // Revoke any existing access for this staff/property combination
    await this.revokeAccess(staffId, propertyId);

    // Create new access grant
    const accessGrant: AccessGrant = {
      id: `ag_${Date.now()}`,
      organizationId: staff.organizationId,
      staffId,
      propertyId,
      rosterEntryId,
      grantType,
      grantedAt: new Date(),
      createdAt: new Date()
    };

    this.accessGrants.push(accessGrant);

    console.log(`Access granted to ${staff.name} for property ${property.name}`);
  }

  async revokeAccess(staffId: string, propertyId: string): Promise<void> {
    const staff = mockStaff.find(s => s.id === staffId);
    const property = mockProperties.find(p => p.id === propertyId);

    if (!staff || !property) {
      throw new Error('Staff or property not found');
    }

    // Find and revoke active access grants
    const activeGrants = this.accessGrants.filter(
      grant => grant.staffId === staffId && 
               grant.propertyId === propertyId && 
               !grant.revokedAt
    );

    activeGrants.forEach(grant => {
      grant.revokedAt = new Date();
    });

    console.log(`Access revoked for ${staff.name} from property ${property.name}`);
  }

  // ===== CONFIGURATION METHODS =====

  async updateRBACConfig(organizationId: string, config: RBACConfig): Promise<void> {
    // In production, this would update the database
    console.log(`RBAC config updated for organization ${organizationId}:`, config);
  }

  async getRBACConfig(organizationId: string): Promise<RBACConfig> {
    // Mock configuration - in production, this would come from database
    return {
      organizationEnabled: true,
      roleConfigurations: [
        {
          roleId: 'role_1',
          roleName: 'Support Facilitator',
          rbacEnabled: true,
          permissions: ['view_clients', 'edit_clients', 'view_properties']
        },
        {
          roleId: 'role_2',
          roleName: 'House Lead',
          rbacEnabled: true,
          permissions: ['view_clients', 'edit_clients', 'view_properties', 'manage_staff']
        },
        {
          roleId: 'role_3',
          roleName: 'Office Admin',
          rbacEnabled: false,
          permissions: ['view_all', 'edit_all']
        }
      ],
      globalSettings: {
        strictMode: false,
        gracePeriodMinutes: 15,
        requireLocation: true,
        maxDistanceMeters: 100,
        auditLogging: true,
        notifications: {
          onClockIn: true,
          onClockOut: true,
          onAccessGranted: true,
          onAccessRevoked: true
        }
      }
    };
  }

  // ===== MONITORING METHODS =====

  async getCurrentAccess(organizationId: string): Promise<CurrentRBACAccess[]> {
    const currentAccess: CurrentRBACAccess[] = [];

    for (const grant of this.accessGrants) {
      if (grant.organizationId === organizationId && !grant.revokedAt) {
        const staff = mockStaff.find(s => s.id === grant.staffId);
        const property = mockProperties.find(p => p.id === grant.propertyId);
        const rosterEntry = mockRosterEntries.find(r => r.id === grant.rosterEntryId);

        if (staff && property && rosterEntry) {
          // Get last clock event
          const lastClockEvent = this.clockEvents
            .filter(ce => ce.staffId === staff.id && ce.eventType === 'clock_in')
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];

          currentAccess.push({
            staffId: staff.id,
            staffName: staff.name,
            propertyId: property.id,
            propertyName: property.name,
            rosterEntryId: rosterEntry.id,
            startTime: rosterEntry.startTime,
            endTime: rosterEntry.endTime,
            lastClockEvent: lastClockEvent?.timestamp,
            accessGrantedAt: grant.grantedAt
          });
        }
      }
    }

    return currentAccess;
  }

  async getAccessHistory(
    organizationId: string, 
    filters?: AccessHistoryFilters
  ): Promise<AccessAuditLog[]> {
    let logs = this.auditLogs.filter(log => log.organizationId === organizationId);

    if (filters) {
      if (filters.staffId) {
        logs = logs.filter(log => log.staffId === filters.staffId);
      }
      if (filters.propertyId) {
        logs = logs.filter(log => log.resourceId === filters.propertyId);
      }
      if (filters.action) {
        logs = logs.filter(log => log.action === filters.action);
      }
      if (filters.startDate) {
        logs = logs.filter(log => log.createdAt >= filters.startDate!);
      }
      if (filters.endDate) {
        logs = logs.filter(log => log.createdAt <= filters.endDate!);
      }
    }

    // Sort by creation date (newest first)
    logs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Apply limit and offset
    if (filters?.offset) {
      logs = logs.slice(filters.offset);
    }
    if (filters?.limit) {
      logs = logs.slice(0, filters.limit);
    }

    return logs;
  }

  // ===== UTILITY METHODS =====

  private async logAuditEvent(event: Omit<AccessAuditLog, 'id' | 'createdAt'>): Promise<void> {
    const auditLog: AccessAuditLog = {
      id: `audit_${Date.now()}`,
      ...event,
      createdAt: new Date()
    };

    this.auditLogs.push(auditLog);
  }

  async validateRBACConfig(config: RBACConfig): Promise<RBACValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate organization-level settings
    if (config.organizationEnabled && config.globalSettings.strictMode) {
      if (config.globalSettings.gracePeriodMinutes > 30) {
        warnings.push('Grace period is set to more than 30 minutes');
      }
    }

    // Validate role configurations
    const enabledRoles = config.roleConfigurations.filter(role => role.rbacEnabled);
    if (enabledRoles.length === 0) {
      errors.push('No roles have RBAC enabled');
    }

    // Check for conflicting permissions
    for (const role of config.roleConfigurations) {
      if (role.rbacEnabled && role.permissions.length === 0) {
        warnings.push(`Role "${role.roleName}" has RBAC enabled but no permissions`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // ===== TESTING METHODS =====

  async resetForTesting(): Promise<void> {
    this.accessGrants = [];
    this.clockEvents = [];
    this.auditLogs = [];
    console.log('RBAC service reset for testing');
  }

  async getTestData(): Promise<{
    accessGrants: AccessGrant[];
    clockEvents: ClockEvent[];
    auditLogs: AccessAuditLog[];
  }> {
    return {
      accessGrants: this.accessGrants,
      clockEvents: this.clockEvents,
      auditLogs: this.auditLogs
    };
  }
}

// Export singleton instance
export const rbacService = RBACService.getInstance(); 