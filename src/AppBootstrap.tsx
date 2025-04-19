
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { logBridge } from '@/bridges/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';
import { LoadPhase } from '@/shared/types/core/app.types';
import { PlatformLoader } from '@/shared/components/platform/PlatformLoader';
import { themeBridge } from '@/bridges/theme/bridge';
import { initializeSupabase } from '@/integrations/supabase/client';
import BasicPage from '@/pages/BasicPage';

interface AppBootstrapProps {
  children: React.ReactNode;
}

const INITIALIZATION_PHASES: LoadPhase[] = [
  { id: 'supabase', status: 'idle', name: 'Database Connection' },
  { id: 'auth', status: 'idle', name: 'Authentication' },
  { id: 'theme', status: 'idle', name: 'Theme' }
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
        // Try to initialize Supabase first
        updatePhase('supabase', 'loading', 'Connecting to database');
        try {
          await initializeSupabase();
          updatePhase('supabase', 'success', 'Database connected');
        } catch (err) {
          // Continue even if Supabase fails
          updatePhase('supabase', 'error', 'Database connection failed - continuing');
          console.warn('Supabase initialization failed, continuing with limited functionality');
        }
        
        // Initialize Auth
        updatePhase('auth', 'loading');
        try {
          await initAuth();
          updatePhase('auth', 'success');
        } catch (authErr) {
          // Continue with guest mode if auth fails
          updatePhase('auth', 'error', 'Authentication failed - continuing as guest');
          console.warn('Auth initialization failed, continuing as guest');
        }
        
        // Initialize Theme
        updatePhase('theme', 'loading');
        try {
          await themeBridge.initialize();
          updatePhase('theme', 'success');
        } catch (themeErr) {
          // Continue with default theme if theme fails
          updatePhase('theme', 'error', 'Theme initialization failed - using default');
          console.warn('Theme initialization failed, using default theme');
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

  if (error) {
    return <BasicPage />;
  }

  if (isLoading) {
    return <PlatformLoader phases={phases} />;
  }

  return <>{children}</>;
}
