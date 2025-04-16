
import React from 'react';
import { Button } from '@/shared/ui/button';

interface DevChatPageProps {
  mode: 'normal' | 'dev' | 'debug';
}

const DevChatPage: React.FC<DevChatPageProps> = ({ mode }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Dev Chat ({mode} mode)</h1>
      <p className="mb-4">This is a placeholder for the Dev Chat functionality.</p>
      
      <div className="flex space-x-4 mb-4">
        <Button variant="outline" onClick={() => window.history.back()}>
          Back
        </Button>
        
        {mode !== 'normal' && (
          <Button variant="outline" onClick={() => window.location.href = '/chat'}>
            Switch to Normal Mode
          </Button>
        )}
        
        {mode !== 'dev' && (
          <Button variant="outline" onClick={() => window.location.href = '/chat/dev'}>
            Switch to Dev Mode
          </Button>
        )}
        
        {mode !== 'debug' && (
          <Button variant="outline" onClick={() => window.location.href = '/chat/debug'}>
            Switch to Debug Mode
          </Button>
        )}
      </div>
      
      <div className="border rounded-lg p-4">
        <p>Current mode: <strong>{mode}</strong></p>
      </div>
    </div>
  );
};

export default DevChatPage;
