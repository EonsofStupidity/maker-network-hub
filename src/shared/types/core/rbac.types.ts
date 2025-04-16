
export type UserRole = 'guest' | 'follower' | 'maker' | 'mod' | 'admin' | 'super_admin';

export const ROLES = {
  GUEST: 'guest' as UserRole,
  FOLLOWER: 'follower' as UserRole,
  MAKER: 'maker' as UserRole,
  MOD: 'mod' as UserRole,
  ADMIN: 'admin' as UserRole,
  SUPER_ADMIN: 'super_admin' as UserRole
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

