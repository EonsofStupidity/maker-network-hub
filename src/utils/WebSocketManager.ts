import { CircuitBreaker } from './CircuitBreaker';
import { logBridge } from '@/bridges/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';
import { AppError } from './AppError';

export interface WebSocketOptions {
  url: string;
  protocols?: string | string[];
  autoConnect?: boolean;
  maxReconnectAttempts?: number;
  reconnectInterval?: number;
  pingInterval?: number;
  pingTimeout?: number;
  onMessage?: (event: MessageEvent) => void;
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
}

export class WebSocketManager {
  private socket: WebSocket | null = null;
  private url: string;
  private protocols?: string | string[];
  private autoConnect: boolean;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number;
  private reconnectInterval: number;
  private reconnectTimer: number | null = null;
  private pingInterval: number;
  private pingTimeout: number;
  private pingTimer: number | null = null;
  private pongTimer: number | null = null;
  private isConnecting: boolean = false;
  private circuitBreaker: CircuitBreaker;
  private messageListeners: ((event: MessageEvent) => void)[] = [];
  
  constructor(options: WebSocketOptions) {
    this.url = options.url;
    this.protocols = options.protocols;
    this.autoConnect = options.autoConnect ?? true;
    this.maxReconnectAttempts = options.maxReconnectAttempts ?? 5;
    this.reconnectInterval = options.reconnectInterval ?? 5000;
    this.pingInterval = options.pingInterval ?? 30000;
    this.pingTimeout = options.pingTimeout ?? 5000;
    
    if (options.onMessage) {
      this.messageListeners.push(options.onMessage);
    }
    
    this.onOpenHandler = this.onOpenHandler.bind(this);
    this.onCloseHandler = this.onCloseHandler.bind(this);
    this.onErrorHandler = this.onErrorHandler.bind(this);
    this.onMessageHandler = this.onMessageHandler.bind(this);
    
    this.externalOnOpen = options.onOpen;
    this.externalOnClose = options.onClose;
    this.externalOnError = options.onError;
    
    this.circuitBreaker = new CircuitBreaker(`ws-${new URL(this.url).hostname}`, {
      maxFailures: 3,
      resetTimeout: 15000,
      reconnectInterval: this.reconnectInterval
    });
    
    if (this.autoConnect) {
      this.connect();
    }
  }
  
  private externalOnOpen?: (event: Event) => void;
  private externalOnClose?: (event: CloseEvent) => void;
  private externalOnError?: (event: Event) => void;

  async connect(): Promise<boolean> {
    if (this.socket?.readyState === WebSocket.OPEN) {
      return true;
    }
    
    if (this.isConnecting) {
      return false;
    }
    
    this.isConnecting = true;
    
    try {
      const connected = await this.circuitBreaker.execute(
        async () => {
          return new Promise<boolean>((resolve, reject) => {
            try {
              logBridge.info(LogCategory.SYSTEM, `WebSocket connecting to ${this.url}`);
              
              this.socket = new WebSocket(this.url, this.protocols);
              
              const tempOnOpen = (event: Event) => {
                resolve(true);
              };
              
              const tempOnError = (event: Event) => {
                reject(new AppError.connection('WebSocket connection failed'));
              };
              
              this.socket.addEventListener('open', tempOnOpen, { once: true });
              this.socket.addEventListener('error', tempOnError, { once: true });
              
              this.socket.addEventListener('open', this.onOpenHandler);
              this.socket.addEventListener('close', this.onCloseHandler);
              this.socket.addEventListener('error', this.onErrorHandler);
              this.socket.addEventListener('message', this.onMessageHandler);
            } catch (err) {
              reject(AppError.fromUnknown(err, 'websocket'));
            }
          });
        },
        () => {
          logBridge.warn(LogCategory.SYSTEM, 'WebSocket circuit open, using fallback');
          return false;
        }
      );
      
      this.isConnecting = false;
      return connected;
    } catch (error) {
      this.isConnecting = false;
      logBridge.error(LogCategory.SYSTEM, 'WebSocket connection error', {
        error: error instanceof Error ? error.message : String(error),
        url: this.url
      });
      return false;
    }
  }
  
