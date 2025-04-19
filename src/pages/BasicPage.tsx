
import React from 'react';
import { Button } from '@/shared/ui/button';
import { RefreshCw } from 'lucide-react';

export function BasicPage() {
  return (
    <div className="container mx-auto p-4 mt-16">
      <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
        <h1 className="text-3xl font-bold mb-4">MakersIMPULSE</h1>
        <p className="text-lg mb-4 text-muted-foreground">
          The application is currently loading essential resources. If this takes longer than expected, you can try refreshing.
        </p>
        <div className="flex justify-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <Button 
            variant="outline"
            onClick={() => window.location.reload()}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Page
          </Button>
        </div>
      </div>
    </div>
  );
}

export default BasicPage;
