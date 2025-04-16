
import { UserProfile, AuthStatus, UserRole } from '@/shared/types/core/auth.types';

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  status: AuthStatus;
  error: Error | null;
  roles: UserRole[];
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
  resetPassword: (email: string) => Promise<void>;
  updateProfile?: (profile: Partial<UserProfile>) => Promise<void>;
}

// Re-export core types
export type { UserProfile, AuthStatus, UserRole };
