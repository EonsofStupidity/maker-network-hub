
import { UserRole, ROLES } from '@/shared/types/core/rbac.types';

// Re-export shared types
export type { UserRole };
export { ROLES };

// Admin section type
export type AdminSection = 'dashboard' | 'users' | 'content' | 'settings' | 'system';

// Role labels for UI display
export const ROLE_LABELS: Record<UserRole, string> = {
  [ROLES.super_admin]: 'Super Admin',
  [ROLES.admin]: 'Admin',
  [ROLES.mod]: 'Moderator',
  [ROLES.maker]: 'Maker',
  [ROLES.follower]: 'Follower',
  [ROLES.guest]: 'Guest',
};

// Section permissions
export const SECTION_PERMISSIONS: Record<AdminSection, UserRole[]> = {
  dashboard: [ROLES.admin, ROLES.super_admin],
  users: [ROLES.admin, ROLES.super_admin],
  content: [ROLES.admin, ROLES.super_admin, ROLES.mod],
  settings: [ROLES.super_admin],
  system: [ROLES.super_admin]
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
