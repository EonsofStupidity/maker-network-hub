
import { useCallback } from 'react';
import { useThemeStore } from '@/stores/theme.store';

export const useThemeVariables = () => {
  const store = useThemeStore();

  const getToken = useCallback((token: string): string => {
    return store.variables[token] || '';
  }, [store.variables]);
  
  const getComponentToken = useCallback((component: string, token: string): string => {
    return store.componentTokens[component]?.[token] || store.variables[token] || '';
  }, [store.componentTokens, store.variables]);
  
  const setToken = useCallback((token: string, value: string) => {
    store.setVariables({ ...store.variables, [token]: value });
  }, [store]);
  
  const setComponentToken = useCallback((component: string, token: string, value: string) => {
    const componentToken = store.componentTokens[component] || {};
    store.setComponentTokens({
      ...store.componentTokens,
      [component]: {
        ...componentToken,
        [token]: value
      }
    });
  }, [store]);

  const getAllTokens = useCallback((): Record<string, string> => {
    return store.variables;
  }, [store.variables]);

  return {
    variables: store.variables || {},
    componentTokens: store.componentTokens,
    getToken,
    getComponentToken,
    setToken,
    setComponentToken,
    getAllTokens,
  };
};
