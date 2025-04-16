
import { create } from 'zustand';
import { UserRole, ROLES, DEFAULT_PERMISSIONS } from '@/shared/types/core/rbac.types';
import { LogCategory, LogLevel } from '@/shared/types/core/logging.types';
import { logger } from '@/logging/logger.service';

// Define RBAC store state
interface RBACState {
  userRoles: UserRole[];
  permissions: string[];
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  
  // Actions
  setUserRoles: (roles: UserRole[]) => void;
  clearUserRoles: () => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  hasPermission: (permission: string) => boolean;
  setPermissions: (permissions: string[]) => void;
  clearPermissions: () => void;
}

// Create the RBAC store
export const useRBACStore = create<RBACState>((set, get) => ({
  userRoles: [],
  permissions: [],
  isLoading: false,
  error: null,
  isInitialized: false,
  
  // Set user roles
  setUserRoles: (roles: UserRole[]) => {
    const permissions = roles.flatMap(role => DEFAULT_PERMISSIONS[role] || []);
    set({ userRoles: roles, permissions, isInitialized: true });
    
    logger.log(LogLevel.INFO, LogCategory.RBAC, "User roles updated", {
      details: { roles, permissionsCount: permissions.length }
    });
  },
  
  // Clear user roles
  clearUserRoles: () => {
    set({ userRoles: [], permissions: [], isInitialized: true });
    logger.log(LogLevel.INFO, LogCategory.RBAC, "User roles cleared");
  },
  
  // Check if user has a role
  hasRole: (roleOrRoles) => {
    const { userRoles } = get();
    
    // Super admin has all roles
    if (userRoles.includes(ROLES.SUPER_ADMIN)) return true;
    
    if (Array.isArray(roleOrRoles)) {
      return roleOrRoles.some(role => userRoles.includes(role));
    }
    
    return userRoles.includes(roleOrRoles);
  },
  
  // Check if user has a permission
  hasPermission: (permission: string) => {
    const { permissions } = get();
    return permissions.includes('*') || permissions.includes(permission);
  },
  
  // Set permissions directly
  setPermissions: (permissions: string[]) => {
    set({ permissions });
    logger.log(LogLevel.INFO, LogCategory.RBAC, "Permissions updated", {
      details: { permissionsCount: permissions.length }
    });
  },
  
  // Clear permissions
  clearPermissions: () => {
    set({ permissions: [] });
    logger.log(LogLevel.INFO, LogCategory.RBAC, "Permissions cleared");
  }
}));

export default useRBACStore;
