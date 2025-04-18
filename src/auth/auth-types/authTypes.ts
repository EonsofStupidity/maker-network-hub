import { UserProfile, AuthStatus } from '@/shared/types/core/auth.types';
import { UserRole } from '@/shared/types/core/rbac.types';

/**
 * Main AuthState interface used throughout the application
 */
export interface AuthState {
  // Auth state
  user: UserProfile | null;
  isAuthenticated: boolean;
  isInitialized: boolean; // Single property for initialization state
  status: AuthStatus;
  error: Error | null;
  
  // Additional state
  roles?: UserRole[];
  isLoading?: boolean;
  sessionToken?: string | null;
  refreshToken?: string | null;
  
  // Auth actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

// Re-export core types
export type { UserProfile, AuthStatus };
