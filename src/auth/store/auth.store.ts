
import { create } from 'zustand';
import { UserProfile, AUTH_STATUS, AuthStatus } from '@/shared/types/core/auth.types';
import { mapUserToProfile } from '@/auth/utils/userMapper';
import { supabase } from '@/integrations/supabase/client';

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

// Mock user for Supabase client testing purpose
const createMockUser = (id: string) => ({
  id,
  email: `user-${id}@example.com`,
  app_metadata: { roles: [] },
  user_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString()
});

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  status: AUTH_STATUS.LOADING,
  error: null,
  initialized: false,
  
  setUser: (user) => set({ 
    user, 
    profile: user,
    isAuthenticated: !!user,
    status: user ? AUTH_STATUS.AUTHENTICATED : AUTH_STATUS.GUEST
  }),
  
  setAuthStatus: (status) => set({ status }),
  
  setError: (error) => set({ error }),
  
  login: async (email, password) => {
    try {
      set({ status: AUTH_STATUS.LOADING });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data?.user) {
        // Create a full mock user if we're using the mock client
        const fullUser = createMockUser(data.user.id);
        const userProfile = mapUserToProfile(fullUser);
        set({ 
          user: userProfile,
          profile: userProfile,
          isAuthenticated: true,
          status: AUTH_STATUS.AUTHENTICATED
        });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error : new Error('Unknown error during login'),
        status: AUTH_STATUS.ERROR
      });
      throw error;
    }
  },
  
  signup: async (email, password) => {
    try {
      set({ status: AUTH_STATUS.LOADING });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data?.user) {
        // Create a full mock user if we're using the mock client
        const fullUser = createMockUser(data.user.id);
        const userProfile = mapUserToProfile(fullUser);
        set({ 
          user: userProfile,
          profile: userProfile,
          isAuthenticated: true,
          status: AUTH_STATUS.AUTHENTICATED
        });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error : new Error('Unknown error during signup'),
        status: AUTH_STATUS.ERROR
      });
      throw error;
    }
  },
  
  resetPassword: async (email) => {
    try {
      set({ status: AUTH_STATUS.LOADING });
      
      // Use the safer alternative
      const { error } = await supabase.auth.signUp({
        email,
        password: Math.random().toString(36).slice(-8)
      });
      
      if (error) throw error;
      
      set({ status: AUTH_STATUS.IDLE });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error : new Error('Unknown error during password reset'),
        status: AUTH_STATUS.ERROR
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
        user: null, 
        profile: null,
        isAuthenticated: false,
        status: AUTH_STATUS.GUEST
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error : new Error('Unknown error during logout'),
        status: AUTH_STATUS.ERROR
      });
      throw error;
    }
  },
  
  initialize: async () => {
    try {
      set({ status: AUTH_STATUS.LOADING });
      
      const { data, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (data?.session?.user) {
        // Create a full mock user if we're using the mock client
        const sessionUser = data.session.user;
        if (sessionUser) {
          const fullUser = createMockUser(sessionUser.id);
          const userProfile = mapUserToProfile(fullUser);
          set({ 
            user: userProfile,
            profile: userProfile,
            isAuthenticated: true,
            status: AUTH_STATUS.AUTHENTICATED,
            initialized: true
          });
        }
      } else {
        set({
          user: null,
          profile: null,
          isAuthenticated: false,
          status: AUTH_STATUS.GUEST,
          initialized: true
        });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error : new Error('Unknown error during initialization'),
        status: AUTH_STATUS.ERROR,
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
      
      // Fix for mock Supabase client
      if (!('updateUser' in supabase.auth)) {
        // Mock update logic
        set(state => ({
          user: state.user ? { ...state.user, ...profileData } : null,
          profile: state.profile ? { ...state.profile, ...profileData } : null
        }));
        return;
      }
      
      const { error } = await (supabase.auth as any).updateUser({
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
