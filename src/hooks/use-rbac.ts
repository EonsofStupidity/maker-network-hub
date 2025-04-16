
import { useCallback } from 'react';
import { RBACBridge } from '@/shared/bridges/RBACBridge';
import { UserRole, ROLES, Permission } from '@/shared/types/core/rbac.types';
import { useRBACStore } from '@/rbac/rbac.store';

export interface IRBACHook {
  roles: UserRole[];
  hasRole: (role: UserRole | UserRole[]) => boolean;
  can: (permission: Permission) => boolean;
  hasAdminAccess: () => boolean;
  isSuperAdmin: () => boolean;
  isModerator: () => boolean;
  isBuilder: () => boolean;
}

/**
 * Hook for accessing RBAC functionality
 * @returns Object with RBAC methods and state
 */
export const useRbac = (): IRBACHook => {
  const roles = useRBACStore(state => state.userRoles);
  
  // Check if user has a specific role
  const hasRole = useCallback((role: UserRole | UserRole[]): boolean => {
    return RBACBridge.hasRole(role);
  }, []);
  
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
    return RBACBridge.isSuperAdmin();
  }, []);
  
  // Check if user is a moderator
  const isModerator = useCallback((): boolean => {
    return RBACBridge.isModerator();
  }, []);
  
  // Check if user is a builder
  const isBuilder = useCallback((): boolean => {
    return RBACBridge.isBuilder();
  }, []);
  
  return {
    roles,
    hasRole,
    can,
    hasAdminAccess,
    isSuperAdmin,
    isModerator,
    isBuilder
  };
};
