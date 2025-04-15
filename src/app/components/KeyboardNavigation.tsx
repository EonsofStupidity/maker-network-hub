import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ScrollConfig {
  scrollAmount?: number;
  smooth?: boolean;
  acceleration?: boolean;
  maxAcceleration?: number;
  accelerationRate?: number;
}

interface KeyboardNavigationProps {
  options?: {
    enabled?: boolean;
    showToasts?: boolean;
    scrollConfig?: ScrollConfig;
  };
}

export const KeyboardNavigation = ({ options = {} }: KeyboardNavigationProps) => {
  const { toast } = useToast();

  useEffect(() => {
    if (!options.enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      let direction: string | null = null;
      
      if (['ArrowUp', 'w', 'W'].includes(e.key)) {
        direction = 'up';
        window.scrollBy({
          top: -mergedOptions.scrollConfig.scrollAmount,
          behavior: mergedOptions.scrollConfig.smooth ? 'smooth' : 'auto'
        });
      } else if (['ArrowDown', 's', 'S'].includes(e.key)) {
        direction = 'down';
        window.scrollBy({
          top: mergedOptions.scrollConfig.scrollAmount,
          behavior: mergedOptions.scrollConfig.smooth ? 'smooth' : 'auto'
        });
      }
      
      if (direction && mergedOptions.showToasts) {
        toast({
          title: `Scrolling ${direction}`,
          description: "Use W/S or arrow keys to scroll",
          variant: "default"
        });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [options, toast]);
  
  return null;
};
