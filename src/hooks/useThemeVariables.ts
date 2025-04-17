
import { useCallback } from 'react';
import { useThemeStore } from '@/shared/store/theme/store';

export function useThemeVariables() {
  const themeState = useThemeStore();
  const themeVariables = themeState.variables || {};
  
  const getVariable = useCallback((name: string, fallback?: string): string => {
    if (!themeVariables) return fallback || '';
    return themeVariables[name] || fallback || '';
  }, [themeVariables]);
  
  const setVariable = useCallback((name: string, value: string): void => {
    if (themeState.setVariables) {
      themeState.setVariables({
        ...themeVariables,
        [name]: value
      });
    }
  }, [themeState.setVariables, themeVariables]);
  
  const updateVariables = useCallback((newVariables: Record<string, string>): void => {
    if (themeState.setVariables) {
      themeState.setVariables({
        ...themeVariables,
        ...newVariables
      });
    }
  }, [themeState.setVariables, themeVariables]);
  
  return {
    variables: themeVariables,
    getVariable,
    setVariable,
    updateVariables
  };
}
