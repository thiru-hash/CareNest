import type { Tenant, TenantLicense, LicenseUsage, User, LicenseModel } from './types';

// ===== LICENSE VALIDATION =====

export interface LicenseValidationResult {
  isValid: boolean;
  canLogin: boolean;
  reason?: string;
  availableSlots?: number;
  currentUsage?: number;
}

export interface LicenseUsageResult {
  success: boolean;
  message: string;
  usage?: LicenseUsage;
}

// ===== LICENSE MANAGEMENT =====

export class LicenseManager {
  private static instance: LicenseManager;
  private activeSessions: Map<string, LicenseUsage> = new Map();

  static getInstance(): LicenseManager {
    if (!LicenseManager.instance) {
      LicenseManager.instance = new LicenseManager();
    }
    return LicenseManager.instance;
  }

  /**
   * Validates if a user can log in based on license model
   */
  validateLogin(user: User, tenant: Tenant): LicenseValidationResult {
    const license = tenant.license;
    
    // Check if license is active
    if (!license.isActive) {
      return {
        isValid: false,
        canLogin: false,
        reason: 'License is inactive or expired'
      };
    }

    // Check license expiration
    if (new Date() > license.endDate) {
      return {
        isValid: false,
        canLogin: false,
        reason: 'License has expired'
      };
    }

    switch (license.model) {
      case 'per_user':
        return this.validatePerUserLicense(user, tenant);
      
      case 'pooled':
        return this.validatePooledLicense(user, tenant);
      
      case 'unlimited':
        return {
          isValid: true,
          canLogin: true,
          availableSlots: -1,
          currentUsage: this.getActiveUserCount(tenant.id)
        };
      
      default:
        return {
          isValid: false,
          canLogin: false,
          reason: 'Invalid license model'
        };
    }
  }

  /**
   * Validates per-user licensing model
   */
  private validatePerUserLicense(user: User, tenant: Tenant): LicenseValidationResult {
    const license = tenant.license;
    const totalUsers = license.totalUsers;
    const maxUsers = license.maxUsers;

    if (totalUsers >= maxUsers) {
      return {
        isValid: false,
        canLogin: false,
        reason: `Maximum users (${maxUsers}) reached. Contact support to upgrade.`,
        availableSlots: 0,
        currentUsage: totalUsers
      };
    }

    return {
      isValid: true,
      canLogin: true,
      availableSlots: maxUsers - totalUsers,
      currentUsage: totalUsers
    };
  }

  /**
   * Validates pooled licensing model
   */
  private validatePooledLicense(user: User, tenant: Tenant): LicenseValidationResult {
    const license = tenant.license;
    const activeUsers = this.getActiveUserCount(tenant.id);
    const maxUsers = license.maxUsers;

    // Check if user is already active
    const existingSession = this.activeSessions.get(user.id);
    if (existingSession?.isActive) {
      return {
        isValid: true,
        canLogin: true,
        availableSlots: maxUsers - activeUsers,
        currentUsage: activeUsers
      };
    }

    // Check if there are available slots
    if (activeUsers >= maxUsers) {
      return {
        isValid: false,
        canLogin: false,
        reason: `Maximum concurrent users (${maxUsers}) reached. Please wait for a slot to become available.`,
        availableSlots: 0,
        currentUsage: activeUsers
      };
    }

    return {
      isValid: true,
      canLogin: true,
      availableSlots: maxUsers - activeUsers,
      currentUsage: activeUsers
    };
  }

  /**
   * Records user login and starts license usage tracking
   */
  startUserSession(user: User, tenant: Tenant): LicenseUsageResult {
    const validation = this.validateLogin(user, tenant);
    
    if (!validation.canLogin) {
      return {
        success: false,
        message: validation.reason || 'Login not allowed'
      };
    }

    const usage: LicenseUsage = {
      userId: user.id,
      tenantId: tenant.id,
      sessionStart: new Date(),
      isActive: true,
      deviceInfo: {
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server',
        ipAddress: '127.0.0.1', // Would be real IP in production
        location: 'Unknown'
      }
    };

    this.activeSessions.set(user.id, usage);

    return {
      success: true,
      message: 'Session started successfully',
      usage
    };
  }

  /**
   * Ends user session and frees up license slot
   */
  endUserSession(userId: string): LicenseUsageResult {
    const session = this.activeSessions.get(userId);
    
    if (!session) {
      return {
        success: false,
        message: 'No active session found'
      };
    }

    session.sessionEnd = new Date();
    session.isActive = false;
    this.activeSessions.delete(userId);

    return {
      success: true,
      message: 'Session ended successfully',
      usage: session
    };
  }

  /**
   * Gets current active user count for a tenant
   */
  getActiveUserCount(tenantId: string): number {
    let count = 0;
    for (const session of this.activeSessions.values()) {
      if (session.tenantId === tenantId && session.isActive) {
        count++;
      }
    }
    return count;
  }

  /**
   * Gets all active sessions for a tenant
   */
  getActiveSessions(tenantId: string): LicenseUsage[] {
    return Array.from(this.activeSessions.values())
      .filter(session => session.tenantId === tenantId && session.isActive);
  }

  /**
   * Cleans up expired sessions (should be called periodically)
   */
  cleanupExpiredSessions(): void {
    const now = new Date();
    const maxSessionDuration = 24 * 60 * 60 * 1000; // 24 hours

    for (const [userId, session] of this.activeSessions.entries()) {
      const sessionDuration = now.getTime() - session.sessionStart.getTime();
      if (sessionDuration > maxSessionDuration) {
        this.endUserSession(userId);
      }
    }
  }
}

// ===== LICENSE UTILITIES =====

export function createMockTenant(overrides: Partial<Tenant> = {}): Tenant {
  return {
    id: 'tenant-1',
    name: 'CareNest Demo Organization',
    slug: 'carenest-demo',
    license: {
      id: 'license-1',
      tenantId: 'tenant-1',
      model: 'pooled',
      maxUsers: 20,
      activeUsers: 0,
      totalUsers: 8,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      isActive: true,
      features: ['dashboard', 'roster', 'people', 'finance', 'settings'],
      restrictions: {
        maxProperties: 10,
        maxClients: 100,
        maxShiftsPerMonth: 1000,
        storageLimitGB: 50
      }
    },
    settings: {
      timezone: 'Pacific/Auckland',
      dateFormat: 'DD/MM/YYYY',
      currency: 'NZD',
      gstEnabled: true,
      gstRate: 0.15,
      defaultLanguage: 'en',
      notifications: {
        email: true,
        sms: false,
        push: true
      }
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    ...overrides
  };
}

export function getLicenseStatus(tenant: Tenant): {
  status: 'active' | 'expired' | 'inactive';
  daysUntilExpiry: number;
  usagePercentage: number;
} {
  const now = new Date();
  const daysUntilExpiry = Math.ceil((tenant.license.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  let status: 'active' | 'expired' | 'inactive';
  if (!tenant.license.isActive) {
    status = 'inactive';
  } else if (daysUntilExpiry <= 0) {
    status = 'expired';
  } else {
    status = 'active';
  }

  const usagePercentage = tenant.license.model === 'per_user' 
    ? (tenant.license.totalUsers / tenant.license.maxUsers) * 100
    : (tenant.license.activeUsers / tenant.license.maxUsers) * 100;

  return {
    status,
    daysUntilExpiry,
    usagePercentage: Math.min(usagePercentage, 100)
  };
} 