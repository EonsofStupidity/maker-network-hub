
import { useState, useEffect } from 'react';

interface NetworkStatusOptions {
  onOffline?: () => void;
  onOnline?: () => void;
}

/**
 * Hook to monitor network connection status
 * @param options Optional callbacks for online/offline events
 * @returns Current online status
 */
export const useNetworkStatus = (options?: NetworkStatusOptions) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      options?.onOnline?.();
    };

    const handleOffline = () => {
      setIsOnline(false);
      options?.onOffline?.();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [options]);

  return isOnline;
};
