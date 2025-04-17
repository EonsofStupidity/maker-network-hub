
import React, { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import AppBootstrap from "./AppBootstrap";
import { Toaster } from "./shared/ui/toaster";
import { TooltipProvider } from "./shared/ui/tooltip";
import { Toaster as Sonner } from "./shared/ui/sonner";
import { AuthProvider } from "./auth/context/AuthContext";
import Routes from "./router/Routes";
import { GlobalErrorBoundary } from "./shared/components/GlobalErrorBoundary";
import { AppProvider } from "./app/context/AppContext";

// Configure Query Client with more resilient settings and proper initialization
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Don't refetch when window gains focus
      refetchOnReconnect: true, // Refetch when reconnecting
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && 'status' in error && 
            (error as any).status >= 400 && (error as any).status < 500) {
          return false;
        }
        // Retry up to 3 times on other errors with exponential backoff
        return failureCount < 3;
      },
      staleTime: 30000, // Consider data fresh for 30s
      gcTime: 5 * 60 * 1000, // Cache for 5 minutes
    },
  },
});

function App() {
  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Suspense fallback={<div className="p-4">Loading application...</div>}>
            <AuthProvider>
              <AppProvider>
                <AppBootstrap>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Routes />
                  </BrowserRouter>
                </AppBootstrap>
              </AppProvider>
            </AuthProvider>
          </Suspense>
        </TooltipProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
