
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { useRBACStore } from '@/rbac/rbac.store';
import { RBACBridge } from '@/shared/bridges/RBACBridge';
import { AUTH_STATUS } from '@/shared/types/core/auth.types';
import { ROLES, UserRole } from '@/shared/types/core/rbac.types';
import { useLogger } from '@/logging/hooks/use-logger';
import { LogCategory } from '@/shared/types/core/logging.types';

interface AppInitializerProps {
  children: React.ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const { status, isAuthenticated, user, initialize } = useAuthStore();
  const { setUserRoles } = useRBACStore();
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
        // If user has roles in appMetadata, use those
        const userRoles = user.roles || [];
        
        // Map roles to correct format and validate
        const validRoles = userRoles.filter(role => 
          Object.values(ROLES).includes(role as UserRole)
        ) as UserRole[];
        
        // Always include guest role as fallback
        if (validRoles.length === 0) {
          setUserRoles([ROLES.GUEST]);
          RBACBridge.setRoles([ROLES.GUEST]);
        } else {
          setUserRoles(validRoles);
          RBACBridge.setRoles(validRoles);
        }
        
        logger.info('User roles set in RBAC store', {
          details: { roles: validRoles }
        });
      } else {
        // Set guest role for unauthenticated users
        setUserRoles([ROLES.GUEST]);
        RBACBridge.setRoles([ROLES.GUEST]);
        logger.info('Guest role set in RBAC store');
      }
    }
  }, [status, isAuthenticated, user, setUserRoles, logger]);

  if (!isInitialized || status === AUTH_STATUS.LOADING) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return <>{children}</>;
}
