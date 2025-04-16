
import React from 'react';
import { useAuth } from '@/auth/hooks/useAuth';
import { UserRole, ROLES } from '@/shared/types/core/rbac.types';

interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: UserRole | UserRole[];
  fallback?: React.ReactNode;
}

export const RoleGate: React.FC<RoleGateProps> = ({ 
  children, 
  allowedRoles,
  fallback = null
}) => {
  const { hasRole } = useAuth();
  
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  const hasPermission = roles.some(role => hasRole(role));
  
  if (!hasPermission) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

export const AdminGate: React.FC<Omit<RoleGateProps, 'allowedRoles'>> = ({ 
  children, 
  fallback = null 
}) => {
  return (
    <RoleGate allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]} fallback={fallback}>
      {children}
    </RoleGate>
  );
};

export const SuperAdminGate: React.FC<Omit<RoleGateProps, 'allowedRoles'>> = ({ 
  children, 
  fallback = null 
}) => {
  return (
    <RoleGate allowedRoles={[ROLES.SUPER_ADMIN]} fallback={fallback}>
      {children}
    </RoleGate>
  );
};
