
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

export type Permission = string;

export const AUTH_STATUS = {
  LOADING: 'LOADING',
  AUTHENTICATED: 'AUTHENTICATED',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  IDLE: 'IDLE',
  ERROR: 'ERROR'
} as const;

export type AuthStatus = typeof AUTH_STATUS[keyof typeof AUTH_STATUS];

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
  roles?: UserRole[];
}

export interface AuthSession {
  userId: string;
  email: string;
  isLinkedToGoogle: boolean;
  status: AuthStatus;
  profile?: UserProfile;
}

export interface RBACState {
  roles: UserRole[];
  permissions: string[];
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}
