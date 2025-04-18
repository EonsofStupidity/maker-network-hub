
import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { LogCategory, LogLevel } from '@/shared/types/core/logging.types';
import { logBridge } from '@/bridges/logging/bridge';
import { authBridge } from '@/bridges/auth/bridge';
import { rbacBridge } from '@/bridges/rbac/bridge';

export function AppBootstrap() {
  const { initialize, initialized } = useAuthStore();
  const initAttemptRef = useRef(false);

  useEffect(() => {
    if (initAttemptRef.current || initialized) {
      return;
    }

    initAttemptRef.current = true;

    const initializeApp = async () => {
      try {
        logBridge.info(LogCategory.SYSTEM, '🚀 Starting app initialization');
        
        // Initialize core bridges
        await authBridge.initialize();
        await rbacBridge.initialize();
        
        // Initialize auth store last
        await initialize();
        
        logBridge.info(LogCategory.SYSTEM, '✅ App initialization complete');
      } catch (error) {
        logBridge.error(LogCategory.SYSTEM, 'Failed to initialize app', {
          error: error instanceof Error ? error.message : String(error)
        });
      }
    };

    initializeApp();
  }, [initialize, initialized]);

  return null;
}
