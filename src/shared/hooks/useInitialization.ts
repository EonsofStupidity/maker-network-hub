
import { useEffect, useState } from 'react';

/**
 * A hook to handle component initialization with proper state tracking
 * Helps prevent "Cannot access variable before initialization" errors
 * @param initFunction - Function to run on initialization
 * @returns Object containing initialization state and any errors
 */
export const useInitialization = <T>(
  initFunction: () => Promise<T> | T
): {
  isInitialized: boolean;
  isLoading: boolean;
  error: Error | null;
  data: T | null;
} => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const initialize = async () => {
      if (isInitialized) return;
      
      try {
        setIsLoading(true);
        const result = await Promise.resolve(initFunction());
        
        if (isMounted) {
          setData(result);
          setIsInitialized(true);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Initialization error:', err);
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initialize();
    
    return () => {
      isMounted = false;
    };
  }, [initFunction, isInitialized]);

  return {
    isInitialized,
    isLoading,
    error,
    data
  };
};
