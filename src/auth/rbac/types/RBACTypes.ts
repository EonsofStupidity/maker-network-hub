
import { UserRole, ROLES } from '@/shared/types/core/rbac.types';

// Re-export shared types
export type { UserRole };
export { ROLES };

// Admin section type
export type AdminSection = 'dashboard' | 'users' | 'content' | 'settings' | 'system';

// Role labels for UI display
export const ROLE_LABELS: Record<UserRole, string> = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.ADMIN]: 'Admin',
  [ROLES.MOD]: 'Moderator',
  [ROLES.MAKER]: 'Maker',
  [ROLES.FOLLOWER]: 'Follower',
  [ROLES.GUEST]: 'Guest',
};

// Section permissions
export const SECTION_PERMISSIONS: Record<AdminSection, UserRole[]> = {
  dashboard: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  users: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  content: [ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MOD],
  settings: [ROLES.SUPER_ADMIN],
  system: [ROLES.SUPER_ADMIN]
};

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
