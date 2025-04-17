import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSupabaseStatus } from '@/hooks/use-supabase-status';
import { logBridge } from '@/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/shared/ui/use-toast';

interface AppContextType {
  isOffline: boolean;
  isInitialized: boolean;
  connectionQuality: 'good' | 'poor' | 'offline';
  lastSyncTime: Date | null;
  syncStatus: 'synced' | 'syncing' | 'error';
  checkConnection: () => Promise<boolean>;
  isWebSocketConnected: boolean;
}

const AppContext = createContext<AppContextType>({
  isOffline: false,
  isInitialized: false,
  connectionQuality: 'good',
  lastSyncTime: null,
  syncStatus: 'synced',
  checkConnection: async () => true,
  isWebSocketConnected: false
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
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  
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
  
  // Websocket connection monitoring - setup channel to monitor connection
  useEffect(() => {
    try {
      // Create a heartbeat channel to check WebSocket connection
      const heartbeatChannel = supabase.channel('heartbeat');
      
      heartbeatChannel
        .on('presence', { event: 'sync' }, () => {
          setIsWebSocketConnected(true);
        })
        .on('system', { event: 'disconnect' }, () => {
          setIsWebSocketConnected(false);
          logBridge.warn(LogCategory.SYSTEM, 'WebSocket disconnected');
        })
        .on('system', { event: 'reconnect' }, () => {
          setIsWebSocketConnected(true);
          logBridge.info(LogCategory.SYSTEM, 'WebSocket reconnected');
        });

      // Subscribe to the channel
      heartbeatChannel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsWebSocketConnected(true);
          logBridge.info(LogCategory.SYSTEM, 'WebSocket connected');
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          setIsWebSocketConnected(false);
          logBridge.warn(LogCategory.SYSTEM, 'WebSocket connection issue', { status });
        }
      });
      
      // Send a heartbeat message every 30 seconds to keep connection alive
      const heartbeatInterval = setInterval(() => {
        if (isConnected) {
          heartbeatChannel.track({ heartbeat: Date.now() });
        }
      }, 30000);

      return () => {
        clearInterval(heartbeatInterval);
        supabase.removeChannel(heartbeatChannel);
      };
    } catch (error) {
      logBridge.error(LogCategory.SYSTEM, 'Error setting up WebSocket monitoring', {
        details: { error: error instanceof Error ? error.message : String(error) }
      });
      setIsWebSocketConnected(false);
      
      // Return empty cleanup function
      return () => {};
    }
  }, [isConnected]);
  
  // Initialization
  useEffect(() => {
    const initApp = async () => {
      try {
        // Check if we can reach Supabase
        const canConnect = await checkConnection();
        
        if (canConnect) {
          // Try to fetch a very lightweight request to check connectivity
          try {
            const { error } = await supabase
              .from('layout_skeletons')
              .select('count')
              .limit(1)
              .single();
              
            if (error) {
              logBridge.warn(LogCategory.SYSTEM, 'App initialized but database query failed', {
                details: { error: error.message }
              });
            } else {
              logBridge.info(LogCategory.SYSTEM, 'App initialized with successful database connection');
            }
          } catch (dbError) {
            logBridge.warn(LogCategory.SYSTEM, 'Error checking database connection', {
              details: { error: dbError instanceof Error ? dbError.message : String(dbError) }
            });
          }
        } else {
          logBridge.warn(LogCategory.SYSTEM, 'App initialized in offline mode');
          
          toast({
            title: "Offline Mode",
            description: "You're currently working offline. Some features may be limited.",
            variant: "warning",
          });
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
  
  // Enhanced connection check
  const enhancedCheckConnection = useCallback(async (): Promise<boolean> => {
    try {
      setSyncStatus('syncing');
      const result = await checkConnection();
      
      if (result) {
        setSyncStatus('synced');
        setLastSyncTime(new Date());
      } else {
        setSyncStatus('error');
      }
      
      return result;
    } catch (error) {
      setSyncStatus('error');
      logBridge.error(LogCategory.SYSTEM, 'Connection check failed', {
        details: { error: error instanceof Error ? error.message : String(error) }
      });
      return false;
    }
  }, [checkConnection]);
  
  // Set up offline detection via window events
  useEffect(() => {
    const handleOnline = () => {
      logBridge.info(LogCategory.SYSTEM, 'Browser reported online status');
      enhancedCheckConnection();
      toast({
        title: "Back online",
        description: "Your connection has been restored.",
      });
    };
    
    const handleOffline = () => {
      logBridge.warn(LogCategory.SYSTEM, 'Browser reported offline status');
      setConnectionQuality('offline');
      toast({
        title: "You're offline",
        description: "Working in limited functionality mode. Some features may not work.",
        variant: "destructive",
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [enhancedCheckConnection]);
  
  const value = {
    isOffline: !isConnected,
    isInitialized,
    connectionQuality,
    lastSyncTime,
    syncStatus,
    checkConnection: enhancedCheckConnection,
    isWebSocketConnected
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
