
import { UserProfile } from '@/shared/types/core/auth.types';
import { authBridge } from '@/auth/lib/AuthBridgeImpl';

/**
 * Re-export the AuthBridge from the auth/lib folder
 */
export { authBridge };

/**
 * AuthBridge interface
 * Provides a clean abstraction layer for authentication functionality
 */
export interface IAuthBridge {
  // Session management
  getCurrentSession: () => Promise<{ user: UserProfile } | null>;
  refreshSession: () => Promise<{ user_id: string } | null>;
  
  // Authentication methods
  signInWithEmail: (email: string, password: string) => Promise<{ user: UserProfile | null; error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ user: UserProfile | null; error: Error | null }>;
  signOut: () => Promise<void>;
  
  // Account linking
  onAuthEvent: (callback: (event: any) => void) => { unsubscribe: () => void };
  
  // Password management
  resetPassword: (email: string) => Promise<void>;
  
  // User profile
  getUser: () => UserProfile | null;
  getProfile: () => UserProfile | null;
}
