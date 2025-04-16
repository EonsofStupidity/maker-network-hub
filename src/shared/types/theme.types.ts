
import type { Theme, ThemeEffect, ThemeEffectType, DesignTokens, ComponentTokens } from './core/theme.types';

export type { Theme, ThemeEffect, ThemeEffectType, DesignTokens, ComponentTokens };

export interface ThemeState {
  activeThemeId: string | null;
  isDark: boolean;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  designTokens: DesignTokens;
  componentTokens: ComponentTokens;
  isLoading: boolean;
  error: string | null;
  theme: Theme | null;
  isLoaded: boolean;
  variables: Record<string, string>;
  componentStyles: Record<string, Record<string, string>>;
  animations: Record<string, any>;
  effects: ThemeEffect[];
  setThemes: (themes: Theme[]) => void;
  setActiveTheme: (themeId: string) => void;
  setDesignTokens: (tokens: DesignTokens) => void;
  setComponentTokens: (tokens: ComponentTokens) => void;
  setEffects: (effects: ThemeEffect[]) => void;
  setVariables: (variables: Record<string, string>) => void;
}
