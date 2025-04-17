
// Define user roles
export type UserRole = 'GUEST' | 'FOLLOWER' | 'MAKER' | 'MOD' | 'ADMIN' | 'SUPER_ADMIN';

// Role constants
export const ROLES = {
  GUEST: 'GUEST' as UserRole,
  FOLLOWER: 'FOLLOWER' as UserRole,
  MAKER: 'MAKER' as UserRole,
  MOD: 'MOD' as UserRole,
  ADMIN: 'ADMIN' as UserRole,
  SUPER_ADMIN: 'SUPER_ADMIN' as UserRole
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
  [ROLES.GUEST]: 'Guest',
  [ROLES.FOLLOWER]: 'Follower',
  [ROLES.MAKER]: 'Maker',
  [ROLES.MOD]: 'Moderator',
  [ROLES.ADMIN]: 'Admin',
  [ROLES.SUPER_ADMIN]: 'Super Admin'
};

// Default permissions
export const DEFAULT_PERMISSIONS: Record<UserRole, ReadonlyArray<string>> = {
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
