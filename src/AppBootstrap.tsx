
import { useEffect, useState } from 'react';
import { initializeLogging } from './logging/bootstrap';
import { AuthBridge } from './bridges/AuthBridge';
import { RBACBridge } from './bridges/RBACBridge';
import { ROLES } from './shared/types/core/rbac.types';
import { AUTH_STATUS } from './shared/types/core/auth.types';
import { logBridge } from './logging/bridge';
import { LogCategory, LogLevel } from './shared/types/core/logging.types';

interface AppBootstrapProps {
  children: React.ReactNode;
}

export function AppBootstrap({ children }: AppBootstrapProps) {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    async function bootstrap() {
      try {
        console.log('Starting application bootstrap process');
        
        // Step 1: Initialize logging (before anything else)
        initializeLogging();
        logBridge.info(LogCategory.SYSTEM, 'AppBootstrap started');
        
        // Step 2: Initialize Auth
        const session = await AuthBridge.getCurrentSession();
        if (session?.user) {
          logBridge.info(LogCategory.AUTH, 'User session found', { 
            userId: session.user.id,
            email: session.user.email
          });
          
          // Set roles from user if available
          if (session.user.roles && session.user.roles.length > 0) {
            RBACBridge.setRoles(session.user.roles);
          } else {
            // Default to guest role
            RBACBridge.setRoles([ROLES.GUEST]);
          }
        } else {
          logBridge.info(LogCategory.AUTH, 'No user session found, setting guest role');
          RBACBridge.setRoles([ROLES.GUEST]);
        }
        
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
  }, []);
  
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
