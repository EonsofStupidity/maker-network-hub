
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./shared/ui/toaster";
import { TooltipProvider } from "./shared/ui/tooltip";
import { Toaster as Sonner } from "./shared/ui/sonner";
import { AuthProvider } from "./auth/context/AuthContext";
import { Routes } from "./router/Routes";
import { GlobalErrorBoundary } from "./shared/components/GlobalErrorBoundary";
import { AppBootstrap } from "./AppBootstrap";
import { ThemeProvider } from "./shared/ui/theme-provider";

// Configure Query Client with robust error handling and retry settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (typeof error === 'object' && error !== null && 'status' in error) {
          return (error as { status: number }).status >= 500 && failureCount < 2;
        }
        return failureCount < 2;
      },
      staleTime: 10000,
      meta: {
        errorHandler: (error: unknown) => {
          console.error('Query error:', error);
        }
      }
    },
    mutations: {
      retry: false,
      meta: {
        errorHandler: (error: unknown) => {
          console.error('Mutation error:', error);
        }
      }
    }
  },
});

function App() {
  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark">
          <TooltipProvider>
            <BrowserRouter>
              <AuthProvider>
                <AppBootstrap>
                  <Routes />
                </AppBootstrap>
                <Toaster />
                <Sonner />
              </AuthProvider>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
