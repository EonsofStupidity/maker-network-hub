
import { UserRole, ROLES } from '@/shared/types/core/rbac.types';

/**
 * Checks if a user has the specified role(s)
 * @param userRoles Array of user roles
 * @param requiredRole Single role or array of roles to check
 * @returns Boolean indicating if user has the required role(s)
 */
export function hasRole(
  userRoles: UserRole[],
  requiredRole: UserRole | UserRole[]
): boolean {
  // If no user roles, return false
  if (!userRoles || userRoles.length === 0) return false;
  
  // Superadmin has all roles
  if (userRoles.includes(ROLES.SUPER_ADMIN)) return true;
  
  // Check for specific roles
  if (Array.isArray(requiredRole)) {
    return requiredRole.some(role => userRoles.includes(role));
  }
  
  return userRoles.includes(requiredRole);
}
