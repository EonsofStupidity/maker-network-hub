
import { useEffect, useState } from 'react';
import { AuthBridge } from './bridges/AuthBridge';
import { RBACBridge } from './shared/bridges/RBACBridge';
import { ROLES, UserRole } from './shared/types/core/rbac.types';
import { logBridge } from './logging/bridge';
import { LogCategory } from './shared/types/core/logging.types';
import { supabase } from './integrations/supabase/client';
import { useSupabaseStatus } from './hooks/use-supabase-status';
import { useToast } from './shared/ui/use-toast';
import { useThemeLoader } from './hooks/useThemeLoader';

interface AppBootstrapProps {
  children: React.ReactNode;
}

export function AppBootstrap({ children }: AppBootstrapProps) {
  // State
  const [authInitialized, setAuthInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { isConnected, hasInitiallyChecked } = useSupabaseStatus(true, 30000);
  const { loadTheme, isLoading: isThemeLoading } = useThemeLoader();
  
  // Bootstrap the application
  useEffect(() => {
    async function bootstrap() {
      try {
        console.log('Starting application bootstrap process');
        
        // Set up auth state listener first to avoid race conditions
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.id);
          if (session?.user) {
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
                
                roles = validRoles.length > 0 ? validRoles : [ROLES.GUEST];
              }
            }
            
            // Set roles in RBAC bridge
            RBACBridge.setRoles(roles);
            
            logBridge.info(LogCategory.RBAC, 'User roles set', { roles });
          } else {
            logBridge.info(LogCategory.AUTH, 'User signed out, setting guest role');
            RBACBridge.setRoles([ROLES.GUEST]);
            AuthBridge.setUser(null);
          }
        });
        
        // Try to get current session, with fallback to guest if it fails
        try {
          const { data, error } = await supabase.auth.getSession();
          
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
                
                roles = validRoles.length > 0 ? validRoles : [ROLES.GUEST];
              }
            }
            
            // Set roles in RBAC bridge
            RBACBridge.setRoles(roles);
            
            logBridge.info(LogCategory.RBAC, 'User roles set', { roles });
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

        // Auth initialization complete
        setAuthInitialized(true);

        // Load theme (this now has multiple fallback mechanisms)
        await loadTheme('Impulsivity');
        
        // Log successful bootstrap
        logBridge.info(LogCategory.SYSTEM, 'Application bootstrap complete');
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
      }
    }
    
    bootstrap();
  }, [loadTheme, toast]);
  
  // Simple loading state
  if (!authInitialized || isThemeLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-lg">Loading application...</p>
      </div>
    );
  }
  
  // Connection issue warning
  if (hasInitiallyChecked && !isConnected) {
    return (
      <>
        <div className="fixed top-0 left-0 right-0 bg-destructive text-destructive-foreground py-1 px-4 text-sm text-center z-50">
          Working in offline mode. Some features may be limited.
        </div>
        {children}
      </>
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
