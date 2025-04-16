
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LogCategory } from '@/shared/types/core/logging.types';
import { logBridge } from '@/logging/bridge';

interface LayoutSkeleton {
  id: string;
  name: string;
  type: string;
  scope: string;
  layout_json: any;
  is_active: boolean;
  is_locked: boolean;
}

export function useLayoutSkeleton(layoutId?: string) {
  const [skeleton, setSkeleton] = useState<LayoutSkeleton | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    async function loadLayoutSkeleton() {
      if (!layoutId) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        const { data, error: responseError } = await supabase
          .from('layout_skeletons')
          .select('*')
          .eq('id', layoutId)
          .maybeSingle();
        
        if (responseError) {
          throw new Error(responseError.message || 'Failed to load layout');
        }
        
        if (data) {
          setSkeleton(data as LayoutSkeleton);
        } else {
          setSkeleton(null);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(new Error(errorMessage));
        logBridge.error(LogCategory.ADMIN, 'Failed to load layout skeleton', {
          details: { layoutId, error: errorMessage }
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    loadLayoutSkeleton();
  }, [layoutId]);
  
  return { skeleton, isLoading, error };
}
