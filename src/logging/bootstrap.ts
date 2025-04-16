
import { LogLevel, LogCategory } from '@/shared/types/core/logging.types';
import { logger } from './logger.service';
import { logBridge } from './bridge';

/**
 * Initialize the logging system
 * This ensures all log transports are properly configured
 * and the logger is ready to receive log events
 */
export function initializeLogging(): void {
  console.log('Initializing logging system');
  
  // Set default log level based on environment
  const isDevelopment = import.meta.env.DEV;
  const defaultLogLevel = isDevelopment ? LogLevel.DEBUG : LogLevel.INFO;
  
  // Configure logger service
  logger.setLevel(defaultLogLevel);
  logger.enableCategories(Object.values(LogCategory));
  
  // Configure log bridge
  logBridge.setMinLevel(defaultLogLevel);
  logBridge.addTransport({
    log: (entry) => {
      // Route log entries to the appropriate console method
      switch (entry.level) {
        case LogLevel.DEBUG:
          console.debug(`[${entry.category}]`, entry.message, entry.details);
          break;
        case LogLevel.INFO:
          console.info(`[${entry.category}]`, entry.message, entry.details);
          break;
        case LogLevel.WARN:
          console.warn(`[${entry.category}]`, entry.message, entry.details);
          break;
        case LogLevel.ERROR:
        case LogLevel.CRITICAL:
        case LogLevel.FATAL:
          console.error(`[${entry.category}]`, entry.message, entry.details);
          break;
        default:
          console.log(`[${entry.category}]`, entry.message, entry.details);
      }
    },
    setMinLevel: (level) => {
      // No-op for console transport
    }
  });
  
  // Log initialization success
  logger.info(LogCategory.SYSTEM, 'Logging system initialized', {
    level: LogLevel[defaultLogLevel],
    isDevelopment
  });
  
  console.log('Logging system initialized');
}
