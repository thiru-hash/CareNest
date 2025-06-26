
'use server';

import { mockShifts, mockClients, mockProperties } from './data';
import { User, Client, Staff } from './types';
import { isWithinInterval } from 'date-fns';

/**
 * Checks for a user's active shifts at the current time.
 * An active shift is one where the current time is between the shift's start and end time.
 * @param userId The ID of the user (staff member).
 * @returns An array of active shifts for the user.
 */
function getActiveShifts(userId: string) {
    const now = new Date();
    return mockShifts.filter(shift => 
        shift.staffId === userId && 
        (shift.status === 'Assigned' || shift.status === 'In Progress') &&
        isWithinInterval(now, { start: shift.start, end: shift.end })
    );
}

/**
 * Gets the IDs of all properties a user can currently access.
 * @param user The current user object.
 * @returns A unique array of property IDs the user can currently access.
 */
export async function getAccessiblePropertyIds(user: Staff): Promise<string[]> {
    if (user.role === 'Admin') {
        // Admins can access all properties
        return mockProperties.map(p => p.id);
    }

    const activeShifts = getActiveShifts(user.id);
    const propertyIds = activeShifts.map(shift => shift.propertyId);
    return [...new Set(propertyIds)]; // Return unique property IDs
}

/**
 * Gets all clients a user can currently access based on their active shifts.
 * @param user The current user object.
 * @returns An array of Client objects the user can currently access.
 */
export async function getAccessibleClients(user: Staff): Promise<Client[]> {
    if (user.role === 'Admin') {
        // Admins can access all clients
        return mockClients;
    }
    
    const accessiblePropertyIds = await getAccessiblePropertyIds(user);
    if (accessiblePropertyIds.length === 0) {
        return [];
    }

    return mockClients.filter(client => 
        accessiblePropertyIds.includes(client.propertyId)
    );
}


/**
 * Checks if a user can access a specific client.
 * @param user The current user object.
 * @param clientId The ID of the client to check.
 * @returns True if the user has access, false otherwise.
 */
export async function canAccessClient(user: Staff, clientId: string): Promise<boolean> {
    if (user.role === 'Admin') {
        return true;
    }

    const client = mockClients.find(c => c.id === clientId);
    if (!client) {
        return false; // Client doesn't exist
    }

    const accessiblePropertyIds = await getAccessiblePropertyIds(user);
    return accessiblePropertyIds.includes(client.propertyId);
}
