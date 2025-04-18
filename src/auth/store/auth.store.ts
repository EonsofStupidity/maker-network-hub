
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { logBridge } from '@/bridges/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';

interface AuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: any | null;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isInitialized: false,
  isAuthenticated: false,
  user: null,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        set({ 
          isAuthenticated: true, 
          user: session.user,
          isInitialized: true 
        });
        logBridge.info(LogCategory.AUTH, 'Auth initialized with session');
      } else {
        set({ 
          isAuthenticated: false, 
          user: null,
          isInitialized: true 
        });
        logBridge.info(LogCategory.AUTH, 'Auth initialized without session');
      }
    } catch (error) {
      logBridge.error(LogCategory.AUTH, 'Failed to initialize auth', { error });
      set({ isInitialized: true, isAuthenticated: false, user: null });
    }
  },

  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    set({
      isAuthenticated: true,
      user: data.user,
    });
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    set({
      isAuthenticated: false,
      user: null,
    });
  },
}));
