
export type PhaseStatus = 'idle' | 'loading' | 'success' | 'error';

// PlatformBootstrapPhase remains for legacy compatibility but deprecated
export interface PlatformBootstrapPhase {
  id: string;
  name: string;
  status: PhaseStatus;
  errorMessage?: string;
  retry?: () => Promise<void>;
}

// Unified LoadPhase type for current bootstrap phases
export interface LoadPhase {
  id: string;
  name: string;
  status: PhaseStatus;
  detail?: string;
  errorMessage?: string;
  retry?: () => Promise<void>;
}
