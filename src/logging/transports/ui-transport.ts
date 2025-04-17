
import { LogEntry, LogLevel, LogFilter } from '@/shared/types/core/logging.types';

export class UITransport {
  private subscribers: ((entry: LogEntry) => void)[] = [];
  private minLevel: LogLevel = LogLevel.INFO;

  setLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  log(entry: LogEntry): void {
    if (entry.level >= this.minLevel) {
      this.notifySubscribers(entry);
    }
  }

  subscribe(callback: (entry: LogEntry) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private notifySubscribers(entry: LogEntry): void {
    this.subscribers.forEach(callback => callback(entry));
  }

  clearSubscribers(): void {
    this.subscribers = [];
  }
}
