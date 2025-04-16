
export type UserRole = 'guest' | 'follower' | 'maker' | 'mod' | 'admin' | 'super_admin';

export const ROLES = {
  guest: 'guest',
  follower: 'follower',
  maker: 'maker',
  mod: 'mod',
  admin: 'admin',
  super_admin: 'super_admin'
} as const;

// Create mappings from legacy roles to new roles
export const ROLE_MAPPINGS = {
  user: ROLES.guest,
  builder: ROLES.maker,
  moderator: ROLES.mod
};

export type Permission = 'canAccessVisualEditor' | 'canUseGus' | 'canModerate' | 'canCreateProjects' | 'canManageParts';
export type RolePermissions = Record<UserRole, Permission[]>;

export interface RBACState {
  roles: UserRole[];
  permissions: string[];
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}
