
import { supabase } from '@/integrations/supabase/client';
import { LogCategory, LogLevel } from '@/shared/types/core/logging.types';

// Example function with the error
export async function logToDatabase(level: LogLevel, category: LogCategory, message: string, details?: any) {
  try {
    const response = await supabase
      .from('application_logs')
      .insert({
        level,
        category,
        message,
        details: details || {}
      })
      .select('id');
      
    if (response.error) {
      console.error('Failed to log to database:', response.error.message || 'Unknown error');
    }
    
    return true;
  } catch (err) {
    console.error('Logging error:', err instanceof Error ? err.message : String(err));
    return false;
  }
}

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
      
      // Log to database if not in development mode
      if (process.env.NODE_ENV !== 'development') {
        logToDatabase(level, category, message, details).catch(console.error);
      }
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
    
    if (filter?.from) {
      filtered = filtered.filter(entry => entry.timestamp >= filter.from);
    }
    
    if (filter?.to) {
      filtered = filtered.filter(entry => entry.timestamp <= filter.to);
    }
    
    return filtered;
  },
  
  clearEntries: () => {
    logEntries.length = 0;
  }
};

// Export other functions as needed
