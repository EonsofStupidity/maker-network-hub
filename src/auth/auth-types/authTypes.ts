import { UserProfile, AuthStatus } from '@/shared/types/core/auth.types';

/**
 * Re-export the UserRole type for backward compatibility
 */
export type { UserProfile };
export { AuthStatus };
export type { AuthStatus as AuthStatusType };

/**
 * Auth user type
 */
export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified?: boolean;
  phoneNumber?: string;
  isAnonymous?: boolean;
  tenantId?: string;
  metadata?: {
    creationTime?: string;
    lastSignInTime?: string;
  };
}

/**
 * Auth provider types
 */
export type AuthProviderType = 'password' | 'google' | 'github' | 'twitter' | 'facebook' | 'phone' | 'anonymous';

/**
 * Auth credential type
 */
export interface AuthCredential {
  providerId: string;
  signInMethod: string;
}

/**
 * Auth state type
 */
export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  status: AuthStatus;
  error: Error | null;
  isLoading: boolean;
  profile: UserProfile | null;
  initialized: boolean;
  sessionToken?: string | null;
  refreshToken?: string | null;
  
  // Auth actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile?: (profile: Partial<UserProfile>) => Promise<void>;
}

/**
 * Auth permission type
 */
export interface Permission {
  id: string;
  name: string;
  description?: string;
}
