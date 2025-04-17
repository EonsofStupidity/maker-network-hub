
import React, { useState } from 'react';
import { CircuitBreaker } from '@/utils/CircuitBreaker';

const FloatingChatWrapper: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Initialize circuit breaker
  React.useEffect(() => {
    // Create a new instance of the circuit breaker
    const chatBreaker = new CircuitBreaker('floating-chat', {
      maxFailures: 5,
      resetTimeout: 1000
    });
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="w-80 h-96 bg-card rounded-lg shadow-lg border border-primary/20 flex flex-col">
          <div className="p-3 border-b border-primary/20 flex justify-between items-center">
            <h3 className="text-sm font-medium">Chat Support</h3>
            <button 
              className="text-muted-foreground hover:text-foreground" 
              onClick={toggleChat}
            >
              Close
            </button>
          </div>
          <div className="flex-grow p-3 overflow-y-auto">
            <div className="text-center text-muted-foreground text-sm">
              Chat functionality coming soon
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="bg-primary text-primary-foreground h-12 w-12 rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
        >
          <span className="sr-only">Open Chat</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      )}
    </div>
  );
};

export default FloatingChatWrapper;
