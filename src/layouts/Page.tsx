
import React, { useEffect } from 'react';
import { LayoutBootstrap } from './LayoutBootstrap';
import { logBridge } from '@/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';
import { useAuth } from '@/auth/hooks/useAuth';
import { useRbac } from '@/hooks/use-rbac';
import { LoadingState } from '@/shared/ui/loading-state';
import { UserRole } from '@/shared/types/core/rbac.types';

export interface PageProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  requiresAuth?: boolean;
  requiresRole?: UserRole | UserRole[];
  layoutType?: string;
  layoutScope?: string;
  isLoading?: boolean;
}

export function Page({
  children,
  title,
  description,
  requiresAuth = false,
  requiresRole,
  layoutType = 'page',
  layoutScope = 'site',
  isLoading = false,
}: PageProps) {
  const { isAuthenticated, user } = useAuth();
  const { hasRole } = useRbac();
  
  useEffect(() => {
    // Log page view
    logBridge.info(LogCategory.UI, 'Page viewed', {
      details: {
        title,
        path: window.location.pathname,
        authenticated: isAuthenticated,
        userId: user?.id || 'anonymous',
        timestamp: new Date().toISOString()
      }
    });
    
    // Set page title if provided
    if (title) {
      document.title = `${title} - MakersIMPULSE`;
    }
  }, [title, isAuthenticated, user]);
  
  // Check authentication requirement
  if (requiresAuth && !isAuthenticated) {
    logBridge.warn(LogCategory.AUTH, 'Unauthorized page access attempt', {
      details: { path: window.location.pathname }
    });
    
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-destructive/10 p-6 rounded-lg text-center">
          <h2 className="text-xl font-bold mb-2">Authentication Required</h2>
          <p className="mb-4">Please log in to access this page.</p>
          <a href="/auth" className="bg-primary text-white px-4 py-2 rounded">Login</a>
        </div>
      </div>
    );
  }
  
  // Check role requirement - cast to proper type to fix TS error
  if (requiresRole && !hasRole(requiresRole as UserRole | UserRole[])) {
    logBridge.warn(LogCategory.RBAC, 'Insufficient permissions for page access', {
      details: { 
        path: window.location.pathname,
        requiredRole: requiresRole,
        userId: user?.id
      }
    });
    
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-destructive/10 p-6 rounded-lg text-center">
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="mb-4">You don't have permission to access this page.</p>
          <a href="/" className="bg-primary text-white px-4 py-2 rounded">Return Home</a>
        </div>
      </div>
    );
  }
  
  // Show loading state if needed
  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <LoadingState type="text" className="max-w-md mb-4" />
        <CardSkeleton />
      </div>
    );
  }
  
  // Render page with layout bootstrap
  return (
    <LayoutBootstrap type={layoutType} scope={layoutScope}>
      {title && (
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}
      {children}
    </LayoutBootstrap>
  );
}

// Helper skeleton components
const CardSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="border rounded-lg p-4">
        <LoadingState type="text" className="mb-4" />
        <LoadingState type="text" width="70%" className="mb-2" />
        <LoadingState type="text" width="40%" />
      </div>
    ))}
  </div>
);
