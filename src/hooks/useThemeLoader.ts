
import { useState, useCallback, useEffect } from 'react';
import { useThemeStore } from '@/stores/theme.store';
import { useThemeFallback } from './useThemeFallback';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/core/logging.types';
import { Theme } from '@/shared/types/core/theme.types';
import { logBridge } from '@/logging/bridge';

interface ThemeLoaderResult {
  isLoading: boolean;
  error: Error | null;
  loadTheme: (themeName?: string) => Promise<void>;
  applyTheme: (themeName?: string) => Promise<boolean>;
}

export function useThemeLoader(): ThemeLoaderResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const setThemes = useThemeStore(state => state.setThemes);
  const setActiveTheme = useThemeStore(state => state.setActiveTheme);
  const { getFallbackTheme, isLoading: isFallbackLoading } = useThemeFallback();
  const logger = useLogger('useThemeLoader', LogCategory.THEME);

  // Function to load a theme from either the primary source or fallbacks
  const loadTheme = useCallback(async (themeName = 'Impulsivity') => {
    if (isLoading) {
      logger.debug('Theme loading already in progress');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      logger.debug(`Loading theme: ${themeName}`);
      
      // Try to get the theme from Supabase first
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const themeServiceUrl = `${supabaseUrl}/functions/v1/theme-service`;
      
      let theme: Theme | null = null;
      
      try {
        // Try to fetch from theme-service
        const response = await fetch(themeServiceUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            operation: 'get-theme',
            themeId: themeName,
            isDefault: true,
            context: 'site'
          })
        });
        
        if (!response.ok) {
          throw new Error(`Theme service error: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        if (!data.theme) {
          throw new Error('No theme found');
        }
        
        // Map the theme data from Supabase to our frontend theme format
        theme = {
          id: data.theme.id,
          name: data.theme.name,
          label: data.theme.name,
          description: data.theme.description || '',
          isDark: true, // Assume true for now
          status: data.theme.status,
          context: data.theme.context,
          variables: {
            primary: data.theme.design_tokens?.colors?.primary || '#00F0FF',
            secondary: data.theme.design_tokens?.colors?.secondary || '#FF2D6E',
            background: data.theme.design_tokens?.colors?.background || '#080F1E',
            foreground: data.theme.design_tokens?.colors?.foreground || '#F9FAFB'
          },
          designTokens: data.theme.design_tokens,
          componentTokens: data.theme.component_tokens,
          metadata: {
            source: 'supabase',
            version: data.theme.version,
          }
        };
        
        logger.info('Successfully loaded theme from Supabase', { themeName });
      } catch (primaryError) {
        // Primary source failed, try fallback
        logger.warn('Failed to fetch from primary source, using fallback', { 
          error: primaryError instanceof Error ? primaryError.message : String(primaryError) 
        });
        
        // Get fallback theme
        theme = await getFallbackTheme(themeName);
        
        if (!theme) {
          throw new Error('Failed to load theme from any source');
        }
        
        logger.info('Successfully loaded theme from fallback source', { 
          themeName,
          source: theme.metadata?.source
        });
      }
      
      // Now that we have a theme from either source, apply it
      setThemes([theme]);
      setActiveTheme(theme.id);
      
      localStorage.setItem('theme-cache', JSON.stringify(theme));
      
      logger.info('Theme loaded and applied successfully', { themeName: theme.name });
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      
      // Try to load from localStorage as a last resort
      try {
        const cachedTheme = localStorage.getItem('theme-cache');
        if (cachedTheme) {
          const theme = JSON.parse(cachedTheme) as Theme;
          logger.warn('Using cached theme from localStorage', { themeName: theme.name });
          setThemes([theme]);
          setActiveTheme(theme.id);
        } else {
          // If all else fails, use a hardcoded theme
          const hardcodedTheme: Theme = {
            id: 'hardcoded-fallback',
            name: 'Fallback Theme',
            label: 'Fallback',
            description: 'Emergency fallback theme',
            isDark: true, 
            status: 'published',
            variables: {
              primary: '#00F0FF',
              secondary: '#FF2D6E',
              background: '#080F1E',
              foreground: '#F9FAFB'
            },
            designTokens: {
              colors: {
                primary: '#00F0FF',
                secondary: '#FF2D6E',
                background: '#080F1E',
                foreground: '#F9FAFB',
                card: '#0E172A',
                cardForeground: '#F9FAFB',
                muted: '#131D35',
                mutedForeground: '#94A3B8',
              }
            },
            componentTokens: {}
          };
          
          logger.error('Using hardcoded fallback theme', { error: errorObj.message });
          setThemes([hardcodedTheme]);
          setActiveTheme(hardcodedTheme.id);
        }
      } catch (localStorageError) {
        logBridge.error(LogCategory.THEME, 'Critical theme loading failure', {
          originalError: errorObj.message,
          localStorageError: localStorageError instanceof Error ? localStorageError.message : String(localStorageError)
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, logger, setThemes, setActiveTheme, getFallbackTheme]);

  // Function to apply a specific theme
  const applyTheme = useCallback(async (themeName = 'Impulsivity'): Promise<boolean> => {
    try {
      await loadTheme(themeName);
      return true;
    } catch (err) {
      return false;
    }
  }, [loadTheme]);

  return {
    isLoading: isLoading || isFallbackLoading,
    error,
    loadTheme,
    applyTheme
  };
}
