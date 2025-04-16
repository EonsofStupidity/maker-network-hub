
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logBridge } from '@/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';
import { useToast } from '@/shared/ui/use-toast';

export interface SupabaseStatus {
  isConnected: boolean;
  lastChecked: number | null;
  retryCount: number;
  checkConnection: () => Promise<boolean>;
  hasInitiallyChecked: boolean;
}

export function useSupabaseStatus(
  checkImmediately: boolean = true,
  checkInterval: number = 30000, // Default: check every 30 seconds
  showToasts: boolean = false
): SupabaseStatus {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [lastChecked, setLastChecked] = useState<number | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [hasInitiallyChecked, setHasInitiallyChecked] = useState(false);
  const { toast } = useToast();

  const checkConnection = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.from('layout_skeletons').select('id').limit(1);
      
      const now = Date.now();
      setLastChecked(now);
      
      if (error) {
        if (isConnected) {
          logBridge.warn(LogCategory.SYSTEM, 'Supabase connection lost', {
            details: { error: error.message }
          });
          
          setIsConnected(false);
          setRetryCount((prev) => prev + 1);
          
          if (showToasts) {
            toast({
              title: "Connection error",
              description: "Lost connection to database. Some features may be limited.",
              variant: "destructive",
            });
          }
        }
        return false;
      }
      
      if (!isConnected) {
        logBridge.info(LogCategory.SYSTEM, 'Supabase connection restored', {
          details: { reconnectedAfter: retryCount }
        });
        
        setRetryCount(0);
        setIsConnected(true);
        
        if (showToasts) {
          toast({
            title: "Connection restored",
            description: "Connection to database has been restored.",
          });
        }
      }
      
      return true;
    } catch (error) {
      logBridge.error(LogCategory.SYSTEM, 'Error checking Supabase connection', {
        details: { error: error instanceof Error ? error.message : String(error) }
      });
      
      setIsConnected(false);
      setRetryCount((prev) => prev + 1);
      return false;
    } finally {
      setHasInitiallyChecked(true);
    }
  };
  
  // Initial check
  useEffect(() => {
    if (checkImmediately) {
      checkConnection();
    } else {
      setHasInitiallyChecked(true);
    }
  }, [checkImmediately]);
  
  // Set up periodic check
  useEffect(() => {
    if (checkInterval <= 0) return;
    
    const interval = setInterval(() => {
      checkConnection();
    }, checkInterval);
    
    return () => clearInterval(interval);
  }, [checkInterval]);
  
  return {
    isConnected,
    lastChecked,
    retryCount,
    checkConnection,
    hasInitiallyChecked,
  };
}
