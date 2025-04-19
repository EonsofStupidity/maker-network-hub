
export type PhaseStatus = 'idle' | 'loading' | 'success' | 'error';

export interface PlatformBootstrapPhase {
  id: string;
  name: string;
  status: PhaseStatus;
  errorMessage?: string;
  retry?: () => Promise<void>;
}

export interface AppConfig {
  appName: string;
  version: string;
  debug: boolean;
  environment: 'development' | 'staging' | 'production';
  features: Record<string, boolean>;
}
