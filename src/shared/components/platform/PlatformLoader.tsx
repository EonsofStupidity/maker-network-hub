
import React from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { LogCategory } from '@/shared/types/core/logging.types';
import { logBridge } from '@/bridges/logging/bridge';

export interface LoadPhase {
  id: string;
  name: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  detail?: string;
  retry?: () => Promise<void>;
}

export interface PlatformLoaderProps {
  phases: LoadPhase[];
  title?: string;
  subtitle?: string;
  onAllComplete?: () => void;
  className?: string;
}

export const PlatformLoader: React.FC<PlatformLoaderProps> = ({
  phases,
  title = 'Loading Platform',
  subtitle = 'Setting up your workspace',
  onAllComplete,
  className
}) => {
  // Check if all phases are complete (either success or error)
  const allComplete = phases.every(phase => 
    phase.status === 'success' || phase.status === 'error'
  );

  // Check if any phase has an error
  const hasError = phases.some(phase => phase.status === 'error');

  // Calculate overall success or failure
  React.useEffect(() => {
    if (allComplete) {
      if (hasError) {
        logBridge.error(LogCategory.SYSTEM, 'Platform initialization completed with errors', {
          details: {
            failedPhases: phases
              .filter(p => p.status === 'error')
              .map(p => p.name)
          }
        });
      } else {
        logBridge.info(LogCategory.SYSTEM, 'Platform initialization completed successfully');
        if (onAllComplete) onAllComplete();
      }
    }
  }, [allComplete, hasError, phases, onAllComplete]);

  return (
    <div className={cn('flex flex-col items-center justify-center min-h-screen p-4 bg-background', className)}>
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <p className="text-muted-foreground mt-1">{subtitle}</p>
        </div>
        
        <div className="space-y-4">
          {phases.map((phase) => (
            <div 
              key={phase.id} 
              className={cn(
                'p-3 border rounded-md flex items-center justify-between',
                phase.status === 'idle' && 'opacity-70 border-muted',
                phase.status === 'loading' && 'border-primary/50 bg-primary/5',
                phase.status === 'success' && 'border-green-500/30 bg-green-500/5',
                phase.status === 'error' && 'border-destructive/30 bg-destructive/5'
              )}
            >
              <div className="flex items-center gap-3">
                {phase.status === 'idle' && (
                  <div className="w-5 h-5 rounded-full border-2 border-muted" />
                )}
                
                {phase.status === 'loading' && (
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                )}
                
                {phase.status === 'success' && (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                )}
                
                {phase.status === 'error' && (
                  <XCircle className="w-5 h-5 text-destructive" />
                )}
                
                <div>
                  <div className="font-medium text-sm">{phase.name}</div>
                  {phase.detail && (
                    <div className="text-xs text-muted-foreground">{phase.detail}</div>
                  )}
                </div>
              </div>
              
              {phase.status === 'error' && phase.retry && (
                <button
                  onClick={() => {
                    logBridge.info(LogCategory.SYSTEM, `Retrying phase: ${phase.name}`);
                    phase.retry?.();
                  }}
                  className="text-xs px-2 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
                >
                  Retry
                </button>
              )}
            </div>
          ))}
        </div>
        
        {allComplete && !hasError && (
          <div className="mt-6 text-center text-green-500 font-medium">
            All systems initialized and ready
          </div>
        )}
        
        {allComplete && hasError && (
          <div className="mt-6 text-center">
            <div className="text-destructive font-medium">
              Some components failed to load
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              The application may function with limited capabilities
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlatformLoader;
