
import { useEffect, useState, useRef } from 'react';
import { logBridge } from './logging/bridge';
import { LogCategory } from './shared/types/core/logging.types';
import { initializeSupabase } from './integrations/supabase/client';
import { useAuthStore } from './auth/store/auth.store';
import { useToast } from './shared/ui/use-toast';

interface AppBootstrapProps {
  children: React.ReactNode;
}

/**
 * AppBootstrap is responsible for initializing the application in a layered,
 * methodical approach with proper error handling and logging.
 */
export function AppBootstrap({ children }: AppBootstrapProps) {
  // State for tracking initialization progress
  const [initStatus, setInitStatus] = useState({
    phase: 'starting',
    completed: false,
    error: null as Error | null
  });
  
  const { toast } = useToast();
  const initStartTime = useRef(Date.now());
  
  // Access auth store
  const { initialize: initializeAuth } = useAuthStore();
  
  // Bootstrap the application
  useEffect(() => {
    async function bootstrap() {
      try {
        console.log('🚀 Starting application bootstrap process');

        // ---- Phase 1: Initialize Logging System ----
        setInitStatus(prev => ({ ...prev, phase: 'logging' }));
        console.log('📝 Initializing logging system');
        logBridge.info(LogCategory.SYSTEM, 'Phase 1: Logging system initialized');

        // ---- Phase 2: Supabase Client Initialization ----
        setInitStatus(prev => ({ ...prev, phase: 'supabase' }));
        logBridge.info(LogCategory.SYSTEM, 'Phase 2: Initializing Supabase client');
        await initializeSupabase();
        logBridge.info(LogCategory.SYSTEM, 'Supabase client initialized successfully');
        
        // ---- Phase 3: Auth Initialization ----
        setInitStatus(prev => ({ ...prev, phase: 'auth' }));
        logBridge.info(LogCategory.SYSTEM, 'Phase 3: Initializing authentication');
        await initializeAuth();
        logBridge.info(LogCategory.SYSTEM, 'Authentication initialized successfully');
        
        // ---- Phase 4: RBAC Initialization ----
        // RBAC is initialized as part of Auth's process
        setInitStatus(prev => ({ ...prev, phase: 'rbac' }));
        logBridge.info(LogCategory.SYSTEM, 'Phase 4: RBAC system initialized');
        
        // ---- Phase 5: Theme Initialization ----
        setInitStatus(prev => ({ ...prev, phase: 'theme' }));
        logBridge.info(LogCategory.SYSTEM, 'Phase 5: Theme system initialized');
        
        // ---- Finalize Bootstrap ----
        const elapsedTime = Date.now() - initStartTime.current;
        logBridge.info(LogCategory.SYSTEM, 'Application bootstrap complete', { 
          elapsedTimeMs: elapsedTime 
        });
        
        setInitStatus({ 
          phase: 'complete', 
          completed: true, 
          error: null 
        });
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown bootstrap error');
        console.error('Bootstrap error:', error);
        
        logBridge.error(LogCategory.SYSTEM, 'Bootstrap error', { 
          message: error.message,
          stack: error.stack,
          phase: initStatus.phase
        });
        
        setInitStatus(prev => ({ 
          ...prev, 
          error 
        }));
        
        toast({
          title: "Initialization Error",
          description: `Error during ${initStatus.phase} phase: ${error.message}`,
          variant: "destructive"
        });
      }
    }
    
    if (!initStatus.completed && !initStatus.error) {
      bootstrap();
    }
  }, [initStatus.completed, initStatus.error, toast, initializeAuth, initStatus.phase]);
  
  // Show loading state with the current initialization phase
  if (!initStatus.completed) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-lg mb-2">Loading application...</p>
        <p className="text-sm text-muted-foreground">Phase: {initStatus.phase}</p>
      </div>
    );
  }
  
  // Critical error that prevents app from functioning
  if (initStatus.error) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="bg-destructive/10 p-6 rounded-lg shadow-lg max-w-md">
          <h2 className="text-xl font-bold text-destructive mb-2">Application Error</h2>
          <p className="text-muted-foreground mb-4">
            There was an error initializing the application: {initStatus.error.message}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Phase: {initStatus.phase}
          </p>
          <button 
            className="bg-primary text-primary-foreground px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}

export default AppBootstrap;
