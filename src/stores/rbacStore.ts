
import { create } from 'zustand';
import { UserRole, ROLES, Permission, DEFAULT_PERMISSIONS } from '@/shared/types/core/rbac.types';
import { LogCategory } from '@/shared/types/core/logging.types';
import { useLogger } from '@/hooks/use-logger';

/**
 * RBAC store state interface
 */
interface RBACState {
  roles: UserRole[];
  permissions: string[];
  
  // Role methods
  hasRole: (check: UserRole | UserRole[]) => boolean;
  setRoles: (roles: UserRole[]) => void;
  
  // Permission methods
  can: (permission: string) => boolean;
  setPermissions: (permissions: string[]) => void;
  
  // Utility methods
  clear: () => void;
}

/**
 * RBAC store implementation
 * Manages roles and permissions separately from auth
 */
export const useRbacStore = create<RBACState>((set, get) => {
  const logger = useLogger('RbacStore', LogCategory.RBAC);
  
  return {
    roles: [],
    permissions: [],
    
    /**
     * Check if user has the specified role(s)
     */
    hasRole: (check: UserRole | UserRole[]) => {
      const { roles } = get();
      
      // Super admin has all roles
      if (roles.includes(ROLES.SUPER_ADMIN)) return true;
      
      const checkRoles = Array.isArray(check) ? check : [check];
      return checkRoles.some(role => roles.includes(role));
    },
    
    /**
     * Set user roles
     */
    setRoles: (roles: UserRole[]) => {
      // Set roles and generate permissions
      const permissions = roles.flatMap(role => DEFAULT_PERMISSIONS[role] || []);
      set({ roles, permissions });
      logger.info('Roles updated', { details: { roles } });
    },
    
    /**
     * Check if user has the specified permission
     */
    can: (permission: string) => {
      const { permissions } = get();
      return permissions.includes('*') || permissions.includes(permission);
    },
    
    /**
     * Set user permissions
     */
    setPermissions: (permissions: string[]) => {
      set({ permissions });
      logger.info('Permissions updated', { details: { permissions } });
    },
    
    /**
     * Clear RBAC state
     */
    clear: () => {
      set({ roles: [], permissions: [] });
      logger.info('RBAC state cleared');
    }
  };
});
