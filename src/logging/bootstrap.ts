import { LogLevel, LogCategory } from '@/shared/types/core/logging.types';
import { logger } from './logger.service';

/**
 * Initialize the logging system
 */
export function initializeLogging() {
  // Here we assume the logger service has a log method instead of info
  logger.log(LogLevel.INFO, LogCategory.SYSTEM, 'Logging system initialized');
  
  // Set up any global error handlers
  setupGlobalErrorHandlers();
}

/**
 * Set up global error handlers
 */
function setupGlobalErrorHandlers() {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logger.log(LogLevel.ERROR, LogCategory.ERROR, 'Unhandled promise rejection', {
      details: {
        reason: event.reason?.message || String(event.reason),
        stack: event.reason?.stack
      }
    });
  });
  
  // Handle uncaught exceptions
  window.addEventListener('error', (event) => {
    logger.log(LogLevel.ERROR, LogCategory.ERROR, 'Uncaught error', {
      details: {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      }
    });
  });
}
