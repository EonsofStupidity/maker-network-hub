import { create } from 'zustand';
import { Theme, ThemeState, ComponentTokens, DesignTokens, ThemeStoreActions } from '@/shared/types/core/theme.types';
import { LogLevel, LogCategory } from '@/shared/types/core/logging.types';
import { logger } from '@/logging/logger.service';

export const useThemeStore = create<ThemeState & ThemeStoreActions>((set) => ({
  themes: [],
  activeThemeId: null,
  isDark: false,
  primaryColor: '',
  backgroundColor: '',
  textColor: '',
  designTokens: {},
  componentTokens: {},
  isLoading: false,
  error: null,
  theme: null,
  isLoaded: false,
  variables: {},
  componentStyles: {},
  animations: {},

  setThemes: (themes: Theme[]) => {
    set({ themes });
    logger.log(LogLevel.INFO, LogCategory.THEME, 'Themes updated');
  },

  setActiveTheme: (themeId: string) => {
    set(state => {
      const theme = state.themes?.find(t => t.id === themeId);
      if (!theme) return state;

      return {
        activeThemeId: themeId,
        isDark: theme.isDark || false,
        theme,
        designTokens: theme.designTokens || {},
        componentTokens: theme.componentTokens || {},
      };
    });
  },

  setDesignTokens: (tokens: DesignTokens) => {
    set({ designTokens: tokens });
  },

  setComponentTokens: (tokens: ComponentTokens) => {
    set({ componentTokens: tokens });
  },

  setEffects: (effects) => {
    set({ effects });
  },

  setVariables: (variables) => {
    set({ variables });
  }
}));
