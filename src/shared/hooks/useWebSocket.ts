
import { useEffect, useCallback, useState, useRef } from 'react';
import { WebSocketManager } from '@/utils/WebSocketManager';
import { WebSocketOptions } from '@/utils/websocket/types';
import { logBridge } from '@/bridges/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';

export interface UseWebSocketOptions extends Omit<WebSocketOptions, 'onMessage' | 'onOpen' | 'onClose' | 'onError'> {
  onMessage?: (data: any) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (error: Event) => void;
}

export function useWebSocket(url: string, options: Partial<UseWebSocketOptions> = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const webSocketRef = useRef<WebSocketManager | null>(null);

  const connect = useCallback(() => {
    if (webSocketRef.current) return;

    const wsOptions: WebSocketOptions = {
      url,
      protocols: options.protocols,
      autoConnect: options.autoConnect,
      maxReconnectAttempts: options.maxReconnectAttempts,
      reconnectInterval: options.reconnectInterval,
      pingInterval: options.pingInterval,
      pingTimeout: options.pingTimeout,
      onOpen: () => {
        setIsConnected(true);
        options.onConnected?.();
      },
      onClose: () => {
        setIsConnected(false);
        options.onDisconnected?.();
      },
      onMessage: (event: MessageEvent) => {
        const data = event.data;
        setLastMessage(data);
        options.onMessage?.(data);
      },
      onError: (event: Event) => {
        options.onError?.(event);
        logBridge.error(LogCategory.SYSTEM, 'WebSocket error in component', {
          url,
          error: event instanceof Error ? event.message : 'Unknown error'
        });
      }
    };

    webSocketRef.current = new WebSocketManager(wsOptions);
  }, [url, options]);

  const disconnect = useCallback(() => {
    if (!webSocketRef.current) return;
    
    webSocketRef.current.close();
    webSocketRef.current = null;
    setIsConnected(false);
  }, []);

  const send = useCallback((data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
    if (!webSocketRef.current) {
      logBridge.warn(LogCategory.SYSTEM, 'Attempted to send message without active connection');
      return false;
    }
    return webSocketRef.current.send(data);
  }, []);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    lastMessage,
    send,
    connect,
    disconnect
  };
}
