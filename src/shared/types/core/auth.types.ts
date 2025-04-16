
export type AuthStatus = 'loading' | 'authenticated' | 'guest' | 'error';

export const AuthStatusEnum = {
  LOADING: 'loading' as AuthStatus,
  AUTHENTICATED: 'authenticated' as AuthStatus,
  GUEST: 'guest' as AuthStatus,
  ERROR: 'error' as AuthStatus,
  IDLE: 'guest' as AuthStatus // Added for compatibility
} as const;

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
  lastSignInAt?: string;
  bio?: string;
  name?: string; // Added for backward compatibility
  userMetadata?: Record<string, unknown>;
  appMetadata?: Record<string, unknown>;
  roles?: string[]; // For compatibility with some components
}

// For legacy compatibility - mapping from snake_case property names
export const userProfileMapping = {
  user_metadata: 'userMetadata',
  app_metadata: 'appMetadata',
  avatar_url: 'avatarUrl',
  created_at: 'createdAt',
  updated_at: 'updatedAt',
  last_sign_in_at: 'lastSignInAt'
};
