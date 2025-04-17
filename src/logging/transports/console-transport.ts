
import { LogEntry, LogLevel, LogCategory } from '@/shared/types/core/logging.types';

// Define log level css styles
const LOG_LEVEL_STYLES = {
  [LogLevel.DEBUG]: 'color: #6b7280;',
  [LogLevel.INFO]: 'color: #60a5fa;',
  [LogLevel.WARN]: 'color: #fbbf24; font-weight: bold;',
  [LogLevel.ERROR]: 'color: #ef4444; font-weight: bold;',
  [LogLevel.CRITICAL]: 'color: #dc2626; font-weight: bold; font-size: 1.1em;'
};

// Export the console transport
export class ConsoleTransport {
  constructor(private options = { collapsed: true }) {}

  log(entry: LogEntry): void {
    const { timestamp, level, category, message, details, source } = entry;
    
    // Format the timestamp
    const time = new Date(timestamp).toLocaleTimeString();
    
    // Get the style for the log level
    const levelStyle = LOG_LEVEL_STYLES[level] || '';
    
    // Convert level to label
    const levelLabel = this.getLevelLabel(level);
    
    // Format the message
    const formattedMessage = `%c${levelLabel}%c [${category}] ${message}`;
    
    // Create the console arguments
    const consoleArgs = [
      formattedMessage,
      levelStyle,
      'color: inherit;',
    ];
    
    // Add source if available
    const logDetails = { ...details };
    if (source && (!details || !('source' in details))) {
      logDetails.source = source;
    }
    
    // Log to console with appropriate level
    switch (level) {
      case LogLevel.DEBUG:
        if (this.options.collapsed && details) {
          console.groupCollapsed(formattedMessage, levelStyle, 'color: inherit;');
          console.log(`Time: ${time}`);
          if (source) console.log(`Source: ${source}`);
          if (details) console.dir(details);
          console.groupEnd();
        } else {
          console.debug(...consoleArgs, details ? details : '');
        }
        break;
      case LogLevel.INFO:
        if (this.options.collapsed && details) {
          console.groupCollapsed(formattedMessage, levelStyle, 'color: inherit;');
          console.log(`Time: ${time}`);
          if (source) console.log(`Source: ${source}`);
          if (details) console.dir(details);
          console.groupEnd();
        } else {
          console.info(...consoleArgs, details ? details : '');
        }
        break;
      case LogLevel.WARN:
        if (this.options.collapsed && details) {
          console.groupCollapsed(formattedMessage, levelStyle, 'color: inherit;');
          console.log(`Time: ${time}`);
          if (source) console.log(`Source: ${source}`);
          if (details) console.dir(details);
          console.groupEnd();
        } else {
          console.warn(...consoleArgs, details ? details : '');
        }
        break;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        if (this.options.collapsed && details) {
          console.groupCollapsed(formattedMessage, levelStyle, 'color: inherit;');
          console.log(`Time: ${time}`);
          if (source) console.log(`Source: ${source}`);
          if (details) console.dir(details);
          console.groupEnd();
        } else {
          console.error(...consoleArgs, details ? details : '');
        }
        break;
      default:
        if (this.options.collapsed && details) {
          console.groupCollapsed(formattedMessage, levelStyle, 'color: inherit;');
          console.log(`Time: ${time}`);
          if (source) console.log(`Source: ${source}`);
          if (details) console.dir(details);
          console.groupEnd();
        } else {
          console.log(...consoleArgs, details ? details : '');
        }
    }
  }
  
  // Helper to convert log level to human-readable label
  private getLevelLabel(level: LogLevel): string {
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
        return 'CRITICAL';
      default:
        return 'LOG';
    }
  }
}
