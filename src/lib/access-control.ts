
'use server';

import { mockClients, mockProperties, mockShifts } from './data';
import type { Staff, Client } from './types';

/**
 * Gets the IDs of all properties a staff member can access.
 * - Admins & specific high-level roles get all properties.
 * - Support Workers get properties from their currently active shifts.
 * - Other roles get properties from their direct assignments.
 * @param user The current staff member object.
 * @returns A unique array of property IDs the user can access.
 */
export async function getAccessiblePropertyIds(user: Staff): Promise<string[]> {
    // Admins and certain high-level roles can access all properties
    const adminRoles: string[] = ['System Admin', 'CEO', 'GM Service', 'Finance Admin', 'Human Resources Manager', 'Roster Admin'];
    if (adminRoles.includes(user.role)) {
        return mockProperties.map(p => p.id);
    }

    // Support Workers get access based on active shifts
    if (user.role === 'Support Worker') {
        const now = new Date();
        const activeShifts = mockShifts.filter(shift => 
            shift.staffId === user.id &&
            shift.start <= now &&
            shift.end >= now
        );
        const propertyIdsFromShifts = activeShifts.map(shift => shift.propertyId);
        
        // Combine with permanently assigned properties and return unique IDs
        const permanentPropertyIds = user.propertyIds || [];
        const allAccessibleIds = [...new Set([...propertyIdsFromShifts, ...permanentPropertyIds])];
        return allAccessibleIds;
    }

    // For other users, access is determined by their assigned properties.
    // This allows for permanent assignments for roles like 'Support Manager'
    return user.propertyIds || [];
}

/**
 * Gets all clients a user can currently access based on their assigned properties.
 * @param user The current staff member object.
 * @returns An array of Client objects the user can access.
 */
export async function getAccessibleClients(user: Staff): Promise<Client[]> {
    const accessiblePropertyIds = await getAccessiblePropertyIds(user);
    
    if (accessiblePropertyIds.length === 0 && !adminRoles.includes(user.role)) {
        return [];
    }
    
    const adminRoles: string[] = ['System Admin', 'CEO', 'GM Service', 'Finance Admin', 'Human Resources Manager', 'Roster Admin'];
    if (adminRoles.includes(user.role)) {
      return mockClients;
    }

    return mockClients.filter(client => 
        accessiblePropertyIds.includes(client.propertyId)
    );
}

/**
 * Checks if a user can access a specific client based on their assigned properties.
 * @param user The current staff member object.
 * @param clientId The ID of the client to check.
 * @returns True if the user has access, false otherwise.
 */
export async function canAccessClient(user: Staff, clientId: string): Promise<boolean> {
    const client = mockClients.find(c => c.id === clientId);
    if (!client) {
        return false; // Client doesn't exist
    }

    const accessiblePropertyIds = await getAccessiblePropertyIds(user);
    return accessiblePropertyIds.includes(client.propertyId);
}
