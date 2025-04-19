
import { create } from 'zustand';
import { AuthState } from '@/auth/auth-types/authTypes';
import { supabase } from '@/integrations/supabase/client';
import { logBridge } from '@/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';
import { mapUserToProfile } from '@/auth/utils/userMapper';
import { AUTH_STATUS } from '@/shared/types/core/auth.types';

const initialState: Partial<AuthState> = {
  user: null,
  isAuthenticated: false,
  status: AUTH_STATUS.IDLE,
  error: null,
  roles: [],
  isLoading: false,
  isInitialized: false
};

export const useAuthStore = create<AuthState>((set, get) => ({
  ...initialState as AuthState,

  initialize: async () => {
    set({ isLoading: true });
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (session?.user) {
        const userProfile = mapUserToProfile(session.user);
        set({
          user: userProfile,
          isAuthenticated: true,
          status: AUTH_STATUS.AUTHENTICATED,
          isInitialized: true
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          status: AUTH_STATUS.GUEST,
          isInitialized: true
        });
      }
    } catch (error) {
      logBridge.error(LogCategory.AUTH, 'Failed to initialize auth', { error });
      set({ error: error as Error, status: AUTH_STATUS.ERROR, isInitialized: true });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      const userProfile = mapUserToProfile(data.user!);
      set({
        user: userProfile,
        isAuthenticated: true,
        status: AUTH_STATUS.AUTHENTICATED,
        error: null
      });
    } catch (error) {
      logBridge.error(LogCategory.AUTH, 'Login failed', { error });
      set({
        user: null,
        isAuthenticated: false,
        status: AUTH_STATUS.ERROR,
        error: error instanceof Error ? error : new Error('Login failed')
      });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      set({
        user: null,
        isAuthenticated: false,
        status: AUTH_STATUS.GUEST,
        error: null
      });
    } catch (error) {
      logBridge.error(LogCategory.AUTH, 'Logout failed', { error });
      set({
        status: AUTH_STATUS.ERROR,
        error: error instanceof Error ? error : new Error('Logout failed')
      });
    } finally {
      set({ isLoading: false });
    }
  },

  signup: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      
      const userProfile = mapUserToProfile(data.user!);
      set({
        user: userProfile,
        isAuthenticated: true,
        status: AUTH_STATUS.AUTHENTICATED,
        error: null
      });
    } catch (error) {
      logBridge.error(LogCategory.AUTH, 'Signup failed', { error });
      set({
        user: null,
        isAuthenticated: false,
        status: AUTH_STATUS.ERROR,
        error: error instanceof Error ? error : new Error('Signup failed')
      });
    } finally {
      set({ isLoading: false });
    }
  },

  resetPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      set({ error: null });
    } catch (error) {
      logBridge.error(LogCategory.AUTH, 'Reset password failed', { error });
      set({ error: error instanceof Error ? error : new Error('Reset password failed') });
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateProfile: async (profile) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', get().user?.id)
        .select()
        .single();
        
      if (error) throw error;
      
      set((state) => ({
        user: {
          ...state.user!,
          ...profile,
        },
        error: null,
      }));
    } catch (error) {
      logBridge.error(LogCategory.AUTH, 'Profile update failed', { error });
      set({ error: error instanceof Error ? error : new Error('Profile update failed') });
    } finally {
      set({ isLoading: false });
    }
  },
}));
