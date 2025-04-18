export const AUTH_STATUS = {
  IDLE: 'IDLE',
  LOADING: 'LOADING',
  AUTHENTICATED: 'AUTHENTICATED',
  GUEST: 'GUEST',
  ERROR: 'ERROR'
} as const;

export type AuthStatus = (typeof AUTH_STATUS)[keyof typeof AUTH_STATUS];

// Define more specific metadata types
export type UserMetadata = {
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  [key: string]: unknown;
};

export type AppMetadata = {
  roles?: string[];
  permissions?: string[];
  [key: string]: unknown;
};

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
  userMetadata?: UserMetadata;
  appMetadata?: AppMetadata;
  roles?: string[];
}

export interface AuthError extends Error {
  code?: string;
  customData?: Record<string, unknown>;
}
