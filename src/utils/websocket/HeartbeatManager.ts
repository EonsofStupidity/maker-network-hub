
import { logBridge } from '@/bridges/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';

export class HeartbeatManager {
  private pingTimer: number | null = null;
  private pongTimer: number | null = null;

  constructor(
    private readonly pingInterval: number,
    private readonly pingTimeout: number,
    private readonly onPingTimeout: () => void
  ) {}

  start(socket: WebSocket): void {
    this.stop();
    
    this.pingTimer = window.setInterval(() => {
      this.sendPing(socket);
    }, this.pingInterval);
  }

  private sendPing(socket: WebSocket): void {
    if (socket.readyState !== WebSocket.OPEN) {
      return;
    }
    
    try {
      socket.send('ping');
      
      this.pongTimer = window.setTimeout(() => {
        logBridge.warn(LogCategory.SYSTEM, 'WebSocket ping timeout, reconnecting');
        this.onPingTimeout();
      }, this.pingTimeout);
    } catch (error) {
      logBridge.error(LogCategory.SYSTEM, 'Error sending WebSocket ping', {
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  handlePong(): void {
    if (this.pongTimer !== null) {
      clearTimeout(this.pongTimer);
      this.pongTimer = null;
    }
  }

  stop(): void {
    if (this.pingTimer !== null) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
    
    if (this.pongTimer !== null) {
      clearTimeout(this.pongTimer);
      this.pongTimer = null;
    }
  }
}
