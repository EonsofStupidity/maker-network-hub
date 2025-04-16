
import { UserRole, ROLES } from '@/shared/types/core/rbac.types';

/**
 * Core RBAC functionality
 */
export function hasRole(
  userRoles: UserRole[],
  requiredRole: UserRole | UserRole[]
): boolean {
  if (!userRoles || userRoles.length === 0) return false;
  
  if (userRoles.includes(ROLES.SUPER_ADMIN)) return true;
  
  const rolesToCheck = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  return rolesToCheck.some(role => userRoles.includes(role));
}

export function hasAdminAccess(userRoles: UserRole[]): boolean {
  return hasRole(userRoles, [ROLES.ADMIN, ROLES.SUPER_ADMIN]);
}

export function isSuperAdmin(userRoles: UserRole[]): boolean {
  return hasRole(userRoles, ROLES.SUPER_ADMIN);
}

export function isModerator(userRoles: UserRole[]): boolean {
  return hasRole(userRoles, [ROLES.MOD, ROLES.ADMIN, ROLES.SUPER_ADMIN]);
}

export function isBuilder(userRoles: UserRole[]): boolean {
  return hasRole(userRoles, [ROLES.MAKER, ROLES.ADMIN, ROLES.SUPER_ADMIN]);
}

export function getRoleLabels(): Record<UserRole, string> {
  return {
    'GUEST': 'Guest',
    'FOLLOWER': 'Follower',
    'MAKER': 'Maker',
    'MOD': 'Moderator', 
    'ADMIN': 'Admin',
    'SUPER_ADMIN': 'Super Admin'
  };
}
