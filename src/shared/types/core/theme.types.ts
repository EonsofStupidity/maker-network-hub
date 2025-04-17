
/**
 * Base theme effect type
 */
export enum ThemeEffectType {
  NONE = 'none',
  PARTICLES = 'particles',
  MATRIX = 'matrix',
  CYBER_GRID = 'cyber_grid',
  WAVE = 'wave',
  STARFIELD = 'starfield',
  GLOW = 'glow',
  BLUR = 'blur',
  MORPH = 'morph',
  GRAIN = 'grain',
  GLITCH = 'glitch',
  NOISE = 'noise',
  GRADIENT = 'gradient',
  CYBER = 'cyber',
  NEON = 'neon',
  PULSE = 'pulse',
  PARTICLE = 'particle'
}

/**
 * Theme effect configuration
 */
export interface ThemeEffect {
  type: ThemeEffectType;
  config?: Record<string, any>;
  enabled: boolean;
  opacity?: number;
  zIndex?: number;
  intensity?: number;
  color?: string;
}

/**
 * Theme token type
 */
export interface ThemeToken {
  name: string;
  value: string;
  cssVar: string;
  category: string;
  type?: string;
  token_name?: string; // For backward compatibility
  token_value?: string; // For backward compatibility
}

/**
 * Complete theme definition
 */
export interface Theme {
  id: string;
  name: string;
  active: boolean;
  dark: boolean;
  isDark?: boolean;
  label?: string;
  description?: string;
  status?: string;
  context?: string;
  colors: Record<string, string>;
  effects: ThemeEffect[];
  tokens: ThemeToken[];
  variables?: Record<string, string>;
  designTokens?: Record<string, any>;
  componentTokens?: Record<string, any>;
  metadata?: Record<string, any>;
}

/**
 * Theme state
 */
export interface ThemeState {
  current: Theme | null;
  available: Theme[];
  loading: boolean;
  error: string | null;
  
  // Extended state properties
  themes?: Theme[];
  activeThemeId?: string;
  isDark?: boolean;
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  designTokens?: Record<string, any>;
  componentTokens?: Record<string, any>;
  theme?: Theme | null;
  isLoaded?: boolean;
  variables?: Record<string, string>;
  componentStyles?: Record<string, Record<string, string>>;
  animations?: Record<string, any>;
  effects?: ThemeEffect[];
  
  // Method signatures for the Theme store
  setThemes?: (themes: Theme[]) => void;
  setActiveTheme?: (themeId: string) => void;
  setDesignTokens?: (tokens: any) => void;
  setComponentTokens?: (tokens: any) => void;
  setEffects?: (effects: ThemeEffect[]) => void;
  setVariables?: (variables: Record<string, string>) => void;
}

// Separate action interface for theme store
export interface ThemeStoreActions {
  setThemes: (themes: Theme[]) => void;
  setActiveTheme: (themeId: string) => void;
  setDesignTokens: (tokens: any) => void;
  setComponentTokens: (tokens: any) => void;
  setEffects?: (effects: ThemeEffect[]) => void;
  setVariables?: (variables: Record<string, string>) => void;
}
