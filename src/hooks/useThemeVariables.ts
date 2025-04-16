
import { useCallback } from 'react';
import { useThemeStore } from '@/stores/theme.store';

/**
 * Hook for getting and setting theme variables
 */
export const useThemeVariables = () => {
  const variables = useThemeStore(state => state.variables);
  const setVariables = useThemeStore(state => state.setVariables);
  
  // Set a single variable
  const setVariable = useCallback((name: string, value: string) => {
    if (!setVariables) return;
    
    setVariables({ ...variables, [name]: value });
  }, [variables, setVariables]);
  
  // Set multiple variables at once
  const setMultipleVariables = useCallback((newVars: Record<string, string>) => {
    if (!setVariables) return;
    
    setVariables({ ...variables, ...newVars });
  }, [variables, setVariables]);
  
  return {
    variables,
    setVariable,
    setMultipleVariables
  };
};
