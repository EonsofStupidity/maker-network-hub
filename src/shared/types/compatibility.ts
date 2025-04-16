
import type { UserRole } from './core/rbac.types';
import { ROLES } from './core/rbac.types';
import { AUTH_STATUS, AuthStatus } from './core/auth.types';

// Legacy AUTH_STATUS constant for compatibility
export { AUTH_STATUS };

// Legacy ROLES mapping for compatibility
export { ROLES };

// Re-export types for compatibility
export type { UserRole, AuthStatus };
