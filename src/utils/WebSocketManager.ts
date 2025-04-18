
import { CircuitBreaker } from './CircuitBreaker';
import { logBridge } from '@/bridges/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';
import { AppError } from './AppError';
import { HeartbeatManager } from './websocket/HeartbeatManager';
import { ReconnectionManager } from './websocket/ReconnectionManager';
import { WebSocketOptions } from './websocket/types';

export class WebSocketManager {
  private socket: WebSocket | null = null;
  private isConnecting: boolean = false;
  private messageListeners: ((event: MessageEvent) => void)[] = [];
  private readonly heartbeatManager: HeartbeatManager;
  private readonly reconnectionManager: ReconnectionManager;
  private readonly circuitBreaker: CircuitBreaker;

  constructor(private readonly options: WebSocketOptions) {
    this.heartbeatManager = new HeartbeatManager(
      options.pingInterval ?? 30000,
      options.pingTimeout ?? 5000,
      () => {
        this.close();
        this.connect();
      }
    );

    this.reconnectionManager = new ReconnectionManager(
      options.maxReconnectAttempts ?? 5,
      options.reconnectInterval ?? 5000,
      () => this.connect()
    );

    this.circuitBreaker = new CircuitBreaker(`ws-${new URL(this.options.url).hostname}`, {
      maxFailures: 3,
      resetTimeout: 15000,
      reconnectInterval: this.options.reconnectInterval
    });

    if (options.onMessage) {
      this.messageListeners.push(options.onMessage);
    }

    if (options.autoConnect ?? true) {
      this.connect();
    }
  }

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
          return this.createWebSocketConnection();
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
        url: this.options.url
      });
      return false;
    }
  }

  private createWebSocketConnection(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      try {
        logBridge.info(LogCategory.SYSTEM, `WebSocket connecting to ${this.options.url}`);
        
        // Check if we're in a browser environment with WebSocket support
        if (typeof window === 'undefined' || !('WebSocket' in window)) {
          throw new AppError.connection('WebSocket not supported in this environment');
        }
        
        const WebSocketConstructor: typeof WebSocket = window.WebSocket;
        this.socket = new WebSocketConstructor(this.options.url, this.options.protocols);
        
        if (!this.socket) {
          throw new AppError.connection('Failed to create WebSocket instance');
        }

        const onOpen = (event: Event) => {
          this.handleOpen(event);
          resolve(true);
        };
        
        const onError = (event: Event) => {
          reject(new AppError.connection('WebSocket connection failed'));
        };
        
        this.socket.addEventListener('open', onOpen, { once: true });
        this.socket.addEventListener('error', onError, { once: true });
        
        this.socket.addEventListener('close', this.handleClose.bind(this));
        this.socket.addEventListener('error', this.handleError.bind(this));
        this.socket.addEventListener('message', this.handleMessage.bind(this));
      } catch (err) {
        reject(AppError.fromUnknown(err, 'websocket'));
      }
    });
  }

  private handleOpen(event: Event): void {
    this.reconnectionManager.reset();
    logBridge.info(LogCategory.SYSTEM, 'WebSocket connection established', {
      url: this.options.url
    });
    
    this.heartbeatManager.start(this.socket!);
    
    if (this.options.onOpen) {
      try {
        this.options.onOpen(event);
      } catch (error) {
        logBridge.error(LogCategory.SYSTEM, 'Error in WebSocket onOpen handler', {
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
  }

  private handleClose(event: CloseEvent): void {
    this.heartbeatManager.stop();
    
    logBridge.info(LogCategory.SYSTEM, 'WebSocket connection closed', {
      code: event.code,
      reason: event.reason,
      wasClean: event.wasClean
    });
    
    if (event.code !== 1000 && (this.options.autoConnect ?? true)) {
      this.reconnectionManager.scheduleReconnect();
    }
    
    if (this.options.onClose) {
      try {
        this.options.onClose(event);
      } catch (error) {
        logBridge.error(LogCategory.SYSTEM, 'Error in WebSocket onClose handler', {
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
  }

  private handleError(event: Event): void {
    logBridge.error(LogCategory.SYSTEM, 'WebSocket error', {
      url: this.options.url
    });
    
    if (this.options.onError) {
      try {
        this.options.onError(event);
      } catch (error) {
        logBridge.error(LogCategory.SYSTEM, 'Error in WebSocket onError handler', {
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
  }

  private handleMessage(event: MessageEvent): void {
    if (typeof event.data === 'string' && event.data === 'pong') {
      this.heartbeatManager.handlePong();
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
    this.heartbeatManager.stop();
    this.reconnectionManager.stop();
    
    if (this.socket) {
      try {
        this.socket.close(code, reason);
      } catch (error) {
        logBridge.error(LogCategory.SYSTEM, 'Error closing WebSocket', {
          error: error instanceof Error ? error.message : String(error)
        });
      }
      
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
