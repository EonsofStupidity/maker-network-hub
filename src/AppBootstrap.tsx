import { useEffect, useState, useRef } from 'react';
import { logBridge } from '@/bridges/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';
import { initializeSupabase } from '@/integrations/supabase/client';
import { useAuthBridge } from '@/bridges/auth/bridge';
import { useRBACBridge } from '@/bridges/rbac/bridge';
import { useThemeBridge } from '@/bridges/theme/bridge';
import { useContentBridge } from '@/bridges/content/bridge';
import { useToast } from '@/shared/ui/use-toast';

interface AppBootstrapProps {
  children: React.ReactNode;
}

export function AppBootstrap({ children }: AppBootstrapProps) {
  const [initStatus, setInitStatus] = useState({
    phase: 'starting',
    completed: false,
    error: null as Error | null
  });

  const { toast } = useToast();
  const initStartTime = useRef(Date.now());

  // Access bridge methods
  const { initialize: initializeAuth } = useAuthBridge();
  const { initialize: initializeRBAC } = useRBACBridge();
  const { initialize: initializeTheme } = useThemeBridge();
  const { initialize: initializeContent } = useContentBridge();

  useEffect(() => {
    async function bootstrap() {
      try {
        logBridge.info(LogCategory.SYSTEM, '🚀 Starting App Bootstrap');

        // ---- Phase 1: Supabase Init ----
        setInitStatus(prev => ({ ...prev, phase: 'supabase' }));
        await initializeSupabase();
        logBridge.info(LogCategory.SYSTEM, 'Supabase initialized');

        // ---- Phase 2: Parallel Bridge Init ----
        setInitStatus(prev => ({ ...prev, phase: 'bridges' }));

        await Promise.all([
          initializeAuth(),
          initializeRBAC(),
          initializeTheme(),
          initializeContent(),
        ]);

        // ---- Bootstrap Complete ----
        const elapsedTime = Date.now() - initStartTime.current;
        logBridge.info(LogCategory.SYSTEM, '✅ App Bootstrap Complete', { elapsedTimeMs: elapsedTime });

        setInitStatus({ phase: 'complete', completed: true, error: null });
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown bootstrap error');
        logBridge.error(LogCategory.SYSTEM, '❌ Bootstrap Error', { error: error.message, phase: initStatus.phase });

        setInitStatus(prev => ({ ...prev, error }));

        toast({
          title: 'Initialization Error',
          description: `Error during ${initStatus.phase} phase: ${error.message}`,
          variant: 'destructive'
        });
      }
    }

    if (!initStatus.completed && !initStatus.error) {
      bootstrap();
    }
  }, [initStatus.completed, initStatus.error, initStatus.phase, initializeAuth, initializeRBAC, initializeTheme, initializeContent, toast]);

  // ---- UI during bootstrap phases ----
  if (!initStatus.completed) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-lg mb-2">Bootstrapping Application...</p>
        <p className="text-sm text-muted-foreground">Phase: {initStatus.phase}</p>
      </div>
    );
  }

  if (initStatus.error) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="bg-destructive/10 p-6 rounded-lg shadow-lg max-w-md">
          <h2 className="text-xl font-bold text-destructive mb-2">Application Error</h2>
          <p className="text-muted-foreground mb-4">
            Error during {initStatus.phase}: {initStatus.error.message}
          </p>
          <button 
            className="bg-primary text-primary-foreground px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <>{children}</>
  );
}

export default AppBootstrap;
