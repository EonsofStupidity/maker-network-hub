import { LogEntry, LogLevel, LogFilter, LOG_LEVEL_VALUES } from '@/shared/types/core/logging.types';

/**
 * In-memory transport for storing and retrieving logs
 */
export class MemoryTransport {
  private logs: LogEntry[] = [];
  private minLevel: LogLevel = LogLevel.INFO;

  constructor(options: { maxEntries?: number } = {}) {
    this.maxEntries = options.maxEntries || 1000;
  }

  private maxEntries: number;

  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  log(entry: LogEntry): void {
    if (this.shouldSkipLog(entry.level)) {
      return;
    }

    this.logs.push(entry);

    if (this.logs.length > this.maxEntries) {
      this.logs = this.logs.slice(this.logs.length - this.maxEntries);
    }
  }

  private shouldSkipLog(level: LogLevel): boolean {
    return LOG_LEVEL_VALUES[level] < LOG_LEVEL_VALUES[this.minLevel];
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  getFilteredLogs(filter: LogFilter = {}): LogEntry[] {
    return this.logs.filter((entry) => {
      if (filter.levels && !filter.levels.includes(entry.level)) {
        return false;
      }

      if (filter.categories && !filter.categories.includes(entry.category)) {
        return false;
      }

      const entryTime = new Date(entry.timestamp).getTime();
      
      if (filter.from && entryTime < filter.from.getTime()) {
        return false;
      }

      if (filter.to && entryTime > filter.to.getTime()) {
        return false;
      }

      if (filter.search) {
        const searchTerm = filter.search.toLowerCase();
        return (
          entry.message.toLowerCase().includes(searchTerm) ||
          (entry.source && entry.source.toLowerCase().includes(searchTerm))
        );
      }

      return true;
    });
  }

  clear(): void {
    this.logs = [];
  }
}
