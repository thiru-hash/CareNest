
'use server';

import { cookies } from 'next/headers';
import { mockStaff } from './data';
import type { Staff } from './types';

// In a real app, this would perform a database lookup.
const adminUser = mockStaff.find(s => s.role === 'System Admin')!;

/**
 * Retrieves the current user from the session cookie.
 * This function can be called from any Server Component or Server Action.
 * It defaults to the primary admin user if no cookie is found.
 * @returns The current user object.
 */
export async function getCurrentUser(): Promise<Staff> {
  const cookieStore = await cookies();
  const userId = cookieStore.get('currentUser_id')?.value;
  
  if (!userId) {
    return adminUser; // Default to admin if no user is logged in
  }

  const user = mockStaff.find(u => u.id === userId);

  return user || adminUser; // Return found user or default to admin
}
