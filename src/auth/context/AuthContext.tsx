
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logBridge } from '@/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';
import { RBACBridge } from '@/shared/bridges/RBACBridge';
import { ROLES, UserRole } from '@/shared/types/core/rbac.types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, metadata?: any) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  loading: true,
  error: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        
        // Check for existing session
        const { data } = await supabase.auth.getSession();
        const session = data?.session;
        
        if (session?.user) {
          setIsAuthenticated(true);
          setUser(session.user);
          logBridge.info(LogCategory.AUTH, 'User session restored', {
            details: { userId: session.user.id }
          });
          
          // Set user roles from session metadata
          if (session.user.app_metadata?.roles) {
            const appRoles = session.user.app_metadata.roles as string[];
            // Convert string array to UserRole array with validation
            const validRoles = appRoles
              .filter(role => 
                Object.values(ROLES).includes(role as UserRole)
              ) as UserRole[];
            
            RBACBridge.setRoles(validRoles.length ? validRoles : [ROLES.GUEST]);
          } else {
            // Default to GUEST if no roles found
            RBACBridge.setRoles([ROLES.GUEST]);
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
          RBACBridge.setRoles([ROLES.GUEST]);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to initialize auth';
        logBridge.error(LogCategory.AUTH, 'Auth initialization error', {
          details: { error: errorMsg }
        });
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
        setUser(session.user);
        
        logBridge.info(LogCategory.AUTH, 'User signed in', {
          details: { userId: session.user?.id ?? 'unknown', event }
        });
        
        // Set user roles from session metadata
        if (session.user?.app_metadata?.roles) {
          const appRoles = session.user.app_metadata.roles as string[];
          // Convert string array to UserRole array with validation
          const validRoles = appRoles
            .filter(role => 
              Object.values(ROLES).includes(role as UserRole)
            ) as UserRole[];
          
          RBACBridge.setRoles(validRoles.length ? validRoles : [ROLES.GUEST]);
        } else {
          // For new users that might not have roles yet
          RBACBridge.setRoles([ROLES.GUEST, ROLES.FOLLOWER]);
        }
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUser(null);
        RBACBridge.setRoles([ROLES.GUEST]);
        
        logBridge.info(LogCategory.AUTH, 'User signed out', {
          details: { event }
        });
      }
    });
    
    initAuth();
    
    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Login function
  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      logBridge.info(LogCategory.AUTH, 'User login successful', {
        details: { userId: data.user?.id ?? 'unknown', email }
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Login failed';
      logBridge.error(LogCategory.AUTH, 'Login error', {
        details: { error: errorMsg, email }
      });
      setError(errorMsg);
      throw err;
    }
  };
  
  // Register function
  const register = async (email: string, password: string, metadata?: any) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) {
        throw error;
      }
      
      logBridge.info(LogCategory.AUTH, 'User registration successful', {
        details: { userId: data.user?.id ?? 'unknown', email }
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Registration failed';
      logBridge.error(LogCategory.AUTH, 'Registration error', {
        details: { error: errorMsg, email }
      });
      setError(errorMsg);
      throw err;
    }
  };
  
  // Logout function
  const logout = async () => {
    try {
      setError(null);
      await supabase.auth.signOut();
      
      logBridge.info(LogCategory.AUTH, 'User logged out');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Logout failed';
      logBridge.error(LogCategory.AUTH, 'Logout error', {
        details: { error: errorMsg }
      });
      setError(errorMsg);
      throw err;
    }
  };
  
  const value = {
    isAuthenticated,
    user,
    login,
    register,
    logout,
    loading,
    error,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
