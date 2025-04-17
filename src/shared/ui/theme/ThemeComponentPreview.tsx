
import React from 'react';
import { Theme } from '@/shared/types/core/theme.types';

interface ThemeComponent {
  component_name?: string;
  id?: string;
  styles?: Record<string, string>;
}

interface ThemeComponentPreviewProps {
  component?: ThemeComponent;
  className?: string;
}

export const ThemeComponentPreview: React.FC<ThemeComponentPreviewProps> = ({
  component,
  className = ''
}) => {
  if (!component) return null;
  
  return (
    <div className={`p-4 border rounded-md ${className}`}>
      <h3 className="text-lg font-medium mb-2">{component.component_name || component.id}</h3>
      <div className="text-sm">
        {Object.entries(component.styles || {}).map(([key, value]) => (
          <div key={key} className="grid grid-cols-2 gap-2">
            <span className="text-gray-500">{key}:</span>
            <span>{String(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeComponentPreview;
