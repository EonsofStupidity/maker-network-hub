
import { 
  LogLevel, 
  LogCategory, 
  LogDetails, 
  LogEntry 
} from '@/shared/types/core/logging.types';
import { ConsoleTransport } from './transports/console-transport';

type LogTransport = {
  log: (entry: LogEntry) => void;
};

type LogSubscriber = {
  callback: (entry: LogEntry) => void;
  filter?: { level?: LogLevel; category?: LogCategory };
};

export interface LoggerConfig {
  minLevel?: LogLevel;
  transports?: LogTransport[];
  defaultSource?: string;
}

class Logger {
  private transports: LogTransport[] = [];
  private subscribers: LogSubscriber[] = [];
  private minLevel: LogLevel = LogLevel.DEBUG;
  private defaultSource: string = 'app';
  
  constructor(config?: LoggerConfig) {
    this.minLevel = config?.minLevel ?? LogLevel.DEBUG;
    this.transports = config?.transports ?? [new ConsoleTransport()];
    this.defaultSource = config?.defaultSource ?? 'app';
  }

  public subscribe(callback: (entry: LogEntry) => void, filter?: { level?: LogLevel; category?: LogCategory }): () => void {
    const subscriber: LogSubscriber = { callback, filter };
    this.subscribers.push(subscriber);
    
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== subscriber);
    };
  }
  
  public log(level: LogLevel, category: LogCategory, message: string, details?: LogDetails): void {
    // Skip logs below minimum level
    if (level < this.minLevel) return;
    
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      details,
      source: details?.source as string || this.defaultSource,
    };
    
    // Send to transports
    this.transports.forEach(transport => {
      try {
        transport.log(entry);
      } catch (error) {
        console.error('Error in log transport:', error);
      }
    });
    
    // Notify subscribers
    this.subscribers.forEach(subscriber => {
      try {
        // Apply filters
        if (subscriber.filter) {
          if (subscriber.filter.level !== undefined && level < subscriber.filter.level) {
            return;
          }
          
          if (subscriber.filter.category !== undefined && category !== subscriber.filter.category) {
            return;
          }
        }
        
        subscriber.callback(entry);
      } catch (error) {
        console.error('Error in log subscriber:', error);
      }
    });
  }

  public debug(category: LogCategory, message: string, details?: LogDetails): void {
    this.log(LogLevel.DEBUG, category, message, details);
  }

  public info(category: LogCategory, message: string, details?: LogDetails): void {
    this.log(LogLevel.INFO, category, message, details);
  }

  public warn(category: LogCategory, message: string, details?: LogDetails): void {
    this.log(LogLevel.WARN, category, message, details);
  }

  public error(category: LogCategory, message: string, details?: LogDetails): void {
    this.log(LogLevel.ERROR, category, message, details);
  }

  public critical(category: LogCategory, message: string, details?: LogDetails): void {
    this.log(LogLevel.CRITICAL, category, message, details);
  }
}

export const logger = new Logger();
