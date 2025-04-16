import { v4 as uuidv4 } from 'uuid';
import { 
  LogLevel, 
  LogCategory, 
  LogCategoryType, 
  LogEntry, 
  LogDetails 
} from '@/shared/types/core/logging.types';
import { supabase } from '@/integrations/supabase/client';

// LogTransport interface for different logging destinations
export interface LogTransport {
  log: (entry: LogEntry) => void;
  setMinLevel: (level: LogLevel) => void;
}

// Console transport
class ConsoleTransport implements LogTransport {
  private minLevel: LogLevel = LogLevel.INFO;

  public setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  public log(entry: LogEntry): void {
    if (entry.level < this.minLevel) return;

    const timestamp = new Date(entry.timestamp).toISOString();
    const prefix = `[${timestamp}] [${LogLevel[entry.level]}] [${entry.category}]`;
    const details = entry.details ? entry.details : {};

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(prefix, entry.message, details);
        break;
      case LogLevel.INFO:
        console.info(prefix, entry.message, details);
        break;
      case LogLevel.WARN:
        console.warn(prefix, entry.message, details);
        break;
      case LogLevel.ERROR:
        console.error(prefix, entry.message, details);
        break;
      case LogLevel.CRITICAL:
        console.error(prefix, entry.message, details);
        break;
      case LogLevel.TRACE:
        console.trace(prefix, entry.message, details);
        break;
      default:
        console.log(prefix, entry.message, details);
    }
  }
}

// Database transport that logs to Supabase
class DatabaseTransport implements LogTransport {
  private minLevel: LogLevel = LogLevel.WARN; // Default to only store warnings and above
  private batchedLogs: LogEntry[] = [];
  private batchTimeout: ReturnType<typeof setTimeout> | null = null;
  private maxBatchSize = 10;
  private batchTimeoutMs = 5000;

  constructor() {
    // Flush logs before unload
    window.addEventListener('beforeunload', () => {
      this.flushLogs();
    });
  }

  public setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  public log(entry: LogEntry): void {
    if (entry.level < this.minLevel) return;
    
    this.batchedLogs.push(entry);
    
    if (this.batchedLogs.length >= this.maxBatchSize) {
      this.flushLogs();
    } else if (!this.batchTimeout) {
      this.batchTimeout = setTimeout(() => {
        this.flushLogs();
      }, this.batchTimeoutMs);
    }
  }

  private async flushLogs(): Promise<void> {
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }

    if (this.batchedLogs.length === 0) return;

    const logsToSend = [...this.batchedLogs];
    this.batchedLogs = [];

    try {
      const logsData = logsToSend.map(entry => ({
        level: entry.level,
        message: entry.message,
        category: entry.category,
        details: entry.details || {},
        source: entry.source || 'frontend',
        timestamp: new Date(entry.timestamp).toISOString()
      }));

      const { error } = await supabase.from('application_logs').insert(logsData);
      
      if (error) {
        console.error('Failed to persist logs to database:', error);
      }
    } catch (error) {
      console.error('Error in database transport:', error);
    }
  }
}

// Memory transport for in-memory log storage with filtering capabilities
class MemoryTransport implements LogTransport {
  private minLevel: LogLevel = LogLevel.INFO;
  private maxEntries = 1000;
  private entries: LogEntry[] = [];

  public setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  public log(entry: LogEntry): void {
    if (entry.level < this.minLevel) return;
    
    this.entries.push(entry);
    
    // Keep only the most recent logs
    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(-this.maxEntries);
    }
  }

  public getEntries(): LogEntry[] {
    return [...this.entries];
  }

  public filterEntries(options: {
    level?: LogLevel;
    category?: LogCategoryType;
    search?: string;
    from?: number;
    to?: number;
  }): LogEntry[] {
    return this.entries.filter(entry => {
      // Filter by level
      if (options.level !== undefined && entry.level < options.level) {
        return false;
      }
      
      // Filter by category
      if (options.category && entry.category !== options.category) {
        return false;
      }
      
      // Filter by time range
      if (options.from && entry.timestamp < options.from) {
        return false;
      }
      
      if (options.to && entry.timestamp > options.to) {
        return false;
      }
      
      // Filter by search text
      if (options.search) {
        const searchLower = options.search.toLowerCase();
        const matchesMessage = entry.message.toLowerCase().includes(searchLower);
        const matchesDetails = entry.details 
          ? JSON.stringify(entry.details).toLowerCase().includes(searchLower) 
          : false;
        
        if (!matchesMessage && !matchesDetails) {
          return false;
        }
      }
      
      return true;
    });
  }

  public clearEntries(): void {
    this.entries = [];
  }
}

/**
 * Enterprise-level application logger
 */
class Logger {
  private static instance: Logger;
  private transports: LogTransport[] = [];
  private defaultLevel: LogLevel = LogLevel.INFO;
  private memoryTransport: MemoryTransport;
  
  private constructor() {
    // Initialize transports
    const consoleTransport = new ConsoleTransport();
    this.memoryTransport = new MemoryTransport();
    const databaseTransport = new DatabaseTransport();
    
    // Add transports
    this.transports = [
      consoleTransport,
      this.memoryTransport,
      databaseTransport
    ];
    
    // Configure transport log levels
    consoleTransport.setMinLevel(LogLevel.DEBUG);
    this.memoryTransport.setMinLevel(LogLevel.INFO);
    databaseTransport.setMinLevel(LogLevel.WARN);
  }
  
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
  
  public setLevel(level: LogLevel): void {
    this.defaultLevel = level;
    this.transports.forEach(transport => transport.setMinLevel(level));
  }
  
  public log(level: LogLevel, category: LogCategoryType, message: string, details?: LogDetails): void {
    const entry: LogEntry = {
      id: uuidv4(),
      level,
      category,
      message,
      timestamp: Date.now(),
      details: details || {},
      source: details?.source || 'application'
    };
    
    this.transports.forEach(transport => {
      try {
        transport.log(entry);
      } catch (error) {
        console.error('Error in log transport:', error);
      }
    });
  }
  
  public debug(category: LogCategoryType, message: string, details?: LogDetails): void {
    this.log(LogLevel.DEBUG, category, message, details);
  }
  
  public info(category: LogCategoryType, message: string, details?: LogDetails): void {
    this.log(LogLevel.INFO, category, message, details);
  }
  
  public warn(category: LogCategoryType, message: string, details?: LogDetails): void {
    this.log(LogLevel.WARN, category, message, details);
  }
  
  public error(category: LogCategoryType, message: string, details?: LogDetails): void {
    this.log(LogLevel.ERROR, category, message, details);
  }
  
  public critical(category: LogCategoryType, message: string, details?: LogDetails): void {
    this.log(LogLevel.CRITICAL, category, message, details);
  }
  
  public trace(category: LogCategoryType, message: string, details?: LogDetails): void {
    this.log(LogLevel.TRACE, category, message, details);
  }
  
  public getEntries(options: {
    level?: LogLevel;
    category?: LogCategoryType;
    search?: string;
    from?: number;
    to?: number;
  } = {}): LogEntry[] {
    return this.memoryTransport.filterEntries(options);
  }
  
  public clearEntries(): void {
    this.memoryTransport.clearEntries();
  }
}

export const logger = Logger.getInstance();
