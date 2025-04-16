
import React, { useMemo } from 'react';
import { Layout, LayoutComponent } from '@/shared/types/core/layout.types';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/core/logging.types';
import { Skeleton } from '@/shared/ui/skeleton';

interface LayoutRendererProps {
  layout: Layout | null;
  isLoading?: boolean;
  fallback?: React.ReactNode;
  error?: Error | null;
}

export function LayoutRenderer({ layout, isLoading, fallback, error }: LayoutRendererProps) {
  const logger = useLogger('LayoutRenderer', LogCategory.ADMIN);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full max-w-sm" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  // Show error state
  if (error) {
    logger.error('Layout error', { details: { error: error.message } });
    return (
      <div className="p-6 border border-destructive/30 bg-destructive/10 rounded-lg">
        <h3 className="text-lg font-medium text-destructive mb-2">Layout Error</h3>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }
  
  // Show fallback if no layout
  if (!layout || !layout.components || Object.keys(layout.components).length === 0) {
    return fallback ? <>{fallback}</> : null;
  }
  
  // Root-level component renderer
  return (
    <div className="layout-root" data-layout-id={layout.id}>
      {Object.values(layout.components).map((component, index) => (
        <ComponentRenderer 
          key={component.id || index} 
          component={component} 
        />
      ))}
    </div>
  );
}

interface ComponentRendererProps {
  component: LayoutComponent;
}

function ComponentRenderer({ component }: ComponentRendererProps) {
  const logger = useLogger('ComponentRenderer', LogCategory.ADMIN);
  
  // Basic component rendering
  const renderComponent = () => {
    switch(component.type) {
      case 'container':
        return (
          <div className="border rounded-md p-4 mb-4" data-component-type="container">
            {component.props?.children}
          </div>
        );
        
      case 'text':
        return (
          <div className="mb-4" data-component-type="text">
            <p>{component.props?.content || 'Text content'}</p>
          </div>
        );
        
      case 'image':
        return (
          <div className="mb-4" data-component-type="image">
            <img 
              src={component.props?.src || 'https://via.placeholder.com/400x200'} 
              alt={component.props?.alt || 'Image'} 
              className="max-w-full h-auto rounded-md"
            />
          </div>
        );
        
      default:
        logger.warn('Unknown component type', { details: { type: component.type } });
        return (
          <div className="border border-dashed border-amber-400 p-4 mb-4 bg-amber-50 text-amber-600 rounded-md">
            Unknown component type: {component.type}
          </div>
        );
    }
  };
  
  return renderComponent();
}
