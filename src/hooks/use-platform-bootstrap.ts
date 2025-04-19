
import { useState, useCallback, useMemo } from 'react';
import { PlatformBootstrapPhase, PhaseStatus } from '@/shared/types/core/app.types';
import { logBridge } from '@/bridges/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';
import { authBridge } from '@/bridges/auth/bridge';
import { rbacBridge } from '@/bridges/rbac/bridge';
import { themeBridge } from '@/bridges/theme/bridge';
import { contentBridge } from '@/bridges/content/bridge';
import { supabase, initializeSupabase as initSupabase } from '@/integrations/supabase/client';
import { CircuitBreaker } from '@/utils/CircuitBreaker';

// Create circuit breakers for critical services
const createCircuitBreaker = (name: string, maxFailures: number, resetTimeout: number) =>
  new CircuitBreaker(name, { maxFailures, resetTimeout });

const supabaseCircuitBreaker = createCircuitBreaker('supabase', 3, 10000);
const authCircuitBreaker = createCircuitBreaker('auth', 3, 10000);
const rbacCircuitBreaker = createCircuitBreaker('rbac', 2, 5000);
const webSocketCircuitBreaker = createCircuitBreaker('websocket', 2, 5000);
const themeCircuitBreaker = createCircuitBreaker('theme', 2, 7000);
const contentCircuitBreaker = createCircuitBreaker('content', 2, 7000);

