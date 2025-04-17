
// Re-export the core RBAC types from the shared directory
export { 
  UserRole, 
  ROLES, 
  Permission, 
  AdminSection, 
  SECTION_PERMISSIONS, 
  ROLE_LABELS,
  DEFAULT_PERMISSIONS 
} from '@/shared/types/core/rbac.types';

// RBAC Hook return type
export interface RBACHook {
  hasRole: (role: UserRole | UserRole[]) => boolean;
  hasAdminAccess: () => boolean;
  isSuperAdmin: () => boolean;
  isModerator: () => boolean;
  isBuilder: () => boolean;
  getHighestRole: () => UserRole;
  hasElevatedPrivileges: () => boolean;
  canAccessAdminSection: (section: AdminSection) => boolean;
  getRoleLabels: () => Record<UserRole, string>;
  roles: UserRole[];
}
