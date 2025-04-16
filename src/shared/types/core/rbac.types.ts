
export const ROLES = {
  super_admin: 'super_admin',
  admin: 'admin',
  moderator: 'moderator',
  builder: 'builder',
  user: 'user',
  guest: 'guest'
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

export type PermissionKey = 'canUseGus' | 'canEditParts' | 'canAccessVisualEditor';

export interface RolePermissions {
  [key in UserRole]: PermissionKey[];
}

export interface RBACState {
  roles: UserRole[];
  permissions: string[];
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

