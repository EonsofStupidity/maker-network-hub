
export type UserRole = 'GUEST' | 'FOLLOWER' | 'MAKER' | 'MOD' | 'ADMIN' | 'SUPER_ADMIN';

export const ROLES = {
  GUEST: 'GUEST' as UserRole,
  FOLLOWER: 'FOLLOWER' as UserRole,
  MAKER: 'MAKER' as UserRole,
  MOD: 'MOD' as UserRole,
  ADMIN: 'ADMIN' as UserRole,
  SUPER_ADMIN: 'SUPER_ADMIN' as UserRole
} as const;

export type Permission = 
  | 'create_project'
  | 'edit_project'
  | 'delete_project'
  | 'submit_build'
  | 'access_admin'
  | 'manage_api_keys'
  | 'manage_users'
  | 'settings:edit';

// Role labels for UI display
export const ROLE_LABELS: Record<UserRole, string> = {
  'GUEST': 'Guest',
  'FOLLOWER': 'Follower',
  'MAKER': 'Maker',
  'MOD': 'Moderator',
  'ADMIN': 'Admin',
  'SUPER_ADMIN': 'Super Admin',
};

// Admin section type
export type AdminSection = 'dashboard' | 'users' | 'content' | 'settings' | 'system';

// Section permissions
export const SECTION_PERMISSIONS: Record<AdminSection, UserRole[]> = {
  dashboard: ['ADMIN', 'SUPER_ADMIN'],
  users: ['ADMIN', 'SUPER_ADMIN'],
  content: ['ADMIN', 'SUPER_ADMIN', 'MOD'],
  settings: ['SUPER_ADMIN'],
  system: ['SUPER_ADMIN']
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
