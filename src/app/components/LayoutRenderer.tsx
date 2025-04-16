
import { Layout, LayoutComponent } from '@/shared/types/core/layout.types';
import { LoadingState } from '@/shared/ui/loading-state';
import { cn } from '@/shared/utils/cn';

interface LayoutRendererProps {
  layout: Layout | null;
  isLoading?: boolean;
  error?: Error | null;
}

export function LayoutRenderer({ layout, isLoading, error }: LayoutRendererProps) {
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
    return (
      <div className="p-6 border border-destructive/30 bg-destructive/10 rounded-lg">
        <h3 className="text-lg font-medium text-destructive mb-2">Layout Error</h3>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  if (!layout) return null;

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

function ComponentRenderer({ component }: { component: LayoutComponent }) {
  const baseStyles = "w-full p-4";

  switch (component.type) {
    case 'container':
      return (
        <div className={cn(baseStyles, "border rounded-md")} data-component-type="container">
          {component.props?.children?.map((child: LayoutComponent) => (
            <ComponentRenderer key={child.id} component={child} />
          ))}
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
}
