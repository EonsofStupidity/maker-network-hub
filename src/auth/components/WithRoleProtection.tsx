
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/auth/hooks/useAuth';
import { UserRole } from '@/shared/types/core/rbac.types';
import { logBridge } from '@/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';

interface WithRoleProtectionProps {
  allowedRoles: UserRole | UserRole[];
  children: React.ReactNode;
  redirectTo?: string;
  redirectWhenNotAuthenticated?: boolean;
}

export const WithRoleProtection: React.FC<WithRoleProtectionProps> = ({ 
  allowedRoles, 
  children, 
  redirectTo = '/',
  redirectWhenNotAuthenticated = true
}) => {
  const { isAuthenticated, hasRole, user } = useAuth();
  
  // Handle unauthenticated users
  if (!isAuthenticated) {
    if (redirectWhenNotAuthenticated) {
      logBridge.info(LogCategory.AUTH, 'Unauthorized access attempt (not authenticated)', {
        details: { redirectTo }
      });
      return <Navigate to="/auth" />;
    }
    return null;
  }
  
  // Check if user has required roles
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  const hasRequiredRoles = roles.some(role => hasRole(role));
  
  if (!hasRequiredRoles) {
    logBridge.warn(LogCategory.AUTH, 'Unauthorized access attempt (insufficient roles)', {
      details: { 
        userId: user?.id,
        requiredRoles: roles
      }
    });
    return <Navigate to={redirectTo} />;
  }
  
  return <>{children}</>;
};
