
import { UserRole, ROLES } from '@/shared/types/core/rbac.types';
import { useRBACStore } from '@/rbac/rbac.store';

export interface IRBACBridge {
  hasRole: (role: UserRole | UserRole[]) => boolean;
  getRoles: () => UserRole[];
  hasAdminAccess: () => boolean;
  isSuperAdmin: () => boolean;
  isModerator: () => boolean;
  isBuilder: () => boolean;
  setRoles: (roles: UserRole[]) => void;
  clearRoles: () => void;
  hasPermission: (permission: string) => boolean;
  canAccessAdminSection: (section?: string) => boolean;
}

class RBACBridgeClass implements IRBACBridge {
  setRoles(roles: UserRole[]): void {
    const validRoles = roles.filter(role => 
      role === ROLES.GUEST || 
      role === ROLES.FOLLOWER || 
      role === ROLES.MAKER || 
      role === ROLES.MOD || 
      role === ROLES.ADMIN || 
      role === ROLES.SUPER_ADMIN
    );
    useRBACStore.getState().setUserRoles(validRoles);
  }

  clearRoles(): void {
    useRBACStore.getState().clearUserRoles();
  }

  getRoles(): UserRole[] {
    return useRBACStore.getState().userRoles;
  }

  hasRole(roleOrRoles: UserRole | UserRole[]): boolean {
    return useRBACStore.getState().hasRole(roleOrRoles);
  }

  hasAdminAccess(): boolean {
    return this.hasRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]);
  }

  isSuperAdmin(): boolean {
    return this.hasRole(ROLES.SUPER_ADMIN);
  }

  isModerator(): boolean {
    return this.hasRole([ROLES.MOD, ROLES.ADMIN, ROLES.SUPER_ADMIN]);
  }

  isBuilder(): boolean {
    return this.hasRole([ROLES.MAKER, ROLES.ADMIN, ROLES.SUPER_ADMIN]);
  }

  hasPermission(permission: string): boolean {
    return useRBACStore.getState().hasPermission(permission);
  }

  canAccessAdminSection(section?: string): boolean {
    if (!section) return this.hasAdminAccess();
    
    // Super admin can access everything
    if (this.isSuperAdmin()) return true;
    
    // Check if user has the role required for this section
    const userRoles = this.getRoles();
    
    switch (section) {
      case 'dashboard':
        return userRoles.some(role => [ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(role));
      case 'users':
        return userRoles.some(role => [ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(role));
      case 'content':
        return userRoles.some(role => [ROLES.MOD, ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(role));
      case 'settings':
        return userRoles.includes(ROLES.SUPER_ADMIN);
      case 'system':
        return userRoles.includes(ROLES.SUPER_ADMIN);
      default:
        return this.hasAdminAccess();
    }
  }
}

export const RBACBridge = new RBACBridgeClass();
