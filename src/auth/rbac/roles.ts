
/**
 * auth/rbac/roles.ts
 * 
 * Role-based access control mapping
 * Maps roles to permissions
 */

import { UserRole, ROLES } from '@/shared/types/shared.types';
import { AuthPermissionValue, AUTH_PERMISSIONS } from '@/auth/constants/permissions';

// Map roles to their allowed permissions
const rolePermissionsMap = {
  [ROLES.SUPER_ADMIN]: Object.values(AUTH_PERMISSIONS),
  [ROLES.ADMIN]: [
    AUTH_PERMISSIONS.ADMIN_ACCESS,
    AUTH_PERMISSIONS.VIEW_CONTENT,
    AUTH_PERMISSIONS.CREATE_CONTENT,
    AUTH_PERMISSIONS.EDIT_CONTENT,
    AUTH_PERMISSIONS.DELETE_CONTENT,
    AUTH_PERMISSIONS.VIEW_USERS,
    AUTH_PERMISSIONS.EDIT_USERS,
    AUTH_PERMISSIONS.SYSTEM_VIEW,
  ],
  [ROLES.MOD]: [
    AUTH_PERMISSIONS.VIEW_CONTENT,
    AUTH_PERMISSIONS.EDIT_CONTENT,
    AUTH_PERMISSIONS.VIEW_USERS,
  ],
  [ROLES.MAKER]: [
    AUTH_PERMISSIONS.VIEW_CONTENT,
    AUTH_PERMISSIONS.CREATE_CONTENT,
  ],
  [ROLES.FOLLOWER]: [
    AUTH_PERMISSIONS.VIEW_CONTENT,
  ],
  [ROLES.GUEST]: []
};

/**
 * Map user roles to their corresponding permissions
 * @param roles Array of user roles
 * @returns Array of permissions granted to the user
 */
export function mapRolesToPermissions(roles: UserRole[]): AuthPermissionValue[] {
  const permissions: AuthPermissionValue[] = [];
  
  roles.forEach(role => {
    const rolePerms = rolePermissionsMap[role] || [];
    rolePerms.forEach(perm => {
      if (!permissions.includes(perm)) {
        permissions.push(perm);
      }
    });
  });
  
  return permissions;
}

/**
 * Check if user has admin access based on roles
 * @param roles User roles to check
 * @returns Boolean indicating if the user has admin access
 */
export function hasAdminAccess(roles: UserRole[]): boolean {
  return roles.some(role => role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN);
}

/**
 * Check if user is a super admin
 * @param roles User roles to check
 * @returns Boolean indicating if the user is a super admin
 */
export function isSuperAdmin(roles: UserRole[]): boolean {
  return roles.includes(ROLES.SUPER_ADMIN);
}
