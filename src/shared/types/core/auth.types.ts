export const AUTH_STATUS = {
  IDLE: 'IDLE',
  LOADING: 'LOADING',
  AUTHENTICATED: 'AUTHENTICATED',
  GUEST: 'GUEST',
  ERROR: 'ERROR'
} as const;

export type AuthStatus = (typeof AUTH_STATUS)[keyof typeof AUTH_STATUS];

export interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
  lastSignIn?: string;
  bio?: string;
  userMetadata?: Record<string, any>;
  appMetadata?: Record<string, any>;
  roles?: string[];
}

export interface AuthError extends Error {
  code?: string;
  customData?: Record<string, any>;
}
