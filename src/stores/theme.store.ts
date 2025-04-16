
import { create } from 'zustand';
import type { ThemeState, Theme, ComponentTokens, DesignTokens } from '@/shared/types/theme.types';

const defaultTheme: Theme = {
  id: 'default',
  name: 'Default Theme',
  label: 'Default',
  description: 'Default theme',
  isDark: false,
  status: 'active',
  context: 'site',
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

export const useThemeStore = create<ThemeState>((set) => ({
  activeThemeId: defaultTheme.id,
  isDark: defaultTheme.isDark || false,
  primaryColor: defaultTheme.variables?.primary || '',
  backgroundColor: defaultTheme.variables?.background || '',
  textColor: defaultTheme.variables?.foreground || '',
  designTokens: defaultTheme.designTokens || {},
  componentTokens: defaultTheme.componentTokens || {},
  isLoading: false,
  error: null,
  theme: defaultTheme,
  isLoaded: true,
  variables: defaultTheme.variables || {},
  componentStyles: {},
  animations: {},
  effects: [],
  themes: [defaultTheme], // Add the themes property

  setThemes: (themes: Theme[]) => set({ themes, theme: themes[0] || null }),
  setActiveTheme: (themeId: string) => set((state) => ({
    activeThemeId: themeId,
    theme: state.themes?.find(t => t.id === themeId) || state.theme
  })),
  setDesignTokens: (tokens: DesignTokens) => set({ designTokens: tokens }),
  setComponentTokens: (tokens: ComponentTokens) => set({ componentTokens: tokens }),
  setEffects: (effects) => set({ effects }),
  setVariables: (vars) => set({ variables: vars })
}));
