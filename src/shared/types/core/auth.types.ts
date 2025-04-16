
export type AuthStatus = 'loading' | 'authenticated' | 'guest' | 'error';

// Create a const enum for consistent usage
export const AuthStatus = {
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  GUEST: 'guest',
  ERROR: 'error'
} as const;

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

// Remove the re-export and create a forward reference instead
// This avoids circular dependencies
export { type UserRole, type Permission } from './rbac.types';
