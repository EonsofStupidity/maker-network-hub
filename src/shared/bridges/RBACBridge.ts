
import { UserRole, ROLES, AdminSection, SECTION_PERMISSIONS, Permission } from '../types/core/rbac.types';

/**
 * RBACBridge - Role-Based Access Control Bridge
 * Provides a unified interface for checking user roles and permissions
 * without requiring direct access to the RBAC store
 */
export interface IRBACBridge {
  hasRole: (role: UserRole | UserRole[]) => boolean;
  getRoles: () => UserRole[];
  setRoles: (roles: UserRole[]) => void;
  clearRoles: () => void;
  hasAdminAccess: () => boolean;
  isSuperAdmin: () => boolean;
  isModerator: () => boolean;
  isBuilder: () => boolean;
  hasPermission: (permission: string | string[]) => boolean;
  canAccessAdminSection: (section: AdminSection) => boolean;
  getRoleLabels: () => Record<UserRole, string>;
}

class RBACBridgeClass implements IRBACBridge {
  private roles: UserRole[] = [ROLES.GUEST];
  private permissions: string[] = [];

  /**
   * Check if the current user has at least one of the specified roles
   */
  public hasRole(role: UserRole | UserRole[]): boolean {
    const rolesToCheck = Array.isArray(role) ? role : [role];
    
    // Super admin has access to everything
    if (this.roles.includes(ROLES.SUPER_ADMIN)) {
      return true;
    }
    
    return rolesToCheck.some(r => this.roles.includes(r));
  }

  /**
   * Get the current user's roles
   */
  public getRoles(): UserRole[] {
    return [...this.roles];
  }

  /**
   * Set the current user's roles
   */
  public setRoles(roles: UserRole[]): void {
    // Always ensure we have at least guest role
    this.roles = roles.length > 0 ? roles : [ROLES.GUEST];
    
    console.info('RBAC roles set:', this.roles);
  }

  /**
   * Clear the current user's roles (reset to guest)
   */
  public clearRoles(): void {
    this.roles = [ROLES.GUEST];
    this.permissions = [];
    console.info('RBAC roles cleared, reset to guest');
  }

  /**
   * Check if user has admin access
   */
  public hasAdminAccess(): boolean {
    return this.hasRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]);
  }

  /**
   * Check if user is a super admin
   */
  public isSuperAdmin(): boolean {
    return this.hasRole(ROLES.SUPER_ADMIN);
  }

  /**
   * Check if user is a moderator
   */
  public isModerator(): boolean {
    return this.hasRole([ROLES.MOD, ROLES.ADMIN, ROLES.SUPER_ADMIN]);
  }

  /**
   * Check if user is a maker/builder
   */
  public isBuilder(): boolean {
    return this.hasRole([ROLES.MAKER, ROLES.ADMIN, ROLES.SUPER_ADMIN]);
  }

  /**
   * Check if user has a specific permission
   */
  public hasPermission(permission: string | string[]): boolean {
    // Super admin has all permissions
    if (this.isSuperAdmin()) {
      return true;
    }
    
    const permissionsToCheck = Array.isArray(permission) ? permission : [permission];
    return permissionsToCheck.some(p => this.permissions.includes(p));
  }

  /**
   * Check if user can access a specific admin section
   */
  public canAccessAdminSection(section: AdminSection): boolean {
    // Check if the section has defined permissions
    const allowedRoles = SECTION_PERMISSIONS[section];
    if (!allowedRoles) {
      return this.hasAdminAccess(); // Default to general admin access
    }
    
    // Check if user has any of the allowed roles
    return allowedRoles.some(role => this.hasRole(role));
  }

  /**
   * Get role labels for UI display
   */
  public getRoleLabels(): Record<UserRole, string> {
    return {
      [ROLES.GUEST]: 'Guest',
      [ROLES.FOLLOWER]: 'Follower',
      [ROLES.MAKER]: 'Maker',
      [ROLES.MOD]: 'Moderator',
      [ROLES.ADMIN]: 'Admin',
      [ROLES.SUPER_ADMIN]: 'Super Admin'
    };
  }
}

// Export singleton instance
export const RBACBridge = new RBACBridgeClass();
