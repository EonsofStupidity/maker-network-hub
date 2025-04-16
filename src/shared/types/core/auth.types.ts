
export type AuthStatus = 'loading' | 'authenticated' | 'guest' | 'error';

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  displayName?: string;
  avatarUrl?: string;
  created_at: string;
  updated_at?: string;
  last_sign_in_at?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
}

// Re-export these from rbac.types.ts for backwards compatibility
export { UserRole, ROLES, Permission, RolePermissions } from './rbac.types';
