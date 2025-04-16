
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, AUTH_STATUS } from '@/shared/types/core/auth.types';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/core/logging.types';

/**
 * Auth error types for better error handling
 */
export class AuthError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: 'auth/invalid-credentials',
  EMAIL_IN_USE: 'auth/email-in-use',
  WEAK_PASSWORD: 'auth/weak-password',
  SESSION_EXPIRED: 'auth/session-expired',
  NETWORK_ERROR: 'auth/network-error',
  UNKNOWN: 'auth/unknown',
} as const;

/**
 * Type guard for UserProfile
 */
function isUserProfile(obj: unknown): obj is UserProfile {
  if (!obj || typeof obj !== 'object') return false;
  const profile = obj as Partial<UserProfile>;
  return (
    typeof profile.id === 'string' &&
    typeof profile.email === 'string' &&
    !!profile.createdAt
  );
}

/**
 * Auth store state interface
 */
interface AuthState {
  user: UserProfile | null;
  status: typeof AUTH_STATUS[keyof typeof AUTH_STATUS];
  error: AuthError | null;
  initialized: boolean;
  lastActivity: number;
  
  // Auth methods
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  
  // Session methods
  initialize: () => Promise<void>;
  refreshSession: () => Promise<void>;
  validateSession: () => boolean;
}

