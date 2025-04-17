
import { LogCategory, LogLevel } from '../shared/types/SharedTypes';

// In-memory log storage
const logEntries: any[] = [];

// Set minimum log level
let minLogLevel: LogLevel = LogLevel.INFO;

export const logger = {
  log: (level: LogLevel, category: LogCategory, message: string, details?: any) => {
    // Only log if level is greater than or equal to minimum level
    if (level >= minLogLevel) {
      // Add to in-memory store
      logEntries.push({
        id: crypto.randomUUID(),
        level,
        category,
        message,
        timestamp: Date.now(),
        details: details || {},
        source: details?.source
      });
      
      // Log to console
      const consoleMethod = level === LogLevel.ERROR ? 'error' : 
                          level === LogLevel.WARN ? 'warn' : 
                          level === LogLevel.DEBUG ? 'debug' : 'log';
      console[consoleMethod](`[${category}] ${message}`, details);
    }
  },
  
  setLevel: (level: LogLevel) => {
    minLogLevel = level;
  },
  
  getEntries: (filter?: any) => {
    let filtered = [...logEntries];
    
    if (filter?.level !== undefined) {
      filtered = filtered.filter(entry => entry.level === filter.level);
    }
    
    if (filter?.category) {
      filtered = filtered.filter(entry => entry.category === filter.category);
    }
    
    if (filter?.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.message.toLowerCase().includes(searchLower) ||
        JSON.stringify(entry.details).toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  },
  
  clearEntries: () => {
    logEntries.length = 0;
  }
};
