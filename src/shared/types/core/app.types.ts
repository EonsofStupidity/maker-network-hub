
export type PhaseStatus = 'idle' | 'loading' | 'success' | 'error';

// Original PlatformBootstrapPhase remains as is
export interface PlatformBootstrapPhase {
  id: string;
  name: string;
  status: PhaseStatus;
  errorMessage?: string;
  retry?: () => Promise<void>;
}

// New type LoadPhase, aligning with existing usages and naming:
export interface LoadPhase {
  id: string;
  name: string;
  status: PhaseStatus;
  detail?: string;        // Used to show additional info in UI phases
  retry?: () => Promise<void>;
}
