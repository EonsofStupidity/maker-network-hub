
/**
 * Simple logging bridge implementation
 * Avoids circular dependencies by not importing from other modules
 */

// Define log levels and categories inline to avoid circular imports
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4
}

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

export interface LogDetails {
  source?: string;
  moduleId?: string;
  moduleName?: string;
  path?: string;
  error?: string;
  errorMessage?: string;
  stack?: string;
  [key: string]: unknown;
}

/**
 * LogBridge provides a unified interface for application logging
 * It acts as a facade over multiple logging mechanisms
 */
class LogBridgeClass {
  private initialized: boolean = false;
  private subscribers: Array<(level: LogLevel, category: LogCategory, message: string, details?: LogDetails) => void> = [];

  /**
   * Initialize the logging system
   */
  public initialize(): void {
    if (this.initialized) return;
    
    console.info('🔍 Initializing logging system');
    this.initialized = true;
    this.info(LogCategory.SYSTEM, 'Logging system initialized');
  }

  /**
   * Check if logging system is initialized
   */
  public isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Subscribe to log events
   */
  public subscribe(callback: (level: LogLevel, category: LogCategory, message: string, details?: LogDetails) => void): () => void {
    this.subscribers.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  /**
   * Log a message with a specific level
   */
  public log(level: LogLevel, category: LogCategory, message: string, details?: LogDetails): void {
    // Format for console
    const categoryStr = category.toString();
    
    // Log to console
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(`[${categoryStr}] ${message}`, details || {});
        break;
      case LogLevel.INFO:
        console.info(`[${categoryStr}] ${message}`, details || {});
        break;
      case LogLevel.WARN:
        console.warn(`[${categoryStr}] ${message}`, details || {});
        break;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        console.error(`[${categoryStr}] ${message}`, details || {});
        break;
      default:
        console.log(`[${categoryStr}] ${message}`, details || {});
    }
    
    // Notify subscribers
    this.subscribers.forEach(callback => {
      try {
        callback(level, category, message, details);
      } catch (error) {
        console.error('Error in log subscriber:', error);
      }
    });
  }
  
  /**
   * Convenience method for debug logs
   */
  public debug(category: LogCategory, message: string, details?: LogDetails): void {
    this.log(LogLevel.DEBUG, category, message, details);
  }
  
  /**
   * Convenience method for info logs
   */
  public info(category: LogCategory, message: string, details?: LogDetails): void {
    this.log(LogLevel.INFO, category, message, details);
  }
  
  /**
   * Convenience method for warning logs
   */
  public warn(category: LogCategory, message: string, details?: LogDetails): void {
    this.log(LogLevel.WARN, category, message, details);
  }
  
  /**
   * Convenience method for error logs
   */
  public error(category: LogCategory, message: string, details?: LogDetails): void {
    this.log(LogLevel.ERROR, category, message, details);
  }
}

// Create and export the singleton instance
export const logBridge = new LogBridgeClass();
