
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./shared/ui/toaster";
import { TooltipProvider } from "./shared/ui/tooltip";
import { Toaster as Sonner } from "./shared/ui/sonner";
import { AuthProvider } from "./auth/context/AuthContext";
import { Routes } from "./router/Routes";
import { GlobalErrorBoundary } from "./shared/components/GlobalErrorBoundary";
import { AppBootstrap } from "./app/bootstrap/AppBootstrap";
import { ThemeProvider } from "./shared/ui/theme-provider";

// Configure Query Client with simpler settings focused on reliability
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 10000,
    },
  },
});

function App() {
  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark">
          <TooltipProvider>
            <AuthProvider>
              <BrowserRouter>
                <AppBootstrap />
                <Toaster />
                <Sonner />
                <Routes />
              </BrowserRouter>
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
