
import React from 'react';
import { useAuth } from '@/auth/hooks/useAuth';
import { UserRole, ROLES } from '@/shared/types/core/rbac.types';

interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: UserRole | UserRole[];
  fallback?: React.ReactNode;
}

/**
 * Role-based access control gate component
 * Only renders children if the user has the required role(s)
 */
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

/**
 * AdminGate - Only allows admin and super admin users
 */
export const AdminGate: React.FC<Omit<RoleGateProps, 'allowedRoles'>> = ({ 
  children, 
  fallback = null 
}) => {
  return (
    <RoleGate allowedRoles={[ROLES.admin, ROLES.super_admin]} fallback={fallback}>
      {children}
    </RoleGate>
  );
};

/**
 * SuperAdminGate - Only allows super admin users
 */
export const SuperAdminGate: React.FC<Omit<RoleGateProps, 'allowedRoles'>> = ({ 
  children, 
  fallback = null 
}) => {
  return (
    <RoleGate allowedRoles={[ROLES.super_admin]} fallback={fallback}>
      {children}
    </RoleGate>
  );
};
