
import { logBridge } from './bridge';
import { LogCategory } from '@/shared/types/core/logging.types';

/**
 * Initialize the logging system
 */
export function initializeLogging(): void {
  const startTime = performance.now();
  
  try {
    // Initialize the log bridge if not already initialized
    if (!logBridge.isInitialized) {
      logBridge.initialize();
      
      // Set up any global error handlers
      setupGlobalErrorHandlers();
      
      // Log successful initialization
      const duration = Math.round(performance.now() - startTime);
      logBridge.info(LogCategory.SYSTEM, 'Logging system initialized', {
        durationMs: duration
      });
    }
  } catch (error) {
    // Fallback to console if logBridge fails
    console.error('Failed to initialize logging system:', error);
  }
}

/**
 * Set up global error handlers to catch unhandled errors
 */
function setupGlobalErrorHandlers(): void {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logBridge.error(LogCategory.ERROR, 'Unhandled promise rejection', {
      reason: event.reason?.message || String(event.reason),
      stack: event.reason?.stack
    });
  });
  
  // Handle uncaught exceptions
  window.addEventListener('error', (event) => {
    logBridge.error(LogCategory.ERROR, 'Uncaught error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack
    });
  });
  
  // Log navigation events
  if (typeof window !== 'undefined') {
    window.addEventListener('popstate', () => {
      logBridge.info(LogCategory.SYSTEM, 'Navigation: popstate', {
        path: window.location.pathname
      });
    });
  }
  
  logBridge.info(LogCategory.SYSTEM, 'Global error handlers registered');
}

// Export the initialization function
export default initializeLogging;
