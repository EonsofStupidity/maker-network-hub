
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logBridge } from '@/bridges/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';
import { z } from 'zod';

interface SupabaseStatusOptions {
  autoCheck?: boolean;
  checkInterval?: number;
  maxRetries?: number;
}

// Define Zod schema for the hook's return value
const SupabaseStatusReturnSchema = z.object({
  isConnected: z.boolean(),
  checkConnection: z.function().returns(z.promise(z.boolean())),
  lastChecked: z.instanceof(Date).nullable(),
  hasInitiallyChecked: z.boolean(),
  retryCount: z.number(),
  retryLimit: z.number(),
  error: z.union([z.custom<Error>(), z.null()]),
});

type SupabaseStatusReturn = z.infer<typeof SupabaseStatusReturnSchema>;

/**
 * Hook to check Supabase connection status
 * 
 * @param autoCheck Start checking automatically on mount
 * @param checkInterval Interval in ms to check connection (if autoCheck is true)
 * @param maxRetries Maximum number of retries if connection fails
 * @returns Connection status and control functions
 */
export function useSupabaseStatus(
  autoCheck = false,
  checkInterval = 30000,
  maxRetries = 3
): SupabaseStatusReturn {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [hasInitiallyChecked, setHasInitiallyChecked] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [timerId, setTimerId] = useState<number | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  // Check the connection to Supabase
  const checkConnection = useCallback(async (): Promise<boolean> => {
    try {
      // Try a simple query to test connection
      const { error } = await supabase.from('profiles').select('id').limit(1);
      
      // If there's an error, connection failed
      const connected = !error;
      
      // Update state
      setIsConnected(connected);
      setLastChecked(new Date());
      setHasInitiallyChecked(true);
      
      // Log result
      if (connected) {
        if (retryCount > 0) {
          logBridge.info(LogCategory.SYSTEM, 'Supabase connection restored', {
            retriesNeeded: retryCount,
          });
        } else {
          logBridge.debug(LogCategory.SYSTEM, 'Supabase connection check passed');
        }
        setRetryCount(0);
      } else {
        setRetryCount(prev => prev + 1);
        logBridge.warn(LogCategory.SYSTEM, 'Supabase connection check failed', {
          reason: error?.message || 'Unknown error',
          retryCount: retryCount + 1,
        });
      }
      
      return connected;
    } catch (err) {
      setIsConnected(false);
      setLastChecked(new Date());
      setHasInitiallyChecked(true);
      setRetryCount(prev => prev + 1);
      
      const thrownError = err as Error;
      setError(thrownError);
      
      logBridge.error(LogCategory.SYSTEM, 'Supabase connection check error', {
        error: thrownError.message,
        retryCount: retryCount + 1,
      });
      
      return false;
    }
  }, [retryCount]);

  // Setup interval checking and initial check
  useEffect(() => {
    // Do initial check if requested
    if (autoCheck && !hasInitiallyChecked) {
      checkConnection();
    }
    
    // Setup interval checking if requested
    if (autoCheck && checkInterval > 0) {
      const id = window.setInterval(() => {
        // Skip if we've reached retry limit
        if (retryCount >= maxRetries) {
          clearInterval(id);
          return;
        }
        
        checkConnection();
      }, checkInterval) as unknown as number;
      
      setTimerId(id);
    }
    
    // Cleanup
    return () => {
      if (timerId !== null) {
        clearInterval(timerId);
      }
    };
  }, [autoCheck, checkInterval, checkConnection, hasInitiallyChecked, maxRetries, retryCount, timerId]);

  // Prep result object
  const result: SupabaseStatusReturn = {
    isConnected,
    checkConnection,
    lastChecked,
    hasInitiallyChecked,
    retryCount,
    retryLimit: maxRetries,
    error,
  };

  // Validate in dev mode
  if (process.env.NODE_ENV === 'development') {
    try {
      SupabaseStatusReturnSchema.parse(result);
    } catch (validationError) {
      console.error('SupabaseStatus hook return value validation error:', validationError);
    }
  }

  return result;
}

export default useSupabaseStatus;
