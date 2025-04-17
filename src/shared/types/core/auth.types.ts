
import { UserRole } from './rbac.types';

// Auth status enum
export const AUTH_STATUS = {
  IDLE: 'IDLE',
  LOADING: 'LOADING',
  AUTHENTICATED: 'AUTHENTICATED',
  GUEST: 'GUEST',
  ERROR: 'ERROR'
} as const;

export type AuthStatus = keyof typeof AUTH_STATUS;

// User profile type
export interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
  lastSignIn?: string;
  userMetadata?: Record<string, any>;
  appMetadata?: Record<string, any>;
  roles?: UserRole[];
  [key: string]: any;
}

// Provider information
export interface AuthProviderData {
  providerId: string;
  uid: string;
  displayName?: string;
  email?: string;
  phoneNumber?: string;
  photoURL?: string;
}

// Auth credential type
export interface AuthCredential {
  providerId: string;
  signInMethod: string;
  accessToken?: string;
}

// Auth error type
export interface AuthError extends Error {
  code?: string;
  customData?: Record<string, any>;
}

// Export UserRole for easier access
export { UserRole, ROLES } from './rbac.types';
