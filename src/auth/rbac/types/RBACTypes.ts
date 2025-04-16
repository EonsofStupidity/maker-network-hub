
import { UserRole, ROLES, AdminSection } from '@/shared/types/core/rbac.types';

// Re-export shared types
export type { UserRole };
export { ROLES };

// Role labels for UI display with proper Record typing
export const ROLE_LABELS = {
  [ROLES.GUEST]: 'Guest',
  [ROLES.FOLLOWER]: 'Follower',
  [ROLES.MAKER]: 'Maker', 
  [ROLES.MOD]: 'Moderator',
  [ROLES.ADMIN]: 'Admin',
  [ROLES.SUPER_ADMIN]: 'Super Admin'
} satisfies Record<UserRole, string>;

// Section permissions with proper Record typing
export const SECTION_PERMISSIONS = {
  dashboard: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  users: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  content: [ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MOD],
  settings: [ROLES.SUPER_ADMIN],
  system: [ROLES.SUPER_ADMIN]
} satisfies Record<AdminSection, ReadonlyArray<string>>;

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
