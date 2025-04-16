
import { UserRole, ROLES } from './rbac.types';

export const AUTH_STATUS = {
  LOADING: 'LOADING',
  AUTHENTICATED: 'AUTHENTICATED',
  GUEST: 'GUEST',
  ERROR: 'ERROR',
  IDLE: 'IDLE'
} as const;

export type AuthStatus = typeof AUTH_STATUS[keyof typeof AUTH_STATUS];

// Re-export logging types needed by auth components
export { LogLevel, LogCategory } from './logging.types';

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

// Re-export RBAC types for auth components
export { UserRole, ROLES };
