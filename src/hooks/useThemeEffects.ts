
import { useCallback } from 'react';
import { useThemeStore } from '@/shared/store/theme/store';
import { ThemeEffect, ThemeEffectType } from '@/shared/types/core/theme.types';

export function useThemeEffects() {
  const themeStore = useThemeStore();
  // Access effects from the store with fallback to empty array
  const themeEffects = themeStore.effects || [];
  
  const setThemeEffects = useCallback((effects: ThemeEffect[]) => {
    if (useThemeStore.getState().setEffects) {
      useThemeStore.getState().setEffects(effects);
    }
  }, []);
  
  const getEffects = useCallback(() => {
    return themeEffects;
  }, [themeEffects]);
  
  const setEffects = useCallback((effects: ThemeEffect[]) => {
    setThemeEffects(effects);
  }, [setThemeEffects]);
  
  const toggleEffect = useCallback((type: ThemeEffectType) => {
    setThemeEffects(
      themeEffects.map(effect => 
        effect.type === type 
          ? { ...effect, enabled: !effect.enabled } 
          : effect
      )
    );
  }, [themeEffects, setThemeEffects]);
  
  const updateEffectIntensity = useCallback((type: ThemeEffectType, intensity: number) => {
    setThemeEffects(
      themeEffects.map(effect => 
        effect.type === type 
          ? { ...effect, intensity } 
          : effect
      )
    );
  }, [themeEffects, setThemeEffects]);
  
  const addEffect = useCallback((type: ThemeEffectType, intensity: number = 0.5, enabled: boolean = true) => {
    // Check if effect already exists
    const existingEffect = themeEffects.find(effect => effect.type === type);
    
    if (existingEffect) {
      // Update existing effect
      setThemeEffects(
        themeEffects.map(effect => 
          effect.type === type 
            ? { ...effect, intensity, enabled } 
            : effect
        )
      );
    } else {
      // Add new effect
      setThemeEffects([
        ...themeEffects,
        { type, intensity, enabled }
      ]);
    }
  }, [themeEffects, setThemeEffects]);
  
  const removeEffect = useCallback((type: ThemeEffectType) => {
    setThemeEffects(
      themeEffects.filter(effect => effect.type !== type)
    );
  }, [themeEffects, setThemeEffects]);
  
  const getEffectByType = useCallback((type: ThemeEffectType): ThemeEffect | undefined => {
    return themeEffects.find(effect => effect.type === type);
  }, [themeEffects]);
  
  const isEffectEnabled = useCallback((type: ThemeEffectType): boolean => {
    const effect = themeEffects.find(effect => effect.type === type);
    return effect ? !!effect.enabled : false;
  }, [themeEffects]);

  return {
    effects: themeEffects,
    getEffects,
    setEffects,
    toggleEffect,
    updateEffectIntensity,
    addEffect,
    removeEffect,
    getEffectByType,
    isEffectEnabled
  };
}
