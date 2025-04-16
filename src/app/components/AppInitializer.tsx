
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { RBACBridge } from '@/rbac/bridge';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';
import { UserRole, ROLES } from '@/shared/types/core/rbac.types';
import { AUTH_STATUS } from '@/shared/types/core/auth.types';

interface AppInitializerProps {
  children: React.ReactNode;
}

export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { initialize, isAuthenticated, status, user } = useAuthStore();
  const logger = useLogger('AppInitializer', LogCategory.APP);
  
  // Update RBAC when auth state changes
  useEffect(() => {
    if (isAuthenticated && user) {
      // Only set valid roles
      const validRoles = (user.roles || []).filter(role => 
        role === ROLES.GUEST || 
        role === ROLES.FOLLOWER || 
        role === ROLES.MAKER || 
        role === ROLES.MOD || 
        role === ROLES.ADMIN || 
        role === ROLES.SUPER_ADMIN
      ) as UserRole[];
      
      // Set roles in RBAC system
      RBACBridge.setRoles(validRoles);
      
      logger.info('User roles set in RBAC', {
        details: { roles: validRoles }
      });
    } else {
      // Clear roles when logged out
      RBACBridge.clearRoles();
      RBACBridge.setRoles([ROLES.GUEST]);
      
      logger.info('RBAC roles cleared');
    }
  }, [isAuthenticated, user, logger]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return <>{children}</>;
};
