
'use server';

import { mockClients, mockProperties } from './data';
import type { Staff, Client } from './types';

/**
 * Gets the IDs of all properties a staff member can access based on their direct assignments.
 * @param user The current staff member object.
 * @returns A unique array of property IDs the user can access.
 */
export async function getAccessiblePropertyIds(user: Staff): Promise<string[]> {
    // Admins and certain high-level roles can access all properties
    const adminRoles: string[] = ['System Admin', 'CEO', 'GM Service', 'Finance Admin', 'Human Resources Manager'];
    if (adminRoles.includes(user.role)) {
        return mockProperties.map(p => p.id);
    }

    // For other users, access is determined by their assigned properties.
    return user.propertyIds || [];
}

/**
 * Gets all clients a user can currently access based on their assigned properties.
 * @param user The current staff member object.
 * @returns An array of Client objects the user can access.
 */
export async function getAccessibleClients(user: Staff): Promise<Client[]> {
    const accessiblePropertyIds = await getAccessiblePropertyIds(user);
    
    if (accessiblePropertyIds.length === 0 && user.role !== 'System Admin') {
        return [];
    }
    
    if (user.role === 'System Admin') {
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
