
import React, { useState, useEffect } from 'react';
import { useWebSocket } from '@/shared/hooks/useWebSocket';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export function WebSocketExample() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [wsUrl] = useState('wss://demo.piesocket.com/v3/channel_123?api_key=VCXCEuvhGcBDP7XhiJJUDvR1e1D3eiVjgZ9VRiaV');
  
  const { isConnected, lastMessage, send, connect, disconnect } = useWebSocket(wsUrl, {
    autoConnect: true,
    maxReconnectAttempts: 3,
    onMessage: (data) => {
      console.log('Received:', data);
    },
    onConnected: () => {
      console.log('Connected to WebSocket');
      setError(null);
    },
    onDisconnected: () => {
      console.log('Disconnected from WebSocket');
    },
    onError: (event) => {
      console.error('WebSocket error:', event);
      setError('Failed to connect to WebSocket server. Please try again later.');
    }
  });

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  const handleSend = () => {
    if (message.trim()) {
      const success = send(message);
      if (success) {
        setMessage('');
      } else {
        setError('Failed to send message. Connection may be closed.');
      }
    }
  };

  const handleReconnect = () => {
    setError(null);
    connect();
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReconnect}
            className="mt-2"
          >
            Try Again
          </Button>
        </Alert>
      )}
      
      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={!isConnected}
        />
        <Button onClick={handleSend} disabled={!isConnected}>
          Send
        </Button>
      </div>
      
      {lastMessage && (
        <Alert variant="default" className="bg-secondary">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <AlertTitle>Last message received</AlertTitle>
          <AlertDescription className="font-mono text-sm">
            {typeof lastMessage === 'object' 
              ? JSON.stringify(lastMessage)
              : String(lastMessage)
            }
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
