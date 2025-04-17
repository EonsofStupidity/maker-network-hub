
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/auth/hooks/useAuth';
import { UserRole } from '@/shared/types/core/rbac.types';

interface WithRoleProtectionProps {
  allowedRoles: UserRole | UserRole[];
  children: React.ReactNode;
  redirectTo?: string;
}

export const WithRoleProtection: React.FC<WithRoleProtectionProps> = ({ 
  allowedRoles, 
  children, 
  redirectTo = '/auth' 
}) => {
  const { isAuthenticated, hasRole } = useAuth();
  
  // For public-first access: if not authenticated, render children by default
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }
  
  // Check if user has required roles
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  const hasRequiredRoles = roles.some(role => hasRole(role));
  
  if (!hasRequiredRoles) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};
