
import { useEffect, useState } from 'react';
import { AuthBridge } from './bridges/AuthBridge';
import { RBACBridge } from './shared/bridges/RBACBridge';
import { ROLES } from './shared/types/core/rbac.types';
import { AUTH_STATUS } from './shared/types/core/auth.types';
import { logBridge } from './logging/bridge';
import { LogCategory, LogLevel } from './shared/types/core/logging.types';
import { useThemeStore } from './stores/theme.store';
import { supabase } from './integrations/supabase/client';
import { ThemeEffect, ThemeEffectType } from './shared/types/core/theme.types';

interface AppBootstrapProps {
  children: React.ReactNode;
}

export function AppBootstrap({ children }: AppBootstrapProps) {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const setThemes = useThemeStore(state => state.setThemes);
  const setActiveTheme = useThemeStore(state => state.setActiveTheme);
  const setEffects = useThemeStore(state => state.setEffects);
  
  useEffect(() => {
    async function bootstrap() {
      try {
        console.log('Starting application bootstrap process');
        
        // Set up auth state listener first to avoid race conditions
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
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
            let roles = [ROLES.GUEST];
            
            if (session.user.app_metadata?.roles) {
              const appRoles = session.user.app_metadata.roles;
              if (Array.isArray(appRoles) && appRoles.length > 0) {
                // Map and validate roles
                roles = appRoles.filter(role => 
                  Object.values(ROLES).includes(role as any)
                ) as any[];
                
                // Always include at least GUEST role
                if (roles.length === 0) {
                  roles = [ROLES.GUEST];
                }
              }
            }
            
            // Set roles in RBAC bridge
            RBACBridge.setRoles(roles);
            
            logBridge.info(LogCategory.RBAC, 'User roles set', { 
              roles 
            });
          }
        });
        
        // Get session
        const { data } = await supabase.auth.getSession();
        
        if (data?.session?.user) {
          const sessionUser = data.session.user;
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
            let roles = [ROLES.GUEST];
            
            if (sessionUser.app_metadata?.roles) {
              const appRoles = sessionUser.app_metadata.roles;
              if (Array.isArray(appRoles) && appRoles.length > 0) {
                // Map and validate roles
                roles = appRoles.filter(role => 
                  Object.values(ROLES).includes(role as any)
                ) as any[];
                
                // Always include at least GUEST role
                if (roles.length === 0) {
                  roles = [ROLES.GUEST];
                }
              }
            }
            
            // Set roles in RBAC bridge
            RBACBridge.setRoles(roles);
            
            logBridge.info(LogCategory.RBAC, 'User roles set', { 
              roles 
            });
          }
        } else {
          logBridge.info(LogCategory.AUTH, 'No user session found, setting guest role');
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
        
        // Set to initialized anyway to avoid blocking the app
        setInitialized(true);
      }
    }
    
    bootstrap();
  }, [setThemes, setActiveTheme, setEffects]);
  
  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
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
