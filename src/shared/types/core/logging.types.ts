
// Logging levels
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4
}

// Log categories
export enum LogCategory {
  APP = 'APP',
  ADMIN = 'ADMIN',
  AUTH = 'AUTH',
  API = 'API',
  UI = 'UI',
  PERFORMANCE = 'PERFORMANCE',
  ERROR = 'ERROR',
  SECURITY = 'SECURITY',
  THEME = 'THEME',
  RBAC = 'RBAC',
  SYSTEM = 'SYSTEM',
  CHAT = 'CHAT',
  DEBUG = 'DEBUG'
}

// Log entry details
export interface LogDetails {
  [key: string]: any;
}

// Log entry structure
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  details?: LogDetails;
  source?: string;
  userId?: string | null;
  sessionId?: string | null;
}
