
import { ThemeEffectType } from '@/shared/types/core/theme.types';

export interface BaseThemeEffect {
  type: ThemeEffectType;
  enabled: boolean;
  intensity: number;
  color?: string;
  [key: string]: any;
}

export interface GlitchEffect extends BaseThemeEffect {
  type: ThemeEffectType;
  frequency?: number;
  amplitude?: number;
}

export interface GradientEffect extends BaseThemeEffect {
  type: ThemeEffectType;
  colors?: string[];
  speed?: number;
}

export interface CyberEffect extends BaseThemeEffect {
  type: ThemeEffectType;
  glowColor?: string;
  scanLines?: boolean;
}

export interface PulseEffect extends BaseThemeEffect {
  type: ThemeEffectType;
  minOpacity?: number;
  maxOpacity?: number;
  duration?: number;
}

export interface ParticleEffect extends BaseThemeEffect {
  type: ThemeEffectType;
  count?: number;
  size?: number;
  speed?: number;
}

export interface MorphEffect extends BaseThemeEffect {
  type: ThemeEffectType;
  speed?: number;
  amplitude?: number;
  shape?: 'wave' | 'blob' | 'zigzag';
}

export type ThemeEffect = 
  | GlitchEffect 
  | GradientEffect 
  | CyberEffect 
  | PulseEffect 
  | ParticleEffect 
  | MorphEffect 
  | BaseThemeEffect;

export interface ThemeEffectProviderProps {
  children: React.ReactNode;
  className?: string;
  effect?: ThemeEffect;
}
