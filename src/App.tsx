
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppBootstrap from "./AppBootstrap";
import { Toaster } from "./shared/ui/toaster";
import { TooltipProvider } from "./shared/ui/tooltip";
import { Toaster as Sonner } from "./shared/ui/sonner";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppBootstrap>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<div className="p-8 text-center">
                <h1 className="text-3xl font-bold mb-4">App Loaded Successfully!</h1>
                <p className="text-lg mb-2">RBAC and logging systems have been initialized.</p>
                <p className="bg-muted p-2 rounded text-sm inline-block">Check console for logs.</p>
              </div>} />
              {/* Add your other routes here */}
            </Routes>
          </BrowserRouter>
        </AppBootstrap>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
