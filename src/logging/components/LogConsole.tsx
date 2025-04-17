import React, { useState, useEffect, useRef } from 'react';
import { LogLevel, LogCategory, LogEntry } from '@/shared/types/core/logging.types';
import { logBridge } from '@/logging/bridge';
import { cn } from '@/utils/cn';

interface LogConsoleProps {
  className?: string;
  maxHeight?: string;
  initialMaxEntries?: number;
  defaultCategory?: LogCategory;
}

export const LogConsole: React.FC<LogConsoleProps> = ({
  className = '',
  maxHeight = '300px',
  initialMaxEntries = 100,
  defaultCategory = LogCategory.DEBUG
}) => {
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [visibleEntries, setVisibleEntries] = useState<LogEntry[]>([]);
  const [maxEntries, setMaxEntries] = useState<number>(initialMaxEntries);
  const [filter, setFilter] = useState<string>('');
  const [levelFilter, setLevelFilter] = useState<LogLevel | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<LogCategory | null>(null);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Subscribe to logs
  useEffect(() => {
    const unsubscribe = logBridge.subscribe((event) => {
      setLogEntries(prev => {
        const newLogs = [...prev, event.entry];
        return newLogs.slice(-maxEntries);
      });
    });
    
    return () => {
      unsubscribe();
    };
  }, [maxEntries]);

  // Filter logs when filter changes
  useEffect(() => {
    setVisibleEntries(
      logEntries.filter(entry => {
        const matchesText = filter === '' || 
          entry.message.toLowerCase().includes(filter.toLowerCase()) ||
          JSON.stringify(entry.details || {}).toLowerCase().includes(filter.toLowerCase());
          
        const matchesLevel = levelFilter === null || entry.level >= levelFilter;
        const matchesCategory = categoryFilter === null || entry.category === categoryFilter;
        
        return matchesText && matchesLevel && matchesCategory;
      })
    );
  }, [logEntries, filter, levelFilter, categoryFilter]);
  
  // Auto-scroll to bottom
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleEntries, autoScroll]);

  // Get log level style
  const getLevelStyle = (level: LogLevel) => {
    switch (level) {
      case LogLevel.DEBUG:
        return 'text-blue-400';
      case LogLevel.INFO:
        return 'text-green-400';
      case LogLevel.WARN:
        return 'text-yellow-400';
      case LogLevel.ERROR:
        return 'text-red-400';
      case LogLevel.CRITICAL:
        return 'font-bold text-red-600';
      default:
        return 'text-gray-400';
    }
  };
  
  // Get log level label
  const getLevelLabel = (level: LogLevel) => {
    switch (level) {
      case LogLevel.DEBUG:
        return 'DEBUG';
      case LogLevel.INFO:
        return 'INFO';
      case LogLevel.WARN:
        return 'WARN';
      case LogLevel.ERROR:
        return 'ERROR';
      case LogLevel.CRITICAL:
        return 'CRIT';
      default:
        return 'LOG';
    }
  };

  return (
    <div className={cn('border border-gray-700 rounded bg-gray-900 text-gray-200 font-mono text-xs', className)}>
      <div className="flex items-center justify-between p-2 border-b border-gray-700">
        <div className="text-sm font-semibold">Log Console</div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter logs..."
            className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs"
          />
          
          <select
            value={levelFilter === null ? '' : levelFilter}
            onChange={(e) => setLevelFilter(e.target.value === '' ? null : Number(e.target.value) as LogLevel)}
            className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs"
          >
            <option value="">All Levels</option>
            <option value={LogLevel.DEBUG}>Debug+</option>
            <option value={LogLevel.INFO}>Info+</option>
            <option value={LogLevel.WARN}>Warn+</option>
            <option value={LogLevel.ERROR}>Error+</option>
            <option value={LogLevel.CRITICAL}>Critical</option>
          </select>
          
          <select
            value={categoryFilter || ''}
            onChange={(e) => setCategoryFilter(e.target.value === '' ? null : e.target.value as LogCategory)}
            className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs"
          >
            <option value="">All Categories</option>
            {Object.values(LogCategory).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          <button
            onClick={() => setLogEntries([])}
            className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs hover:bg-gray-700"
          >
            Clear
          </button>
          
          <label className="flex items-center space-x-1">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={() => setAutoScroll(!autoScroll)}
              className="form-checkbox h-3 w-3"
            />
            <span>Auto-scroll</span>
          </label>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="overflow-y-auto p-2"
        style={{ maxHeight }}
      >
        {visibleEntries.length === 0 ? (
          <div className="text-gray-500 italic">No logs to display</div>
        ) : (
          visibleEntries.map((entry, index) => (
            <div 
              key={`${entry.timestamp}-${index}`} 
              className="mb-1 border-b border-gray-800 pb-1 last:border-0"
            >
              <div className="flex">
                <span className="text-gray-500 mr-2">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </span>
                <span className={`w-12 ${getLevelStyle(entry.level)}`}>
                  {getLevelLabel(entry.level)}
                </span>
                <span className="text-purple-400 w-20">
                  {entry.category}
                </span>
                <span className="text-gray-100 flex-1">
                  {entry.message}
                </span>
              </div>
              
              {entry.details && Object.keys(entry.details).length > 0 && (
                <div className="pl-32 text-gray-400 whitespace-pre-wrap">
                  {JSON.stringify(entry.details, null, 2)}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
