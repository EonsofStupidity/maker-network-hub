
import { Theme, ComponentTokens, DesignTokens } from './shared.types';

export interface ThemeState {
  themes: Theme[];
  activeThemeId: string | null;
  isDark: boolean;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  designTokens: DesignTokens;
  componentTokens: ComponentTokens;
  isLoading: boolean;
  error: null | string;
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
  setVariables: (vars: Record<string, string>) => void;
}

export interface ThemeEffect {
  type: ThemeEffectType;
  intensity: number;
  enabled: boolean;
  color?: string;
}

export enum ThemeEffectType {
  NONE = 'none',
  CYBER = 'cyber',
  NEON = 'neon',
  GLITCH = 'glitch',
  BLUR = 'blur',
  GRADIENT = 'gradient',
  PULSE = 'pulse',
  PARTICLE = 'particle',
  MORPH = 'morph'
}

// Re-export needed type
export type { Theme };
export interface ThemeComponent {
  id?: string;
  name?: string;
  component_name?: string;
  styles?: Record<string, string>;
  tokens?: Record<string, string>;
}
