
import React from 'react';
import { ThemeEffectType } from '@/shared/types/core/theme.types';

/**
 * Component to render various theme effects
 */
export const EffectRenderer: React.FC<{
  effect: string;
  intensity?: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({
  effect,
  intensity = 1,
  className = '',
  style = {},
  children
}) => {
  // Return children without wrapper for disabled or missing effects
  if (!effect || effect === ThemeEffectType.NONE) {
    return <>{children}</>;
  }

  // Different rendering based on effect type
  switch (effect) {
    case ThemeEffectType.BLUR:
    case ThemeEffectType.MORPH:
      return (
        <div 
          className={`backdrop-blur-sm ${className}`}
          style={{
            backdropFilter: `blur(${intensity * 2}px)`,
            ...style
          }}
        >
          {children}
        </div>
      );
      
    case ThemeEffectType.GRAIN:
      return (
        <div 
          className={`before:absolute before:inset-0 before:z-[-1] before:opacity-20 ${className}`}
          style={{
            position: 'relative',
            isolation: 'isolate',
            ...style,
            '--grain-opacity': `${0.1 * intensity}`,
          } as React.CSSProperties}
        >
          <style dangerouslySetInnerHTML={{
            __html: `
            div::before {
              background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
              opacity: var(--grain-opacity);
              content: '';
              pointer-events: none;
            }
          `
          }} />
          {children}
        </div>
      );
      
    case ThemeEffectType.GLITCH:
    case ThemeEffectType.NOISE:
      return (
        <div 
          className={`relative overflow-hidden ${className}`}
          style={style}
          data-effect="glitch"
          data-intensity={intensity}
        >
          {children}
          <div className="glitch-effect absolute inset-0 z-[-1] opacity-50" />
        </div>
      );
      
    case ThemeEffectType.GRADIENT:
      return (
        <div 
          className={`bg-gradient-to-br ${className}`}
          style={{
            backgroundSize: '400% 400%',
            animation: `gradient ${20/intensity}s ease infinite`,
            ...style,
          }}
          data-effect="gradient"
        >
          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes gradient {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `
          }} />
          {children}
        </div>
      );
      
    case ThemeEffectType.CYBER:
    case ThemeEffectType.NEON:
      return (
        <div 
          className={`relative ${className}`}
          style={{
            ...style,
            '--glow-intensity': intensity,
          } as React.CSSProperties}
          data-effect="cyber"
        >
          <div className="cyber-glow absolute inset-0 z-[-1] pointer-events-none opacity-40" />
          {children}
        </div>
      );
      
    case ThemeEffectType.PULSE:
      return (
        <div 
          className={`pulse-effect ${className}`}
          style={{
            animation: `pulse ${2/intensity}s infinite ease-in-out`,
            ...style,
          }}
          data-effect="pulse"
        >
          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes pulse {
              0% { opacity: 0.7; }
              50% { opacity: 1; }
              100% { opacity: 0.7; }
            }
          `
          }} />
          {children}
        </div>
      );
      
    case ThemeEffectType.PARTICLE:
    case ThemeEffectType.PARTICLES:
      return (
        <div 
          className={`particle-container relative overflow-hidden ${className}`}
          style={style}
          data-effect="particle"
          data-intensity={intensity}
        >
          {children}
          <div className="particle-overlay absolute inset-0 z-[-1] pointer-events-none" />
        </div>
      );
      
    default:
      return <>{children}</>;
  }
};
