
import { useCallback } from 'react';
import { RBACBridge } from '@/shared/bridges/RBACBridge';
import { useRbac } from '@/hooks/use-rbac';
import { ROLES, AdminSection } from '@/shared/types/core/rbac.types';
import { useNavigate } from 'react-router-dom';
import { logBridge } from '@/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';

/**
 * Hook for handling admin access and permissions
 */
export function useAdminAccess() {
  const { roles, hasRole } = useRbac();
  const navigate = useNavigate();
  
  // Check if user can access a specific admin section
  const canAccessSection = useCallback((section: AdminSection) => {
    const hasAccess = RBACBridge.canAccessAdminSection(section);
    
    if (!hasAccess) {
      logBridge.warn(LogCategory.RBAC, 'Admin section access denied', {
        details: {
          section,
          roles,
        }
      });
    }
    
    return hasAccess;
  }, [roles]);
  
  // Navigate to admin section with access check
  const navigateToSection = useCallback((section: AdminSection) => {
    if (canAccessSection(section)) {
      navigate(`/admin/${section}`);
    } else {
      logBridge.warn(LogCategory.RBAC, 'Navigation to admin section blocked', {
        details: { section }
      });
      navigate('/admin');
    }
  }, [canAccessSection, navigate]);
  
  return {
    hasAdminAccess: useCallback(() => hasRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]), [hasRole]),
    isSuperAdmin: useCallback(() => hasRole(ROLES.SUPER_ADMIN), [hasRole]),
    canAccessSection,
    navigateToSection,
  };
}
