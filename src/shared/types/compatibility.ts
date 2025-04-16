
import { UserRole as CoreUserRole, ROLES as CoreROLES } from './core/rbac.types';
import { AuthStatus, AuthStatusEnum } from './core/auth.types';

// Legacy AUTH_STATUS constant for compatibility
export const AUTH_STATUS = AuthStatusEnum;

// Legacy ROLES mapping for compatibility
export const ROLES = CoreROLES;

// Re-export types for compatibility
export type UserRole = CoreUserRole;
