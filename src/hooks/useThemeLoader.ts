import { useState, useCallback, useEffect } from 'react';
import { useThemeStore } from '@/shared/store/theme/store';
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

/**
 * Hook for loading and applying themes with robust logging and fallbacks
 */
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

    const loadStartTime = Date.now();
    setIsLoading(true);
    setError(null);

    try {
      logger.debug(`Loading theme: ${themeName}`);
      logBridge.info(LogCategory.THEME, `Starting theme load: ${themeName}`);
      
      // Try to get the hardcoded theme when all else fails
      const hardcodedTheme: Theme = {
        id: 'hardcoded-fallback',
        name: 'Fallback Theme',
        active: true,
        dark: true,
        description: 'Emergency fallback theme',
        colors: {
          primary: '#00F0FF',
          secondary: '#FF2D6E',
          background: '#080F1E',
          foreground: '#F9FAFB'
        },
        effects: [],
        tokens: [],
        status: 'published',
        variables: {
          primary: '#00F0FF',
          secondary: '#FF2D6E',
          background: '#080F1E',
          foreground: '#F9FAFB',
          card: '#0E172A',
          cardForeground: '#F9FAFB',
          muted: '#131D35',
          mutedForeground: '#94A3B8',
          accent: '#131D35',
          accentForeground: '#F9FAFB',
          destructive: '#EF4444',
          destructiveForeground: '#F9FAFB',
          border: '#131D35',
          input: '#131D35',
          ring: '#1E293B',
          effectColor: '#00F0FF',
          effectSecondary: '#FF2D6E',
          transitionFast: '150ms',
          transitionNormal: '300ms',
          transitionSlow: '500ms',
          animationFast: '300ms',
          animationNormal: '500ms',
          animationSlow: '1000ms',
          radiusSm: '0.125rem',
          radiusMd: '0.25rem',
          radiusLg: '0.5rem',
          radiusFull: '9999px'
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
      
      // Try to load from localStorage first (fastest)
      let theme: Theme | null = null;
      let source = 'unknown';
      
      try {
        const cachedThemeJson = localStorage.getItem('theme-cache');
        if (cachedThemeJson) {
          const cachedTheme = JSON.parse(cachedThemeJson) as Theme;
          logger.debug('Found cached theme in localStorage');
          theme = cachedTheme;
          source = 'localStorage';
        }
      } catch (localStorageError) {
        logger.warn('Failed to read theme from localStorage', {
          error: localStorageError instanceof Error ? localStorageError.message : String(localStorageError)
        });
      }
      
      // If no localStorage theme, try to get from API/Supabase
      if (!theme) {
        try {
          // This would be implemented to fetch from Supabase
          logger.debug('No cached theme found, attempting to load from fallback');
          theme = await getFallbackTheme(themeName);
          source = theme ? 'fallback-service' : 'unknown';
        } catch (apiError) {
          logger.warn('Failed to load theme from fallback service', {
            error: apiError instanceof Error ? apiError.message : String(apiError)
          });
        }
      }
      
      // If still no theme, use hardcoded fallback
      if (!theme) {
        logger.info('Using hardcoded theme as final fallback');
        theme = hardcodedTheme;
        source = 'hardcoded';
      }
      
      // Apply the theme
      logger.info(`Applying theme from source: ${source}`, { themeName: theme.name });
      logBridge.info(LogCategory.THEME, 'Theme loaded successfully', {
        details: { source, themeName: theme.name, loadTimeMs: Date.now() - loadStartTime }
      });
      
      if (setThemes) {
        setThemes([theme]);
      }
      
      if (setActiveTheme) {
        setActiveTheme(theme.id);
      }
      
      // Try to save to localStorage for future visits
      try {
        localStorage.setItem('theme-cache', JSON.stringify(theme));
      } catch (localStorageError) {
        // Ignore localStorage errors - the theme is already applied
        logger.warn('Failed to save theme to localStorage', {
          error: localStorageError instanceof Error ? localStorageError.message : String(localStorageError)
        });
      }
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      logger.error('Critical theme loading failure', { error: errorObj.message });
      logBridge.error(LogCategory.THEME, 'Theme loading failed', {
        details: { 
          error: errorObj.message,
          themeName,
          loadTimeMs: Date.now() - loadStartTime 
        }
      });
      
      // Use the simplest possible fallback - this should never fail
      const minimalTheme: Theme = {
        id: 'minimal-fallback',
        name: 'Minimal Fallback',
        active: true,
        dark: true,
        description: 'Bare minimum theme',
        colors: {
          primary: '#00F0FF',
          secondary: '#FF2D6E',
          background: '#080F1E',
          foreground: '#F9FAFB'
        },
        effects: [],
        tokens: [],
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
            foreground: '#F9FAFB'
          }
        },
        componentTokens: {}
      };
      
      if (setThemes) {
        setThemes([minimalTheme]);
      }
      
      if (setActiveTheme) {
        setActiveTheme(minimalTheme.id);
      }
      
      logBridge.warn(LogCategory.THEME, 'Applied minimal fallback theme', {
        details: { reason: 'Critical loading failure' }
      });
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
      logBridge.error(LogCategory.THEME, 'Failed to apply theme', {
        details: { themeName, error: err instanceof Error ? err.message : String(err) }
      });
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
