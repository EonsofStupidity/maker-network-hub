
export type AuthStatus = 'loading' | 'authenticated' | 'guest' | 'error';

export const AuthStatusEnum = {
  LOADING: 'loading' as AuthStatus,
  AUTHENTICATED: 'authenticated' as AuthStatus,
  GUEST: 'guest' as AuthStatus,
  ERROR: 'error' as AuthStatus
} as const;

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  created_at: string;
  updated_at?: string;
  last_sign_in_at?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
}
