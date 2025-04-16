
import { UserRole, ROLES } from '@/shared/types/core/rbac.types';

/**
 * Core RBAC functionality
 * This module is responsible for role-based access control logic
 * but does NOT handle authentication state directly
 */

/**
 * Check if a user has the specified role(s)
 * @param userRoles Array of user roles to check
 * @param requiredRole Single role or array of roles to check against
 * @returns Boolean indicating if user has the required role(s)
 */
export function hasRole(
  userRoles: UserRole[],
  requiredRole: UserRole | UserRole[]
): boolean {
  // If no user roles, return false
  if (!userRoles || userRoles.length === 0) return false;
  
  // Superadmin has all roles
  if (userRoles.includes(ROLES.super_admin)) return true;
  
  // Check for specific roles
  const rolesToCheck = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  return rolesToCheck.some(role => userRoles.includes(role));
}

/**
 * Check if user has admin access (admin or superadmin)
 * @param userRoles Array of user roles to check
 * @returns Boolean indicating if user has admin access
 */
export function hasAdminAccess(userRoles: UserRole[]): boolean {
  return hasRole(userRoles, [ROLES.admin, ROLES.super_admin]);
}

/**
 * Check if user is a super admin
 * @param userRoles Array of user roles to check
 * @returns Boolean indicating if user is a super admin
 */
export function isSuperAdmin(userRoles: UserRole[]): boolean {
  return hasRole(userRoles, ROLES.super_admin);
}

/**
 * Check if user is a moderator (or higher)
 * @param userRoles Array of user roles to check
 * @returns Boolean indicating if user is a moderator or higher
 */
export function isModerator(userRoles: UserRole[]): boolean {
  return hasRole(userRoles, [ROLES.mod, ROLES.admin, ROLES.super_admin]);
}

/**
 * Check if user is a builder (or higher)
 * @param userRoles Array of user roles to check
 * @returns Boolean indicating if user is a builder or higher
 */
export function isBuilder(userRoles: UserRole[]): boolean {
  return hasRole(userRoles, [ROLES.maker, ROLES.admin, ROLES.super_admin]);
}

/**
 * Get the highest role for a user
 * @param userRoles Array of user roles to check
 * @returns The highest role the user has
 */
export function getHighestRole(userRoles: UserRole[]): UserRole {
  if (hasRole(userRoles, ROLES.super_admin)) return ROLES.super_admin;
  if (hasRole(userRoles, ROLES.admin)) return ROLES.admin;
  if (hasRole(userRoles, ROLES.mod)) return ROLES.mod;
  if (hasRole(userRoles, ROLES.maker)) return ROLES.maker;
  if (hasRole(userRoles, ROLES.follower)) return ROLES.follower;
  return ROLES.guest;
}

/**
 * Check if user has elevated privileges (admin or higher)
 * @param userRoles Array of user roles to check
 * @returns Boolean indicating if user has elevated privileges
 */
export function hasElevatedPrivileges(userRoles: UserRole[]): boolean {
  return hasRole(userRoles, [ROLES.admin, ROLES.super_admin]);
}

/**
 * Check if user can access a specific admin section
 * @param userRoles Array of user roles to check
 * @param section Admin section to check access for
 * @returns Boolean indicating if user can access the section
 */
export function canAccessAdminSection(userRoles: UserRole[], section: string): boolean {
  // Super admins can access everything
  if (hasRole(userRoles, ROLES.super_admin)) return true;

  // Define section permissions
  const sectionPermissions: Record<string, UserRole[]> = {
    dashboard: [ROLES.admin, ROLES.super_admin],
    users: [ROLES.admin, ROLES.super_admin],
    content: [ROLES.admin, ROLES.super_admin, ROLES.mod],
    settings: [ROLES.super_admin],
    system: [ROLES.super_admin]
  };

  const allowedRoles = sectionPermissions[section];
  if (!allowedRoles) return false;

  return hasRole(userRoles, allowedRoles);
}

/**
 * Get role labels for UI display
 * @returns Record of role keys to display labels
 */
export function getRoleLabels(): Record<UserRole, string> {
  return {
    [ROLES.guest]: 'Guest',
    [ROLES.follower]: 'Follower',
    [ROLES.maker]: 'Maker',
    [ROLES.mod]: 'Moderator',
    [ROLES.admin]: 'Admin',
    [ROLES.super_admin]: 'Super Admin'
  };
}
