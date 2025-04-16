
import { UserRole, ROLES } from '@/shared/types/core/rbac.types';

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
  private _roles: UserRole[] = [ROLES.GUEST];
  
  setRoles(roles: UserRole[]): void {
    const validRoles = roles.filter(role => 
      role === ROLES.GUEST || 
      role === ROLES.FOLLOWER || 
      role === ROLES.MAKER || 
      role === ROLES.MOD || 
      role === ROLES.ADMIN || 
      role === ROLES.SUPER_ADMIN
    );
    this._roles = validRoles.length > 0 ? validRoles : [ROLES.GUEST];
    console.log('RBAC roles set:', this._roles);
  }

  clearRoles(): void {
    this._roles = [ROLES.GUEST];
    console.log('RBAC roles cleared, set to GUEST');
  }

  getRoles(): UserRole[] {
    return this._roles;
  }

  hasRole(roleOrRoles: UserRole | UserRole[]): boolean {
    // Super admin has all roles
    if (this._roles.includes(ROLES.SUPER_ADMIN)) {
      return true;
    }
    
    // Check for specific roles
    if (Array.isArray(roleOrRoles)) {
      return roleOrRoles.some(role => this._roles.includes(role));
    }
    
    return this._roles.includes(roleOrRoles);
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
    // Simple implementation - in real app this would check against permissions list
    if (this.isSuperAdmin()) {
      return true; // Super admin has all permissions
    }
    
    // For now, we'll just check some basic permissions based on roles
    if (permission.startsWith('admin:') && this.hasAdminAccess()) {
      return true;
    }
    
    if (permission.startsWith('moderate:') && this.isModerator()) {
      return true;
    }
    
    if (permission.startsWith('build:') && this.isBuilder()) {
      return true;
    }
    
    // Guest permissions
    if (permission === 'view:public') {
      return true;
    }
    
    return false;
  }

  canAccessAdminSection(section?: string): boolean {
    if (!section) return this.hasAdminAccess();
    
    // Super admin can access everything
    if (this.isSuperAdmin()) return true;
    
    // Check if user has the role required for this section
    switch (section) {
      case 'dashboard':
        return this.hasRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]);
      case 'users':
        return this.hasRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]);
      case 'content':
        return this.hasRole([ROLES.MOD, ROLES.ADMIN, ROLES.SUPER_ADMIN]);
      case 'settings':
        return this.hasRole(ROLES.SUPER_ADMIN);
      case 'system':
        return this.hasRole(ROLES.SUPER_ADMIN);
      default:
        return this.hasAdminAccess();
    }
  }
}

export const RBACBridge = new RBACBridgeClass();
