
import React, { createContext, useContext, useMemo, useEffect, useState } from "react";
import { Theme } from "@/shared/types/shared.types";
import { logger } from "@/logging/logger.service";
import { LogCategory } from "@/shared/types/shared.types";

export interface SiteThemeContextType {
  theme: Theme | null;
  isLoaded: boolean;
  componentStyles: Record<string, Record<string, string>> | null;
  animations: Record<string, string> | null;
  variables: Record<string, string> | null;
  themeError: Error | null;
}

// Create the context
export const SiteThemeContext = createContext<SiteThemeContextType | null>(null);

interface SiteThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
}

export function SiteThemeProvider({ children, defaultTheme = "impulsivity" }: SiteThemeProviderProps) {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [themeError, setThemeError] = useState<Error | null>(null);
  const [componentStyles, setComponentStyles] = useState<Record<string, Record<string, string>> | null>(null);
  const [animations, setAnimations] = useState<Record<string, string> | null>(null);
  const [cssVariables, setCssVariables] = useState<Record<string, string> | null>(null);

  // Mock theme store for now - we'll fix the real store in phase 2
  const themeStore = {
    themes: [],
    activeThemeId: null,
    setActiveTheme: (id: string) => {},
    isLoading: false,
    loadThemes: () => {}
  };

  // Prepare context value
  const contextValue = useMemo<SiteThemeContextType>(() => ({
    theme,
    isLoaded,
    componentStyles,
    animations,
    variables: cssVariables,
    themeError,
  }), [theme, isLoaded, componentStyles, animations, cssVariables, themeError]);

  return (
    <SiteThemeContext.Provider value={contextValue}>
      {children}
    </SiteThemeContext.Provider>
  );
}

// Hook to use the theme context
export function useSiteTheme() {
  const context = useContext(SiteThemeContext);
  if (!context) {
    throw new Error("useSiteTheme must be used within a SiteThemeProvider");
  }
  return context;
}
