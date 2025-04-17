
import { useEffect, useState } from 'react';
import { AuthBridge } from './bridges/AuthBridge';
import { RBACBridge } from './shared/bridges/RBACBridge';
import { ROLES, UserRole } from './shared/types/core/rbac.types';
import { logBridge } from './logging/bridge';
import { LogCategory } from './shared/types/core/logging.types';
import { useThemeStore } from './stores/theme.store';
import { supabase } from './integrations/supabase/client';
import { ThemeEffect, ThemeEffectType } from './shared/types/core/theme.types';
import { CircuitBreaker } from './utils/CircuitBreaker';
import { useSupabaseStatus } from './hooks/use-supabase-status';
import { useToast } from './shared/ui/use-toast';

interface AppBootstrapProps {
  children: React.ReactNode;
}

// Circuit breaker for app bootstrap operations
const bootstrapCircuitBreaker = new CircuitBreaker('app-bootstrap', {
  maxFailures: 3,
  resetTimeout: 5000, // 5 seconds
});

export function AppBootstrap({ children }: AppBootstrapProps) {
  // State
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const setThemes = useThemeStore(state => state.setThemes);
  const setActiveTheme = useThemeStore(state => state.setActiveTheme);
  const setEffects = useThemeStore(state => state.setEffects);
  const { toast } = useToast();
  
  // Check Supabase connection status
  const { isConnected, hasInitiallyChecked } = useSupabaseStatus(true, 30000);
  
  // Bootstrap the application
  useEffect(() => {
    async function bootstrap() {
      try {
        console.log('Starting application bootstrap process');
        
        // Set up auth state listener first to avoid race conditions
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.id);
          if (session?.user) {
            // Try to handle this with circuit breaker in case auth fails
            try {
              await bootstrapCircuitBreaker.execute(
                async () => {
                  AuthBridge.setUser({
                    id: session.user.id,
                    email: session.user.email || '',
                    displayName: session.user.user_metadata?.display_name || session.user.email,
                    createdAt: session.user.created_at,
                    roles: session.user.app_metadata?.roles || [ROLES.GUEST],
                  });
                  
                  // Map Supabase roles to our app roles
                  let roles: UserRole[] = [ROLES.GUEST];
                  
                  if (session.user.app_metadata?.roles) {
                    const appRoles = session.user.app_metadata.roles;
                    if (Array.isArray(appRoles) && appRoles.length > 0) {
                      // Properly validate and cast roles to UserRole type
                      const validRoles: UserRole[] = [];
                      for (const role of appRoles) {
                        if (typeof role === 'string' && Object.values(ROLES).includes(role as UserRole)) {
                          validRoles.push(role as UserRole);
                        }
                      }
                      
                      // Use the validated roles array
                      roles = validRoles.length > 0 ? validRoles : [ROLES.GUEST];
                    }
                  }
                  
                  // Set roles in RBAC bridge
                  RBACBridge.setRoles(roles);
                  
                  logBridge.info(LogCategory.RBAC, 'User roles set', { 
                    roles 
                  });
                  
                  return true;
                },
                () => {
                  // Fallback to guest access on failure
                  AuthBridge.setUser(null);
                  RBACBridge.setRoles([ROLES.GUEST]);
                  logBridge.error(LogCategory.AUTH, 'Failed to process auth state change, falling back to guest');
                  return false;
                }
              );
            } catch (err) {
              // In case the circuit breaker throws, we still want to handle this gracefully
              AuthBridge.setUser(null);
              RBACBridge.setRoles([ROLES.GUEST]);
              logBridge.error(LogCategory.AUTH, 'Exception in auth state change handler', {
                error: err instanceof Error ? err.message : String(err)
              });
            }
          } else {
            logBridge.info(LogCategory.AUTH, 'User signed out, setting guest role');
            RBACBridge.setRoles([ROLES.GUEST]);
            AuthBridge.setUser(null);
          }
        });
        
        // Try to get current session, with fallback to guest if it fails
        try {
          const { data, error } = await bootstrapCircuitBreaker.execute(
            async () => await supabase.auth.getSession(),
            () => ({ 
              data: { session: null },
              error: null
            })
          );
          
          // Handle any potential errors
          if (error) {
            throw error;
          }
          
          const sessionUser = data?.session?.user;
          if (sessionUser) {
            logBridge.info(LogCategory.AUTH, 'User session found', { 
              userId: sessionUser.id || 'unknown',
              email: sessionUser.email || 'unknown'
            });
            
            AuthBridge.setUser({
              id: sessionUser.id,
              email: sessionUser.email || '',
              displayName: sessionUser.user_metadata?.display_name || sessionUser.email,
              createdAt: sessionUser.created_at,
              roles: sessionUser.app_metadata?.roles || [ROLES.GUEST],
            });
            
            // Map Supabase roles to our app roles
            let roles: UserRole[] = [ROLES.GUEST];
            
            if (sessionUser.app_metadata?.roles) {
              const appRoles = sessionUser.app_metadata.roles;
              if (Array.isArray(appRoles) && appRoles.length > 0) {
                // Properly validate and cast roles to UserRole type
                const validRoles: UserRole[] = [];
                for (const role of appRoles) {
                  if (typeof role === 'string' && Object.values(ROLES).includes(role as UserRole)) {
                    validRoles.push(role as UserRole);
                  }
                }
                
                // Use the validated roles array
                roles = validRoles.length > 0 ? validRoles : [ROLES.GUEST];
              }
            }
            
            // Set roles in RBAC bridge
            RBACBridge.setRoles(roles);
            
            logBridge.info(LogCategory.RBAC, 'User roles set', { 
              roles 
            });
          } else {
            logBridge.info(LogCategory.AUTH, 'No user session found, setting guest role');
            RBACBridge.setRoles([ROLES.GUEST]);
            AuthBridge.setUser(null);
          }
        } catch (authError) {
          logBridge.error(LogCategory.AUTH, 'Auth initialization error', {
            error: authError instanceof Error ? authError.message : String(authError)
          });
          
          // Fallback to guest role
          RBACBridge.setRoles([ROLES.GUEST]);
          AuthBridge.setUser(null);
        }

        // Setup default theme (public pages need this)
        const defaultTheme = {
          id: 'cyberpunk',
          name: 'Cyberpunk',
          isDark: true,
          status: 'active',
          context: 'site',
          variables: {
            primary: '#00f0ff',
            secondary: '#ff2d6e',
            background: '#080F1E',
            foreground: '#f9fafb'
          }
        };
        
        const defaultEffects: ThemeEffect[] = [
          { 
            type: ThemeEffectType.CYBER, 
            intensity: 0.7, 
            enabled: true,
            color: '#00f0ff'
          },
          {
            type: ThemeEffectType.GRAIN,
            intensity: 0.3,
            enabled: true
          }
        ];
        
        setThemes([defaultTheme]);
        setActiveTheme('cyberpunk');
        setEffects(defaultEffects);
        
        logBridge.info(LogCategory.THEME, 'Default theme initialized', {
          details: { theme: 'cyberpunk' }
        });
        
        // Log successful bootstrap
        logBridge.info(LogCategory.SYSTEM, 'Application bootstrap complete');
        setInitialized(true);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown bootstrap error');
        console.error('Bootstrap error:', error);
        logBridge.error(LogCategory.SYSTEM, 'Bootstrap error', { 
          message: error.message,
          stack: error.stack
        });
        setError(error);
        
        toast({
          title: "Initialization Error",
          description: "The application encountered a problem during startup. Some features may be limited.",
          variant: "destructive"
        });
        
        // Set to initialized anyway to avoid blocking the app completely
        setInitialized(true);
      }
    }
    
    bootstrap();
  }, [setThemes, setActiveTheme, setEffects, toast]);
  
  // Wait for Supabase status check before proceeding
  if (!initialized || !hasInitiallyChecked) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground text-sm">Initializing application...</p>
      </div>
    );
  }
  
  // Connection issue warning
  if (!isConnected) {
    return (
      <>
        <div className="fixed top-0 left-0 right-0 bg-destructive text-white py-1 px-4 text-sm text-center z-50">
          <p>Working in offline mode. Some features may be limited.</p>
        </div>
        {children}
      </>
    );
  }
  
  // Critical error that prevents app from functioning
  if (error && !initialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="bg-destructive/10 p-6 rounded-lg shadow-lg max-w-md">
          <h2 className="text-xl font-bold text-destructive mb-2">Application Error</h2>
          <p className="text-muted-foreground mb-4">
            There was an error initializing the application: {error.message}
          </p>
          <button 
            className="bg-primary text-white px-4 py-2 rounded"
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
