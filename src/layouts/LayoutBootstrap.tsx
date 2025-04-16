
import React, { useEffect, useState, useCallback } from 'react';
import { logBridge } from '@/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';
import { LoadingState } from '@/shared/ui/loading-state';
import { Layout } from '@/shared/types/core/layout.types';
import { useRbac } from '@/hooks/use-rbac';
import { LayoutRenderer } from '@/app/components/LayoutRenderer';
import { loadLayout } from '@/app/utils/layoutLoader';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { Button } from '@/shared/ui/button';
import { useToast } from '@/shared/ui/use-toast';
import { CircleRefresh } from 'lucide-react';

export interface LayoutBootstrapProps {
  children: React.ReactNode;
  type?: string;
  scope?: string;
  fallback?: React.ReactNode;
  retryOnError?: boolean;
}

export function LayoutBootstrap({
  children,
  type = 'page',
  scope = 'site',
  fallback,
  retryOnError = true,
}: LayoutBootstrapProps) {
  // State
  const [layout, setLayout] = useState<Layout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retries, setRetries] = useState(0);
  const { hasAdminAccess } = useRbac();
  const { toast } = useToast();
  
  // Use local storage as backup for layouts to improve offline experience
  const [layoutBackup, setLayoutBackup] = useLocalStorage<Layout | null>(
    `layout-backup-${type}-${scope}`, 
    null
  );
  
  // Load layout function
  const fetchLayout = useCallback(async (showLoadingState = true) => {
    try {
      if (showLoadingState) {
        setIsLoading(true);
      }
      setError(null);
      
      const loadedLayout = await loadLayout(type, scope);
      
      if (loadedLayout) {
        setLayout(loadedLayout);
        
        // Save successful response as backup
        setLayoutBackup(loadedLayout);
        
        logBridge.info(LogCategory.SYSTEM, 'Layout set from Supabase', {
          details: { layoutId: loadedLayout.id, type, scope }
        });
      } else {
        // Try to use backup if no layout was found
        if (layoutBackup) {
          setLayout(layoutBackup);
          logBridge.info(LogCategory.SYSTEM, 'Using backup layout', {
            details: { layoutId: layoutBackup.id, type, scope }
          });
        } else {
          setLayout(null);
        }
      }
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      logBridge.error(LogCategory.SYSTEM, 'Layout loading error', {
        details: { error: errorObj.message, type, scope, retry: retries }
      });
      
      setError(errorObj);
      
      // Try to use backup if available
      if (layoutBackup) {
        setLayout(layoutBackup);
        toast({
          title: "Using offline layout",
          description: "Couldn't connect to server, using locally stored layout",
        });
      }
    } finally {
      if (showLoadingState) {
        setIsLoading(false);
      }
    }
  }, [type, scope, layoutBackup, setLayoutBackup, retries]);
  
  // Handle retries with exponential backoff
  useEffect(() => {
    if (error && retryOnError && retries < 3) {
      const retryDelay = Math.pow(2, retries) * 1000; // 1s, 2s, 4s
      
      const retryTimer = setTimeout(() => {
        setRetries(prev => prev + 1);
        fetchLayout(false);
      }, retryDelay);
      
      return () => clearTimeout(retryTimer);
    }
  }, [error, retryOnError, retries, fetchLayout]);
  
  // Initial data load
  useEffect(() => {
    fetchLayout();
  }, [fetchLayout]);
  
  // Manual refresh handler
  const handleRefresh = () => {
    setRetries(0);
    fetchLayout();
  };

  if (isLoading) {
    return (
      <div className="layout-loading">
        <LoadingState type="card" count={3} />
      </div>
    );
  }
  
  // Show error UI, but still render children as fallback
  if (error && !layout) {
    return (
      <>
        <div className="mb-4 p-4 border border-destructive/30 bg-destructive/10 rounded-lg">
          <h3 className="text-lg font-medium text-destructive mb-2">Failed to load layout</h3>
          <p className="text-sm mb-2">{error.message}</p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            className="flex items-center gap-1"
          >
            <CircleRefresh className="h-4 w-4" />
            <span>Retry</span>
          </Button>
        </div>
        {children}
      </>
    );
  }
  
  // If we have a layout, render it with the LayoutRenderer
  return (
    <>
      {layout ? (
        <LayoutRenderer layout={layout} fallback={children} />
      ) : (
        <>{fallback || children}</>
      )}
      
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
