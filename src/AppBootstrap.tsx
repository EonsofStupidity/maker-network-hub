import { useEffect, useState, useRef } from 'react';
import { logBridge } from '@/bridges/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';
import { initializeSupabase } from '@/integrations/supabase/client';
import { authBridge } from '@/bridges/auth/bridge';
import { rbacBridge } from '@/bridges/rbac/bridge';
import { themeBridge } from '@/bridges/theme/bridge';
import { contentBridge } from '@/bridges/content/bridge';
import { useToast } from '@/shared/ui/use-toast';
import { CircuitBreaker } from '@/utils/CircuitBreaker';

interface AppBootstrapProps {
  children: React.ReactNode;
}

// Create circuit breakers for critical services
const supabaseCircuitBreaker = new CircuitBreaker('supabase', { maxFailures: 3, resetTimeout: 10000 });
const authCircuitBreaker = new CircuitBreaker('auth', { maxFailures: 2, resetTimeout: 5000 });

export function AppBootstrap({ children }: AppBootstrapProps) {
  const [initStatus, setInitStatus] = useState({
    phase: 'starting',
    completed: false,
    error: null as Error | null
  });

  const { toast } = useToast();
  const initStartTime = useRef(Date.now());
  const initAttempt = useRef(0);

  useEffect(() => {
    async function bootstrap() {
      try {
        // Increment attempt counter
        initAttempt.current += 1;
        logBridge.info(LogCategory.SYSTEM, `🚀 Starting App Bootstrap (attempt ${initAttempt.current})`);

        // ---- Phase 1: Supabase Init ----
        setInitStatus(prev => ({ ...prev, phase: 'supabase' }));
        await supabaseCircuitBreaker.execute(
          async () => await initializeSupabase(),
          () => {
            logBridge.warn(LogCategory.SYSTEM, 'Supabase initialization failed, using fallback');
            // Continue execution with fallback/offline mode
          }
        );
        logBridge.info(LogCategory.SYSTEM, 'Supabase initialized');

        // ---- Phase 2: Sequential Bridge Init ----
        // Auth must be initialized first
        setInitStatus(prev => ({ ...prev, phase: 'auth' }));
        await authCircuitBreaker.execute(
          async () => await authBridge.initialize(),
          () => {
            logBridge.warn(LogCategory.SYSTEM, 'Auth bridge initialization failed, continuing as guest');
            // Continue as guest
          }
        );
        logBridge.info(LogCategory.SYSTEM, 'Auth bridge initialized');

        // RBAC depends on Auth
        setInitStatus(prev => ({ ...prev, phase: 'rbac' }));
        await rbacBridge.initialize();
        logBridge.info(LogCategory.SYSTEM, 'RBAC bridge initialized');

        // Other bridges can initialize in parallel as they don't depend on each other
        setInitStatus(prev => ({ ...prev, phase: 'remaining_bridges' }));
        await Promise.all([
          themeBridge.initialize(),
          contentBridge.initialize(),
          logBridge.initialize(),
        ]);

        // ---- Bootstrap Complete ----
        const elapsedTime = Date.now() - initStartTime.current;
        logBridge.info(LogCategory.SYSTEM, '✅ App Bootstrap Complete', { 
          elapsedTimeMs: elapsedTime,
          attempt: initAttempt.current
        });

        setInitStatus({ phase: 'complete', completed: true, error: null });
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown bootstrap error');
        logBridge.error(LogCategory.SYSTEM, '❌ Bootstrap Error', { 
          error: error.message, 
          phase: initStatus.phase,
          attempt: initAttempt.current
        });

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
  }, [initStatus.completed, initStatus.error, initStatus.phase, toast]);

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
