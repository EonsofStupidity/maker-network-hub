import React, { createContext, useState, useCallback } from 'react';
import { LogEntry, LogFilter } from '@/shared/types/core/logging.types';

interface LoggingContextType {
  entries: LogEntry[];
  addEntry: (entry: LogEntry) => void;
  clearEntries: () => void;
  setFilter: (filter: LogFilter | null) => void;
  filter: LogFilter | null;
}

export const LoggingContext = createContext<LoggingContextType>({
  entries: [],
  addEntry: () => {},
  clearEntries: () => {},
  setFilter: () => {},
  filter: null
});

export function LoggingProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [filter, setFilterState] = useState<LogFilter | null>(null);

  const addEntry = useCallback((entry: LogEntry) => {
    if (!entry.source) {
      entry.source = 'unknown';
    }
    setEntries(prev => [...prev, entry]);
  }, []);

  const clearEntries = useCallback(() => {
    setEntries([]);
  }, []);

  const setFilter = useCallback((filter: LogFilter | null) => {
    setFilterState(filter);
  }, []);

  const value: LoggingContextType = {
    entries,
    addEntry,
    clearEntries,
    setFilter,
    filter
  };

  return (
    <LoggingContext.Provider value={value}>
      {children}
    </LoggingContext.Provider>
  );
}
