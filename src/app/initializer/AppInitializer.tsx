
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { useRBACStore } from '@/rbac/rbac.store';
import { AuthStatusEnum } from '@/shared/types/core/auth.types';
import { ROLES } from '@/shared/types/core/rbac.types';

interface AppInitializerProps {
  children: React.ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const { status, isAuthenticated, user } = useAuthStore();
  const { setUserRoles } = useRBACStore();
  
  useEffect(() => {
    if (status !== AuthStatusEnum.LOADING) {
      if (isAuthenticated && user) {
        // If user has roles in appMetadata, use those
        const userRoles = user.appMetadata?.roles as string[] || [];
        
        // Always include guest role as fallback
        if (userRoles.length === 0) {
          setUserRoles([ROLES.guest]);
        } else {
          setUserRoles(userRoles as any[]);
        }
      } else {
        // Set guest role for unauthenticated users
        setUserRoles([ROLES.guest]);
      }
      
      setIsInitialized(true);
    }
  }, [status, isAuthenticated, user, setUserRoles]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return <>{children}</>;
}
