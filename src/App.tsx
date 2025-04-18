
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./shared/ui/toaster";
import { TooltipProvider } from "./shared/ui/tooltip";
import { Toaster as Sonner } from "./shared/ui/sonner";
import { ThemeProvider } from "./shared/ui/theme-provider";
import { AppBootstrap } from "./AppBootstrap";
import { Routes } from "./router/Routes";
import { GlobalErrorBoundary } from "./shared/components/GlobalErrorBoundary";

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
      staleTime: 10000
    }
  }
});

export default function App() {
  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark">
          <TooltipProvider>
            <BrowserRouter>
              <AppBootstrap>
                <Routes />
              </AppBootstrap>
              <Toaster />
              <Sonner />
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}
