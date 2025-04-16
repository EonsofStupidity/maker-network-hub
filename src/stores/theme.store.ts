
import { create } from 'zustand';
import {
  ThemeState,
  DesignTokens,
  ComponentTokens,
  Theme,
  ThemeEffect,
  ThemeEffectType
} from '@/shared/types/core/theme.types';

// Define default design tokens
const DEFAULT_DESIGN_TOKENS: DesignTokens = {
  colors: {
    primary: '#3b82f6',
    background: '#ffffff',
    text: '#0f172a',
    muted: '#64748b',
    accent: '#8b5cf6'
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    headingFont: 'Inter, system-ui, sans-serif',
    bodyFont: 'Inter, system-ui, sans-serif',
    codeFont: 'monospace'
  },
  spacing: {
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem'
  }
};

// Define default component tokens
const DEFAULT_COMPONENT_TOKENS: ComponentTokens = {
  button: {
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    paddingX: '1rem',
    paddingY: '0.5rem',
  },
  card: {
    borderRadius: '0.5rem',
    padding: '1.5rem',
    shadowColor: 'rgba(0,0,0,0.1)',
  }
};

// Define default theme effects
const DEFAULT_THEME_EFFECTS: ThemeEffect[] = [
  { 
    type: ThemeEffectType.NONE, 
    intensity: 0, 
    enabled: false 
  }
];

// Adding effects to the interface
interface ThemeStoreState extends ThemeState {
  // Actions
  setActiveTheme: (themeId: string) => void;
  setDesignTokens: (tokens: DesignTokens) => void;
  setComponentTokens: (tokens: ComponentTokens) => void;
  setThemes: (themes: Theme[]) => void;
  setThemeVariables: (variables: Record<string, string>) => void;
  toggleDarkMode: () => void;
  setEffects: (effects: ThemeEffect[]) => void;
}

export const useThemeStore = create<ThemeStoreState>((set) => ({
  activeThemeId: 'default',
  isDark: false,
  primaryColor: '#3b82f6',
  backgroundColor: '#ffffff',
  textColor: '#0f172a',
  designTokens: DEFAULT_DESIGN_TOKENS,
  componentTokens: DEFAULT_COMPONENT_TOKENS,
  variables: {},
  isLoading: false,
  isLoaded: false,
  error: null,
  themes: [],
  theme: null,
  effects: DEFAULT_THEME_EFFECTS, // Initialize with default effects
  
  // Actions
  setActiveTheme: (themeId: string) => set({ activeThemeId: themeId }),
  
  setDesignTokens: (tokens: DesignTokens) => set((state) => ({
    designTokens: { ...state.designTokens, ...tokens }
  })),
  
  setComponentTokens: (tokens: ComponentTokens) => set((state) => ({
    componentTokens: { ...state.componentTokens, ...tokens }
  })),
  
  setThemes: (themes: Theme[]) => set({ themes, isLoaded: true }),
  
  setThemeVariables: (variables: Record<string, string>) => set({ variables }),
  
  toggleDarkMode: () => set((state) => {
    const isDark = !state.isDark;
    return {
      isDark,
      backgroundColor: isDark ? '#0f172a' : '#ffffff',
      textColor: isDark ? '#f8fafc' : '#0f172a',
    };
  }),
  
  setEffects: (effects: ThemeEffect[]) => set({ effects })
}));
