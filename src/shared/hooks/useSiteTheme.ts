import { useThemeStore } from "@/shared/store/theme/store";

export function useSiteTheme() {
  const { 
    activeThemeId, 
    themes,
    isDark, 
    primaryColor, 
    backgroundColor, 
    textColor, 
    componentTokens,
    isLoading 
  } = useThemeStore();

  const currentTheme = themes?.find(t => t.id === activeThemeId) || null;

  return {
    theme: currentTheme,
    isDark,
    primaryColor,
    backgroundColor,
    textColor,
    componentTokens,
    isLoading,
    activeThemeId
  };
}
