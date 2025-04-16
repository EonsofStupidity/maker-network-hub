
import { UserRole, ROLES, Permission } from '@/shared/types/core/rbac.types';
import type { AdminSection, SECTION_PERMISSIONS } from '@/shared/types/core/rbac.types';

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
      role === ROLES.GUEST || 
      role === ROLES.FOLLOWER || 
      role === ROLES.MAKER || 
      role === ROLES.MOD || 
      role === ROLES.ADMIN || 
      role === ROLES.SUPER_ADMIN
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

  hasPermission(permission: Permission): boolean {
    return this.isSuperAdmin() || this.hasAdminAccess();
  }

  canAccessAdminSection(section?: string): boolean {
    return this.hasAdminAccess();
  }
}

export const RBACBridge = new RBACBridgeClass();
