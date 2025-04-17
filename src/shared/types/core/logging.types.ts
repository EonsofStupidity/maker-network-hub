
// Logging levels
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4,
  FATAL = 5,
  TRACE = -1,
  SUCCESS = 2,
  SILENT = 100
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

// Log categorization type (for filtering)
export type LogCategoryType = LogCategory | string;

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
  id?: string;
}

// Log event for pub/sub pattern
export interface LogEvent {
  entry: LogEntry;
  type: 'new' | 'clear' | 'filter';
}

// Log filter options
export interface LogFilter {
  levels?: LogLevel[];
  categories?: LogCategory[];
  search?: string;
  from?: Date;
  to?: Date;
}

// Map of log level values (for comparison)
export const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  [LogLevel.TRACE]: -1,
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.SUCCESS]: 2,
  [LogLevel.ERROR]: 3,
  [LogLevel.CRITICAL]: 4,
  [LogLevel.FATAL]: 5,
  [LogLevel.SILENT]: 100
};
