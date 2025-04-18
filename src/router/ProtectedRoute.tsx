
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth/hooks/useAuth';
import { UserRole } from '@/shared/types/core/rbac.types';
import { rbacBridge } from '@/bridges/rbac/bridge';
import { logBridge } from '@/bridges/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
  requiredPermission?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  requiredPermission 
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Log access attempt for auditing
  React.useEffect(() => {
    if (requiredRole || requiredPermission) {
      logBridge.info(LogCategory.AUTH, 'Protected route access attempt', {
        path: location.pathname,
        requiredRole,
        requiredPermission,
        isAuthenticated,
        userId: user?.id
      });
    }
  }, [location.pathname, requiredRole, requiredPermission, isAuthenticated, user?.id]);

  // Check authentication first
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If no specific role or permission is required, just check authentication
  if (!requiredRole && !requiredPermission) {
    return <>{children}</>;
  }

  // Check role requirement if specified
  if (requiredRole) {
    const hasRequiredRole = Array.isArray(requiredRole) 
      ? requiredRole.some(role => rbacBridge.hasRole(role))
      : rbacBridge.hasRole(requiredRole);
      
    if (!hasRequiredRole) {
      logBridge.warn(LogCategory.AUTH, 'Access denied - missing required role', {
        path: location.pathname,
        requiredRole,
        userId: user?.id
      });
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check permission requirement if specified
  if (requiredPermission && !rbacBridge.hasPermission(requiredPermission)) {
    logBridge.warn(LogCategory.AUTH, 'Access denied - missing required permission', {
      path: location.pathname,
      requiredPermission,
      userId: user?.id
    });
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