export function usePlatformBootstrap() {
  const [phases, setPhases] = useState<PlatformBootstrapPhase[]>([
    { id: 'supabase', name: 'Database Connection', status: 'idle' },
    { id: 'auth', name: 'Authentication', status: 'idle' },
    { id: 'rbac', name: 'Permissions System', status: 'idle' },
    { id: 'websocket', name: 'Real-Time Updates', status: 'idle' },
    { id: 'theme', name: 'Visual Theme', status: 'idle' },
    { id: 'content', name: 'Content Management', status: 'idle' },
  ]);
  const [bootstrapComplete, setBootstrapComplete] = useState(false);

  const updatePhase = useCallback((
    phaseId: string,
    status: PhaseStatus,
    errorMessage?: string,
    retryFn?: () => Promise<void>
  ) => {
    setPhases(current =>
      current.map(phase =>
        phase.id === phaseId ? { ...phase, status, errorMessage, retry: retryFn ?? phase.retry } : phase
      )
    );

    if (status === 'error') {
      logBridge.error(LogCategory.SYSTEM, `Bootstrap phase ${phaseId} failed`, { errorMessage });
    } else {
      logBridge.info(LogCategory.SYSTEM, `Bootstrap phase ${phaseId} status: ${status}`, { errorMessage });
    }
  }, []);

  // Each phase initialization with retry handlers

  // Helper to convert initialize functions returning Promise<boolean> to Promise<void>
  const toVoid = (fn: () => Promise<boolean>): (() => Promise<void>) => {
    return async () => {
      await fn();
    };
  };

  const initializeSupabase = useCallback(async () => {
    updatePhase('supabase', 'loading', undefined, toVoid(initializeSupabase));
    try {
      return await supabaseCircuitBreaker.execute(async () => {
        await initSupabase();
        const { error } = await supabase.from('profiles').select('id').limit(1);
        if (error) throw error;
        updatePhase('supabase', 'success');
        return true;
      }, () => {
        updatePhase('supabase', 'error', 'Failed to connect to database');
        return false;
      });
    } catch (error) {
      updatePhase('supabase', 'error', error instanceof Error ? error.message : 'Unknown database error');
      return false;
    }
  }, [updatePhase]);

  const initializeAuth = useCallback(async () => {
    updatePhase('auth', 'loading', undefined, toVoid(initializeAuth));
    try {
      return await authCircuitBreaker.execute(async () => {
        await authBridge.initialize();
        const user = authBridge.getUser();
        const detail = user ? `(${user.email || user.id})` : '(Guest)';
        updatePhase('auth', 'success', `Authentication ready ${detail}`);
        return true;
      }, () => {
        updatePhase('auth', 'error', 'Authentication service unavailable');
        return false;
      });
    } catch (error) {
      updatePhase('auth', 'error', error instanceof Error ? error.message : 'Unknown auth error');
      return false;
    }
  }, [updatePhase]);

  const initializeRBAC = useCallback(async () => {
    updatePhase('rbac', 'loading', undefined, toVoid(initializeRBAC));
    try {
      return await rbacCircuitBreaker.execute(async () => {
        await rbacBridge.initialize();
        const roles = rbacBridge.getRoles();
        const rolesDetail = roles.length > 0 ? `(${roles.join(', ')})` : '(No roles)';
        updatePhase('rbac', 'success', `Roles loaded ${rolesDetail}`);
        return true;
      }, () => {
        updatePhase('rbac', 'error', 'RBAC system unavailable');
        return false;
      });
    } catch (error) {
      updatePhase('rbac', 'error', error instanceof Error ? error.message : 'Unknown RBAC error');
      return false;
    }
  }, [updatePhase]);

  // Placeholder WebSocket initialization with retry stub - to be implemented fully later
  const initializeWebSocket = useCallback(async () => {
    updatePhase('websocket', 'loading', undefined, toVoid(initializeWebSocket));
    try {
      return await webSocketCircuitBreaker.execute(async () => {
        // Assuming a websocketBridge with initialize() and status check exists
        // For now, simulate success after timeout (replace with actual bridge)
        await new Promise(res => setTimeout(res, 100)); 
        updatePhase('websocket', 'success');
        return true;
      }, () => {
        updatePhase('websocket', 'error', 'WebSocket service unavailable');
        return false;
      });
    } catch (error) {
      updatePhase('websocket', 'error', error instanceof Error ? error.message : 'Unknown WebSocket error');
      return false;
    }
  }, [updatePhase]);

  const initializeTheme = useCallback(async () => {
    updatePhase('theme', 'loading', undefined, toVoid(initializeTheme));
    try {
      return await themeCircuitBreaker.execute(async () => {
        await themeBridge.initialize();
        const isDark = themeBridge.isDarkMode();
        const themeDetail = isDark ? 'Dark Theme' : 'Light Theme';
        updatePhase('theme', 'success', `Theme loaded (${themeDetail})`);
        return true;
      }, () => {
        updatePhase('theme', 'error', 'Theme service unavailable');
        return false;
      });
    } catch (error) {
      updatePhase('theme', 'error', error instanceof Error ? error.message : 'Unknown theme error');
      return false;
    }
  }, [updatePhase]);

  const initializeContent = useCallback(async () => {
    updatePhase('content', 'loading', undefined, toVoid(initializeContent));
    try {
      return await contentCircuitBreaker.execute(async () => {
        await contentBridge.initialize();
        updatePhase('content', 'success', 'Content system ready');
        return true;
      }, () => {
        updatePhase('content', 'error', 'Content management unavailable');
        return false;
      });
    } catch (error) {
      updatePhase('content', 'error', error instanceof Error ? error.message : 'Unknown content error');
      return false;
    }
  }, [updatePhase]);

  // Final bootstrap sequence - strictly sequential for critical dependencies:
  // Supabase → Auth → RBAC → WebSocket → Theme & Content (parallel)
  const bootstrap = useCallback(async () => {
    logBridge.info(LogCategory.SYSTEM, 'Starting platform bootstrap sequence');
    setBootstrapComplete(false);

    const supabaseOk = await initializeSupabase();
    const authOk = await initializeAuth();
    const rbacOk = await initializeRBAC();
    const webSocketOk = await initializeWebSocket();

    // Load theme and content in parallel; even if others failed, continue
    await Promise.allSettled([
      initializeTheme(),
      initializeContent()
    ]);

    setBootstrapComplete(true);
    logBridge.info(LogCategory.SYSTEM, 'Platform bootstrap sequence complete', {
      supabase: supabaseOk,
      auth: authOk,
      rbac: rbacOk,
      webSocket: webSocketOk
    });

    return true;
  }, [
    initializeSupabase,
    initializeAuth,
    initializeRBAC,
    initializeWebSocket,
    initializeTheme,
    initializeContent
  ]);

  // Add retry wrappers to phases for quick access
  const phasesWithRetry = useMemo(() => {
    return phases.map(phase => ({
      ...phase,
      retry: phase.retry
    }));
  }, [phases]);

  return {
    phases: phasesWithRetry,
    bootstrap,
    bootstrapComplete,
    retryPhase: async (phaseId: string) => {
      const phase = phases.find(p => p.id === phaseId);
      if (!phase || !phase.retry) {
        logBridge.warn(LogCategory.SYSTEM, `No retry function available for phase ${phaseId}`);
        return false;
      }
      await phase.retry();
      return true;
    }
  };
}

