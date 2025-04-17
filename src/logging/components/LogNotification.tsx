
import React from 'react';
import { LogLevel, LogCategory, LogEntry } from '@/shared/types/core/logging.types';
import { cn } from '@/utils/cn';

interface LogNotificationProps {
  log: LogEntry;
  onClose?: () => void;
  className?: string;
}

export const LogNotification: React.FC<LogNotificationProps> = ({ 
  log, 
  onClose,
  className = '' 
}) => {
  // Get notification style based on log level
  const getNotificationStyle = () => {
    switch (log.level) {
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        return 'bg-red-900/80 border-red-500 text-red-50';
      case LogLevel.WARN:
        return 'bg-yellow-900/80 border-yellow-500 text-yellow-50';
      case LogLevel.INFO:
        return 'bg-blue-900/80 border-blue-500 text-blue-50';
      default:
        return 'bg-gray-900/80 border-gray-500 text-gray-50';
    }
  };

  return (
    <div className={cn(
      'flex flex-col rounded-lg border p-3 shadow-lg backdrop-blur transition-all',
      getNotificationStyle(),
      className
    )}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          {log.level === LogLevel.ERROR && (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-red-300">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path>
              <path d="M12 9v4"></path>
              <path d="M12 17h.01"></path>
            </svg>
          )}
          {log.level === LogLevel.WARN && (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-yellow-300">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          )}
          {log.level === LogLevel.INFO && (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-300">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          )}
          <span className="font-semibold">{log.category}</span>
        </div>
        
        {onClose && (
          <button onClick={onClose} className="text-current opacity-70 hover:opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
      
      <p className="mb-1">{log.message}</p>
      
      {log.details && Object.keys(log.details).length > 0 && (
        <div className="text-xs opacity-80 max-h-28 overflow-y-auto">
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(log.details, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="text-xs opacity-60 mt-1">
        {new Date(log.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
};
