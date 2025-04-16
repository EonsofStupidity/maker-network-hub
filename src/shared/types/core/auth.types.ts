
import { UserRole, ROLES } from './rbac.types';

export const AUTH_STATUS = {
  LOADING: 'LOADING',
  AUTHENTICATED: 'AUTHENTICATED', 
  GUEST: 'GUEST',
  ERROR: 'ERROR',
  IDLE: 'IDLE'
} as const;

export type AuthStatus = typeof AUTH_STATUS[keyof typeof AUTH_STATUS];

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
  lastSignInAt?: string;
  bio?: string;
  name?: string;
  userMetadata?: Record<string, unknown>;
  appMetadata?: Record<string, unknown>;
  roles?: UserRole[];
}

// Re-export RBAC types
export { UserRole, ROLES };
