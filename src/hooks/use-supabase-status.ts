
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logBridge } from '@/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';
import { useToast } from '@/shared/ui/use-toast';
import { SupabaseResponseSchema } from '@/shared/types/core/supabase.types';

export function useSupabaseStatus(
  checkImmediately: boolean = true,
  checkInterval: number = 30000
) {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [lastChecked, setLastChecked] = useState<number | null>(null);
  const { toast } = useToast();

  const checkConnection = async () => {
    try {
      const response = await supabase.from('profiles').select('id').limit(1);
      const validatedResponse = SupabaseResponseSchema.parse(response);
      
      const now = Date.now();
      setLastChecked(now);
      
      if (validatedResponse.error) {
        if (isConnected) {
          logBridge.error(LogCategory.SYSTEM, 'Supabase connection lost', {
            details: validatedResponse.error
          });
          setIsConnected(false);
          toast({
            variant: "destructive",
            title: "Connection lost",
            description: "Lost connection to database. Some features may be limited."
          });
        }
        return false;
      }
      
      if (!isConnected) {
        setIsConnected(true);
        toast({
          title: "Connection restored",
          description: "Connection to database has been restored."
        });
      }
      
      return true;
    } catch (error) {
      setIsConnected(false);
      return false;
    }
  };

  useEffect(() => {
    if (checkImmediately) {
      checkConnection();
    }
    
    if (checkInterval > 0) {
      const interval = setInterval(checkConnection, checkInterval);
      return () => clearInterval(interval);
    }
  }, [checkInterval, checkImmediately]);

  return {
    isConnected,
    lastChecked,
    checkConnection,
  };
}
