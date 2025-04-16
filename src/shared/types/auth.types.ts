
import { UserRole, AUTH_STATUS } from './shared.types';

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
 * User profile type
 */
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
  roles?: UserRole[];
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
  status: typeof AUTH_STATUS[keyof typeof AUTH_STATUS];
  error: Error | null;
  roles: UserRole[];
  isLoading: boolean;
  profile?: UserProfile;
  initialized: boolean;
  sessionToken?: string | null;
  refreshToken?: string | null;
  
  // Auth actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
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

/**
 * Auth context type
 */
export interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

/**
 * Auth hook return type
 */
export interface UseAuthReturn {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  status: typeof AUTH_STATUS[keyof typeof AUTH_STATUS];
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile?: (profile: Partial<UserProfile>) => Promise<void>;
}
