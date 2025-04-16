
import { UserRole, ROLES } from '@/shared/types/core/rbac.types';
import type { Permission } from '@/shared/types/core/rbac.types';

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
    this.roles = roles.filter(role => 
      role === ROLES.guest || 
      role === ROLES.follower || 
      role === ROLES.maker || 
      role === ROLES.mod || 
      role === ROLES.admin || 
      role === ROLES.super_admin
    );
  }

  clearRoles(): void {
    this.roles = [];
  }

  getRoles(): UserRole[] {
    return [...this.roles];
  }

  hasRole(roleOrRoles: UserRole | UserRole[]): boolean {
    if (!this.roles || this.roles.length === 0) return false;
    const rolesToCheck = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];
    return rolesToCheck.some(role => this.roles.includes(role));
  }

  hasAdminAccess(): boolean {
    return this.hasRole([ROLES.admin, ROLES.super_admin]);
  }

  isSuperAdmin(): boolean {
    return this.hasRole(ROLES.super_admin);
  }

  isModerator(): boolean {
    return this.hasRole([ROLES.mod, ROLES.admin, ROLES.super_admin]);
  }

  isBuilder(): boolean {
    return this.hasRole([ROLES.maker, ROLES.admin, ROLES.super_admin]);
  }

  hasPermission(permission: Permission): boolean {
    return this.isSuperAdmin() || this.hasAdminAccess();
  }

  canAccessAdminSection(section?: string): boolean {
    return this.hasAdminAccess();
  }
}

export const RBACBridge = new RBACBridgeClass();
