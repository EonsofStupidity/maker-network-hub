
import { create } from 'zustand';
import {
  ThemeState,
  DesignTokens,
  ComponentTokens,
  Theme,
  ThemeEffect
} from '@/shared/types/core/theme.types';

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
  effects: [], // Explicitly include effects array
  
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
