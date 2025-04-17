
import { useState, useCallback } from 'react';
import { useLogger } from '@/hooks/use-logger';
import { logBridge } from '@/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';
import { Theme } from '@/shared/types/core/theme.types';

interface ThemeFallbackResult {
  isLoading: boolean;
  error: Error | null;
  getFallbackTheme: (themeName?: string) => Promise<Theme | null>;
}

export function useThemeFallback(): ThemeFallbackResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const logger = useLogger('useThemeFallback', LogCategory.THEME);

  const getFallbackTheme = useCallback(async (themeName = 'Impulsivity'): Promise<Theme | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // First try the Supabase Edge Function
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const functionUrl = `${supabaseUrl}/functions/v1/theme-fallback?name=${encodeURIComponent(themeName)}`;
      
      logger.debug(`Fetching fallback theme from: ${functionUrl}`);

      const response = await fetch(functionUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch fallback theme: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (!data.theme) {
        throw new Error('No theme data received from fallback service');
      }

      logger.info(`Successfully loaded fallback theme: ${data.theme.name} from ${data.source}`);
      
      // Map the theme to our frontend Theme type format
      const mappedTheme: Theme = {
        id: data.theme.id,
        name: data.theme.name,
        label: data.theme.name,
        description: data.theme.description || '',
        isDark: true, // Assume Impulsivity is dark by default
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
          source: data.source,
          version: data.theme.version,
        }
      };

      return mappedTheme;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      logBridge.error(LogCategory.THEME, 'Error fetching fallback theme', { 
        error: error.message,
        themeName 
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [logger]);

  return {
    isLoading,
    error,
    getFallbackTheme
  };
}
