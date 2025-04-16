import { UserRole, ROLES } from '@/shared/types/core/rbac.types';
import { AUTH_PERMISSIONS } from '../constants/permissions';

/**
 * Check if a user has the required permission based on their roles
 * @param userRoles Array of user roles
 * @param permission Permission to check
 * @returns Boolean indicating if the user has the permission
 */
export const hasPermission = (
  userRoles: UserRole[] = [],
  permission: string
): boolean => {
  if (userRoles.includes(ROLES.SUPER_ADMIN)) {
    return true;
  }
  
  const permissions = mapRolesToPermissions(userRoles);
  return permissions.includes(permission);
};

/**
 * Higher-order function to create a permission checker with preset roles
 * @param userRoles Array of user roles
 * @returns A function that checks if the user has a specific permission
 */
export const createPermissionChecker = (userRoles: UserRole[] = []) => {
  return (permission: string): boolean => {
    return hasPermission(userRoles, permission);
  };
};

/**
 * Check if user has admin access
 */
export const canAccessAdmin = (userRoles: UserRole[] = []): boolean => {
  return userRoles.includes(ROLES.ADMIN) || userRoles.includes(ROLES.SUPER_ADMIN);
};

/**
 * Check if user can use development features
 */
export const canAccessDevFeatures = (userRoles: UserRole[] = []): boolean => {
  return userRoles.includes(ROLES.ADMIN) || userRoles.includes(ROLES.SUPER_ADMIN);
};
