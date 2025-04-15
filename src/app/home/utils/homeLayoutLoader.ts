import { useEffect } from 'react';
import { useThemeStore } from '@/shared/store/theme/store';
import { Theme } from '@/shared/types/shared.types';
import { useToast } from '@/shared/hooks/use-toast';
import { LogLevel, LogCategory } from '@/shared/types/shared.types';
import { logger } from '@/logging/logger.service';

interface HomeLayoutLoaderProps {
  themeId: string;
}

export const useHomeLayoutLoader = ({ themeId }: HomeLayoutLoaderProps) => {
  const themeStore = useThemeStore();
  const { toast } = useToast();

  useEffect(() => {
    const loadTheme = async () => {
      try {
        logger.log(LogLevel.INFO, LogCategory.THEME, `Attempting to load theme ${themeId}`);
        
        // Load the theme
        await themeStore.loadTheme(themeId);
        
        // After loading, get the theme from the store
        const theme: Theme | undefined = themeStore.theme;

        if (theme) {
          logger.log(LogLevel.INFO, LogCategory.THEME, `Theme ${theme.name} loaded successfully`);
          
          toast({
            title: "Theme loaded successfully",
            description: `The ${theme.name} theme has been loaded.`,
            variant: "default", // Changed from "success" to "default"
            duration: 3000
          });
        } else {
          logger.log(LogLevel.WARN, LogCategory.THEME, `Theme ${themeId} not found`);
          
          toast({
            title: "Theme not found",
            description: `Theme with ID ${themeId} could not be found.`,
            variant: "warning",
            duration: 5000
          });
        }
      } catch (error) {
        logger.log(LogLevel.ERROR, LogCategory.THEME, `Error loading theme ${themeId}`, {
          details: { error }
        });
        
        toast({
          title: "Error loading theme",
          description: `Failed to load theme: ${error}`,
          variant: "destructive",
          duration: 5000
        });
      }
    };

    loadTheme();

    // Cleanup function (optional)
    return () => {
      logger.log(LogLevel.DEBUG, LogCategory.THEME, `Unmounting HomeLayoutLoader for theme ${themeId}`);
    };
  }, [themeId, themeStore, toast]); // Dependencies array
};
