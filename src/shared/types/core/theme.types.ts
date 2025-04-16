
// Theme effect types
export const ThemeEffectType = {
  NONE: 'none',
  CYBER: 'cyber',
  NEON: 'neon',
  ELECTRIC: 'electric',
  GLITCH: 'glitch',
  SYNTHWAVE: 'synthwave',
  HOLOGRAM: 'hologram',
  BLUR: 'blur',
  MORPH: 'morph',
  NOISE: 'noise',
  GRADIENT: 'gradient',
  PULSE: 'pulse',
  PARTICLE: 'particle',
  GRAIN: 'grain',
  GLOW: 'glow',
  SHADOW: 'shadow'
} as const;

export type ThemeEffectType = typeof ThemeEffectType[keyof typeof ThemeEffectType];

export interface ThemeComponent {
  id?: string;
  name?: string;
  component_name?: string;
  styles?: Record<string, string>;
  tokens?: Record<string, string>;
}

export interface ThemeToken {
  id?: string;
  name?: string;
  token_name?: string;
  token_value?: string;
  category?: string;
  description?: string;
  fallback_value?: string;
  value?: string;
  type?: string;
}

export interface Theme {
  id: string;
  name: string;
  label?: string;
  description?: string;
  isDark: boolean;
  status?: string;
  context?: string;
  variables?: Record<string, string>;
  designTokens?: DesignTokens;
  componentTokens?: ComponentTokens;
  metadata?: Record<string, any>;
}

export interface DesignTokens {
  colors?: Record<string, string>;
  typography?: any;
  spacing?: Record<string, string>;
  borders?: Record<string, string>;
  shadows?: Record<string, string>;
  radii?: Record<string, string>;
  zIndices?: Record<string, string>;
  breakpoints?: Record<string, string>;
  transitions?: Record<string, string>;
  animations?: Record<string, any>;
  [key: string]: any;
}

export interface ComponentTokens {
  [componentName: string]: Record<string, string>;
}

export interface ThemeState {
  activeThemeId: string | null;
  isDark: boolean;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  designTokens: DesignTokens;
  componentTokens: ComponentTokens;
  isLoading?: boolean;
  error?: string | null;
  themes?: Theme[];
  theme?: Theme | null;
  isLoaded?: boolean;
  variables?: Record<string, string>;
  componentStyles?: Record<string, Record<string, string>>;
  animations?: Record<string, any>;
  effects: ThemeEffect[]; // Ensure effects is required and included in the interface
}

export interface ThemeEffect {
  type: ThemeEffectType;
  intensity: number;
  color?: string;
  enabled?: boolean;
  [key: string]: any;
}

export interface ThemeStoreActions {
  setThemes: (themes: Theme[]) => void;
  setActiveTheme: (themeId: string) => void;
  setDesignTokens: (tokens: DesignTokens) => void;
  setComponentTokens: (tokens: ComponentTokens) => void;
}

// Custom Token Map type
export interface TokenMap {
  [key: string]: string;
}

export interface ComponentTokenMap {
  [component: string]: TokenMap;
}
