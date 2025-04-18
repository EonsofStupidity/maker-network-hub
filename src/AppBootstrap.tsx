
import { useEffect, useState } from 'react';
import { logBridge } from '@/bridges/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';
import { LoadPhase } from '@/shared/types/core/app.types';
import { PlatformLoader } from '@/shared/components/platform/PlatformLoader';
import { themeBridge } from '@/bridges/theme/bridge';
import { contentBridge } from '@/bridges/content/bridge';
import { authBridge } from '@/bridges/auth/bridge';
import { toast } from '@/shared/ui/use-toast';

interface AppBootstrapProps {
  children: React.ReactNode;
}

export function AppBootstrap({ children }: AppBootstrapProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [phases, setPhases] = useState<LoadPhase[]>([
    { id: 'auth', status: 'loading', name: 'Authentication' },
    { id: 'theme', status: 'loading', name: 'Theme' },
    { id: 'content', status: 'loading', name: 'Content' }
  ]);
  
  const updatePhase = (id: string, status: LoadPhase['status']) => {
    setPhases(current => 
      current.map(phase => 
        phase.id === id ? { ...phase, status } : phase
      )
    );
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize auth
        updatePhase('auth', 'loading');
        await authBridge.initialize();
        updatePhase('auth', 'success');

        // Initialize theme
        updatePhase('theme', 'loading');
        await themeBridge.initialize();
        updatePhase('theme', 'success');

        // Initialize content
        updatePhase('content', 'loading');
        await contentBridge.initialize();
        updatePhase('content', 'success');

        setIsLoading(false);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to initialize app';
        setError(message);
        logBridge.error(LogCategory.SYSTEM, 'App initialization failed', { error: message });
        toast({
          variant: "destructive",
          title: "Initialization Error",
          description: message
        });
      }
    };

    initializeApp();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Failed to load application</h1>
          <p className="mt-2 text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-primary text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <PlatformLoader phases={phases} />;
  }

  return <>{children}</>;
}

export default AppBootstrap;
