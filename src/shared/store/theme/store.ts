
import { create } from 'zustand';
import { Theme, ThemeState, ComponentTokens, DesignTokens, ThemeStoreActions, ThemeEffect } from '@/shared/types/shared.types';
import { devtools, persist } from 'zustand/middleware';
import { logger } from '@/logging/logger.service';
import { LogLevel, LogCategory } from '@/shared/types/shared.types';

// Default theme to use when no theme is loaded
const defaultTheme: Theme = {
  id: 'default',
  name: 'Default Theme',
  active: false,
  dark: false,
  isDark: false,
  label: 'Default',
  description: 'Default theme',
  status: 'active',
  context: 'site',
  colors: {
    primary: '#3b82f6',
    secondary: '#f3f4f6',
    background: '#ffffff',
    foreground: '#000000',
  },
  effects: [],
  tokens: [],
  variables: {
    background: '#ffffff',
    foreground: '#000000',
    card: '#f7f7f7',
    cardForeground: '#000000',
    primary: '#3b82f6',
    primaryForeground: '#ffffff',
    secondary: '#f3f4f6',
    secondaryForeground: '#000000',
    muted: '#f1f5f9',
    mutedForeground: '#64748b',
    accent: '#f59e0b',
    accentForeground: '#000000',
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    border: '#e2e8f0',
    input: '#e2e8f0',
    ring: '#3b82f6',
    effectColor: '#3b82f6',
    effectSecondary: '#f59e0b',
    effectTertiary: '#10b981',
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
      primary: '#3b82f6',
      secondary: '#f3f4f6',
      background: '#ffffff',
      foreground: '#000000',
    },
    typography: {
      fontFamily: 'system-ui, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
      }
    }
  },
  componentTokens: {
    button: {
      padding: '0.5rem 1rem',
      borderRadius: '0.25rem',
      fontWeight: '500',
    },
    card: {
      padding: '1rem',
      borderRadius: '0.5rem',
      shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }
  }
};

// Default component tokens
const defaultComponentTokens = {
  button: {
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    fontWeight: '500',
  },
  card: {
    padding: '1rem',
    borderRadius: '0.5rem',
    shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
  },
  input: {
    height: '2.5rem',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.25rem',
  },
  badge: {
    padding: '0.25rem 0.5rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
  },
  alert: {
    padding: '1rem',
    borderRadius: '0.5rem',
    fontWeight: '500',
  },
};

// Create the theme store
export const useThemeStore = create<ThemeState & ThemeStoreActions>()(
  devtools(
    persist(
      (set, get) => ({
        themes: [defaultTheme],
        activeThemeId: defaultTheme.id,
        isDark: defaultTheme.isDark || false,
        primaryColor: defaultTheme.variables?.primary || '',
        backgroundColor: defaultTheme.variables?.background || '',
        textColor: defaultTheme.variables?.foreground || '',
        designTokens: defaultTheme.designTokens || {},
        componentTokens: defaultComponentTokens,
        isLoading: false,
        error: null,
        effects: [],
        
        // Set all themes
        setThemes: (themes) => {
          if (Array.isArray(themes)) {
            set({ themes });
            logger.log(LogLevel.INFO, LogCategory.THEME, 'Themes updated', { 
              details: { themesCount: themes.length } 
            });
          }
        },
        
        // Set active theme by ID
        setActiveTheme: (themeId) => {
          const { themes = [] } = get();
          const theme = themes.find((t) => t.id === themeId);
          
          if (!theme) {
            logger.log(LogLevel.ERROR, LogCategory.THEME, 'Theme not found', {
              details: { themeId }
            });
            return;
          }
          
          set({
            activeThemeId: themeId,
            isDark: theme.isDark || false,
            primaryColor: theme.variables?.primary || '',
            backgroundColor: theme.variables?.background || '',
            textColor: theme.variables?.foreground || '',
            designTokens: theme.designTokens || {},
            componentTokens: theme.componentTokens || defaultComponentTokens,
          });
          
          logger.log(LogLevel.INFO, LogCategory.THEME, 'Active theme changed', {
            details: { themeId, themeName: theme.name }
          });
        },
        
        // Set design tokens
        setDesignTokens: (tokens) => {
          set({ designTokens: tokens });
        },
        
        // Set component tokens
        setComponentTokens: (tokens) => {
          set({ componentTokens: tokens });
        },
        
        // Set effects
        setEffects: (effects) => {
          set({ effects });
        },
        
        // Set variables
        setVariables: (variables) => {
          set({ variables });
        }
      }),
      {
        name: 'theme-store',
        partialize: (state) => ({
          activeThemeId: state.activeThemeId,
          isDark: state.isDark,
        }),
      }
    )
  )
);
