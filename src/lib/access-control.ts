
'use server';

import { mockClients, mockProperties, mockShifts } from './data';
import { getRBACSettings, getTenantRBACSettings } from './settings';
import type { Staff, Client } from './types';

/**
 * Enhanced access control that respects RBAC settings
 */
export async function getAccessiblePropertyIds(user: Staff): Promise<string[]> {
    const rbacSettings = getRBACSettings();
    const tenantRBAC = getTenantRBACSettings();
    
    // Check if RBAC is enabled for this tenant
    if (!tenantRBAC.enabled) {
        return getAllPropertyIds(user);
    }
    
    // Check if user role is excluded from RBAC
    if (tenantRBAC.excludedRoles.includes(user.role)) {
        return getAllPropertyIds(user);
    }
    
    // Check if user role is allowed for RBAC
    if (!tenantRBAC.allowedRoles.includes(user.role)) {
        return []; // No access if role not allowed
    }
    
    // Apply RBAC logic
    if (rbacSettings.enabled && user.role === 'Support Worker') {
        return getRBACPropertyAccess(user);
    }
    
    // Fallback to standard access control
    return getAllPropertyIds(user);
}

/**
 * Gets all property IDs for admin/high-level roles
 */
function getAllPropertyIds(user: Staff): string[] {
    const adminRoles: string[] = ['System Admin', 'CEO', 'GM Service', 'Finance Admin', 'Human Resources Manager', 'Roster Admin'];
    if (adminRoles.includes(user.role)) {
        return mockProperties.map(p => p.id);
    }
    return user.propertyIds || [];
}

/**
 * Gets property access based on active shifts (RBAC)
 */
function getRBACPropertyAccess(user: Staff): string[] {
    const rbacSettings = getRBACSettings();
    const tenantRBAC = getTenantRBACSettings();
    const now = new Date();
    
    // Get active shifts for the user
    const activeShifts = mockShifts.filter(shift => {
        if (shift.staffId !== user.id) return false;
        
        const shiftStart = new Date(shift.start);
        const shiftEnd = new Date(shift.end);
        
        // Check if shift is currently active
        const isActive = now >= shiftStart && now <= shiftEnd;
        
        // If strict mode is enabled, only return assigned shifts that are clocked in
        if (rbacSettings.requireClockIn && tenantRBAC.strictMode) {
            return isActive && shift.status === 'Assigned';
        }
        
        return isActive;
    });
    
    const propertyIdsFromShifts = activeShifts.map(shift => shift.propertyId);
    
    // Combine with permanently assigned properties
    const permanentPropertyIds = user.propertyIds || [];
    const allAccessibleIds = [...new Set([...propertyIdsFromShifts, ...permanentPropertyIds])];
    
    return allAccessibleIds;
}

/**
 * Checks if a user can access a specific property based on RBAC
 */
export async function canAccessProperty(user: Staff, propertyId: string): Promise<boolean> {
    const accessibleIds = await getAccessiblePropertyIds(user);
    return accessibleIds.includes(propertyId);
}

/**
 * Checks if a user can access a specific client based on RBAC
 */
export async function canAccessClient(user: Staff, clientId: string): Promise<boolean> {
    const client = mockClients.find(c => c.id === clientId);
    if (!client) return false;
    
    return await canAccessProperty(user, client.propertyId);
}

/**
 * Gets accessible clients for a user based on RBAC
 */
export async function getAccessibleClients(user: Staff): Promise<Client[]> {
    const accessiblePropertyIds = await getAccessiblePropertyIds(user);
    
    return mockClients.filter(client => 
        accessiblePropertyIds.includes(client.propertyId)
    );
}
