
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

  // Set up auth state listener first to avoid race conditions
  useEffect(() => {
    let isMounted = true;
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      
      try {
        // Track the auth state changes
        console.log('Auth state changed:', event);
        
        // Update auth state based on session
        if (session?.user) {
          setIsAuthenticated(true);
          setUser(session.user);
          
          // Set user roles from session metadata
          if (session.user?.app_metadata?.roles) {
            const appRoles = session.user.app_metadata.roles;
            const validRoles = Array.isArray(appRoles) 
              ? appRoles.filter(role => Object.values(ROLES).includes(role as UserRole)) as UserRole[]
              : [];
            
            RBACBridge.setRoles(validRoles.length ? validRoles : [ROLES.GUEST]);
          } else {
            RBACBridge.setRoles([ROLES.GUEST]);
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
          RBACBridge.setRoles([ROLES.GUEST]);
        }
        
        // If we have a session update, mark as no longer loading
        if (event !== 'INITIAL_SESSION') {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error in auth state change handler:', err);
      }
    });
    
    // Check for existing session
    const checkSession = async () => {
      if (!isMounted) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data?.session?.user) {
          setIsAuthenticated(true);
          setUser(data.session.user);
          
          // Set user roles
          if (data.session.user?.app_metadata?.roles) {
            const appRoles = data.session.user.app_metadata.roles;
            const validRoles = Array.isArray(appRoles) 
              ? appRoles.filter(role => Object.values(ROLES).includes(role as UserRole)) as UserRole[]
              : [];
            
            RBACBridge.setRoles(validRoles.length ? validRoles : [ROLES.GUEST]);
          } else {
            RBACBridge.setRoles([ROLES.GUEST]);
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
          RBACBridge.setRoles([ROLES.GUEST]);
        }
      } catch (err) {
        console.error('Error checking auth session:', err);
        logBridge.error(LogCategory.AUTH, 'Failed to get session', {
          details: { error: String(err) }
        });
        
        // Even if there's an error, mark as not loading so UI can show error state
        setIsAuthenticated(false);
        setUser(null);
        RBACBridge.setRoles([ROLES.GUEST]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    // Perform initial session check
    checkSession();
    
    // Cleanup
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);
  
  // Login function
  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      // Auth state listener will update state
      logBridge.info(LogCategory.AUTH, 'User login successful', {
        details: { userId: data.user?.id ?? 'unknown', email }
      });
    } catch (err) {
      setLoading(false);
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
      setLoading(true);
      
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
      
      // Auth state listener will update state
      logBridge.info(LogCategory.AUTH, 'User registration successful', {
        details: { userId: data.user?.id ?? 'unknown', email }
      });
    } catch (err) {
      setLoading(false);
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
      setLoading(true);
      
      await supabase.auth.signOut();
      
      // Auth state listener will update state
      logBridge.info(LogCategory.AUTH, 'User logged out');
    } catch (err) {
      setLoading(false);
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
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
