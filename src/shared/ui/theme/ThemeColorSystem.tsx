
import React from 'react';
import { useThemeVariables } from '@/hooks/useThemeVariables';

interface ThemeColorSystemProps {
  children?: React.ReactNode;
}

export function ThemeColorSystem({ children }: ThemeColorSystemProps) {
  const { variables } = useThemeVariables();
  
  // Safe guard if variables haven't been loaded yet
  if (!variables) {
    return <>{children}</>;
  }
  
  // Extract all CSS variables and apply them
  const cssVariables = {
    // Convert theme variables to CSS variables
    '--color-primary': variables['primary'] || '#3b82f6',
    '--color-secondary': variables['secondary'] || '#8b5cf6',
    '--color-background': variables['background'] || '#ffffff',
    '--color-foreground': variables['foreground'] || '#0f172a',
    '--color-muted': variables['muted'] || '#64748b',
    '--color-accent': variables['accent'] || '#ec4899',
    '--color-destructive': variables['destructive'] || '#ef4444',
    '--color-success': variables['success'] || '#22c55e',
    '--color-warning': variables['warning'] || '#f59e0b',
    
    // Other CSS variables
    '--font-family': variables['fontFamily'] || 'Inter, system-ui, sans-serif',
  } as React.CSSProperties;
  
  return (
    <div style={cssVariables} className="theme-container">
      {children}
    </div>
  );
}

export default ThemeColorSystem;
