
import { create } from 'zustand';
import { UserProfile, AUTH_STATUS, AuthStatus } from '@/shared/types/core/auth.types';
import { mapUserToProfile } from '@/auth/utils/userMapper';
import { supabase } from '@/integrations/supabase/client';
import { RBACBridge } from '@/shared/bridges/RBACBridge';
import { ROLES, UserRole } from '@/shared/types/core/rbac.types';
import { logBridge } from '@/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';

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
  status: AUTH_STATUS.LOADING,
  error: null,
  initialized: false,
  
  setUser: (user) => {
    set({ 
      user, 
      profile: user,
      isAuthenticated: !!user,
      status: user ? AUTH_STATUS.AUTHENTICATED : AUTH_STATUS.GUEST
    });
    
    // Update RBAC roles when user changes
    if (user?.roles && Array.isArray(user.roles)) {
      // Filter to ensure only valid roles
      const validRoles = user.roles.filter(role => 
        Object.values(ROLES).includes(role as UserRole)
      ) as UserRole[];
      
      if (validRoles.length > 0) {
        RBACBridge.setRoles(validRoles);
      } else {
        RBACBridge.setRoles([ROLES.GUEST]);
      }
    } else {
      // Default to guest if no roles
      RBACBridge.setRoles([ROLES.GUEST]);
    }
  },
  
  setAuthStatus: (status) => set({ status }),
  
  setError: (error) => set({ error }),
  
  login: async (email, password) => {
    try {
      set({ status: AUTH_STATUS.LOADING });
      
      logBridge.info(LogCategory.AUTH, 'Login attempt', {
        details: { email }
      });
      
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
        
        logBridge.info(LogCategory.AUTH, 'Login successful', {
          details: { userId: userProfile.id }
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during login';
      logBridge.error(LogCategory.AUTH, 'Login failed', {
        details: { error: errorMessage, email }
      });
      
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
      
      logBridge.info(LogCategory.AUTH, 'Signup attempt', {
        details: { email }
      });
      
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
        
        logBridge.info(LogCategory.AUTH, 'Signup successful', {
          details: { userId: userProfile.id }
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during signup';
      logBridge.error(LogCategory.AUTH, 'Signup failed', {
        details: { error: errorMessage, email }
      });
      
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
      
      logBridge.info(LogCategory.AUTH, 'Password reset requested', {
        details: { email }
      });
      
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) throw error;
      
      set({ status: AUTH_STATUS.IDLE });
      
      logBridge.info(LogCategory.AUTH, 'Password reset email sent', {
        details: { email }
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during password reset';
      logBridge.error(LogCategory.AUTH, 'Password reset failed', {
        details: { error: errorMessage, email }
      });
      
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
      
      logBridge.info(LogCategory.AUTH, 'Logout attempt', {
        details: { userId: get().user?.id }
      });
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      set({ 
        user: null, 
        profile: null,
        isAuthenticated: false,
        status: AUTH_STATUS.GUEST
      });
      
      // Reset RBAC to guest
      RBACBridge.clearRoles();
      
      logBridge.info(LogCategory.AUTH, 'Logout successful');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during logout';
      logBridge.error(LogCategory.AUTH, 'Logout failed', {
        details: { error: errorMessage }
      });
      
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
      
      logBridge.info(LogCategory.AUTH, 'Initializing auth state');
      
      // Set up auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          const userProfile = mapUserToProfile(session.user);
          set({ 
            user: userProfile,
            profile: userProfile,
            isAuthenticated: true,
            status: AUTH_STATUS.AUTHENTICATED
          });
          
          logBridge.info(LogCategory.AUTH, 'Auth state changed', {
            details: { event, userId: userProfile.id }
          });
        } else {
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            status: AUTH_STATUS.GUEST
          });
          
          // Reset RBAC to guest
          RBACBridge.clearRoles();
          
          logBridge.info(LogCategory.AUTH, 'Auth state changed - no session', {
            details: { event }
          });
        }
      });
      
      // Check for existing session
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        logBridge.error(LogCategory.AUTH, 'Failed to get session', {
          details: { error: error.message }
        });
      }
      
      if (data?.session?.user) {
        const userProfile = mapUserToProfile(data.session.user);
        set({ 
          user: userProfile,
          profile: userProfile,
          isAuthenticated: true,
          status: AUTH_STATUS.AUTHENTICATED,
          initialized: true
        });
        
        logBridge.info(LogCategory.AUTH, 'Session found during initialization', {
          details: { userId: userProfile.id }
        });
      } else {
        set({
          user: null,
          profile: null,
          isAuthenticated: false,
          status: AUTH_STATUS.GUEST,
          initialized: true
        });
        
        // Set default guest role
        RBACBridge.setRoles([ROLES.GUEST]);
        
        logBridge.info(LogCategory.AUTH, 'No session found during initialization');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during initialization';
      logBridge.error(LogCategory.AUTH, 'Initialization error', {
        details: { error: errorMessage }
      });
      
      set({ 
        error: error instanceof Error ? error : new Error('Unknown error during initialization'),
        status: AUTH_STATUS.ERROR,
        initialized: true
      });
      
      // Default to guest on error
      RBACBridge.setRoles([ROLES.GUEST]);
    }
  },
  
  updateProfile: async (profileData) => {
    try {
      const { user } = get();
      
      if (!user) {
        throw new Error('No user logged in');
      }
      
      logBridge.info(LogCategory.AUTH, 'Profile update requested', {
        details: { userId: user.id }
      });
      
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
      
      logBridge.info(LogCategory.AUTH, 'Profile updated successfully', {
        details: { userId: user.id }
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error updating profile';
      logBridge.error(LogCategory.AUTH, 'Profile update failed', {
        details: { error: errorMessage, userId: get().user?.id }
      });
      
      set({ error: error instanceof Error ? error : new Error('Unknown error updating profile') });
      throw error;
    }
  }
}));
