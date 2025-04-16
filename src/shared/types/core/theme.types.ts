
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

export const THEME_EFFECTS = {
  NONE: ThemeEffectType.NONE,
  CYBER: ThemeEffectType.CYBER,
  NEON: ThemeEffectType.NEON,
  ELECTRIC: ThemeEffectType.ELECTRIC,
  GLITCH: ThemeEffectType.GLITCH,
  SYNTHWAVE: ThemeEffectType.SYNTHWAVE
};

export interface ThemeEffect {
  type: ThemeEffectType;
  intensity: number;
  color?: string;
  enabled?: boolean;
}
