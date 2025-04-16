
import React from "react";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && 'status' in error && (error as any).status >= 400 && (error as any).status < 500) {
          return false;
        }
        // Retry up to 3 times on other errors
        return failureCount < 3;
      },
      staleTime: 30000,
    },
  },
});

function App() {
  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
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
        </TooltipProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
