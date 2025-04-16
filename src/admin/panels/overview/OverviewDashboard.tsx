import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { RBACBridge } from '@/rbac/bridge';
import { ROLES, UserRole } from '@/shared/types/core/rbac.types';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/core/logging.types';

const OverviewDashboard = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const logger = useLogger('OverviewDashboard', LogCategory.ADMIN);
  
  useEffect(() => {
    if (isAuthenticated) {
      const roles = RBACBridge.getRoles();
      setUserRoles([...roles]);
      logger.info('User roles retrieved', { details: { roles } });
    }
  }, [isAuthenticated, logger]);
  
  const isSuperAdmin = RBACBridge.hasRole(ROLES.SUPER_ADMIN);
  
  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Welcome</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Hello, {user?.name || 'Administrator'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Roles: {userRoles.join(', ') || 'None assigned'}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Quick Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Users</p>
              <p className="text-2xl font-bold">128</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Content</p>
              <p className="text-2xl font-bold">45</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">System Status</h2>
          <p className="text-green-500 font-medium mb-2">All Systems Operational</p>
          <p className="text-xs text-gray-500">Last checked: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
      
      {isSuperAdmin && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-200 dark:border-blue-800">
          <h3 className="font-medium text-blue-800 dark:text-blue-300">Super Admin Controls</h3>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            You have super admin privileges. Additional controls are available.
          </p>
        </div>
      )}
    </div>
  );
};

export default OverviewDashboard;
