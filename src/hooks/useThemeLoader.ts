
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
      
      // Try to get the hardcoded theme when all else fails
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
      
      // Apply the hardcoded theme - most reliable approach right now
      logger.info('Using hardcoded theme for reliability', { themeName: hardcodedTheme.name });
      setThemes([hardcodedTheme]);
      setActiveTheme(hardcodedTheme.id);
      
      // Try to save to localStorage for future visits
      try {
        localStorage.setItem('theme-cache', JSON.stringify(hardcodedTheme));
      } catch (localStorageError) {
        // Ignore localStorage errors - the hardcoded theme is already applied
        logger.warn('Failed to save theme to localStorage', {
          error: localStorageError instanceof Error ? localStorageError.message : String(localStorageError)
        });
      }
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      logger.error('Critical theme loading failure', { error: errorObj.message });
      
      // Use the simplest possible fallback - this should never fail
      const minimalTheme: Theme = {
        id: 'minimal-fallback',
        name: 'Minimal Fallback',
        label: 'Minimal',
        description: 'Bare minimum theme',
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
            foreground: '#F9FAFB'
          }
        },
        componentTokens: {}
      };
      
      setThemes([minimalTheme]);
      setActiveTheme(minimalTheme.id);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, logger, setThemes, setActiveTheme]);

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
