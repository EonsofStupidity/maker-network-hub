
import { UserRole, Permission, ROLES, AdminSection, SECTION_PERMISSIONS } from '@/shared/types/core/rbac.types';

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
  private roles: UserRole[] = [ROLES.GUEST];

  setRoles(roles: UserRole[]): void {
    // Only accept valid UserRole values
    this.roles = roles.filter(role => 
      role === ROLES.GUEST || 
      role === ROLES.FOLLOWER || 
      role === ROLES.MAKER || 
      role === ROLES.MOD || 
      role === ROLES.ADMIN || 
      role === ROLES.SUPER_ADMIN
    );
    
    // Always include GUEST as fallback if no roles
    if (this.roles.length === 0) {
      this.roles = [ROLES.GUEST];
    }
    
    console.log('RBAC roles set:', this.roles);
  }

  clearRoles(): void {
    this.roles = [ROLES.GUEST];
    console.log('RBAC roles cleared, set to GUEST');
  }

  getRoles(): UserRole[] {
    return [...this.roles];
  }

  hasRole(roleOrRoles: UserRole | UserRole[]): boolean {
    if (!this.roles || this.roles.length === 0) return false;
    
    // Super admin has all roles
    if (this.roles.includes(ROLES.SUPER_ADMIN)) return true;
    
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
    // This will be expanded with actual permission mapping
    // For now, super admins have all permissions, admins most permissions
    if (this.isSuperAdmin()) return true;
    if (this.hasAdminAccess() && permission !== 'manage_api_keys') return true;
    
    // For other roles, we'll need to implement proper permission mappings
    return false;
  }

  canAccessAdminSection(section?: string): boolean {
    if (!section) return this.hasAdminAccess();
    
    if (this.isSuperAdmin()) return true;
    
    const sectionKey = section as AdminSection;
    if (SECTION_PERMISSIONS[sectionKey]) {
      return this.hasRole(SECTION_PERMISSIONS[sectionKey]);
    }
    
    return this.hasAdminAccess();
  }
}

export const RBACBridge = new RBACBridgeClass();
