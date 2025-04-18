import { useState, useCallback, useMemo } from 'react';
import { LoadPhase } from '@/shared/components/platform/PlatformLoader';
import { logBridge } from '@/bridges/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';
import { useAuthStore } from '@/auth/store/auth.store';
import { authBridge } from '@/bridges/auth/bridge';
import { rbacBridge } from '@/bridges/rbac/bridge';
import { themeBridge } from '@/bridges/theme/bridge';
import { contentBridge } from '@/bridges/content/bridge';
import { CircuitBreaker } from '@/utils/CircuitBreaker';
import { supabase, initializeSupabase as initSupabase } from '@/integrations/supabase/client';

// Create circuit breakers for critical services
const authCircuitBreaker = new CircuitBreaker('auth', { 
  maxFailures: 3, 
  resetTimeout: 10000,
});

const rbacCircuitBreaker = new CircuitBreaker('rbac', { 
  maxFailures: 2, 
  resetTimeout: 5000,
});

const themeCircuitBreaker = new CircuitBreaker('theme', { 
  maxFailures: 2, 
  resetTimeout: 7000,
});

const contentCircuitBreaker = new CircuitBreaker('content', { 
  maxFailures: 2, 
  resetTimeout: 7000,
});

export function usePlatformBootstrap() {
  const { user } = useAuthStore();
  
  // Define our phases
  const [phases, setPhases] = useState<LoadPhase[]>([
    { 
      id: 'supabase', 
      name: 'Database Connection', 
      status: 'idle',
    },
    { 
      id: 'auth', 
      name: 'Authentication', 
      status: 'idle',
    },
    { 
      id: 'rbac', 
      name: 'Permissions System', 
      status: 'idle',
    },
    { 
      id: 'theme', 
      name: 'Visual Theme', 
      status: 'idle',
    },
    { 
      id: 'content', 
      name: 'Content Management', 
      status: 'idle',
    }
  ]);
  
  // Helper to update a phase's status
  const updatePhaseStatus = useCallback((
    phaseId: string, 
    status: LoadPhase['status'], 
    detail?: string
  ) => {
    setPhases(prev => prev.map(phase => {
      if (phase.id === phaseId) {
        return { ...phase, status, detail: detail || phase.detail };
      }
      return phase;
    }));
    
    // Log the phase status change
    const logLevel = status === 'error' ? LogCategory.ERROR : LogCategory.SYSTEM;
    logBridge.info(logLevel, `Bootstrap phase ${phaseId}: ${status}`, {
      phaseId,
      status,
      detail
    });
  }, []);

  // Initialize Supabase connection with the real client
  const initializeSupabase = useCallback(async () => {
    try {
      updatePhaseStatus('supabase', 'loading', 'Connecting to Supabase');
      
      // Use the actual Supabase initialization function
      await initSupabase();
      
      // Verify connection by making a simple query
      const { error } = await supabase.from('profiles').select('id').limit(1);
      
      if (error) {
        updatePhaseStatus('supabase', 'error', `Database connection error: ${error.message}`);
        return false;
      } else {
        updatePhaseStatus('supabase', 'success', 'Connected to Supabase database');
        return true;
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown database connection error';
      updatePhaseStatus('supabase', 'error', errorMsg);
      return false;
    }
  }, [updatePhaseStatus]);

  // Initialize Auth system
  const initializeAuth = useCallback(async () => {
    try {
      updatePhaseStatus('auth', 'loading');
      
      await authCircuitBreaker.execute(
        async () => {
          await authBridge.initialize();
          const userData = user ? `(${user.email || user.id})` : '(Guest)';
          updatePhaseStatus('auth', 'success', `Authentication ready ${userData}`);
          return true;
        },
        () => {
          updatePhaseStatus('auth', 'error', 'Authentication service unavailable');
          return false;
        }
      );
    } catch (error) {
      updatePhaseStatus('auth', 'error', error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }, [updatePhaseStatus, user]);

  // Initialize RBAC system
  const initializeRBAC = useCallback(async () => {
    try {
      updatePhaseStatus('rbac', 'loading');
      
      await rbacCircuitBreaker.execute(
        async () => {
          await rbacBridge.initialize();
          const roles = rbacBridge.getRoles();
          const rolesDetail = roles.length > 0 ? `(${roles.join(', ')})` : '(No roles assigned)';
          updatePhaseStatus('rbac', 'success', `Roles loaded ${rolesDetail}`);
          return true;
        },
        () => {
          updatePhaseStatus('rbac', 'error', 'Permission system unavailable');
          return false;
        }
      );
    } catch (error) {
      updatePhaseStatus('rbac', 'error', error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }, [updatePhaseStatus]);

  // Initialize Theme system
  const initializeTheme = useCallback(async () => {
    try {
      updatePhaseStatus('theme', 'loading');
      
      await themeCircuitBreaker.execute(
        async () => {
          await themeBridge.initialize();
          const isDark = themeBridge.isDarkMode();
          const themeDetail = isDark ? 'Dark Theme' : 'Light Theme';
          updatePhaseStatus('theme', 'success', `Theme loaded (${themeDetail})`);
          return true;
        },
        () => {
          updatePhaseStatus('theme', 'error', 'Theme service unavailable');
          return false;
        }
      );
    } catch (error) {
      updatePhaseStatus('theme', 'error', error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }, [updatePhaseStatus]);

  // Initialize Content system
  const initializeContent = useCallback(async () => {
    try {
      updatePhaseStatus('content', 'loading');
      
      await contentCircuitBreaker.execute(
        async () => {
          await contentBridge.initialize();
          updatePhaseStatus('content', 'success', 'Content system ready');
          return true;
        },
        () => {
          updatePhaseStatus('content', 'error', 'Content management unavailable');
          return false;
        }
      );
    } catch (error) {
      updatePhaseStatus('content', 'error', error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }, [updatePhaseStatus]);
  
  // Add retry capabilities to each phase
  const phasesWithRetry = useMemo(() => {
    return phases.map(phase => {
      let retryFn;
      
      switch (phase.id) {
        case 'supabase':
          retryFn = initializeSupabase;
          break;
        case 'auth':
          retryFn = initializeAuth;
          break;
        case 'rbac':
          retryFn = initializeRBAC;
          break;
        case 'theme':
          retryFn = initializeTheme;
          break;
        case 'content':
          retryFn = initializeContent;
          break;
      }
      
      return {
        ...phase,
        retry: retryFn
      };
    });
  }, [
    phases, 
    initializeSupabase, 
    initializeAuth, 
    initializeRBAC, 
    initializeTheme,
    initializeContent
  ]);

  // Full bootstrap sequence
  const bootstrap = useCallback(async () => {
    logBridge.info(LogCategory.SYSTEM, 'Starting platform bootstrap sequence');
    
    // Initialize systems in sequence
    const supabaseOk = await initializeSupabase();
    if (!supabaseOk) return false;
    
    const authOk = await initializeAuth();
    // We continue even if auth fails, will be in guest mode
    
    const rbacOk = await initializeRBAC();
    // We continue even if RBAC fails, will use default guest permissions
    
    // Theme and Content can load in parallel since they don't depend on each other
    await Promise.allSettled([
      initializeTheme(),
      initializeContent()
    ]);
    
    logBridge.info(LogCategory.SYSTEM, 'Platform bootstrap sequence completed', {
      details: {
        supabase: supabaseOk ? 'success' : 'failed',
        auth: authOk ? 'success' : 'failed',
        rbac: rbacOk ? 'success' : 'failed'
      }
    });
    
    return true;
  }, [
    initializeSupabase, 
    initializeAuth, 
    initializeRBAC,
    initializeTheme,
    initializeContent
  ]);

  return {
    phases: phasesWithRetry,
    bootstrap,
    initializeSupabase,
    initializeAuth,
    initializeRBAC,
    initializeTheme,
    initializeContent
  };
}
