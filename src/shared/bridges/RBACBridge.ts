
import { UserRole, Permission } from '@/shared/types/core/rbac.types';

export interface IRBACBridge {
  hasRole: (role: UserRole | UserRole[]) => boolean;
  getRoles: () => UserRole[];
  hasAdminAccess: () => boolean;
  isSuperAdmin: () => boolean;
  isModerator: () => boolean;
  isBuilder: () => boolean;
  setRoles: (roles: UserRole[]) => void;
  clearRoles: () => void;
  hasPermission: (permission: Permission) => boolean;
  canAccessAdminSection: (section?: string) => boolean;
}

class RBACBridgeClass implements IRBACBridge {
  private roles: UserRole[] = [];

  setRoles(roles: UserRole[]): void {
    // Only accept valid UserRole values
    this.roles = roles.filter(role => 
      role === 'guest' || 
      role === 'follower' || 
      role === 'maker' || 
      role === 'mod' || 
      role === 'admin' || 
      role === 'super_admin'
    ) as UserRole[];
  }

  clearRoles(): void {
    this.roles = [];
  }

  getRoles(): UserRole[] {
    return [...this.roles];
  }

  hasRole(roleOrRoles: UserRole | UserRole[]): boolean {
    const rolesToCheck = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];
    return rolesToCheck.some(role => this.roles.includes(role));
  }

  hasAdminAccess(): boolean {
    return this.hasRole(['admin', 'super_admin']);
  }

  isSuperAdmin(): boolean {
    return this.hasRole('super_admin');
  }

  isModerator(): boolean {
    return this.hasRole(['mod', 'admin', 'super_admin']);
  }

  isBuilder(): boolean {
    return this.hasRole(['maker', 'admin', 'super_admin']);
  }

  hasPermission(permission: Permission): boolean {
    return this.isSuperAdmin() || this.hasAdminAccess();
  }

  canAccessAdminSection(section?: string): boolean {
    return this.hasAdminAccess();
  }
}

export const RBACBridge = new RBACBridgeClass();
