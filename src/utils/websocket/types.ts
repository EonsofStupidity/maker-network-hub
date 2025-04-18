
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

export interface WebSocketState {
  isConnecting: boolean;
  reconnectAttempts: number;
  socket: WebSocket | null;
}
