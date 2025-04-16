
import { create } from 'zustand';
import { UserProfile, AUTH_STATUS, AuthStatus } from '@/shared/types/core/auth.types';
import { mapUserToProfile } from '@/auth/utils/userMapper';
import { supabase } from '@/integrations/supabase/client';
import { ROLES, UserRole } from '@/shared/types/core/rbac.types';

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

// Default system user for development/testing
const systemUser: UserProfile = {
  id: 'system-user-id',
  email: 'system@internal.app',
  displayName: 'System User',
  createdAt: new Date().toISOString(),
  roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
};

// Create mock user for development
const createMockUser = (id: string): UserProfile => ({
  id,
  email: `user-${id}@example.com`,
  displayName: `User ${id}`,
  createdAt: new Date().toISOString(),
  roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
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
      
      // In development, always succeed with system user
      if (process.env.NODE_ENV === 'development') {
        set({ 
          user: systemUser,
          profile: systemUser,
          isAuthenticated: true,
          status: AUTH_STATUS.AUTHENTICATED
        });
        return;
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data?.user) {
        const userProfile = mapUserToProfile(data.user);
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
      
      // In development, always succeed with system user
      if (process.env.NODE_ENV === 'development') {
        set({ 
          user: systemUser,
          profile: systemUser,
          isAuthenticated: true,
          status: AUTH_STATUS.AUTHENTICATED
        });
        return;
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data?.user) {
        const userProfile = mapUserToProfile(data.user);
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
      
      // In development mode, just simulate success
      if (process.env.NODE_ENV === 'development') {
        set({ status: AUTH_STATUS.IDLE });
        return;
      }
      
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
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
      
      // In development, just reset the state
      if (process.env.NODE_ENV === 'development') {
        set({ 
          user: null, 
          profile: null,
          isAuthenticated: false,
          status: AUTH_STATUS.GUEST
        });
        return;
      }
      
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
      
      // In development, always use the system user
      if (process.env.NODE_ENV === 'development') {
        console.info('Development mode: Using system user');
        set({ 
          user: systemUser,
          profile: systemUser,
          isAuthenticated: true,
          status: AUTH_STATUS.AUTHENTICATED,
          initialized: true
        });
        return;
      }
      
      const { data, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (data?.session?.user) {
        const userProfile = mapUserToProfile(data.session.user);
        set({ 
          user: userProfile,
          profile: userProfile,
          isAuthenticated: true,
          status: AUTH_STATUS.AUTHENTICATED,
          initialized: true
        });
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
      console.error('Auth initialization error:', error);
      
      // In case of an error in production, set guest mode
      set({ 
        user: null,
        profile: null,
        isAuthenticated: false,
        error: error instanceof Error ? error : new Error('Unknown error during initialization'),
        status: AUTH_STATUS.GUEST,
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
      
      // In development, just update the state
      if (process.env.NODE_ENV === 'development') {
        set(state => ({
          user: state.user ? { ...state.user, ...profileData } : null,
          profile: state.profile ? { ...state.profile, ...profileData } : null
        }));
        return;
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
