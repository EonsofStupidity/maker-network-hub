
import { create } from 'zustand';
import { UserRole, ROLES } from '@/shared/types/core/rbac.types';
import { LogCategory, LogLevel } from '@/shared/types/core/logging.types';
import { logger } from '@/logging/logger.service';

// Define permission types
export interface Permission {
  id: string;
  name: string;
  description?: string;
}

export interface RolePermissions {
  role: UserRole;
  permissions: string[];
}

// Define default permissions for each role
const DEFAULT_PERMISSIONS: Record<UserRole, string[]> = {
  [ROLES.GUEST]: [
    'view:public:content',
    'view:builds'
  ],
  [ROLES.FOLLOWER]: [
    'view:profile',
    'edit:profile',
    'view:builds',
    'comment:builds'
  ],
  [ROLES.MAKER]: [
    'view:profile',
    'edit:profile',
    'create:build',
    'edit:own:build',
    'delete:own:build',
    'view:builds',
    'comment:builds',
    'feature:own:build',
    'upload:firmware'
  ],
  [ROLES.MOD]: [
    'view:profile',
    'edit:profile',
    'view:builds',
    'comment:builds',
    'moderate:comments',
    'review:builds'
  ],
  [ROLES.ADMIN]: [
    'view:profile',
    'edit:profile',
    'view:builds',
    'comment:builds',
    'moderate:comments',
    'review:builds',
    'edit:any:build',
    'delete:any:build',
    'feature:any:build',
    'view:admin',
    'manage:users',
    'manage:builds'
  ],
  [ROLES.SUPER_ADMIN]: [
    '*' // All permissions
  ]
};

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
  },
  
  // Clear user roles
  clearUserRoles: () => set({ userRoles: [], permissions: [], isInitialized: true }),
  
  // Check if user has a role
  hasRole: (roleOrRoles) => {
    const { userRoles } = get();
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
  setPermissions: (permissions: string[]) => set({ permissions }),
  
  // Clear permissions
  clearPermissions: () => set({ permissions: [] })
}));

export default useRBACStore;
