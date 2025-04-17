
import { LogLevel, LogCategory, LogDetails, LogEntry } from '@/shared/types/core/logging.types';
import { MemoryTransport } from './transports/memory-transport';

class Logger {
  private minLevel: LogLevel = LogLevel.INFO;
  private transports: { log: (entry: LogEntry) => void }[] = [new MemoryTransport()];

  setLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  log(level: LogLevel, category: LogCategory, message: string, details?: LogDetails): void {
    if (level < this.minLevel) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      details
    };

    this.transports.forEach(transport => {
      try {
        transport.log(entry);
      } catch (error) {
        console.error('Error in log transport:', error);
      }
    });
  }
}

export const logger = new Logger();
