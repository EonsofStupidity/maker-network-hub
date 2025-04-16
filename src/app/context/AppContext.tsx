
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logBridge } from '@/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';

// Define core app data types
export interface AppSettings {
  siteTitle: string;
  siteDescription: string;
  maintenanceMode: boolean;
  defaultTheme: string;
  [key: string]: any;
}

export interface AppData {
  settings: AppSettings | null;
  pages: any[] | null;
  menus: any[] | null;
  fetchedAt: number | null;
  source: 'supabase' | 'backup' | 'default' | 'unknown';
  error?: boolean;
  isLoading: boolean;
}

export interface AppContextType extends AppData {
  refresh: () => Promise<void>;
  isOnline: boolean;
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Default values for the app
const defaultAppData: AppData = {
  settings: {
    siteTitle: 'MakersIMPULSE',
    siteDescription: 'Build something amazing',
    maintenanceMode: false,
    defaultTheme: 'cyberpunk'
  },
  pages: [],
  menus: [],
  fetchedAt: null,
  source: 'default',
  isLoading: true
};

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State
  const [appData, setAppData] = useState<AppData>({...defaultAppData});
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [appBackup, setAppBackup] = useLocalStorage<AppData | null>('__appBackup', null);
  
  // Load app data from Supabase
  const loadAppData = async (): Promise<AppData> => {
    try {
      logBridge.info(LogCategory.SYSTEM, 'Loading app data from Supabase');
      
      // Load essential app data in parallel
      const [
        { data: settings, error: settingsError }, 
        { data: pages, error: pagesError },
        { data: menus, error: menusError }
      ] = await Promise.all([
        supabase.from('settings').select('*').maybeSingle(),
        supabase.from('pages').select('*'),
        supabase.from('menus').select('*')
      ]);
      
      // Check for errors
      if (settingsError || pagesError || menusError) {
        throw new Error('Error fetching app data');
      }
      
      const freshData: AppData = {
        settings: settings || defaultAppData.settings,
        pages: pages || [],
        menus: menus || [],
        fetchedAt: Date.now(),
        source: 'supabase',
        isLoading: false
      };
      
      // Save successful response as backup
      setAppBackup(freshData);
      
      logBridge.info(LogCategory.SYSTEM, 'App data loaded successfully', {
        details: { source: 'supabase' }
      });
      
      return freshData;
    } catch (error) {
      logBridge.error(LogCategory.SYSTEM, 'Error loading app data from Supabase', {
        details: { error: error instanceof Error ? error.message : String(error) }
      });
      
      // Try to use backup
      if (appBackup) {
        logBridge.info(LogCategory.SYSTEM, 'Using backup app data', {
          details: { backupDate: new Date(appBackup.fetchedAt || 0).toISOString() }
        });
        
        return {
          ...appBackup,
          source: 'backup',
          error: true,
          isLoading: false
        };
      }
      
      // Fall back to defaults
      return {
        ...defaultAppData,
        source: 'default', 
        error: true,
        isLoading: false
      };
    }
  };
  
  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      logBridge.info(LogCategory.SYSTEM, 'App is back online');
      refresh();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      logBridge.info(LogCategory.SYSTEM, 'App is offline');
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Initial data load
  useEffect(() => {
    refresh();
  }, []);
  
  // Function to refresh app data
  const refresh = async (): Promise<void> => {
    try {
      setAppData(prevData => ({...prevData, isLoading: true}));
      const freshData = await loadAppData();
      setAppData(freshData);
    } catch (error) {
      logBridge.error(LogCategory.SYSTEM, 'Error refreshing app data', {
        details: { error: error instanceof Error ? error.message : String(error) }
      });
      setAppData(prevData => ({...prevData, isLoading: false, error: true}));
    }
  };
  
  const contextValue: AppContextType = {
    ...appData,
    refresh,
    isOnline
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Hook to use the app context
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
