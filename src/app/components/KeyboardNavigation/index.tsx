
import { useEffect, useState } from 'react';
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
  const [scrollAmount, setScrollAmount] = useState(options.scrollConfig?.scrollAmount ?? 100);
  
  const config = {
    enabled: options.enabled ?? true,
    showToasts: options.showToasts ?? false,
    scrollConfig: {
      scrollAmount: scrollAmount,
      smooth: options.scrollConfig?.smooth ?? true,
      acceleration: options.scrollConfig?.acceleration ?? true,
      maxAcceleration: options.scrollConfig?.maxAcceleration ?? 500,
      accelerationRate: options.scrollConfig?.accelerationRate ?? 1.1
    }
  };

  useEffect(() => {
    if (!config.enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      let direction: string | null = null;
      
      if (['ArrowUp', 'w', 'W'].includes(e.key)) {
        direction = 'up';
        window.scrollBy({
          top: -config.scrollConfig.scrollAmount,
          behavior: config.scrollConfig.smooth ? 'smooth' : 'auto'
        });
      } else if (['ArrowDown', 's', 'S'].includes(e.key)) {
        direction = 'down';
        window.scrollBy({
          top: config.scrollConfig.scrollAmount,
          behavior: config.scrollConfig.smooth ? 'smooth' : 'auto'
        });
      }
      
      if (direction && config.showToasts) {
        toast({
          title: `Scrolling ${direction}`,
          description: "Use W/S or arrow keys to scroll"
        });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [config, toast]);
  
  return null;
};
