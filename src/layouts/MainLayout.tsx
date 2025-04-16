
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { logBridge } from "@/logging/bridge";
import { LogCategory } from "@/shared/types/core/logging.types";
import { useAuth } from "@/auth/hooks/useAuth";
import { MainNav } from "@/app/components/MainNav";
import { Footer } from "@/app/components/Footer";
import { useThemeStore } from "@/stores/theme.store";

export const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { isDark, primaryColor } = useThemeStore();
  
  useEffect(() => {
    // Log page navigation
    logBridge.info(LogCategory.UI, "Page navigation", {
      details: {
        path: location.pathname,
        userId: user?.id || "anonymous",
        theme: {
          isDark,
          primaryColor
        },
        timestamp: new Date().toISOString()
      }
    });
  }, [location.pathname, user, isDark, primaryColor]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainNav />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
