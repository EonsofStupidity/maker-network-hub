import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { RBACBridge } from '@/rbac/bridge';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';
import { UserRole } from '@/shared/types/core/rbac.types';
import { AccountLinkingModal } from '@/auth/components/AccountLinkingModal';
import { LinkedAccountAlert } from '@/auth/components/LinkedAccountAlert';

interface AppInitializerProps {
  children: React.ReactNode;
}

/**
 * AppInitializer component
 * Handles application initialization like auth state loading
 */
export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const { initialize, isAuthenticated, status, user } = useAuthStore();
  const roles = useAuthStore(state => state.roles || []) as UserRole[];
  const logger = useLogger('AppInitializer', LogCategory.APP);
  const [isLinkingModalOpen, setIsLinkingModalOpen] = useState(false);
  
  // Initialize auth on mount
  useEffect(() => {
    const initApp = async () => {
      logger.info('Initializing application');
      
      try {
        // Load auth state
        await initialize();
        
        logger.info('Auth initialized', {
          details: { 
            isAuthenticated: useAuthStore.getState().isAuthenticated,
            status: useAuthStore.getState().status
          }
        });
      } catch (error) {
        logger.error('Failed to initialize application', {
          details: { error }
        });
      }
    };
    
    initApp();
  }, [initialize, logger]);
  
  // Update RBAC when auth state changes
  useEffect(() => {
    if (isAuthenticated && roles && roles.length > 0) {
      // Only set valid roles
      const validRoles = roles.filter(role => 
        role === 'guest' || 
        role === 'follower' || 
        role === 'maker' || 
        role === 'mod' || 
        role === 'admin' || 
        role === 'super_admin'
      ) as UserRole[];
      
      // Set roles in RBAC system
      RBACBridge.setRoles(validRoles);
      
      logger.info('User roles set in RBAC', {
        details: { roles: validRoles }
      });
    } else if (!isAuthenticated) {
      // Clear roles when logged out
      RBACBridge.clearRoles();
      
      logger.info('RBAC roles cleared');
    }
  }, [isAuthenticated, roles, logger]);
  
  // Open account linking modal handler
  const handleOpenLinkingModal = () => {
    setIsLinkingModalOpen(true);
  };
  
  return (
    <>
      {children}
      {/* These components need to be defined elsewhere */}
      {/* <LinkedAccountAlert />
      <AccountLinkingModal 
        isOpen={isLinkingModalOpen} 
        onClose={() => setIsLinkingModalOpen(false)} 
      /> */}
    </>
  );
};
