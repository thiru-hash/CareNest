
import { cookies } from 'next/headers';
import { mockStaff } from './data';
import { createMockTenant } from './licensing';
import type { User, Tenant } from './types';

// In a real app, this would perform a database lookup.
const adminUser = mockStaff.find(u => u.role === 'System Admin')!;

/**
 * Retrieves the current user from the session cookie.
 * This function can be called from any Server Component or Server Action.
 * It defaults to the primary admin user if no cookie is found.
 * @returns The current user object.
 */
export async function getCurrentUser(): Promise<User> {
  const cookieStore = await cookies();
  const userId = cookieStore.get('currentUser_id')?.value;
  
  if (!userId) {
    return adminUser; // Default to admin if no user is logged in
  }

  const user = mockStaff.find(u => u.id === userId);

  return user || adminUser; // Return found user or default to admin
}

/**
 * Gets the current tenant for the application.
 * In a real app, this would be determined by subdomain or tenant ID in cookies.
 */
export async function getCurrentTenant(): Promise<Tenant> {
  const cookieStore = await cookies();
  const tenantId = cookieStore.get('tenant_id')?.value;
  
  // For now, return a mock tenant. In production, this would fetch from database
  return createMockTenant({ id: tenantId || 'tenant-1' });
}

/**
 * Enhanced user object with tenant and licensing information
 */
export async function getCurrentUserWithTenant(): Promise<{ user: User; tenant: Tenant }> {
  const [user, tenant] = await Promise.all([
    getCurrentUser(),
    getCurrentTenant()
  ]);

  // User already has tenant information
  const enhancedUser: User = {
    ...user,
    lastActive: new Date(),
    loginCount: 1, // Would be incremented in real app
    preferences: {
      theme: 'light' as const,
      language: 'en',
      notifications: {
        email: true,
        sms: false,
        push: true
      }
    }
  };

  return { user: enhancedUser, tenant };
}

/**
 * Validates if a user can access a specific module
 */
export async function canAccessModule(moduleId: string): Promise<boolean> {
  const { user, tenant } = await getCurrentUserWithTenant();
  
  // Check if module is enabled for tenant
  const moduleEnabled = tenant.license.features.includes(moduleId);
  if (!moduleEnabled) {
    return false;
  }

  // In a real app, you would also check user-specific permissions
  // based on their role and group memberships
  
  return true;
}

/**
 * Gets user permissions based on their role and group memberships
 */
export function getUserPermissions(user: User): string[] {
  const permissions: string[] = [];
  
  // Base permissions based on role
  switch (user.role) {
    case 'System Admin':
      permissions.push('*'); // All permissions
      break;
    case 'Manager':
      permissions.push('view_dashboard', 'view_roster', 'view_people', 'view_finance', 'view_timesheet', 'view_compliance');
      break;
    case 'Support Worker':
      permissions.push('view_dashboard', 'view_roster', 'view_people', 'view_timesheet', 'view_compliance');
      break;
    case 'HR Manager':
      permissions.push('view_dashboard', 'view_people', 'edit_people', 'view_compliance');
      break;
    case 'Finance Admin':
      permissions.push('view_dashboard', 'view_finance', 'edit_finance');
      break;
    default:
      permissions.push('view_dashboard');
  }

  // Add group-based permissions
  user.groups.forEach(groupId => {
    switch (groupId) {
      case 'group-admin':
        permissions.push('*');
        break;
      case 'group-managers':
        permissions.push('view_roster', 'edit_roster', 'view_people', 'edit_people');
        break;
      case 'group-support':
        permissions.push('view_roster', 'view_people');
        break;
      case 'group-hr':
        permissions.push('view_people', 'edit_people');
        break;
      case 'group-finance':
        permissions.push('view_finance', 'edit_finance');
        break;
    }
  });

  return [...new Set(permissions)]; // Remove duplicates
}

/**
 * Checks if user has a specific permission
 */
export function hasPermission(user: User, permission: string): boolean {
  const permissions = getUserPermissions(user);
  return permissions.includes('*') || permissions.includes(permission);
}
