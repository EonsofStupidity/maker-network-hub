
import { useCallback } from 'react';
import { logBridge } from '../bridge';
import { LogCategory, LogLevel, LogDetails } from '@/shared/types/core/logging.types';
import { useAuthStore } from '@/auth/store/auth.store';

/**
 * Hook for component-scoped logging
 */
export function useLogger(source: string, defaultCategory: LogCategory = LogCategory.APP) {
  const user = useAuthStore(state => state.user);
  
  const debug = useCallback((message: string, details?: LogDetails) => {
    logBridge.debug(defaultCategory, message, {
      ...details,
      source,
      userId: user?.id
    });
  }, [defaultCategory, source, user]);
  
  const info = useCallback((message: string, details?: LogDetails) => {
    logBridge.info(defaultCategory, message, {
      ...details,
      source,
      userId: user?.id
    });
  }, [defaultCategory, source, user]);
  
  const warn = useCallback((message: string, details?: LogDetails) => {
    logBridge.warn(defaultCategory, message, {
      ...details,
      source,
      userId: user?.id
    });
  }, [defaultCategory, source, user]);
  
  const error = useCallback((message: string, details?: LogDetails) => {
    logBridge.error(defaultCategory, message, {
      ...details,
      source,
      userId: user?.id
    });
  }, [defaultCategory, source, user]);
  
  const critical = useCallback((message: string, details?: LogDetails) => {
    logBridge.critical(defaultCategory, message, {
      ...details,
      source,
      userId: user?.id
    });
  }, [defaultCategory, source, user]);
  
  const log = useCallback((level: LogLevel, message: string, details?: LogDetails) => {
    logBridge.log(level, defaultCategory, message, {
      ...details,
      source,
      userId: user?.id
    });
  }, [defaultCategory, source, user]);
  
  return {
    debug,
    info,
    warn,
    error,
    critical,
    log
  };
}

export default useLogger;
