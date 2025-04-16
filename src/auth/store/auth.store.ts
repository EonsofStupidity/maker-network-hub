import { create } from 'zustand';
import { UserProfile, AuthStatusEnum, AuthStatus } from '@/shared/types/core/auth.types';
import { mapUserToProfile } from '@/auth/utils/userMapper';
import { supabase } from '@/integrations/supabase/client';
import { AUTH_STATUS } from '@/shared/types/core/auth.types';

export interface AuthState {
  user: UserProfile | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  status: AuthStatus;
  error: Error | null;
  initialized: boolean;
  
  // Actions
  setUser: (user: UserProfile | null) => void;
  setAuthStatus: (status: AuthStatus) => void;
  setError: (error: Error | null) => void;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  initialize: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  status: AuthStatusEnum.LOADING,
  error: null,
  initialized: false,
  
  setUser: (user) => set({ 
    user, 
    profile: user,
    isAuthenticated: !!user,
    status: user ? AuthStatusEnum.AUTHENTICATED : AuthStatusEnum.GUEST
  }),
  
  setAuthStatus: (status) => set({ status }),
  
  setError: (error) => set({ error }),
  
  login: async (email, password) => {
    try {
      set({ status: AuthStatusEnum.LOADING });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        const userProfile = mapUserToProfile(data.user);
        set({ 
          user: userProfile,
          profile: userProfile,
          isAuthenticated: true,
          status: AuthStatusEnum.AUTHENTICATED
        });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error : new Error('Unknown error during login'),
        status: AuthStatusEnum.ERROR
      });
      throw error;
    }
  },
  
  signup: async (email, password) => {
    try {
      set({ status: AuthStatusEnum.LOADING });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        const userProfile = mapUserToProfile(data.user);
        set({ 
          user: userProfile,
          profile: userProfile,
          isAuthenticated: true,
          status: AuthStatusEnum.AUTHENTICATED
        });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error : new Error('Unknown error during signup'),
        status: AuthStatusEnum.ERROR
      });
      throw error;
    }
  },
  
  resetPassword: async (email) => {
    try {
      set({ status: AuthStatusEnum.LOADING });
      
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) throw error;
      
      set({ status: AuthStatusEnum.IDLE });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error : new Error('Unknown error during password reset'),
        status: AuthStatusEnum.ERROR
      });
      throw error;
    }
  },
  
  logout: async () => {
    try {
      set({ status: AuthStatusEnum.LOADING });
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      set({ 
        user: null, 
        profile: null,
        isAuthenticated: false,
        status: AuthStatusEnum.GUEST
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error : new Error('Unknown error during logout'),
        status: AuthStatusEnum.ERROR
      });
      throw error;
    }
  },
  
  initialize: async () => {
    try {
      set({ status: AuthStatusEnum.LOADING });
      
      const { data, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (data.session?.user) {
        const userProfile = mapUserToProfile(data.session.user);
        set({ 
          user: userProfile,
          profile: userProfile,
          isAuthenticated: true,
          status: AuthStatusEnum.AUTHENTICATED,
          initialized: true
        });
      } else {
        set({
          user: null,
          profile: null,
          isAuthenticated: false,
          status: AuthStatusEnum.GUEST,
          initialized: true
        });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error : new Error('Unknown error during initialization'),
        status: AuthStatusEnum.ERROR,
        initialized: true
      });
    }
  },
  
  updateProfile: async (profileData) => {
    try {
      const { user } = get();
      
      if (!user) {
        throw new Error('No user logged in');
      }
      
      const { error } = await supabase.auth.updateUser({
        data: {
          ...user.userMetadata,
          ...profileData.userMetadata
        }
      });
      
      if (error) throw error;
      
      set(state => ({
        user: state.user ? { ...state.user, ...profileData } : null,
        profile: state.profile ? { ...state.profile, ...profileData } : null
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error : new Error('Unknown error updating profile') });
      throw error;
    }
  }
}));
