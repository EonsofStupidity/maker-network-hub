
import { useCallback } from 'react';
import { RBACBridge } from '@/shared/bridges/RBACBridge';
import { AdminSection, UserRole, ROLES } from '@/shared/types/core/rbac.types';
import { useRBACStore } from '@/rbac/rbac.store';

export function useRbac() {
  const userRoles = useRBACStore((state) => state.userRoles);
  
  // Check if user has specific role
  const hasRole = useCallback((role: UserRole | UserRole[]): boolean => {
    return RBACBridge.hasRole(role);
  }, []);
  
  // Check if user has admin access
  const hasAdminAccess = useCallback((): boolean => {
    return RBACBridge.hasAdminAccess();
  }, []);
  
  // Check if user is super admin
  const isSuperAdmin = useCallback((): boolean => {
    return RBACBridge.isSuperAdmin();
  }, []);
  
  // Check if user is a moderator
  const isModerator = useCallback((): boolean => {
    return RBACBridge.isModerator();
  }, []);
  
  // Check if user is a builder/maker
  const isBuilder = useCallback((): boolean => {
    return RBACBridge.isBuilder();
  }, []);
  
  // Check if user has permission to access admin section
  const canAccessAdminSection = useCallback((section: AdminSection): boolean => {
    return RBACBridge.canAccessAdminSection(section);
  }, []);

  // Get highest role for a user
  const getHighestRole = useCallback((): UserRole => {
    if (userRoles.includes(ROLES.SUPER_ADMIN)) return ROLES.SUPER_ADMIN;
    if (userRoles.includes(ROLES.ADMIN)) return ROLES.ADMIN;
    if (userRoles.includes(ROLES.MOD)) return ROLES.MOD;
    if (userRoles.includes(ROLES.MAKER)) return ROLES.MAKER;
    if (userRoles.includes(ROLES.FOLLOWER)) return ROLES.FOLLOWER;
    return ROLES.GUEST;
  }, [userRoles]);
  
  // Check if user has elevated privileges (mod or higher)
  const hasElevatedPrivileges = useCallback((): boolean => {
    return hasRole([ROLES.MOD, ROLES.ADMIN, ROLES.SUPER_ADMIN]);
  }, [hasRole]);
  
  return {
    roles: userRoles,
    hasRole,
    hasAdminAccess,
    isSuperAdmin,
    isModerator,
    isBuilder,
    getHighestRole,
    hasElevatedPrivileges,
    canAccessAdminSection,
    ROLES
  };
}
