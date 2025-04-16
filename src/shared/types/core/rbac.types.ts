
export type UserRole = 'guest' | 'follower' | 'maker' | 'mod' | 'admin' | 'super_admin';

export const ROLES = {
  guest: 'guest',
  follower: 'follower',
  maker: 'maker', // replaces 'builder'
  mod: 'mod',    // replaces 'moderator'
  admin: 'admin',
  super_admin: 'super_admin'
} as const;

export type Permission =
  | 'canUseGus'
  | 'canAccessVisualEditor'
  | 'canManageParts'
  | 'canModerate'
  | 'canPublishStaticPages';

export interface RBACState {
  roles: UserRole[];
  permissions: Permission[];
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}
