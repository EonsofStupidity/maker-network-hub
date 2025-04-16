
import { Layout, LayoutComponent } from '@/shared/types/core/layout.types';
import { LoadingState } from '@/shared/ui/loading-state';
import { cn } from '@/shared/utils/cn';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/core/logging.types';
import { toast } from '@/shared/ui/use-toast';

interface LayoutRendererProps {
  layout: Layout | null;
  isLoading?: boolean;
  error?: Error | null;
  fallback?: React.ReactNode;
}

export function LayoutRenderer({ layout, isLoading, error, fallback }: LayoutRendererProps) {
  const logger = useLogger('LayoutRenderer', LogCategory.UI);

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

  if (error) {
    logger.error('Layout error', { error: error.message });
    return (
      <div className="p-6 border border-destructive/30 bg-destructive/10 rounded-lg">
        <h3 className="text-lg font-medium text-destructive mb-2">Layout Error</h3>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  if (!layout || !layout.components || Object.keys(layout.components).length === 0) {
    return fallback ? <>{fallback}</> : null;
  }

  // Process and validate the layout before rendering
  try {
    return (
      <div className="layout-root" data-layout-id={layout.id}>
        {Object.values(layout.components).map((component, index) => (
          <ComponentRenderer 
            key={component.id || index} 
            component={component} 
            logger={logger}
          />
        ))}
      </div>
    );
  } catch (renderError) {
    logger.error('Layout rendering error', { error: renderError instanceof Error ? renderError.message : String(renderError) });
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
  logger: ReturnType<typeof useLogger>;
}

function ComponentRenderer({ component, logger }: ComponentRendererProps) {
  // Validate component props first
  if (!component || !component.type) {
    logger.warn('Invalid component', { details: { component } });
    return null;
  }

  const baseStyles = "w-full p-4";

  try {
    switch (component.type) {
      case 'container':
        return (
          <div className={cn(baseStyles, "border rounded-md")} data-component-type="container">
            {Array.isArray(component.children) && 
              component.children.map((child) => (
                <ComponentRenderer key={child.id} component={child} logger={logger} />
              ))}
            {component.props?.children && !Array.isArray(component.children) &&
              component.props.children}
          </div>
        );
        
      case 'text':
        return (
          <div className={cn(baseStyles)} data-component-type="text">
            {component.props?.content || 'Text content'}
          </div>
        );
        
      case 'image':
        return (
          <div className={cn(baseStyles)} data-component-type="image">
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
          <div className={cn(baseStyles, "border border-dashed border-amber-400 bg-amber-50/10")} data-component-type="unknown">
            Unknown component type: {component.type}
          </div>
        );
    }
  } catch (error) {
    logger.error('Component rendering error', { details: { componentType: component.type, error } });
    return (
      <div className="p-4 border border-destructive/30 bg-destructive/10 rounded-lg">
        <p className="text-sm text-destructive">Component Error: Failed to render {component.type}</p>
      </div>
    );
  }
}
