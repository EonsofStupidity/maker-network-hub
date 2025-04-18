import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/auth.store';
import { AUTH_STATUS, UserProfile, AuthStatus } from '@/shared/types/core/auth.types';

/**
 * Hook to access auth state with auto-initialization
 * Provides a simplified interface for components
 */
export const useAuthState = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  
  const {
    user,
    isAuthenticated,
    status,
    error,
    isInitialized,
    initialize,
    login,
    logout,
    signup
  } = useAuthStore();

  useEffect(() => {
    // Initialize auth if not already initialized
    if (!isInitialized) {
      initialize().finally(() => {
        setIsInitializing(false);
      });
    } else {
      setIsInitializing(false);
    }
  }, [initialize, isInitialized]);

  return {
    user,
    isAuthenticated,
    isAuthReady: isInitialized && !isInitializing,
    isLoading: status === AUTH_STATUS.LOADING || isInitializing,
    error,
    login,
    logout,
    signup,
    status: status as AuthStatus
  };
};

export type AuthHookState = {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  isLoading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  status: AuthStatus;
};

export default useAuthState;
