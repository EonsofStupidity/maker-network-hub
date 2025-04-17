
import { useCallback } from 'react';
import { useThemeStore } from '@/stores/theme.store';

export function useThemeVariables() {
  const themeState = useThemeStore();
  const themeVariables = themeState.variables || {};
  
  const getVariable = useCallback((name: string, fallback?: string): string => {
    if (!themeVariables) return fallback || '';
    return themeVariables[name] || fallback || '';
  }, [themeVariables]);
  
  const setVariable = useCallback((name: string, value: string): void => {
    if (useThemeStore.getState().setVariables) {
      const currentVars = useThemeStore.getState().variables || {};
      useThemeStore.getState().setVariables!({
        ...currentVars,
        [name]: value
      });
    }
  }, []);
  
  const updateVariables = useCallback((newVariables: Record<string, string>): void => {
    if (useThemeStore.getState().setVariables) {
      const currentVars = useThemeStore.getState().variables || {};
      useThemeStore.getState().setVariables!({
        ...currentVars,
        ...newVariables
      });
    }
  }, []);
  
  return {
    variables: themeVariables,
    getVariable,
    setVariable,
    updateVariables
  };
}
