
import { LogLevel, LogCategory, LogCategoryType, LogDetails, LogEntry, LogFilter } from '@/shared/types/shared.types';
import { getErrorMessage } from '@/utils/errors';

/**
 * Logger service for application-wide logging
 */
class LoggerService {
  private static instance: LoggerService;
  private logLevel: LogLevel = LogLevel.INFO;
  private enabledCategories: Set<LogCategoryType> = new Set(
    Object.keys(LogCategory) as Array<LogCategoryType>
  );
  private listeners: ((level: LogLevel, category: LogCategoryType, message: string, details?: LogDetails) => void)[] = [];
  private logEntries: LogEntry[] = [];
  
  /**
   * Get singleton instance
   */
  public static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }
  
  /**
   * Set minimum log level
   */
  public setLevel(level: LogLevel): void {
    this.logLevel = level;
  }
  
  /**
   * Enable specific log categories
   */
  public enableCategories(categories: Array<LogCategoryType>): void {
    categories.forEach(category => this.enabledCategories.add(category));
  }
  
  /**
   * Disable specific log categories
   */
  public disableCategories(categories: Array<LogCategoryType>): void {
    categories.forEach(category => this.enabledCategories.delete(category));
  }
  
  /**
   * Add log listener
   */
  public addListener(listener: (level: LogLevel, category: LogCategoryType, message: string, details?: LogDetails) => void): void {
    this.listeners.push(listener);
  }
  
  /**
   * Remove log listener
   */
  public removeListener(listener: (level: LogLevel, category: LogCategoryType, message: string, details?: LogDetails) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }
  
  /**
   * Subscribe to log events
   */
  public subscribe(callback: (entry: LogEntry) => void): () => void {
    const handler = (level: LogLevel, category: LogCategoryType, message: string, details?: LogDetails) => {
      const entry: LogEntry = {
        id: crypto.randomUUID(),
        level,
        category,
        message,
        timestamp: Date.now(),
        details,
        source: details?.source
      };
      callback(entry);
    };
    
    this.addListener(handler);
    
    return () => {
      this.removeListener(handler);
    };
  }
  
  /**
   * Log a message
   */
  public log(level: LogLevel, category: LogCategoryType, message: string, details?: LogDetails): void {
    // Check if this log should be processed
    if (!this.shouldLog(level, category)) {
      return;
    }
    
    // Create log entry
    const entry: LogEntry = {
      id: crypto.randomUUID(),
      level,
      category,
      message,
      timestamp: Date.now(),
      details,
      source: details?.source
    };
    
    // Store the log entry
    this.logEntries.push(entry);
    
    // Format the log message
    const timestamp = new Date().toISOString();
    const formattedMsg = `[${timestamp}] [${LogLevel[level]}] [${category}] ${message}`;
    
    // Log to console
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMsg, details);
        break;
      case LogLevel.INFO:
        console.info(formattedMsg, details);
        break;
      case LogLevel.WARN:
        console.warn(formattedMsg, details);
        break;
      case LogLevel.ERROR:
        console.error(formattedMsg, details);
        break;
      case LogLevel.CRITICAL:
        console.error(formattedMsg, details);
        break;
      default:
        console.log(formattedMsg, details);
    }
    
    // Notify listeners
    this.notifyListeners(level, category, message, details);
  }
  
  /**
   * Check if this log should be processed based on level and category
   */
  private shouldLog(level: LogLevel, category: LogCategoryType): boolean {
    // Check log level
    if (level < this.logLevel) {
      return false;
    }
    
    // Check category
    if (!this.enabledCategories.has(category)) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Notify all listeners
   */
  private notifyListeners(level: LogLevel, category: LogCategoryType, message: string, details?: LogDetails): void {
    this.listeners.forEach(listener => {
      try {
        listener(level, category, message, details);
      } catch (error) {
        console.error('Error in log listener:', error);
      }
    });
  }
  
  /**
   * Get log entries with optional filtering
   */
  public getEntries(filter: Partial<LogFilter> = {}): LogEntry[] {
    let filteredEntries = [...this.logEntries];
    
    if (filter.level !== undefined) {
      filteredEntries = filteredEntries.filter(entry => entry.level === filter.level);
    }
    
    if (filter.category) {
      filteredEntries = filteredEntries.filter(entry => entry.category === filter.category);
    }
    
    if (filter.from !== undefined) {
      const fromTimestamp = filter.from instanceof Date ? filter.from.getTime() : filter.from;
      filteredEntries = filteredEntries.filter(entry => entry.timestamp >= fromTimestamp);
    }
    
    if (filter.to !== undefined) {
      const toTimestamp = filter.to instanceof Date ? filter.to.getTime() : filter.to;
      filteredEntries = filteredEntries.filter(entry => entry.timestamp <= toTimestamp);
    }
    
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filteredEntries = filteredEntries.filter(entry => 
        entry.message.toLowerCase().includes(searchLower) || 
        JSON.stringify(entry.details).toLowerCase().includes(searchLower)
      );
    }
    
    return filteredEntries;
  }
  
  /**
   * Clear all log entries
   */
  public clearLogs(): void {
    this.logEntries = [];
  }
}

export const logger = LoggerService.getInstance();
