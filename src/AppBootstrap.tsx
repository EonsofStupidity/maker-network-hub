
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
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { loadTheme, isLoading: isThemeLoading } = useThemeLoader();
  
  // Bootstrap the application
  useEffect(() => {
    async function bootstrap() {
      try {
        console.log('Starting application bootstrap process');
        
        // Initialize as guest user by default - no auth checks for now
        AuthBridge.setUser(null);
        RBACBridge.setRoles([ROLES.GUEST]);
        
        // Load theme (this now has multiple fallback mechanisms)
        await loadTheme('Impulsivity');
        
        // Log successful bootstrap
        logBridge.info(LogCategory.SYSTEM, 'Application bootstrap complete');
        
        // Mark as initialized
        setIsInitialized(true);
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
  if (!isInitialized || isThemeLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-lg">Loading application...</p>
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
