
import { useEffect, useCallback, useState } from 'react';
import { RBACBridge } from '@/bridges/RBACBridge';
import { UserRole, ROLES } from '@/shared/types/core/rbac.types';
import { useAuthStore } from '@/stores/auth/auth.store';

/**
 * Hook to use RBAC (Role-Based Access Control) functionality
 */
export function useRbac() {
  // Get the roles from the RBAC bridge
  const [roles, setRoles] = useState<UserRole[]>(RBACBridge.getRoles());
  
  // Get auth state from auth store
  const authUser = useAuthStore(state => state.user);
  const userRoles = useAuthStore(state => state.roles);
  
  // Sync roles from auth store to RBAC bridge
  useEffect(() => {
    if (userRoles && userRoles.length > 0) {
      // Only accept valid roles
      const typedRoles = userRoles.filter((role): role is UserRole => 
        role === ROLES.GUEST || 
        role === ROLES.FOLLOWER || 
        role === ROLES.MAKER || 
        role === ROLES.MOD || 
        role === ROLES.ADMIN || 
        role === ROLES.SUPER_ADMIN);
      
      RBACBridge.setRoles(typedRoles);
      setRoles(typedRoles);
    } else if (authUser) {
      // If no roles on state, default to guest
      const defaultRoles: UserRole[] = [ROLES.GUEST];
      RBACBridge.setRoles(defaultRoles);
      setRoles(defaultRoles);
    }
  }, [authUser, userRoles]);
  
  // Check if user has a specific role
  const hasRole = useCallback((role: UserRole | UserRole[]): boolean => {
    return RBACBridge.hasRole(role);
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
  
  // Map of role constants
  const ROLE_CONSTANTS = {
    GUEST: ROLES.GUEST,
    ADMIN: ROLES.ADMIN,
    SUPER_ADMIN: ROLES.SUPER_ADMIN,
    MOD: ROLES.MOD,
    MAKER: ROLES.MAKER,
    FOLLOWER: ROLES.FOLLOWER,
  };
  
  return {
    roles,
    hasRole,
    hasAdminAccess,
    isSuperAdmin,
    isModerator,
    isBuilder,
    ROLES: ROLE_CONSTANTS
  };
}
