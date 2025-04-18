
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
import { PlatformLoader, LoadPhase } from '@/shared/components/platform/PlatformLoader';
import { AppError } from '@/utils/AppError';

interface AppBootstrapProps {
  children: React.ReactNode;
}

// Create circuit breakers for critical services
const supabaseCircuitBreaker = new CircuitBreaker('supabase', { maxFailures: 3, resetTimeout: 10000 });
const authCircuitBreaker = new CircuitBreaker('auth', { maxFailures: 2, resetTimeout: 5000 });
const themeCircuitBreaker = new CircuitBreaker('theme', { maxFailures: 2, resetTimeout: 5000 });
const contentCircuitBreaker = new CircuitBreaker('content', { maxFailures: 2, resetTimeout: 5000 });

export function AppBootstrap({ children }: AppBootstrapProps) {
  // State
  const [phases, setPhases] = useState<LoadPhase[]>([
    { id: 'supabase', name: 'Database Connection', status: 'idle' },
    { id: 'auth', name: 'Authentication', status: 'idle' },
    { id: 'rbac', name: 'Permissions System', status: 'idle' },
    { id: 'theme', name: 'Visual Theme', status: 'idle' },
    { id: 'content', name: 'Content Management', status: 'idle' }
  ]);
  const [bootstrapCompleted, setBootstrapCompleted] = useState(false);
  const [bootstrapError, setBootstrapError] = useState<Error | null>(null);
  const { toast } = useToast();
  const initStartTime = useRef(Date.now());
  const initAttempt = useRef(0);

  // Update phase status helper function
  const updatePhase = (
    phaseId: string, 
    status: LoadPhase['status'], 
    detail?: string,
    retry?: () => Promise<void>
  ) => {
    setPhases(prev => prev.map(phase => {
      if (phase.id === phaseId) {
        return { ...phase, status, detail, retry };
      }
      return phase;
    }));
  };

  // Initialize functions for each phase
  const initializeSupabasePhase = async () => {
    try {
      updatePhase('supabase', 'loading');
      
      await supabaseCircuitBreaker.execute(
        async () => await initializeSupabase(),
        () => {
          throw new AppError('Failed to initialize Supabase', 'SUPABASE_ERROR', {}, true, 'supabase');
        }
      );
      
      updatePhase('supabase', 'success', 'Database connected');
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      updatePhase('supabase', 'error', error.message, initializeSupabasePhase);
      throw error;
    }
  };

  const initializeAuthPhase = async () => {
    try {
      updatePhase('auth', 'loading');
      
      await authCircuitBreaker.execute(
        async () => {
          await authBridge.initialize();
          const user = authBridge.getUser();
          const userInfo = user ? `(${user.email || user.id})` : '(Guest)';
          updatePhase('auth', 'success', `Authenticated ${userInfo}`);
        },
        () => {
          updatePhase('auth', 'success', 'Guest mode (offline)');
          logBridge.warn(LogCategory.SYSTEM, 'Auth bridge initialization failed, continuing as guest');
        }
      );
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      updatePhase('auth', 'error', error.message, initializeAuthPhase);
      // Don't throw here - we can continue as guest
      logBridge.warn(LogCategory.SYSTEM, 'Authentication failed, continuing as guest', {
        error: error.message
      });
    }
  };

  const initializeRBACPhase = async () => {
    try {
      updatePhase('rbac', 'loading');
      
      await rbacBridge.initialize();
      
      const roles = rbacBridge.getRoles();
      const rolesDetail = roles.length > 0 
        ? `(${roles.join(', ')})` 
        : '(Guest)';
      
      updatePhase('rbac', 'success', `Roles loaded ${rolesDetail}`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      updatePhase('rbac', 'error', error.message, initializeRBACPhase);
      // Don't throw here - we can continue with default permissions
      logBridge.warn(LogCategory.SYSTEM, 'RBAC initialization failed, using default permissions', {
        error: error.message
      });
    }
  };

  const initializeThemePhase = async () => {
    try {
      updatePhase('theme', 'loading');
      
      await themeCircuitBreaker.execute(
        async () => {
          await themeBridge.initialize();
          const isDark = themeBridge.isDarkMode();
          const themeDetail = `(${isDark ? 'Dark' : 'Light'} Mode)`; 
          updatePhase('theme', 'success', `Theme loaded ${themeDetail}`);
        },
        () => {
          updatePhase('theme', 'success', 'Default theme (fallback)');
          logBridge.warn(LogCategory.SYSTEM, 'Theme bridge initialization failed, using default theme');
        }
      );
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      updatePhase('theme', 'error', error.message, initializeThemePhase);
      // Don't throw here - we can continue with default theme
      logBridge.warn(LogCategory.SYSTEM, 'Theme initialization failed, using default theme', {
        error: error.message
      });
    }
  };

  const initializeContentPhase = async () => {
    try {
      updatePhase('content', 'loading');
      
      await contentCircuitBreaker.execute(
        async () => {
          await contentBridge.initialize();
          updatePhase('content', 'success', 'Content ready');
        },
        () => {
          updatePhase('content', 'success', 'Limited content (offline)');
          logBridge.warn(LogCategory.SYSTEM, 'Content bridge initialization failed, using offline content');
        }
      );
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      updatePhase('content', 'error', error.message, initializeContentPhase);
      // Don't throw here - we can continue with limited functionality
      logBridge.warn(LogCategory.SYSTEM, 'Content initialization failed, functionality may be limited', {
        error: error.message
      });
    }
  };

  // Complete bootstrap function
  const bootstrap = async () => {
    initAttempt.current += 1;
    
    try {
      logBridge.info(LogCategory.SYSTEM, `🚀 Starting App Bootstrap (attempt ${initAttempt.current})`);
      
      // Critical phase - if this fails, we can't continue
      await initializeSupabasePhase();
      
      // Non-critical phases - continue even if they fail
      await initializeAuthPhase();
      await initializeRBACPhase();
      
      // These can run in parallel
      await Promise.allSettled([
        initializeThemePhase(),
        initializeContentPhase()
      ]);

      // Bootstrap complete!
      const elapsedTime = Date.now() - initStartTime.current;
      logBridge.info(LogCategory.SYSTEM, '✅ App Bootstrap Complete', { 
        elapsedTimeMs: elapsedTime,
        attempt: initAttempt.current
      });

      setBootstrapCompleted(true);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      
      setBootstrapError(error);
      
      logBridge.error(LogCategory.SYSTEM, '❌ Bootstrap Error', { 
        error: error.message, 
        attempt: initAttempt.current
      });

      toast({
        title: 'Initialization Error',
        description: `Critical error: ${error.message}`,
        variant: 'destructive'
      });
    }
  };

  // Run the bootstrap on component mount
  useEffect(() => {
    if (!bootstrapCompleted && !bootstrapError) {
      bootstrap();
    }
  }, [bootstrapCompleted, bootstrapError]);

  // If bootstrap has error in a critical phase
  if (bootstrapError) {
    // Check if it's a critical phase error (Supabase)
    const criticalError = phases.find(p => p.id === 'supabase' && p.status === 'error');
    
    if (criticalError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="max-w-md w-full bg-card p-6 rounded-lg shadow-lg border border-destructive/20">
            <h2 className="text-xl font-semibold text-foreground mb-4">Critical Error</h2>
            <p className="text-muted-foreground mb-6">
              Unable to initialize the application due to a critical error:
            </p>
            <div className="bg-muted p-3 rounded-md mb-6 text-sm overflow-auto">
              <code>{bootstrapError.message}</code>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }
  }

  // Show platform loader until bootstrap is complete
  if (!bootstrapCompleted) {
    return (
      <PlatformLoader
        phases={phases}
        title="Initializing MakersIMPULSE"
        subtitle="Setting up your workspace..."
      />
    );
  }

  // Bootstrap complete, render children
  return <>{children}</>;
}

export default AppBootstrap;
