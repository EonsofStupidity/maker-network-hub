
import { v4 as uuidv4 } from 'uuid';
import { 
  LogLevel, 
  LogCategory, 
  LogEntry, 
  LogFilter, 
  LogEvent, 
  LogDetails 
} from '@/shared/types/core/logging.types';
import { logger } from './logger';

/**
 * LogBridge provides a unified interface for application logging
 * It acts as a facade over multiple logging mechanisms
 */
export class LogBridge {
  private static instance: LogBridge;
  private subscribers: ((event: LogEvent) => void)[] = [];

  private constructor() {
    // Private constructor to enforce singleton
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): LogBridge {
    if (!LogBridge.instance) {
      LogBridge.instance = new LogBridge();
    }
    return LogBridge.instance;
  }

  /**
   * Set minimum log level
   */
  public setMinLevel(level: LogLevel): void {
    logger.setLevel(level);
  }

  /**
   * Subscribe to log events
   */
  public subscribe(callback: (event: LogEvent) => void): () => void {
    this.subscribers.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify subscribers of new log event
   */
  private notify(entry: LogEntry): void {
    const event: LogEvent = { entry };
    this.subscribers.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in log subscriber', error);
      }
    });
  }

  /**
   * Log a message
   */
  public log(level: LogLevel, category: LogCategory, message: string, details?: LogDetails): void {
    const entry: LogEntry = {
      id: uuidv4(),
      level,
      category,
      message,
      timestamp: Date.now(),
      details: details || {},
      source: details?.source
    };
    
    // Use our Logger implementation
    logger.log(level, category, message, details);
    
    // Notify subscribers
    this.notify(entry);
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
  
  /**
   * Query logs with filter
   */
  public query(filter: LogFilter = {}): LogEntry[] {
    return logger.getEntries(filter);
  }
  
  /**
   * Clear all logs
   */
  public clearLogs(): void {
    logger.clearEntries();
  }
}

export const logBridge = LogBridge.getInstance();
