
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSupabaseStatus } from '@/hooks/use-supabase-status';
import { authBridge } from '@/bridges/auth/bridge';
import { z } from 'zod';
import { useToast } from '@/shared/ui/use-toast';
import { logBridge } from '@/bridges/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';

// Define the shape of our context with Zod
const AppContextSchema = z.object({
  isLoading: z.boolean(),
  isConnected: z.boolean(),
  hasCheckedConnection: z.boolean(),
  isAuthenticated: z.boolean(),
  user: z.any().nullable(),
  refreshApp: z.function().args().returns(z.void()),
});

type AppContextType = z.infer<typeof AppContextSchema>;

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Use the enhanced Supabase status hook
  const { 
    isConnected, 
    lastChecked, 
    hasInitiallyChecked, 
    retryCount, 
    checkConnection 
  } = useSupabaseStatus(true);

  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initial user check
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = authBridge.getUser();
        setUser(currentUser);
        setIsAuthenticated(!!currentUser);
      } catch (error) {
        logBridge.error(LogCategory.AUTH, 'Failed to get user information', {
          error: error instanceof Error ? error.message : String(error)
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Function to refresh app state
  const refreshApp = () => {
    setIsLoading(true);
    
    // Force check connection status
    checkConnection()
      .then(() => {
        // Re-fetch user information
        const currentUser = authBridge.getUser();
        setUser(currentUser);
        setIsAuthenticated(!!currentUser);
      })
      .catch((error) => {
        toast({
          title: 'Error refreshing application state',
          description: error instanceof Error ? error.message : 'Unknown error',
          variant: 'destructive',
        });
        logBridge.error(LogCategory.SYSTEM, 'Error refreshing app state', {
          error: error instanceof Error ? error.message : String(error)
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const contextValue = {
    isLoading,
    isConnected,
    hasCheckedConnection: hasInitiallyChecked,
    isAuthenticated,
    user,
    refreshApp,
  };

  // Runtime validation in development
  if (process.env.NODE_ENV === 'development') {
    try {
      AppContextSchema.parse(contextValue);
    } catch (error) {
      console.error('AppContext value validation error:', error);
    }
  }

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook for using the app context
export function useApp() {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  
  return context;
}
