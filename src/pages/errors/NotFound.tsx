
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { logBridge } from '@/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';

const NotFound: React.FC = () => {
  React.useEffect(() => {
    // Log 404 errors for analysis
    logBridge.warn(LogCategory.UI, '404 page not found', {
      details: {
        path: window.location.pathname,
        referrer: document.referrer,
        timestamp: new Date().toISOString()
      }
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
      <div className="relative mb-6">
        <h1 className="text-9xl font-bold text-primary/20">404</h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl md:text-2xl font-semibold">Page Not Found</span>
        </div>
      </div>
      
      <p className="text-lg text-muted-foreground max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <div className="flex flex-wrap gap-4 justify-center">
        <Button asChild>
          <Link to="/">Return Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/builds/explore">Explore Builds</Link>
        </Button>
      </div>
      
      <div className="mt-12 border-t border-border pt-6 w-full max-w-md">
        <p className="text-sm text-muted-foreground">
          If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
