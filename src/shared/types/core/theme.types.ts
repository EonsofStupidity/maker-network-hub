
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
  GLOW = 'glow'
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
}

/**
 * Theme token type
 */
export interface ThemeToken {
  name: string;
  value: string;
  cssVar: string;
  category: string;
}

/**
 * Complete theme definition
 */
export interface Theme {
  id: string;
  name: string;
  active: boolean;
  dark: boolean;
  colors: Record<string, string>;
  effects: ThemeEffect[];
  tokens: ThemeToken[];
}

/**
 * Theme state
 */
export interface ThemeState {
  current: Theme | null;
  available: Theme[];
  loading: boolean;
  error: string | null;
}