/**
 * Auth store implementation
 * Manages only user, session, and authentication state
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      const logger = useLogger('AuthStore', LogCategory.AUTH);
      
      // Session timeout in milliseconds (30 minutes)
      const SESSION_TIMEOUT = 30 * 60 * 1000;
      
      return {
        user: null,
        status: AUTH_STATUS.IDLE,
        error: null,
        initialized: false,
        lastActivity: Date.now(),
        
        /**
         * Validate current session
         */
        validateSession: () => {
          const { lastActivity, status } = get();
          const isValid = (
            status === AUTH_STATUS.AUTHENTICATED &&
            Date.now() - lastActivity < SESSION_TIMEOUT
          );
          
          if (!isValid && status === AUTH_STATUS.AUTHENTICATED) {
            set({ 
              status: AUTH_STATUS.GUEST,
              error: new AuthError('Session expired', AUTH_ERROR_CODES.SESSION_EXPIRED)
            });
            logger.warn('Session expired');
          }
          
          return isValid;
        },
        
        /**
         * Sign in with email and password
         */
        signIn: async (email: string, password: string) => {
          try {
            set({ status: AUTH_STATUS.LOADING, error: null });
            
            // Validate inputs
            if (!email || !password) {
              throw new AuthError('Invalid credentials', AUTH_ERROR_CODES.INVALID_CREDENTIALS);
            }
            
            // TODO: Implement actual auth logic
            const mockUser: UserProfile = {
              id: '1',
              email,
              name: 'Test User',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            
            // Validate response
            if (!isUserProfile(mockUser)) {
              throw new AuthError('Invalid user data', AUTH_ERROR_CODES.UNKNOWN);
            }
            
            set({ 
              user: mockUser, 
              status: AUTH_STATUS.AUTHENTICATED,
              lastActivity: Date.now()
            });
            logger.info('User signed in successfully', { details: { email } });
          } catch (error) {
            const authError = error instanceof AuthError 
              ? error 
              : new AuthError(
                  error instanceof Error ? error.message : 'Unknown error',
                  AUTH_ERROR_CODES.UNKNOWN
                );
            
            set({ error: authError, status: AUTH_STATUS.ERROR });
            logger.error('Sign in failed', { 
              details: { 
                code: authError.code,
                message: authError.message 
              } 
            });
            throw authError;
          }
        },
        
        /**
         * Sign out current user
         */
        signOut: async () => {
          try {
            set({ status: AUTH_STATUS.LOADING, error: null });
            // TODO: Implement actual sign out logic
            set({ 
              user: null, 
              status: AUTH_STATUS.GUEST,
              lastActivity: 0
            });
            logger.info('User signed out successfully');
          } catch (error) {
            const authError = error instanceof AuthError 
              ? error 
              : new AuthError(
                  error instanceof Error ? error.message : 'Unknown error',
                  AUTH_ERROR_CODES.UNKNOWN
                );
            
            set({ error: authError, status: AUTH_STATUS.ERROR });
            logger.error('Sign out failed', { 
              details: { 
                code: authError.code,
                message: authError.message 
              } 
            });
            throw authError;
          }
        },
        
        /**
         * Sign up new user
         */
        signUp: async (email: string, password: string) => {
          try {
            set({ status: AUTH_STATUS.LOADING, error: null });
            
            // Validate inputs
            if (!email || !password) {
              throw new AuthError('Invalid credentials', AUTH_ERROR_CODES.INVALID_CREDENTIALS);
            }
            
            if (password.length < 8) {
              throw new AuthError('Password too weak', AUTH_ERROR_CODES.WEAK_PASSWORD);
            }
            
            // TODO: Implement actual sign up logic
            const mockUser: UserProfile = {
              id: '1',
              email,
              name: 'Test User',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            
            // Validate response
            if (!isUserProfile(mockUser)) {
              throw new AuthError('Invalid user data', AUTH_ERROR_CODES.UNKNOWN);
            }
            
            set({ 
              user: mockUser, 
              status: AUTH_STATUS.AUTHENTICATED,
              lastActivity: Date.now()
            });
            logger.info('User signed up successfully', { details: { email } });
          } catch (error) {
            const authError = error instanceof AuthError 
              ? error 
              : new AuthError(
                  error instanceof Error ? error.message : 'Unknown error',
                  AUTH_ERROR_CODES.UNKNOWN
                );
            
            set({ error: authError, status: AUTH_STATUS.ERROR });
            logger.error('Sign up failed', { 
              details: { 
                code: authError.code,
                message: authError.message 
              } 
            });
            throw authError;
          }
        },
        
        /**
         * Reset password
         */
        resetPassword: async (email: string) => {
          try {
            set({ status: AUTH_STATUS.LOADING, error: null });
            
            // Validate input
            if (!email) {
              throw new AuthError('Invalid email', AUTH_ERROR_CODES.INVALID_CREDENTIALS);
            }
            
            // TODO: Implement actual password reset logic
            set({ status: AUTH_STATUS.IDLE });
            logger.info('Password reset email sent', { details: { email } });
          } catch (error) {
            const authError = error instanceof AuthError 
              ? error 
              : new AuthError(
                  error instanceof Error ? error.message : 'Unknown error',
                  AUTH_ERROR_CODES.UNKNOWN
                );
            
            set({ error: authError, status: AUTH_STATUS.ERROR });
            logger.error('Password reset failed', { 
              details: { 
                code: authError.code,
                message: authError.message 
              } 
            });
            throw authError;
          }
        },
        
        /**
         * Initialize auth state
         */
        initialize: async () => {
          try {
            set({ status: AUTH_STATUS.LOADING, error: null });
            
            // Check for existing session
            const { validateSession } = get();
            const isValid = validateSession();
            
            set({ 
              status: isValid ? AUTH_STATUS.AUTHENTICATED : AUTH_STATUS.UNAUTHENTICATED,
              initialized: true 
            });
            logger.info('Auth state initialized', { details: { isValid } });
          } catch (error) {
            const authError = error instanceof AuthError 
              ? error 
              : new AuthError(
                  error instanceof Error ? error.message : 'Unknown error',
                  AUTH_ERROR_CODES.UNKNOWN
                );
            
            set({ 
              error: authError, 
              status: AUTH_STATUS.ERROR,
              initialized: true 
            });
            logger.error('Auth initialization failed', { 
              details: { 
                code: authError.code,
                message: authError.message 
              } 
            });
          }
        },
        
        /**
         * Refresh session
         */
        refreshSession: async () => {
          try {
            set({ status: AUTH_STATUS.LOADING, error: null });
            
            // Check for existing session
            const { validateSession } = get();
            const isValid = validateSession();
            
            if (!isValid) {
              throw new AuthError('Session expired', AUTH_ERROR_CODES.SESSION_EXPIRED);
            }
            
            // TODO: Implement actual session refresh logic
            set({ 
              status: AUTH_STATUS.AUTHENTICATED,
              lastActivity: Date.now()
            });
            logger.info('Session refreshed');
          } catch (error) {
            const authError = error instanceof AuthError 
              ? error 
              : new AuthError(
                  error instanceof Error ? error.message : 'Unknown error',
                  AUTH_ERROR_CODES.UNKNOWN
                );
            
            set({ error: authError, status: AUTH_STATUS.ERROR });
            logger.error('Session refresh failed', { 
              details: { 
                code: authError.code,
                message: authError.message 
              } 
            });
            throw authError;
          }
        }
      };
    },
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        lastActivity: state.lastActivity
      })
    }
  )
);
