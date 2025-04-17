
import { Layout, LayoutComponent } from '@/shared/types/core/layout.types';
import { LoadingState } from '@/shared/ui/loading-state';
import { cn } from '@/shared/utils/cn';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/core/logging.types';
import { toast } from '@/shared/ui/use-toast';
import { useEffect, useState } from 'react';

interface LayoutRendererProps {
  layout: Layout | null;
  isLoading?: boolean;
  error?: Error | null;
  fallback?: React.ReactNode;
}

export function LayoutRenderer({ layout, isLoading, error, fallback }: LayoutRendererProps) {
  const logger = useLogger('LayoutRenderer', LogCategory.UI);
  const [renderError, setRenderError] = useState<Error | null>(null);

  // Reset render error when layout changes
  useEffect(() => {
    setRenderError(null);
  }, [layout]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <LoadingState type="text" count={1} className="max-w-sm" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <LoadingState type="card" count={3} />
        </div>
        <LoadingState type="text" count={1} className="h-64" />
      </div>
    );
  }

  if (error || renderError) {
    const displayError = renderError || error;
    logger.error('Layout error', { error: displayError?.message });
    return (
      <div className="p-6 border border-destructive/30 bg-destructive/10 rounded-lg">
        <h3 className="text-lg font-medium text-destructive mb-2">Layout Error</h3>
        <p className="text-sm">{displayError?.message}</p>
      </div>
    );
  }

  if (!layout || !layout.components || Object.keys(layout.components).length === 0) {
    return fallback ? <>{fallback}</> : null;
  }

  // Process and validate the layout before rendering
  try {
    // Get all top-level components (those without a parent)
    const topLevelItems = layout.layout.filter(item => !item.parentId);
    
    // Sort by position
    topLevelItems.sort((a, b) => a.position - b.position);
    
    return (
      <div className="layout-root" data-layout-id={layout.id}>
        {topLevelItems.map((item) => {
          const component = layout.components[item.componentId];
          if (!component) {
            logger.warn('Component not found in layout', { 
              details: { componentId: item.componentId }
            });
            return null;
          }
          
          return (
            <ComponentRenderer 
              key={item.id} 
              component={component}
              componentId={item.componentId}
              layout={layout}
              layoutItem={item}
              logger={logger}
            />
          );
        })}
      </div>
    );
  } catch (renderErr) {
    const error = renderErr instanceof Error ? renderErr : new Error(String(renderErr));
    logger.error('Layout rendering error', { error: error.message });
    setRenderError(error);
    
    toast({
      title: "Layout Error",
      description: "There was a problem rendering the layout. Showing fallback content.",
      variant: "destructive"
    });
    
    return fallback ? <>{fallback}</> : null;
  }
}

interface ComponentRendererProps {
  component: LayoutComponent;
  componentId: string;
  layout: Layout;
  layoutItem: Layout['layout'][0];
  logger: ReturnType<typeof useLogger>;
}

function ComponentRenderer({ component, componentId, layout, layoutItem, logger }: ComponentRendererProps) {
  // Validate component props first
  if (!component || !component.type) {
    logger.warn('Invalid component', { details: { component } });
    return null;
  }

  // Find child layout items for this component
  const childItems = layout.layout
    .filter(item => item.parentId === layoutItem.id)
    .sort((a, b) => a.position - b.position);

  const baseStyles = "w-full p-4";
  
  // Set up error boundary at component level
  try {
    switch (component.type) {
      case 'container':
        return (
          <div className={cn(baseStyles, "border rounded-md")} data-component-type="container" data-component-id={componentId}>
            {childItems.map((childItem) => {
              const childComponent = layout.components[childItem.componentId];
              if (!childComponent) return null;
              
              return (
                <ComponentRenderer 
                  key={childItem.id}
                  component={childComponent}
                  componentId={childItem.componentId}
                  layout={layout}
                  layoutItem={childItem}
                  logger={logger}
                />
              );
            })}
            {component.props?.children && !childItems.length && component.props.children}
          </div>
        );
        
      case 'text':
        return (
          <div className={cn(baseStyles)} data-component-type="text" data-component-id={componentId}>
            {component.props?.content || 'Text content'}
          </div>
        );
        
      case 'image':
        return (
          <div className={cn(baseStyles)} data-component-type="image" data-component-id={componentId}>
            <img 
              src={component.props?.src || ''} 
              alt={component.props?.alt || ''} 
              className="max-w-full h-auto rounded-md"
              onError={(e) => {
                logger.warn('Image failed to load', { details: { src: component.props?.src } });
                e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Image+Error';
              }}
            />
          </div>
        );
        
      default:
        return (
          <div 
            className={cn(baseStyles, "border border-dashed border-amber-400 bg-amber-50/10")} 
            data-component-type="unknown"
            data-component-id={componentId}
          >
            Unknown component type: {component.type}
          </div>
        );
    }
  } catch (error) {
    logger.error('Component rendering error', { 
      details: { componentType: component.type, error } 
    });
    return (
      <div className="p-4 border border-destructive/30 bg-destructive/10 rounded-lg">
        <p className="text-sm text-destructive">Component Error: Failed to render {component.type}</p>
      </div>
    );
  }
}
