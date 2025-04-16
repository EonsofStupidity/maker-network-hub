
import React, { forwardRef, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { RBACBridge } from '@/rbac/bridge';
import { ROLES } from '@/shared/types/core/rbac.types';

interface ComponentWrapperProps {
  children: React.ReactNode;
  componentName: string;
  className?: string;
  id?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const ComponentWrapper = forwardRef<HTMLDivElement, ComponentWrapperProps>(
  ({ children, componentName, className, id, onClick, ...props }, ref) => {
    const isSuperAdmin = RBACBridge.hasRole(ROLES.SUPER_ADMIN);
    
    const stableId = useMemo(() => {
      return id || `${componentName}-${Math.random().toString(36).substring(2, 9)}`;
    }, [componentName, id]);
    
    const debugAttributes = useMemo(() => {
      if (!isSuperAdmin) return {};
      
      return {
        'data-component': componentName,
        'data-component-id': stableId
      };
    }, [isSuperAdmin, componentName, stableId]);
    
    return (
      <div
        ref={ref}
        className={cn('relative', className)}
        onClick={onClick}
        {...debugAttributes}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ComponentWrapper.displayName = 'ComponentWrapper';
