
import { useCallback } from 'react';
import { LogLevel, LogCategory, LogDetails } from '@/shared/types/core/logging.types';
import { logger } from '@/logging/logger.service';

/**
 * Custom hook for component-level logging
 * @param source The source of the log (usually component name)
 * @param defaultCategory The default category for logs
 * @returns Object with log methods
 */
export function useLogger(source: string, defaultCategory: LogCategory = LogCategory.UI) {
  const logWithSource = useCallback((level: LogLevel, message: string, options?: Partial<LogDetails>) => {
    const details: LogDetails = options ? { ...options, source } : { source };
    logger.log(level, defaultCategory, message, details);
  }, [source, defaultCategory]);

  return {
    debug: useCallback((message: string, options?: Partial<LogDetails>) => {
      logWithSource(LogLevel.DEBUG, message, options);
    }, [logWithSource]),
    
    info: useCallback((message: string, options?: Partial<LogDetails>) => {
      logWithSource(LogLevel.INFO, message, options);
    }, [logWithSource]),
    
    warn: useCallback((message: string, options?: Partial<LogDetails>) => {
      logWithSource(LogLevel.WARN, message, options);
    }, [logWithSource]),
    
    error: useCallback((message: string, options?: Partial<LogDetails>) => {
      logWithSource(LogLevel.ERROR, message, options);
    }, [logWithSource]),
    
    log: useCallback((level: LogLevel, message: string, options?: Partial<LogDetails>) => {
      logWithSource(level, message, options);
    }, [logWithSource]),
    
    withCategory: useCallback((category: LogCategory) => {
      return useLogger(source, category);
    }, [source])
  };
}
