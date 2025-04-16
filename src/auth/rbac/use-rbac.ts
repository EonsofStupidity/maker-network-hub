
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
        role === 'guest' || 
        role === 'follower' || 
        role === 'maker' || 
        role === 'mod' || 
        role === 'admin' || 
        role === 'super_admin');
      
      RBACBridge.setRoles(typedRoles);
      setRoles(typedRoles);
    } else if (authUser) {
      // If no roles on state, default to guest
      const defaultRoles: UserRole[] = ['guest'];
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
    guest: ROLES.guest,
    admin: ROLES.admin,
    super_admin: ROLES.super_admin,
    mod: ROLES.mod,
    maker: ROLES.maker,
    follower: ROLES.follower,
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
