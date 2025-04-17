// Define user roles
export type UserRole = 'guest' | 'follower' | 'maker' | 'mod' | 'admin' | 'super_admin';

// Role constants
export const ROLES = {
  GUEST: 'guest' as UserRole,
  FOLLOWER: 'follower' as UserRole,
  MAKER: 'maker' as UserRole,
  MOD: 'mod' as UserRole,
  ADMIN: 'admin' as UserRole,
  SUPER_ADMIN: 'super_admin' as UserRole
} as const;

// Permission type
export type Permission = 
  | 'create_project'
  | 'edit_project'
  | 'delete_project'
  | 'submit_build'
  | 'access_admin'
  | 'manage_api_keys'
  | 'manage_users'
  | 'settings:edit'
  | string; // Allow for dynamic permissions

// Admin section type
export type AdminSection = 'dashboard' | 'users' | 'content' | 'settings' | 'system' | string;

// Section permissions mapping
export const SECTION_PERMISSIONS: Record<AdminSection, ReadonlyArray<UserRole>> = {
  dashboard: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  users: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  content: [ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MOD],
  settings: [ROLES.SUPER_ADMIN],
  system: [ROLES.SUPER_ADMIN]
};

// Role labels
export const ROLE_LABELS: Record<UserRole, string> = {
  guest: 'Guest',
  follower: 'Follower', 
  maker: 'Maker',
  mod: 'Moderator',
  admin: 'Admin',
  super_admin: 'Super Admin'
};

export const DEFAULT_PERMISSIONS: Record<UserRole, readonly string[]> = {
  guest: ['view:public:content', 'view:builds'],
  follower: ['view:profile', 'edit:profile', 'view:builds', 'comment:builds'],
  maker: ['view:profile', 'edit:profile', 'create:build', 'edit:own:build', 'delete:own:build'],
  mod: ['view:profile', 'edit:profile', 'moderate:comments', 'review:builds'],
  admin: ['view:admin', 'manage:users', 'manage:builds'],
  super_admin: ['*']
};
