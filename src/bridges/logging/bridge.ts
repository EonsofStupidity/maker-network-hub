
import { LogCategory, LogLevel, LogDetails, LogEntry, LogFilter, LogEvent } from '@/shared/types/core/logging.types';

/**
 * LogBridge - Logging Bridge
 * Provides a unified interface for logging across the application
 */
export interface ILogBridge {
  initialize: () => Promise<void>;
  debug: (category: LogCategory, message: string, details?: LogDetails) => void;
  info: (category: LogCategory, message: string, details?: LogDetails) => void;
  warn: (category: LogCategory, message: string, details?: LogDetails) => void;
  error: (category: LogCategory, message: string, details?: LogDetails) => void;
  critical: (category: LogCategory, message: string, details?: LogDetails) => void;
  log: (level: LogLevel, category: LogCategory, message: string, details?: LogDetails) => void;
  isInitialized: boolean;
  subscribe: (callback: (event: LogEvent) => void) => () => void;
  getFilter: () => LogFilter;
  setFilter: (filter: LogFilter) => void;
  clearLogs: () => void;
}

class LogBridgeClass implements ILogBridge {
  private logs: LogEntry[] = [];
  isInitialized = false;
  private subscribers: Array<(event: LogEvent) => void> = [];
  private currentFilter: LogFilter = {};

  /**
   * Initialize the logging system
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    this.isInitialized = true;
    console.info('Logging system initialized');
    
    // Log this initialization
    this.info(LogCategory.SYSTEM, 'Logging system initialized');
  }

  /**
   * Log a debug message
   */
  public debug(category: LogCategory, message: string, details?: LogDetails): void {
    this.log(LogLevel.DEBUG, category, message, details);
  }

  /**
   * Log an info message
   */
  public info(category: LogCategory, message: string, details?: LogDetails): void {
    this.log(LogLevel.INFO, category, message, details);
  }

  /**
   * Log a warning message
   */
  public warn(category: LogCategory, message: string, details?: LogDetails): void {
    this.log(LogLevel.WARN, category, message, details);
  }

  /**
   * Log an error message
   */
  public error(category: LogCategory, message: string, details?: LogDetails): void {
    this.log(LogLevel.ERROR, category, message, details);
  }

  /**
   * Log a critical error message
   */
  public critical(category: LogCategory, message: string, details?: LogDetails): void {
    this.log(LogLevel.CRITICAL, category, message, details);
  }

  /**
   * Log a message with a specific level
   */
  public log(level: LogLevel, category: LogCategory, message: string, details?: LogDetails): void {
    // Create log entry
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      details
    };
    
    // Store log entry
    this.logs.push(entry);
    
    // Output to console based on level
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(`[${category}] ${message}`, details || '');
        break;
      case LogLevel.INFO:
        console.info(`[${category}] ${message}`, details || '');
        break;
      case LogLevel.WARN:
        console.warn(`[${category}] ${message}`, details || '');
        break;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        console.error(`[${category}] ${message}`, details || '');
        break;
    }

    // Notify subscribers
    this.notifySubscribers({
      type: 'new',
      entry,
    });
  }

  /**
   * Subscribe to log events
   */
  public subscribe(callback: (event: LogEvent) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify subscribers of log events
   */
  private notifySubscribers(event: LogEvent): void {
    this.subscribers.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in log subscriber callback', error);
      }
    });
  }

  /**
   * Get all logs
   */
  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Clear all logs
   */
  public clearLogs(): void {
    this.logs = [];
    this.notifySubscribers({
      type: 'clear',
      entry: {} as LogEntry
    });
  }

  /**
   * Get current filter
   */
  public getFilter(): LogFilter {
    return { ...this.currentFilter };
  }

  /**
   * Set filter
   */
  public setFilter(filter: LogFilter): void {
    this.currentFilter = { ...filter };
    this.notifySubscribers({
      type: 'filter',
      entry: {} as LogEntry
    });
  }
}

// Export singleton instance
export const logBridge = new LogBridgeClass();
export { LogCategory, LogLevel } from '@/shared/types/core/logging.types';
