
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logBridge } from '@/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';
import { LoadingState } from '@/shared/ui/loading-state';
import { Layout } from '@/shared/types/core/layout.types';
import { useRbac } from '@/hooks/use-rbac';
import { LayoutRenderer } from '@/admin/panels/layout/LayoutRenderer';

export interface LayoutBootstrapProps {
  children: React.ReactNode;
  type?: string;
  scope?: string;
  fallback?: React.ReactNode;
}

export function LayoutBootstrap({
  children,
  type = 'page',
  scope = 'site',
  fallback,
}: LayoutBootstrapProps) {
  const [layout, setLayout] = useState<Layout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { hasAdminAccess } = useRbac();
  
  useEffect(() => {
    async function loadLayout() {
      try {
        setIsLoading(true);
        
        // Fetch active layout for the given type and scope
        const response = await supabase
          .from('layout_skeletons')
          .select('*');
        
        // Since we can't chain eq with the mock, we'll filter manually
        const data = response.data?.find(item => 
          item.type === type && 
          item.scope === scope && 
          item.is_active === true
        );
        
        const responseError = response.error;
        
        if (responseError) {
          throw new Error(`Failed to load layout: ${responseError.message || 'Unknown error'}`);
        }
        
        if (data) {
          setLayout(data as Layout);
          logBridge.info(LogCategory.SYSTEM, 'Layout loaded successfully', {
            details: { layoutId: data.id, type, scope }
          });
        } else {
          logBridge.warn(LogCategory.SYSTEM, 'No active layout found', {
            details: { type, scope }
          });
          setLayout(null);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        logBridge.error(LogCategory.SYSTEM, 'Layout loading error', {
          details: { error: errorMessage, type, scope }
        });
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    }
    
    loadLayout();
  }, [type, scope]);
  
  if (isLoading) {
    return (
      <div className="layout-loading">
        <LoadingState type="card" count={3} />
      </div>
    );
  }
  
  if (error) {
    // Log the error but continue with children as fallback
    return <>{children}</>;
  }
  
  if (!layout) {
    return <>{fallback || children}</>;
  }
  
  // If we have a layout, render it with the LayoutRenderer
  return (
    <>
      <LayoutRenderer layout={layout} />
      {children}
      
      {/* Admin overlay button for layout editing if user has admin access */}
      {hasAdminAccess && hasAdminAccess() && (
        <div className="fixed bottom-4 right-4 z-50">
          <button 
            className="bg-primary text-white p-2 rounded-full shadow-lg"
            onClick={() => {
              // This would open the layout editor in a real implementation
              logBridge.info(LogCategory.ADMIN, 'Layout edit button clicked');
            }}
          >
            <span className="sr-only">Edit Layout</span>
            {/* You would add an icon here */}
            ⚙️
          </button>
        </div>
      )}
    </>
  );
}
