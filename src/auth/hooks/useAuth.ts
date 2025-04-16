
import { useAuthStore } from '../store/auth.store';
import { RBACBridge } from '@/shared/bridges/RBACBridge';
import { UserRole } from '@/shared/types/core/rbac.types';

export function useAuth() {
  const { 
    user, 
    isAuthenticated, 
    login, 
    logout, 
    signup, 
    resetPassword,
    status,
    error
  } = useAuthStore();
  
  // Get roles from RBAC bridge
  const roles = RBACBridge.getRoles();
  
  // Check if user has specific role
  const hasRole = (role: UserRole | UserRole[]): boolean => {
    return RBACBridge.hasRole(role);
  };
  
  // Rename to conform to the interface expected in the components
  const signIn = login;
  const signOut = logout;
  const signUp = signup;
  
  return {
    user,
    isAuthenticated,
    isLoading: status === 'LOADING',
    roles,
    hasRole,
    signIn,
    signOut,
    signUp,
    resetPassword,
    error
  };
}
