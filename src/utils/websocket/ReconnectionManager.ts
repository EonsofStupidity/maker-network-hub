
import { logBridge } from '@/bridges/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';

export class ReconnectionManager {
  private reconnectTimer: number | null = null;
  private attempts: number = 0;
  private readonly maxAttempts: number;
  private readonly baseInterval: number;
  private readonly onReconnect: () => void;

  constructor(maxAttempts: number, baseInterval: number, onReconnect: () => void) {
    this.maxAttempts = maxAttempts;
    this.baseInterval = baseInterval;
    this.onReconnect = onReconnect;
  }

  scheduleReconnect(): void {
    if (this.reconnectTimer !== null || this.attempts >= this.maxAttempts) {
      return;
    }

    this.attempts++;
    
    const delay = Math.min(
      this.baseInterval * Math.pow(1.5, this.attempts - 1),
      60000
    );
    
    logBridge.info(LogCategory.SYSTEM, 'Scheduling WebSocket reconnect', {
      attempt: this.attempts,
      delay
    });
    
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null;
      this.onReconnect();
    }, delay);
  }

  reset(): void {
    this.attempts = 0;
  }

  stop(): void {
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  getAttempts(): number {
    return this.attempts;
  }
}
