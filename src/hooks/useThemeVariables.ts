
import { useCallback } from 'react';
import { useThemeStore } from '@/stores/theme.store';

export function useThemeVariables() {
  const themeVariables = useThemeStore(state => state.variables);
  
  const getVariable = useCallback((name: string, fallback?: string): string => {
    if (!themeVariables) return fallback || '';
    return themeVariables[name] || fallback || '';
  }, [themeVariables]);
  
  const setVariable = useCallback((name: string, value: string): void => {
    useThemeStore.setState(state => ({
      variables: {
        ...(state.variables || {}),
        [name]: value
      }
    }));
  }, []);
  
  const updateVariables = useCallback((newVariables: Record<string, string>): void => {
    useThemeStore.setState(state => ({
      variables: {
        ...(state.variables || {}),
        ...newVariables
      }
    }));
  }, []);
  
  return {
    variables: themeVariables || {},
    getVariable,
    setVariable,
    updateVariables
  };
}
