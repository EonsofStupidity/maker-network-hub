
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { useRBACStore } from '@/rbac/rbac.store';
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
        
        // Map roles to correct format
        const validRoles = userRoles.filter(role => 
          role === ROLES.GUEST || 
          role === ROLES.FOLLOWER || 
          role === ROLES.MAKER || 
          role === ROLES.MOD || 
          role === ROLES.ADMIN || 
          role === ROLES.SUPER_ADMIN
        ) as UserRole[];
        
        // Always include guest role as fallback
        if (validRoles.length === 0) {
          setUserRoles([ROLES.GUEST]);
        } else {
          setUserRoles(validRoles);
        }
        
        logger.info('User roles set in RBAC store', {
          details: { roles: validRoles }
        });
      } else {
        // Set guest role for unauthenticated users
        setUserRoles([ROLES.GUEST]);
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
