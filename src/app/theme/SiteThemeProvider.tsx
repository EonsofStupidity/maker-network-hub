import React, { createContext, useContext, useMemo, useEffect, useState } from "react";
import { Theme } from "@/shared/types/shared.types";
import { logger } from "@/logging/logger.service";
import { LogCategory, LogLevel } from "@/shared/types/shared.types";
import { supabase } from '@/integrations/supabase/client';

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

  // Load theme data from Supabase
  useEffect(() => {
    const loadThemeData = async () => {
      try {
        // Fetch active theme
        const { data: themeData, error: themeError } = await supabase
          .from('themes')
          .select('*')
          .eq('id', defaultTheme)
          .single();
          
        if (themeError) {
          throw new Error(`Failed to load theme: ${themeError.message}`);
        }
        
        if (!themeData) {
          throw new Error(`Theme not found: ${defaultTheme}`);
        }
        
        // Fetch component styles for this theme
        const { data: stylesData, error: stylesError } = await supabase
          .from('theme_component_styles')
          .select('*')
          .eq('theme_id', themeData.id);
          
        if (stylesError) {
          throw new Error(`Failed to load component styles: ${stylesError.message}`);
        }
        
        // Fetch animations for this theme
        const { data: animationsData, error: animationsError } = await supabase
          .from('theme_animations')
          .select('*')
          .eq('theme_id', themeData.id);
          
        if (animationsError) {
          throw new Error(`Failed to load animations: ${animationsError.message}`);
        }
        
        // Transform the data into the expected format
        setTheme(themeData as Theme);
        
        // Transform component styles
        const stylesByComponent: Record<string, Record<string, string>> = {};
        stylesData?.forEach(style => {
          if (!stylesByComponent[style.component_name]) {
            stylesByComponent[style.component_name] = {};
          }
          stylesByComponent[style.component_name][style.style_key] = style.style_value;
        });
        setComponentStyles(stylesByComponent);
        
        // Transform animations
        const animationMap: Record<string, string> = {};
        animationsData?.forEach(anim => {
          animationMap[anim.name] = anim.value;
        });
        setAnimations(animationMap);
        
        // Set CSS variables from theme data
        setCssVariables(themeData.variables || {});
        
        setIsLoaded(true);
        logger.log(LogLevel.INFO, LogCategory.UI, 'Theme loaded successfully', { themeId: themeData.id });
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setThemeError(error);
        logger.log(LogLevel.ERROR, LogCategory.UI, 'Theme loading failed', { error: error.message });
        
        // Set isLoaded to true even on error to avoid perpetual loading state
        setIsLoaded(true);
      }
    };
    
    loadThemeData();
  }, [defaultTheme]);

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
