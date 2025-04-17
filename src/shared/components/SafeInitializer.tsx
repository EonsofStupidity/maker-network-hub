
import React, { ReactNode, useEffect, useState } from 'react';
import { LoadingState } from '@/shared/ui/loading-state';
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { logBridge } from '@/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';

interface SafeInitializerProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
  offlineFallback?: ReactNode;
  initFunction?: () => Promise<void>;
  requiresNetwork?: boolean;
}

/**
 * A component that safely initializes child components with proper error handling,
 * network status tracking, and loading states
 */
export const SafeInitializer: React.FC<SafeInitializerProps> = ({
  children,
  fallback = <LoadingState type="card" count={1} />,
  errorFallback,
  offlineFallback,
  initFunction,
  requiresNetwork = false,
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isOnline = useNetworkStatus({
    onOffline: () => {
      logBridge.warn(LogCategory.SYSTEM, 'Network connection lost', {
        details: { timestamp: new Date().toISOString() }
      });
    },
    onOnline: () => {
      logBridge.info(LogCategory.SYSTEM, 'Network connection restored', {
        details: { timestamp: new Date().toISOString() }
      });
      
      // Re-initialize if we were offline and now we're online
      if (requiresNetwork && !isInitialized) {
        initialize();
      }
    }
  });

  const initialize = async () => {
    if (isInitialized) return;
    
    try {
      setIsLoading(true);
      if (initFunction) {
        await initFunction();
      }
      setIsInitialized(true);
    } catch (err) {
      console.error('Initialization error:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      
      logBridge.error(LogCategory.SYSTEM, 'Component initialization failed', {
        details: { error: String(err) }
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!requiresNetwork || isOnline) {
      initialize();
    }
  }, [requiresNetwork, isOnline]);

  if (!isOnline && requiresNetwork) {
    return (
      <>
        {offlineFallback || (
          <Alert variant="destructive">
            <AlertTitle>You appear to be offline</AlertTitle>
            <AlertDescription>
              Please check your internet connection and try again.
            </AlertDescription>
          </Alert>
        )}
      </>
    );
  }

  if (error) {
    return (
      <>
        {errorFallback || (
          <Alert variant="destructive">
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              {error.message || 'An unknown error occurred.'}
            </AlertDescription>
          </Alert>
        )}
      </>
    );
  }

  if (isLoading) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default SafeInitializer;
