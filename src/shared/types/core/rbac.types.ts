
// User role types
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
