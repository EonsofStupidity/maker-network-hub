
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { RBACBridge } from '@/shared/bridges/RBACBridge';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/core/logging.types';
import { UserRole, ROLES } from '@/shared/types/core/rbac.types';
import { AUTH_STATUS } from '@/shared/types/core/auth.types';

interface AppInitializerProps {
  children: React.ReactNode;
}

export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { initialize, isAuthenticated, status, user } = useAuthStore();
  const logger = useLogger('AppInitializer', LogCategory.APP);
  
  // Initialize auth
  useEffect(() => {
    if (!isInitialized) {
      initialize().finally(() => {
        setIsInitialized(true);
      });
    }
  }, [initialize, isInitialized]);
  
  // Update RBAC when auth state changes
  useEffect(() => {
    if (status !== AUTH_STATUS.LOADING) {
      if (isAuthenticated && user) {
        // Only set valid roles
        const validRoles = (user.roles || []).filter(role => 
          Object.values(ROLES).includes(role as UserRole)
        ) as UserRole[];
        
        // Set roles in RBAC system - default to guest if no valid roles
        if (validRoles.length === 0) {
          RBACBridge.setRoles([ROLES.GUEST]);
          logger.info('No valid roles found, set to GUEST', { 
            details: { userId: user.id } 
          });
        } else {
          RBACBridge.setRoles(validRoles);
          logger.info('User roles set in RBAC', {
            details: { roles: validRoles }
          });
        }
      } else {
        // Clear roles when logged out
        RBACBridge.clearRoles();
        logger.info('RBAC roles cleared, set to GUEST');
      }
    }
  }, [isAuthenticated, user, status, logger]);

  if (!isInitialized || status === AUTH_STATUS.LOADING) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return <>{children}</>;
};
