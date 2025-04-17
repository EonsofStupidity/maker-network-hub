
import React, { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./shared/ui/toaster";
import { TooltipProvider } from "./shared/ui/tooltip";
import { Toaster as Sonner } from "./shared/ui/sonner";
import { AuthProvider } from "./auth/context/AuthContext";
import Routes from "./router/Routes";
import { GlobalErrorBoundary } from "./shared/components/GlobalErrorBoundary";
import { AppProvider } from "./app/context/AppContext";
import AppBootstrap from "./AppBootstrap";

// Configure Query Client with simpler settings focused on reliability
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 10000,
      gcTime: 5 * 60 * 1000,
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
              <Toaster />
              <Sonner />
              <AppBootstrap>
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
