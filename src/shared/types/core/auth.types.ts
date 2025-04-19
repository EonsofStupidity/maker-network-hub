
export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
  lastSignIn?: string;
  bio?: string;
  name?: string;
  userMetadata?: Record<string, any>;
  appMetadata?: Record<string, any>;
  roles?: string[];
}

export const AUTH_STATUS = {
  AUTHENTICATED: 'AUTHENTICATED',
  GUEST: 'GUEST',
  ERROR: 'ERROR',
  LOADING: 'LOADING'
} as const;

export type AuthStatus = typeof AUTH_STATUS[keyof typeof AUTH_STATUS];
