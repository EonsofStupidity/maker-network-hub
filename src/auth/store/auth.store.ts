
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { logBridge } from '@/bridges/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';
import { UserProfile, AUTH_STATUS, AuthStatus } from '@/shared/types/core/auth.types';

interface AuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: UserProfile | null;
  status: AuthStatus;
  error: Error | null;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isInitialized: false,
  isAuthenticated: false,
  user: null,
  status: AUTH_STATUS.IDLE,
  error: null,

  initialize: async () => {
    try {
      set({ status: AUTH_STATUS.LOADING });
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        set({ 
          isAuthenticated: true, 
          user: session.user,
          status: AUTH_STATUS.AUTHENTICATED,
          isInitialized: true 
        });
        logBridge.info(LogCategory.AUTH, 'Auth initialized with session');
      } else {
        set({ 
          isAuthenticated: false, 
          user: null,
          status: AUTH_STATUS.GUEST,
          isInitialized: true 
        });
        logBridge.info(LogCategory.AUTH, 'Auth initialized without session');
      }
    } catch (error) {
      logBridge.error(LogCategory.AUTH, 'Failed to initialize auth', { error });
      set({ 
        isInitialized: true, 
        isAuthenticated: false, 
        user: null,
        status: AUTH_STATUS.ERROR,
        error: error instanceof Error ? error : new Error('Unknown error')
      });
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ status: AUTH_STATUS.LOADING });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      set({
        isAuthenticated: true,
        user: data.user,
        status: AUTH_STATUS.AUTHENTICATED,
        error: null
      });
    } catch (error) {
      set({ 
        status: AUTH_STATUS.ERROR,
        error: error instanceof Error ? error : new Error('Unknown error')
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      set({ status: AUTH_STATUS.LOADING });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      set({
        isAuthenticated: false,
        user: null,
        status: AUTH_STATUS.GUEST,
        error: null
      });
    } catch (error) {
      set({ 
        status: AUTH_STATUS.ERROR,
        error: error instanceof Error ? error : new Error('Unknown error')
      });
      throw error;
    }
  },

  signup: async (email: string, password: string) => {
    try {
      set({ status: AUTH_STATUS.LOADING });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      set({
        isAuthenticated: true,
        user: data.user,
        status: AUTH_STATUS.AUTHENTICATED,
        error: null
      });
    } catch (error) {
      set({ 
        status: AUTH_STATUS.ERROR,
        error: error instanceof Error ? error : new Error('Unknown error')
      });
      throw error;
    }
  },

  resetPassword: async (email: string) => {
    try {
      set({ status: AUTH_STATUS.LOADING });
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      set({ status: AUTH_STATUS.IDLE, error: null });
    } catch (error) {
      set({ 
        status: AUTH_STATUS.ERROR,
        error: error instanceof Error ? error : new Error('Unknown error')
      });
      throw error;
    }
  },

  updateProfile: async (profile: Partial<UserProfile>) => {
    try {
      set({ status: AUTH_STATUS.LOADING });
      const { data, error } = await supabase.auth.updateUser({
        data: profile
      });

      if (error) throw error;

      set({
        user: { ...data.user, ...profile },
        status: AUTH_STATUS.AUTHENTICATED,
        error: null
      });
    } catch (error) {
      set({ 
        status: AUTH_STATUS.ERROR,
        error: error instanceof Error ? error : new Error('Unknown error')
      });
      throw error;
    }
  }
}));
