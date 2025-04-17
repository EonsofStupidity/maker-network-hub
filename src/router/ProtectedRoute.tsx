
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/auth/hooks/useAuth';
import { UserRole } from '@/shared/types/core/rbac.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // If no specific role is required, just check authentication
  if (!requiredRole) {
    return <>{children}</>;
  }

  // Check role requirement
  const hasRequiredRole = user?.roles?.includes(requiredRole);
  if (!hasRequiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
