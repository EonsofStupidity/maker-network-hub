
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { logBridge } from '@/bridges/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';
import { LoadPhase } from '@/shared/types/core/app.types';
import { PlatformLoader } from '@/shared/components/platform/PlatformLoader';
import { themeBridge } from '@/bridges/theme/bridge';
import { initializeSupabase } from '@/integrations/supabase/client';
import { toast } from '@/shared/ui/use-toast';
import BasicPage from '@/pages/BasicPage';

interface AppBootstrapProps {
  children: React.ReactNode;
}

const INITIALIZATION_PHASES: LoadPhase[] = [
  { id: 'supabase', status: 'idle', name: 'Database Connection' },
  { id: 'auth', status: 'idle', name: 'Authentication' },
  { id: 'theme', status: 'idle', name: 'Theme & Layout' }
];

export function AppBootstrap({ children }: AppBootstrapProps) {
  const { initialize: initAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [phases, setPhases] = useState<LoadPhase[]>(INITIALIZATION_PHASES);
  
  const updatePhase = (id: string, status: LoadPhase['status'], detail?: string) => {
    setPhases(current => 
      current.map(phase => 
        phase.id === id ? { ...phase, status, detail } : phase
      )
    );
    
    if (status === 'error') {
      logBridge.error(LogCategory.SYSTEM, `Phase ${id} failed`, { detail });
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize Supabase
        updatePhase('supabase', 'loading', 'Connecting to database');
        try {
          await initializeSupabase();
          updatePhase('supabase', 'success');
        } catch (err) {
          updatePhase('supabase', 'error', 'Database connection failed - continuing in offline mode');
          toast({
            title: "Offline Mode",
            description: "Some features may be limited while offline",
            variant: "warning"
          });
        }
        
        // Initialize Auth
        updatePhase('auth', 'loading');
        try {
          await initAuth();
          updatePhase('auth', 'success');
        } catch (err) {
          updatePhase('auth', 'error', 'Continuing as guest');
          toast({
            title: "Guest Mode",
            description: "You're browsing as a guest",
            variant: "warning"
          });
        }
        
        // Initialize Theme
        updatePhase('theme', 'loading');
        try {
          await themeBridge.initialize();
          updatePhase('theme', 'success');
        } catch (err) {
          updatePhase('theme', 'error', 'Using default theme');
          toast({
            title: "Default Theme",
            description: "Using fallback theme settings",
            variant: "warning"
          });
        }

        setIsLoading(false);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to initialize app';
        setError(message);
        logBridge.error(LogCategory.SYSTEM, 'App initialization failed', { error: message });
      }
    };

    initializeApp();
  }, [initAuth]);

  // Show basic loading page if initialization fails
  if (error || phases.every(p => p.status === 'error')) {
    return <BasicPage />;
  }

  // Show platform loader while initializing
  if (isLoading) {
    return <PlatformLoader phases={phases} />;
  }

  return <>{children}</>;
}
