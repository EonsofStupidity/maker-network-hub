
import { create } from 'zustand';
import { UserRole, ROLES, Permission } from '@/shared/types/core/rbac.types';
import { LogCategory } from '@/shared/types/core/logging.types';
import { useLogger } from '@/hooks/use-logger';

/**
 * RBAC store state interface
 */
interface RBACState {
  roles: UserRole[];
  permissions: Record<string, boolean>;
  
  // Role methods
  hasRole: (check: UserRole | UserRole[]) => boolean;
  setRoles: (roles: UserRole[]) => void;
  
  // Permission methods
  can: (permission: string) => boolean;
  setPermissions: (permissions: Record<string, boolean>) => void;
  
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
    permissions: {
      'create_project': false,
      'edit_project': false,
      'delete_project': false,
      'submit_build': false,
      'access_admin': false,
      'manage_api_keys': false,
      'manage_users': false,
      'settings:edit': false
    },
    
    /**
     * Check if user has the specified role(s)
     */
    hasRole: (check: UserRole | UserRole[]) => {
      const { roles } = get();
      const checkRoles = Array.isArray(check) ? check : [check];
      return checkRoles.some(role => roles.includes(role));
    },
    
    /**
     * Set user roles
     */
    setRoles: (roles: UserRole[]) => {
      set({ roles });
      logger.info('Roles updated', { details: { roles } });
    },
    
    /**
     * Check if user has the specified permission
     */
    can: (permission: string) => {
      const { permissions } = get();
      return permissions[permission] === true;
    },
    
    /**
     * Set user permissions
     */
    setPermissions: (permissions: Record<string, boolean>) => {
      set({ permissions });
      logger.info('Permissions updated', { details: { permissions } });
    },
    
    /**
     * Clear RBAC state
     */
    clear: () => {
      const defaultPermissions: Record<string, boolean> = {
        'create_project': false,
        'edit_project': false,
        'delete_project': false,
        'submit_build': false,
        'access_admin': false,
        'manage_api_keys': false,
        'manage_users': false,
        'settings:edit': false
      };
      
      set({ roles: [], permissions: defaultPermissions });
      logger.info('RBAC state cleared');
    }
  };
});
