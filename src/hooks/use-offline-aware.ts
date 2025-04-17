
import { useState, useEffect, useCallback } from 'react';
import { logBridge } from '@/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';
import { useSupabaseStatus } from './use-supabase-status';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';

export interface OfflineAwareOptions<T> {
  key: string;
  initialData?: T | null;
  fetchFn: () => Promise<T | null>;
  cacheTime?: number; // milliseconds
  logCategory?: LogCategory;
  retryOnReconnect?: boolean;
  dontFetchIfOffline?: boolean;
}

export interface OfflineAwareResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  isOffline: boolean;
  isStale: boolean;
  refetch: () => Promise<void>;
}

/**
 * Hook to handle data loading with offline support
 */
export function useOfflineAware<T>(options: OfflineAwareOptions<T>): OfflineAwareResult<T> {
  const {
    key,
    initialData = null,
    fetchFn,
    cacheTime = 5 * 60 * 1000, // 5 minutes by default
    logCategory = LogCategory.SYSTEM,
    retryOnReconnect = true,
    dontFetchIfOffline = false
  } = options;
  
  // State
  const [data, setData] = useState<T | null>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isStale, setIsStale] = useState<boolean>(false);
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);
  
  // Track connection status
  const { isConnected, checkConnection } = useSupabaseStatus(false);
  
  // Use local storage for offline cache
  const [cachedData, setCachedData] = useLocalStorage<{
    data: T | null;
    timestamp: number;
  }>(`offline-cache-${key}`, {
    data: initialData,
    timestamp: Date.now()
  });
  
  // Fetch data function
  const fetchData = useCallback(async () => {
    if (dontFetchIfOffline && !isConnected) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await fetchFn();
      const now = Date.now();
      
      if (result) {
        setData(result);
        setIsStale(false);
        setLastFetchTime(now);
        
        // Update cache
        setCachedData({
          data: result,
          timestamp: now
        });
        
        logBridge.info(logCategory, 'Data loaded successfully', {
          details: { key }
        });
      } else if (cachedData?.data) {
        // Use cached data if available and fetch returned null
        setData(cachedData.data);
        setIsStale(true);
        
        logBridge.info(logCategory, 'Using cached data (null result)', {
          details: { key, cacheAge: now - cachedData.timestamp }
        });
      }
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      
      setError(errorObj);
      setIsStale(true);
      
      logBridge.error(logCategory, 'Error fetching data', {
        details: { key, error: errorObj.message }
      });
      
      // Use cached data on error if available
      if (cachedData?.data) {
        setData(cachedData.data);
        
        logBridge.info(logCategory, 'Using cached data (error fallback)', {
          details: { key, cacheAge: Date.now() - cachedData.timestamp }
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, isConnected, cachedData, setCachedData, key, dontFetchIfOffline, logCategory]);
  
  // Initial fetch
  useEffect(() => {
    // First check if we have valid cached data
    if (cachedData?.data) {
      const now = Date.now();
      const cacheAge = now - cachedData.timestamp;
      
      // If cache is fresh enough, use it before fetching new data
      if (cacheAge < cacheTime) {
        setData(cachedData.data);
        setIsStale(false);
        setIsLoading(false);
        setLastFetchTime(cachedData.timestamp);
        
        logBridge.info(logCategory, 'Using fresh cached data initially', {
          details: { key, cacheAge }
        });
      } else {
        // Cache is stale but still usable while fetching fresh data
        setData(cachedData.data);
        setIsStale(true);
        
        logBridge.info(logCategory, 'Using stale cached data initially', {
          details: { key, cacheAge }
        });
        
        // Fetch fresh data
        fetchData();
      }
    } else {
      // No cached data, fetch fresh data
      fetchData();
    }
  }, []);
  
  // Handle reconnection
  useEffect(() => {
    if (isConnected && retryOnReconnect && isStale) {
      logBridge.info(logCategory, 'Reconnected, refreshing data', {
        details: { key }
      });
      fetchData();
    }
  }, [isConnected, retryOnReconnect, isStale, fetchData, key, logCategory]);
  
  // Check for cache staleness periodically
  useEffect(() => {
    if (!lastFetchTime) return;
    
    const checkStaleness = () => {
      const now = Date.now();
      const dataAge = now - lastFetchTime;
      
      if (dataAge > cacheTime) {
        setIsStale(true);
      }
    };
    
    const intervalId = setInterval(checkStaleness, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, [lastFetchTime, cacheTime]);
  
  // Refetch function for manual refresh
  const refetch = useCallback(async () => {
    // Check connection first
    if (!isConnected) {
      const hasConnection = await checkConnection();
      if (!hasConnection) {
        return; // Don't proceed if still offline
      }
    }
    
    await fetchData();
  }, [fetchData, isConnected, checkConnection]);
  
  return {
    data,
    isLoading,
    error,
    isOffline: !isConnected,
    isStale,
    refetch
  };
}
