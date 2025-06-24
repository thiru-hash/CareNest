
'use server';

import { mockShifts, mockClients, mockUsers, mockProperties } from './data';
import { User, Client } from './types';
import { isWithinInterval } from 'date-fns';

function getUserRole(userId: string): User['role'] | undefined {
    // In a real app, this would come from a session or a database query.
    // For now, we find the user in our mock data.
    const user = Object.values(mockUsers).find(u => u.id === userId);
    if (user) return user.role;
    
    // Fallback for staff who might not be in the primary users object
    const staffUser = mockStaff.find(s => s.id === userId);
    return staffUser?.role as User['role'] | undefined;
}


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
 * @param userId The ID of the user.
 * @returns A unique array of property IDs the user can currently access.
 */
export function getAccessiblePropertyIds(userId: string): string[] {
    const role = getUserRole(userId);
    if (role === 'Admin') {
        // Admins can access all properties
        return mockProperties.map(p => p.id);
    }

    const activeShifts = getActiveShifts(userId);
    const propertyIds = activeShifts.map(shift => shift.propertyId);
    return [...new Set(propertyIds)]; // Return unique property IDs
}

/**
 * Gets all clients a user can currently access based on their active shifts.
 * @param userId The ID of the user.
 * @returns An array of Client objects the user can currently access.
 */
export function getAccessibleClients(userId: string): Client[] {
    const role = getUserRole(userId);
    if (role === 'Admin') {
        // Admins can access all clients
        return mockClients;
    }
    
    const accessiblePropertyIds = getAccessiblePropertyIds(userId);
    if (accessiblePropertyIds.length === 0) {
        return [];
    }

    return mockClients.filter(client => 
        accessiblePropertyIds.includes(client.propertyId)
    );
}


/**
 * Checks if a user can access a specific client.
 * @param userId The ID of the user.
 * @param clientId The ID of the client to check.
 * @returns True if the user has access, false otherwise.
 */
export async function canAccessClient(userId: string, clientId: string): Promise<boolean> {
    const role = getUserRole(userId);
    if (role === 'Admin') {
        return true;
    }

    const client = mockClients.find(c => c.id === clientId);
    if (!client) {
        return false; // Client doesn't exist
    }

    const accessiblePropertyIds = getAccessiblePropertyIds(userId);
    return accessiblePropertyIds.includes(client.propertyId);
}
