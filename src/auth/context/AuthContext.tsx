
import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthStatus } from '@/shared/types/core/auth.types';
import { UserProfile } from '@/shared/types/core/auth.types';
import { createClient } from '@supabase/supabase-js';

interface AuthContextProps {
  user: UserProfile | null;
  isAuthenticated: boolean;
  status: typeof AuthStatus[keyof typeof AuthStatus];
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  setStatus: React.Dispatch<React.SetStateAction<typeof AuthStatus[keyof typeof AuthStatus]>>;
  supabase: any;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  status: AuthStatus.LOADING,
  setUser: () => {},
  setStatus: () => {},
  supabase: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState<typeof AuthStatus[keyof typeof AuthStatus]>(AuthStatus.LOADING);
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co',
    import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'
  );

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          const userProfile: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name,
            avatarUrl: session.user.user_metadata?.avatar_url,
            created_at: session.user.created_at,
            updated_at: session.user.updated_at || session.user.created_at,
            user_metadata: session.user.user_metadata,
            app_metadata: session.user.app_metadata,
          };
          setUser(userProfile);
          setStatus(AuthStatus.AUTHENTICATED);
        } else {
          setUser(null);
          setStatus(AuthStatus.GUEST);
        }
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const userProfile: UserProfile = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name,
          avatarUrl: session.user.user_metadata?.avatar_url,
          created_at: session.user.created_at,
          updated_at: session.user.updated_at || session.user.created_at,
          user_metadata: session.user.user_metadata,
          app_metadata: session.user.app_metadata,
        };
        setUser(userProfile);
        setStatus(AuthStatus.AUTHENTICATED);
      } else {
        setStatus(AuthStatus.GUEST);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    isAuthenticated: status === AuthStatus.AUTHENTICATED,
    status,
    setUser,
    setStatus,
    supabase,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
