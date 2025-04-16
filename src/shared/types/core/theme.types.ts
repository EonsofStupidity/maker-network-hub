
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

// Theme effect types
export enum ThemeEffectType {
  NONE = 'none',
  CYBER = 'cyber',
  NEON = 'neon',
  ELECTRIC = 'electric',
  GLITCH = 'glitch',
  SYNTHWAVE = 'synthwave',
  HOLOGRAM = 'hologram',
  BLUR = 'blur',
  MORPH = 'morph',
  NOISE = 'noise',
  GRADIENT = 'gradient',
  PULSE = 'pulse',
  PARTICLE = 'particle',
  GRAIN = 'grain',
  GLOW = 'glow',
  SHADOW = 'shadow'
}

export interface ThemeEffect {
  type: ThemeEffectType;
  intensity: number;
  color?: string;
  enabled?: boolean;
  [key: string]: any;
}