  private onOpenHandler(event: Event): void {
    this.reconnectAttempts = 0;
    logBridge.info(LogCategory.SYSTEM, 'WebSocket connection established', {
      url: this.url
    });
    
    this.startHeartbeat();
    
    if (this.externalOnOpen) {
      try {
        this.externalOnOpen(event);
      } catch (error) {
        logBridge.error(LogCategory.SYSTEM, 'Error in WebSocket onOpen handler', {
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
  }
  
  private onCloseHandler(event: CloseEvent): void {
    this.clearTimers();
    
    logBridge.info(LogCategory.SYSTEM, 'WebSocket connection closed', {
      code: event.code,
      reason: event.reason,
      wasClean: event.wasClean
    });
    
    if (event.code !== 1000 && this.autoConnect) {
      this.scheduleReconnect();
    }
    
    if (this.externalOnClose) {
      try {
        this.externalOnClose(event);
      } catch (error) {
        logBridge.error(LogCategory.SYSTEM, 'Error in WebSocket onClose handler', {
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
  }
  
  private onErrorHandler(event: Event): void {
    logBridge.error(LogCategory.SYSTEM, 'WebSocket error', {
      url: this.url
    });
    
    if (this.externalOnError) {
      try {
        this.externalOnError(event);
      } catch (error) {
        logBridge.error(LogCategory.SYSTEM, 'Error in WebSocket onError handler', {
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
  }
  
  private onMessageHandler(event: MessageEvent): void {
    if (typeof event.data === 'string' && event.data === 'pong') {
      this.handlePong();
      return;
    }
    
    for (const listener of this.messageListeners) {
      try {
        listener(event);
      } catch (error) {
        logBridge.error(LogCategory.SYSTEM, 'Error in WebSocket message listener', {
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
  }
  
  private scheduleReconnect(): void {
    if (this.reconnectTimer !== null) {
      return;
    }
    
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      logBridge.warn(LogCategory.SYSTEM, 'Maximum WebSocket reconnect attempts reached', {
        attempts: this.reconnectAttempts
      });
      return;
    }
    
    this.reconnectAttempts++;
    
    const delay = Math.min(
      this.reconnectInterval * Math.pow(1.5, this.reconnectAttempts - 1),
      60000
    );
    
    logBridge.info(LogCategory.SYSTEM, 'Scheduling WebSocket reconnect', {
      attempt: this.reconnectAttempts,
      delay
    });
    
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }
  
  private startHeartbeat(): void {
    this.clearTimers();
    
    this.pingTimer = window.setInterval(() => {
      this.sendPing();
    }, this.pingInterval);
  }
  
  private sendPing(): void {
    if (this.socket?.readyState !== WebSocket.OPEN) {
      return;
    }
    
    try {
      this.socket.send('ping');
      
      this.pongTimer = window.setTimeout(() => {
        logBridge.warn(LogCategory.SYSTEM, 'WebSocket ping timeout, reconnecting');
        this.close();
        this.connect();
      }, this.pingTimeout);
    } catch (error) {
      logBridge.error(LogCategory.SYSTEM, 'Error sending WebSocket ping', {
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  
  private handlePong(): void {
    if (this.pongTimer !== null) {
      clearTimeout(this.pongTimer);
      this.pongTimer = null;
    }
  }
  
  private clearTimers(): void {
    if (this.pingTimer !== null) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
    
    if (this.pongTimer !== null) {
      clearTimeout(this.pongTimer);
      this.pongTimer = null;
    }
    
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
  
  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): boolean {
    if (this.socket?.readyState !== WebSocket.OPEN) {
      logBridge.warn(LogCategory.SYSTEM, 'WebSocket not open, cannot send message');
      return false;
    }
    
    try {
      this.socket.send(data);
      return true;
    } catch (error) {
      logBridge.error(LogCategory.SYSTEM, 'Error sending WebSocket message', {
        error: error instanceof Error ? error.message : String(error)
      });
      return false;
    }
  }
  
  close(code?: number, reason?: string): void {
    this.clearTimers();
    
    if (this.socket) {
      try {
        this.socket.close(code, reason);
      } catch (error) {
        logBridge.error(LogCategory.SYSTEM, 'Error closing WebSocket', {
          error: error instanceof Error ? error.message : String(error)
        });
      }
      
      this.socket.removeEventListener('open', this.onOpenHandler);
      this.socket.removeEventListener('close', this.onCloseHandler);
      this.socket.removeEventListener('error', this.onErrorHandler);
      this.socket.removeEventListener('message', this.onMessageHandler);
      
      this.socket = null;
    }
  }
  
  getState(): number {
    return this.socket ? this.socket.readyState : -1;
  }
  
  addMessageListener(listener: (event: MessageEvent) => void): () => void {
    this.messageListeners.push(listener);
    
    return () => {
      this.messageListeners = this.messageListeners.filter(l => l !== listener);
    };
  }
  
  removeMessageListener(listener: (event: MessageEvent) => void): void {
    this.messageListeners = this.messageListeners.filter(l => l !== listener);
  }
}
