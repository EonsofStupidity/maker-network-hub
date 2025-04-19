
export type LoadPhaseStatus = 'idle' | 'loading' | 'success' | 'error';

export interface LoadPhase {
  id: string;
  name: string;
  status: LoadPhaseStatus;
  detail?: string;
}

export interface AppConfig {
  appName: string;
  version: string;
  debug: boolean;
  environment: 'development' | 'staging' | 'production';
  features: Record<string, boolean>;
}
