
import { useCallback } from 'react';
import { RBACBridge } from '@/rbac/bridge';
import { useLogger } from '@/logging/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';
import { Permission } from '@/shared/types/core/rbac.types';

/**
 * Hook for checking admin permissions
 */
export function useAdminPermissions() {
  const logger = useLogger('useAdminPermissions', LogCategory.ADMIN);
  
  const hasPermission = useCallback((permission: Permission) => {
    // Check for direct permission
    const hasDirectPermission = RBACBridge.hasPermission(permission);
    
    // Super admin has all permissions
    const isSuperAdmin = RBACBridge.isSuperAdmin();
    
    const result = hasDirectPermission || isSuperAdmin;
    
    logger.debug(`Permission check for ${permission}`, {
      details: { permission, result }
    });
    
    return result;
  }, [logger]);
  
  return { hasPermission };
}
