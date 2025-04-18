
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logBridge } from '@/bridges/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';
import { Button } from '@/shared/ui/button';
import { AppError } from '@/utils/AppError';

interface GlobalErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface GlobalErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class GlobalErrorBoundary extends Component<GlobalErrorBoundaryProps, GlobalErrorBoundaryState> {
  public state: GlobalErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): Partial<GlobalErrorBoundaryState> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Map to AppError for consistent error handling
    const appError = AppError.isAppError(error) ? error : AppError.fromUnknown(error);
    
    // Log the error to our logging system
    logBridge.error(LogCategory.SYSTEM, 'Unhandled application error', {
      details: { 
        message: appError.message,
        code: appError.code,
        stack: appError.stack,
        componentStack: errorInfo.componentStack,
        recoverable: appError.recoverable
      }
    });
    
    this.setState({ errorInfo });
    
    // Log to console for development
    console.error('Uncaught error:', error, errorInfo);
  }

  public render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full bg-card p-6 rounded-lg shadow-lg border border-destructive/20">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-destructive">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                  <line x1="12" x2="12" y1="9" y2="13"/>
                  <line x1="12" x2="12.01" y1="17" y2="17"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-foreground">Application Error</h2>
              <p className="text-muted-foreground">
                An unexpected error occurred. The application has been notified.
              </p>
              
              <div className="w-full p-2 bg-muted rounded-md overflow-auto mt-2 text-left">
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                  {error?.message || 'Unknown error'}
                </pre>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => window.location.reload()}
                  variant="default"
                >
                  Reload Application
                </Button>
                
                <Button
                  onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                  variant="outline"
                >
                  Try to Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default GlobalErrorBoundary;
