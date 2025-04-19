
import React from 'react';
import { LoadPhase } from '@/shared/types/core/app.types';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface PlatformLoaderProps {
  phases: LoadPhase[];
}

export function PlatformLoader({ phases }: PlatformLoaderProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border">
        <h2 className="text-2xl font-bold mb-4 text-center">Loading MakersIMPULSE</h2>
        
        <div className="space-y-4 mb-6">
          {phases.map((phase) => (
            <div key={phase.id} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-medium">{phase.name}</div>
                {phase.detail && (
                  <div className="text-xs text-muted-foreground">{phase.detail}</div>
                )}
              </div>
              <div className="flex items-center">
                {phase.status === 'idle' && (
                  <div className="h-5 w-5 rounded-full bg-muted"></div>
                )}
                {phase.status === 'loading' && (
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                )}
                {phase.status === 'success' && (
                  <CheckCircle className="h-5 w-5 text-success" />
                )}
                {phase.status === 'error' && (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          {phases.some(p => p.status === 'error') ? (
            <p>Some components failed to load. Limited functionality may be available.</p>
          ) : (
            <p>Preparing your experience...</p>
          )}
        </div>
      </div>
    </div>
  );
}
