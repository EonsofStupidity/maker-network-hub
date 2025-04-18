
import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { LogCategory, LogLevel } from '@/shared/types/core/logging.types';
import { logBridge } from '@/bridges/logging/bridge';
import { authBridge } from '@/bridges/auth/bridge';
import { rbacBridge } from '@/bridges/rbac/bridge';
import { PlatformLoader } from '@/shared/components/platform/PlatformLoader'; 
import { usePlatformBootstrap } from '@/hooks/use-platform-bootstrap';

export function AppBootstrap() {
  const { initialize, initialized } = useAuthStore();
  const initAttemptRef = useRef(false);
  const { phases, bootstrap } = usePlatformBootstrap();

  useEffect(() => {
    if (initAttemptRef.current || initialized) {
      return;
    }

    initAttemptRef.current = true;

    const initializeApp = async () => {
      try {
        logBridge.info(LogCategory.SYSTEM, '🚀 Starting app initialization');
        
        // Execute the bootstrap sequence
        await bootstrap();
        
        // Initialize auth store last (after all bridges are initialized)
        await initialize();
        
        logBridge.info(LogCategory.SYSTEM, '✅ App initialization complete');
      } catch (error) {
        logBridge.error(LogCategory.SYSTEM, 'Failed to initialize app', {
          error: error instanceof Error ? error.message : String(error)
        });
      }
    };

    initializeApp();
  }, [initialize, initialized, bootstrap]);

  // If we're not yet initialized, show the platform loader
  if (!initialized) {
    return <PlatformLoader phases={phases} />;
  }

  // Once initialized, no need to render anything
  return null;
}

export default AppBootstrap;
