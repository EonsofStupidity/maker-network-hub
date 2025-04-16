
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
  displayName: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
  lastSignInAt?: string;
  bio?: string;
  name?: string;
  userMetadata?: Record<string, unknown>;
  appMetadata?: Record<string, unknown>;
  roles?: string[];
}

