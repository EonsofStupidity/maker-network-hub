
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logBridge } from '@/bridges/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';
import { useToast } from '@/shared/ui/use-toast';
import { SupabaseResponseSchema } from '@/shared/types/core/supabase.types';
import { z } from 'zod';

// Enhanced schema for connection status
export const ConnectionStatusSchema = z.object({
  isConnected: z.boolean(),
  lastChecked: z.number().nullable(),
  hasInitiallyChecked: z.boolean(),
  retryCount: z.number(),
  maxRetries: z.number().optional(),
  checkConnection: z.function().args().returns(z.promise(z.boolean())),
});

export type ConnectionStatus = z.infer<typeof ConnectionStatusSchema>;

export function useSupabaseStatus(
  checkImmediately: boolean = true,
  checkInterval: number = 30000,
  maxRetries: number = 5
) {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [lastChecked, setLastChecked] = useState<number | null>(null);
  const [hasInitiallyChecked, setHasInitiallyChecked] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);
  const retryTimerRef = useRef<number | null>(null);
  const { toast } = useToast();

  // Clear existing retry timer when component unmounts or parameters change
  useEffect(() => {
    return () => {
      if (retryTimerRef.current !== null) {
        clearTimeout(retryTimerRef.current);
      }
    };
  }, [checkInterval, maxRetries]);

  const checkConnection = async (): Promise<boolean> => {
    try {
      const response = await supabase.from('profiles').select('id').limit(1);
      const validationResult = SupabaseResponseSchema.safeParse(response);
      
      const now = Date.now();
      setLastChecked(now);
      setHasInitiallyChecked(true);
      
      if (!validationResult.success || validationResult.data.error) {
        const error = validationResult.success ? validationResult.data.error : new Error('Invalid response structure');
        
        if (isConnected) {
          logBridge.error(LogCategory.SYSTEM, 'Supabase connection lost', {
            details: validationResult.success ? validationResult.data.error : 'Validation failed',
            retryCount
          });
          
          setIsConnected(false);
          
          // Only show toast on initial disconnection or after reconnection
          toast({
            variant: "destructive",
            title: "Connection lost",
            description: "Lost connection to database. Some features may be limited."
          });
          
          // Schedule retry
          if (retryCount < maxRetries) {
            const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 30000); // Exponential backoff with cap at 30s
            
            retryTimerRef.current = window.setTimeout(() => {
              setRetryCount(prev => prev + 1);
              checkConnection();
            }, backoffDelay);
            
            logBridge.info(LogCategory.SYSTEM, `Scheduling reconnection attempt ${retryCount + 1}/${maxRetries}`, {
              details: { delay: backoffDelay }
            });
          }
        }
        return false;
      }
      
      if (!isConnected) {
        setIsConnected(true);
        setRetryCount(0);
        
        toast({
          title: "Connection restored",
          description: "Connection to database has been restored."
        });
        
        logBridge.info(LogCategory.SYSTEM, 'Supabase connection restored', {
          details: { downtime: lastChecked ? now - lastChecked : 'unknown' }
        });
      }
      
      return true;
    } catch (error) {
      setIsConnected(false);
      setHasInitiallyChecked(true);
      
      logBridge.error(LogCategory.SYSTEM, 'Supabase connection check failed', {
        details: { error: error instanceof Error ? error.message : String(error) }
      });
      
      return false;
    }
  };

  // Initial check and interval setup
  useEffect(() => {
    if (checkImmediately) {
      checkConnection();
    }
    
    if (checkInterval > 0) {
      const interval = setInterval(checkConnection, checkInterval);
      return () => clearInterval(interval);
    }
  }, [checkInterval, checkImmediately]);

  // Validate the return value against our schema
  const returnValue = {
    isConnected,
    lastChecked,
    hasInitiallyChecked,
    retryCount,
    maxRetries,
    checkConnection,
  };

  // Perform runtime type validation in development
  if (process.env.NODE_ENV === 'development') {
    try {
      ConnectionStatusSchema.parse(returnValue);
    } catch (error) {
      console.error('useSupabaseStatus hook return value type mismatch:', error);
    }
  }

  return returnValue;
}
