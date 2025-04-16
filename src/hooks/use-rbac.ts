
import { useCallback } from 'react';
import { RBACBridge } from '@/shared/bridges/RBACBridge';
import { UserRole, ROLES, Permission, AdminSection } from '@/shared/types/core/rbac.types';
import { useRBACStore } from '@/rbac/rbac.store';
import { logBridge } from '@/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';

export interface IRBACHook {
  roles: UserRole[];
  hasRole: (role: UserRole | UserRole[]) => boolean;
  can: (permission: Permission) => boolean;
  hasAdminAccess: () => boolean;
  isSuperAdmin: () => boolean;
  isModerator: () => boolean;
  isBuilder: () => boolean;
  canAccessAdminSection: (section: AdminSection) => boolean;
  getHighestRole: () => UserRole;
  getRoleLabels: () => Record<UserRole, string>;
}

/**
 * Hook for accessing RBAC functionality
 * @returns Object with RBAC methods and state
 */
export const useRbac = (): IRBACHook => {
  const roles = useRBACStore(state => state.userRoles);
  
  // Check if user has a specific role
  const hasRole = useCallback((role: UserRole | UserRole[]): boolean => {
    const result = RBACBridge.hasRole(role);
    
    // Log failed permission checks for auditing
    if (!result && process.env.NODE_ENV !== 'production') {
      logBridge.debug(LogCategory.RBAC, 'Role check failed', {
        details: {
          requiredRoles: Array.isArray(role) ? role : [role],
          userRoles: roles,
        }
      });
    }
    
    return result;
  }, [roles]);
  
  // Check if user has a specific permission
  const can = useCallback((permission: Permission): boolean => {
    return RBACBridge.hasPermission(permission);
  }, []);
  
  // Check if user has admin access
  const hasAdminAccess = useCallback((): boolean => {
    return RBACBridge.hasAdminAccess();
  }, []);
  
  // Check if user is a super admin
  const isSuperAdmin = useCallback((): boolean => {
    return RBACBridge.hasRole(ROLES.SUPER_ADMIN);
  }, []);
  
  // Check if user is a moderator
  const isModerator = useCallback((): boolean => {
    return RBACBridge.hasRole(ROLES.MOD);
  }, []);
  
  // Check if user is a builder/maker
  const isBuilder = useCallback((): boolean => {
    return RBACBridge.hasRole(ROLES.MAKER);
  }, []);
  
  // Check if user can access a specific admin section
  const canAccessAdminSection = useCallback((section: AdminSection): boolean => {
    return RBACBridge.canAccessAdminSection(section);
  }, []);
  
  // Get the highest role a user has
  const getHighestRole = useCallback((): UserRole => {
    const roleOrder: UserRole[] = [
      ROLES.GUEST,
      ROLES.FOLLOWER,
      ROLES.MAKER,
      ROLES.MOD,
      ROLES.ADMIN,
      ROLES.SUPER_ADMIN
    ];
    
    // Find the highest role the user has
    for (let i = roleOrder.length - 1; i >= 0; i--) {
      if (roles.includes(roleOrder[i])) {
        return roleOrder[i];
      }
    }
    
    return ROLES.GUEST;
  }, [roles]);
  
  // Get role labels for UI display
  const getRoleLabels = useCallback((): Record<UserRole, string> => {
    return RBACBridge.getRoleLabels();
  }, []);
  
  return {
    roles,
    hasRole,
    can,
    hasAdminAccess,
    isSuperAdmin,
    isModerator,
    isBuilder,
    canAccessAdminSection,
    getHighestRole,
    getRoleLabels
  };
};
