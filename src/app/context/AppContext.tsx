
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSupabaseStatus } from '@/hooks/use-supabase-status';
import { logBridge } from '@/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';
import { supabase } from '@/integrations/supabase/client';

interface AppContextType {
  isOffline: boolean;
  isInitialized: boolean;
  connectionQuality: 'good' | 'poor' | 'offline';
  lastSyncTime: Date | null;
  syncStatus: 'synced' | 'syncing' | 'error';
  checkConnection: () => Promise<boolean>;
}

const AppContext = createContext<AppContextType>({
  isOffline: false,
  isInitialized: false,
  connectionQuality: 'good',
  lastSyncTime: null,
  syncStatus: 'synced',
  checkConnection: async () => true,
});

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get Supabase status
  const { isConnected, checkConnection, hasInitiallyChecked, retryCount } = useSupabaseStatus(
    true, // Check immediately
    30000, // Check every 30s
    true // Show toasts
  );
  
  // Additional state
  const [isInitialized, setIsInitialized] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'poor' | 'offline'>('good');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');
  
  // Connection quality monitoring
  useEffect(() => {
    if (!isConnected) {
      setConnectionQuality('offline');
    } else if (retryCount > 0) {
      setConnectionQuality('poor');
    } else {
      setConnectionQuality('good');
    }
  }, [isConnected, retryCount]);
  
  // Initialization
  useEffect(() => {
    const initApp = async () => {
      try {
        // Check if we can reach Supabase
        const canConnect = await checkConnection();
        
        if (canConnect) {
          // Perform any initialization that requires Supabase
          const { data } = await supabase.from('layout_skeletons').select('count').single();
          
          logBridge.info(LogCategory.SYSTEM, 'App initialized with Supabase connection', {
            details: { layoutCount: data?.count }
          });
        } else {
          logBridge.warn(LogCategory.SYSTEM, 'App initialized in offline mode');
        }
        
        // Mark as initialized regardless of connection status
        setIsInitialized(true);
        setLastSyncTime(new Date());
      } catch (error) {
        logBridge.error(LogCategory.SYSTEM, 'Error initializing app', {
          details: { error: error instanceof Error ? error.message : String(error) }
        });
        
        // Mark as initialized anyway to not block the app
        setIsInitialized(true);
      }
    };
    
    if (hasInitiallyChecked && !isInitialized) {
      initApp();
    }
  }, [hasInitiallyChecked, isInitialized, checkConnection]);
  
  // Set up offline detection via window events
  useEffect(() => {
    const handleOnline = () => {
      logBridge.info(LogCategory.SYSTEM, 'Browser reported online status');
      checkConnection();
    };
    
    const handleOffline = () => {
      logBridge.warn(LogCategory.SYSTEM, 'Browser reported offline status');
      setConnectionQuality('offline');
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkConnection]);
  
  const value = {
    isOffline: !isConnected,
    isInitialized,
    connectionQuality,
    lastSyncTime,
    syncStatus,
    checkConnection,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
