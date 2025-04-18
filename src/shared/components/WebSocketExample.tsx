
import React, { useState } from 'react';
import { useWebSocket } from '@/shared/hooks/useWebSocket';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

export function WebSocketExample() {
  const [message, setMessage] = useState('');
  
  const { isConnected, lastMessage, send } = useWebSocket('wss://example.com/socket', {
    autoConnect: true,
    maxReconnectAttempts: 3,
    onMessage: (data) => {
      console.log('Received:', data);
    },
    onConnected: () => {
      console.log('Connected to WebSocket');
    },
    onDisconnected: () => {
      console.log('Disconnected from WebSocket');
    }
  });

  const handleSend = () => {
    if (message.trim()) {
      send(message);
      setMessage('');
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
      </div>
      
      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button onClick={handleSend} disabled={!isConnected}>
          Send
        </Button>
      </div>
      
      {lastMessage && (
        <div className="p-2 bg-secondary rounded">
          Last message: {lastMessage}
        </div>
      )}
    </div>
  );
}
