
import { useEffect, useState, useRef } from 'react';
import { AuthBridge } from './bridges/AuthBridge';
import { RBACBridge } from './shared/bridges/RBACBridge';
import { ROLES, UserRole } from './shared/types/core/rbac.types';
import { logBridge } from './logging/bridge';
import { LogCategory, LogLevel } from './shared/types/core/logging.types';
import { initializeSupabase, isUsingMockClient } from './integrations/supabase/client';
import { useSupabaseStatus } from './hooks/use-supabase-status';
import { useToast } from './shared/ui/use-toast';
import { useThemeLoader } from './hooks/useThemeLoader';

interface AppBootstrapProps {
  children: React.ReactNode;
}

/**
 * AppBootstrap is responsible for initializing the application in a layered,
 * methodical approach with proper error handling and logging at each phase.
 */
export function AppBootstrap({ children }: AppBootstrapProps) {
  // State for tracking initialization progress
  const [isInitialized, setIsInitialized] = useState(false);
  const [initPhase, setInitPhase] = useState<string>('starting');
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { loadTheme, isLoading: isThemeLoading } = useThemeLoader();
  const initStartTime = useRef(Date.now());
  
  // Track initialization attempts
  const initializedRef = useRef({
    logging: false,
    supabase: false,
    theme: false,
    auth: false,
    rbac: false
  });

  // Bootstrap the application
  useEffect(() => {
    async function bootstrap() {
      try {
        console.log('🚀 Starting application bootstrap process');

        // ---- Phase 1: Initialize Logging System ----
        setInitPhase('logging');
        if (!initializedRef.current.logging) {
          console.log('📝 Initializing logging system');
          logBridge.initialize();
          initializedRef.current.logging = true;
          logBridge.info(LogCategory.SYSTEM, 'Phase 1: Logging system initialized');
        }

        // ---- Phase 2: Supabase Client Initialization ----
        setInitPhase('supabase');
        if (!initializedRef.current.supabase) {
          logBridge.info(LogCategory.SYSTEM, 'Phase 2: Initializing Supabase client');
          const success = initializeSupabase();
          initializedRef.current.supabase = true;
          
          if (isUsingMockClient()) {
            logBridge.warn(LogCategory.SYSTEM, 'Using mock Supabase client', {
              details: { reason: 'Environment variables missing or initialization failed' }
            });
            
            toast({
              title: "Limited Functionality Mode",
              description: "Running with mock data. Some features may be unavailable.",
              variant: "warning"
            });
          } else {
            logBridge.info(LogCategory.SYSTEM, 'Supabase client initialized successfully');
          }
        }
        
        // ---- Phase 3: Theme Loading ----
        setInitPhase('theme');
        if (!initializedRef.current.theme) {
          logBridge.info(LogCategory.SYSTEM, 'Phase 3: Loading application theme');
          
          try {
            // This has multiple fallback mechanisms inside
            await loadTheme('Impulsivity');
            initializedRef.current.theme = true;
            logBridge.info(LogCategory.THEME, 'Theme loaded successfully', {
              details: { themeName: 'Impulsivity' }
            });
          } catch (themeError) {
            // Theme errors shouldn't stop the bootstrap process
            logBridge.error(LogCategory.THEME, 'Error loading theme, using fallback', {
              details: { error: themeError instanceof Error ? themeError.message : String(themeError) }
            });
            
            initializedRef.current.theme = true; // Mark as initialized anyway
            
            toast({
              title: "Theme Error",
              description: "Using fallback theme due to loading error.",
              variant: "warning"
            });
          }
        }
        
        // ---- Phase 4: Auth Initialization ----
        setInitPhase('auth');
        if (!initializedRef.current.auth) {
          logBridge.info(LogCategory.SYSTEM, 'Phase 4: Initializing authentication');
          
          // Initialize as guest user by default for now
          AuthBridge.setUser(null);
          initializedRef.current.auth = true;
          
          logBridge.info(LogCategory.AUTH, 'Auth initialized with guest user');
          
          // TODO: In a future implementation, we would fetch the actual session here
          // const { data, error } = await supabase.auth.getSession();
          // if (data?.session?.user) {
          //   AuthBridge.setUser(data.session.user);
          //   logBridge.info(LogCategory.AUTH, 'User session loaded', { userId: data.session.user.id });
          // }
        }
        
        // ---- Phase 5: RBAC Initialization ----
        setInitPhase('rbac');
        if (!initializedRef.current.rbac) {
          logBridge.info(LogCategory.SYSTEM, 'Phase 5: Initializing RBAC');
          
          // Set guest role by default - can be overridden by auth session later
          RBACBridge.setRoles([ROLES.GUEST]);
          initializedRef.current.rbac = true;
          
          logBridge.info(LogCategory.RBAC, 'RBAC initialized with guest role');
        }
        
        // ---- Finalize Bootstrap ----
        const elapsedTime = Date.now() - initStartTime.current;
        logBridge.info(LogCategory.SYSTEM, 'Application bootstrap complete', { 
          details: { elapsedTimeMs: elapsedTime }
        });
        
        setInitPhase('complete');
        setIsInitialized(true);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown bootstrap error');
        console.error('Bootstrap error:', error);
        
        logBridge.error(LogCategory.SYSTEM, 'Bootstrap error', { 
          message: error.message,
          stack: error.stack,
          phase: initPhase
        });
        
        setError(error);
        
        toast({
          title: "Initialization Error",
          description: `Error during ${initPhase} phase: ${error.message}`,
          variant: "destructive"
        });
      }
    }
    
    bootstrap();
  }, [loadTheme, toast]);
  
  // Show loading state with the current initialization phase
  if (!isInitialized || isThemeLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-lg mb-2">Loading application...</p>
        <p className="text-sm text-muted-foreground">Phase: {initPhase}</p>
      </div>
    );
  }
  
  // Critical error that prevents app from functioning
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="bg-destructive/10 p-6 rounded-lg shadow-lg max-w-md">
          <h2 className="text-xl font-bold text-destructive mb-2">Application Error</h2>
          <p className="text-muted-foreground mb-4">
            There was an error initializing the application: {error.message}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Phase: {initPhase}
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
