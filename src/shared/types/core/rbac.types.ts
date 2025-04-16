
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

// Admin section type
export type AdminSection = 'dashboard' | 'users' | 'content' | 'settings' | 'system';

// Section permissions
export const SECTION_PERMISSIONS: Record<AdminSection, UserRole[]> = {
  dashboard: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  users: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  content: [ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MOD],
  settings: [ROLES.SUPER_ADMIN],
  system: [ROLES.SUPER_ADMIN]
};
