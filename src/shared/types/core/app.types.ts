/**
 * Core app types definition
 */

// App settings type
export interface AppSettings {
  siteTitle: string;
  siteDescription: string;
  maintenanceMode: boolean;
  defaultTheme: string;
  [key: string]: any;
}

// Source of app data
export type DataSource = 'supabase' | 'backup' | 'default' | 'unknown';

// Core app data structure
export interface AppData {
  settings: AppSettings | null;
  pages: any[] | null;
  menus: any[] | null;
  layoutSkeletons?: any[] | null;
  fetchedAt: number | null;
  source: DataSource;
  error?: boolean;
  isLoading: boolean;
}

// Interface for our app backup mechanism
export interface AppBackupService {
  saveBackup: (data: AppData) => Promise<void> | void;
  getBackup: () => Promise<AppData | null> | AppData | null;
  clearBackup: () => Promise<void> | void;
}

// Network state
export interface NetworkState {
  isOnline: boolean;
  lastConnectedAt: number | null;
  lastDisconnectedAt: number | null;
}

// Loading phase type for bootstrap
export interface LoadPhase {
  id: string;
  name: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  detail?: string;
  retry?: () => Promise<void>;
}
