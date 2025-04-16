
export type ThemeEffectType = 'pulse' | 'hover-glow' | 'float';

export interface ThemeComponent {
  id: string;
  name: string;
  component_name?: string;
  styles?: Record<string, string>;
  tokens?: Record<string, string>;
}

export interface ThemeEffect {
  type: ThemeEffectType;
  enabled: boolean;
  intensity: number;
  color?: string;
}

export interface Theme {
  id: string;
  name: string;
  isDark: boolean;
  variables?: Record<string, string>;
  designTokens?: Record<string, unknown>;
  componentTokens?: Record<string, unknown>;
}

export interface ThemeState {
  themes: Theme[];
  activeThemeId: string | null;
  isDark: boolean;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  designTokens: Record<string, unknown>;
  componentTokens: Record<string, unknown>;
  isLoading: boolean;
  error: string | null;
  theme: Theme | null;
  isLoaded: boolean;
  variables: Record<string, string>;
  componentStyles: Record<string, Record<string, string>>;
  animations: Record<string, unknown>;
  effects: ThemeEffect[];
  setEffects: (effects: ThemeEffect[]) => void;
  setVariables: (variables: Record<string, string>) => void;
}
