
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppBootstrap from "./AppBootstrap";
import { Toaster } from "./shared/ui/toaster";
import { TooltipProvider } from "./shared/ui/tooltip";
import { Toaster as Sonner } from "./shared/ui/sonner";
import { PublicHome } from "./pages/public/Home";
import { AuthProvider } from "./auth/context/AuthContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AppBootstrap>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<PublicHome />} />
                <Route path="/auth" element={<div>Login Page</div>} />
                <Route path="/builds/explore" element={<div>Builds Explorer</div>} />
                <Route path="*" element={<div>Page Not Found</div>} />
              </Routes>
            </BrowserRouter>
          </AppBootstrap>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
