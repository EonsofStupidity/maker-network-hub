
import { z } from 'zod';
import { Theme } from '@/shared/types/core/theme.types';

// Define the shape of ThemeBridge using Zod schema
export const ThemeBridgeSchema = z.object({
  initialize: z.function().returns(z.promise(z.void())),
  getActiveTheme: z.function().returns(z.union([z.custom<Theme>(), z.null()])),
  setTheme: z.function().args(z.string()).returns(z.promise(z.void())),
  toggleDarkMode: z.function().returns(z.boolean()),
  isDarkMode: z.function().returns(z.boolean()),
});

// Export the type of ThemeBridge
export type IThemeBridge = z.infer<typeof ThemeBridgeSchema>;

/**
 * ThemeBridge provides theme management functionality
 * without exposing direct access to the underlying store
 */
class ThemeBridgeClass implements IThemeBridge {
  private _activeTheme: Theme | null = null;
  private _isDarkMode = false;
  
  async initialize(): Promise<void> {
    // This would typically load theme from storage or API
    console.log('Theme bridge initializing...');
    
    // Set a default theme with all required properties
    this._activeTheme = {
      id: 'default',
      name: 'Default Theme',
      isDark: false,
      primaryColor: '#3b82f6',
      backgroundColor: '#ffffff',
      textColor: '#1e293b',
      designTokens: {},
      componentTokens: {},
      colors: {
        primary: '#3b82f6',
        background: '#ffffff',
        text: '#1e293b'
      }
    };
    
    // Check system preference for dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this._isDarkMode = prefersDark;
    
    if (this._isDarkMode && this._activeTheme) {
      this._activeTheme.isDark = true;
      this._activeTheme.backgroundColor = '#1e293b';
      this._activeTheme.textColor = '#f8fafc';
      this._activeTheme.colors = {
        primary: '#00f0ff',
        background: '#1e293b',
        text: '#f8fafc'
      };
    }
    
    console.log('Theme bridge initialized');
  }
  
  getActiveTheme(): Theme | null {
    return this._activeTheme;
  }
  
  async setTheme(themeId: string): Promise<void> {
    console.log(`Setting theme to ${themeId}...`);
    // This would typically fetch theme from API or local storage
  }
  
  toggleDarkMode(): boolean {
    this._isDarkMode = !this._isDarkMode;
    
    // Update theme properties
    if (this._activeTheme) {
      this._activeTheme.isDark = this._isDarkMode;
      
      if (this._isDarkMode) {
        this._activeTheme.backgroundColor = '#1e293b';
        this._activeTheme.textColor = '#f8fafc';
      } else {
        this._activeTheme.backgroundColor = '#ffffff';
        this._activeTheme.textColor = '#1e293b';
      }
    }
    
    return this._isDarkMode;
  }
  
  isDarkMode(): boolean {
    return this._isDarkMode;
  }
}

export const themeBridge = new ThemeBridgeClass();
export const useThemeBridge = () => themeBridge;

// Validate at runtime in development
if (process.env.NODE_ENV === 'development') {
  try {
    ThemeBridgeSchema.parse(themeBridge);
  } catch (error) {
    console.error('ThemeBridge fails schema validation:', error);
  }
}
