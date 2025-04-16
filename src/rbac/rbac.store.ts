
import { create } from 'zustand';
import { UserRole, ROLES } from '@/shared/types/core/rbac.types';
import { logBridge } from '@/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';

interface RBACState {
  userRoles: UserRole[];
  permissions: string[];
  setRoles: (roles: UserRole[]) => void;
  setUserRoles: (roles: UserRole[]) => void; // Added alias for compatibility
  addRole: (role: UserRole) => void;
  removeRole: (role: UserRole) => void;
  clearRoles: () => void;
  setPermissions: (permissions: string[]) => void;
  hasPermission: (permission: string) => boolean;
}

export const useRBACStore = create<RBACState>((set, get) => ({
  userRoles: [ROLES.GUEST],
  permissions: [],
  
  setRoles: (roles) => {
    logBridge.info(LogCategory.RBAC, 'User roles set', { 
      details: { roles }
    });
    
    set({ userRoles: roles });
  },

  // Alias for setRoles for components that expect this name
  setUserRoles: (roles) => {
    logBridge.info(LogCategory.RBAC, 'User roles set', { 
      details: { roles }
    });
    
    set({ userRoles: roles });
  },
  
  addRole: (role) => {
    const { userRoles } = get();
    
    if (!userRoles.includes(role)) {
      logBridge.info(LogCategory.RBAC, 'Role added to user', { 
        details: { role }
      });
      
      set({ userRoles: [...userRoles, role] });
    }
  },
  
  removeRole: (role) => {
    const { userRoles } = get();
    
    if (userRoles.includes(role)) {
      logBridge.info(LogCategory.RBAC, 'Role removed from user', { 
        details: { role }
      });
      
      set({ userRoles: userRoles.filter(r => r !== role) });
    }
  },
  
  clearRoles: () => {
    logBridge.info(LogCategory.RBAC, 'User roles cleared');
    set({ userRoles: [ROLES.GUEST] });
  },
  
  setPermissions: (permissions) => {
    logBridge.info(LogCategory.RBAC, 'User permissions set', { 
      details: { permissionsCount: permissions.length }
    });
    
    set({ permissions });
  },
  
  hasPermission: (permission) => {
    const { permissions, userRoles } = get();
    
    // Super admin has all permissions
    if (userRoles.includes(ROLES.SUPER_ADMIN)) {
      return true;
    }
    
    // Check if the user has this specific permission
    return permissions.includes(permission);
  }
}));
