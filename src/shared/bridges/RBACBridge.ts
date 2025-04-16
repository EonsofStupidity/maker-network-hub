
import { UserRole, ROLES, AdminSection, SECTION_PERMISSIONS, ROLE_LABELS } from '@/shared/types/core/rbac.types';
import { useRBACStore } from '@/rbac/rbac.store';
import { logBridge } from '@/logging/bridge';
import { LogCategory } from '@/shared/types/core/logging.types';

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
  canAccessAdminSection: (section: AdminSection) => boolean;
  getRoleLabels: () => Record<UserRole, string>;
}

/**
 * Bridge for RBAC functionality between components and the RBAC store
 * This allows for consistent RBAC checks across the application
 */
class RBACBridgeImpl implements IRBACBridge {
  /**
   * Check if the current user has a specific role or one of multiple roles
   * @param role The role(s) to check
   * @returns True if the user has the role, false otherwise
   */
  public hasRole(role: UserRole | UserRole[]): boolean {
    const userRoles = this.getRoles();
    
    if (Array.isArray(role)) {
      return role.some(r => userRoles.includes(r));
    }
    
    return userRoles.includes(role);
  }
  
  /**
   * Get all roles assigned to the current user
   * @returns Array of user roles
   */
  public getRoles(): UserRole[] {
    return useRBACStore.getState().userRoles;
  }
  
  /**
   * Set roles for the current user
   * @param roles Array of roles to assign
   */
  public setRoles(roles: UserRole[]): void {
    // Ensure we always have at least GUEST role
    const safeRoles = roles.length > 0 ? roles : [ROLES.GUEST];
    
    useRBACStore.getState().setRoles(safeRoles);
    
    logBridge.info(LogCategory.RBAC, 'User roles set via bridge', {
      details: { roles: safeRoles }
    });
  }
  
  /**
   * Clear all user roles and set back to default GUEST
   */
  public clearRoles(): void {
    useRBACStore.getState().clearRoles();
    
    logBridge.info(LogCategory.RBAC, 'User roles cleared via bridge');
  }
  
  /**
   * Check if the user has admin access
   * @returns True if the user has ADMIN or SUPER_ADMIN role
   */
  public hasAdminAccess(): boolean {
    return this.hasRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]);
  }
  
  /**
   * Check if the user is a super admin
   * @returns True if the user has SUPER_ADMIN role
   */
  public isSuperAdmin(): boolean {
    return this.hasRole(ROLES.SUPER_ADMIN);
  }
  
  /**
   * Check if the user is a moderator
   * @returns True if the user has MOD, ADMIN or SUPER_ADMIN role
   */
  public isModerator(): boolean {
    return this.hasRole([ROLES.MOD, ROLES.ADMIN, ROLES.SUPER_ADMIN]);
  }
  
  /**
   * Check if the user is a builder/maker
   * @returns True if the user has MAKER role
   */
  public isBuilder(): boolean {
    return this.hasRole(ROLES.MAKER);
  }
  
  /**
   * Check if the user has a specific permission
   * @param permission The permission to check
   * @returns True if the user has the permission, false otherwise
   */
  public hasPermission(permission: string): boolean {
    return useRBACStore.getState().hasPermission(permission);
  }
  
  /**
   * Check if the user can access a specific admin section
   * @param section The admin section to check
   * @returns True if the user can access the section, false otherwise
   */
  public canAccessAdminSection(section: AdminSection): boolean {
    const userRoles = this.getRoles();
    const allowedRoles = SECTION_PERMISSIONS[section] || [];
    
    return userRoles.some(role => allowedRoles.includes(role));
  }
  
  /**
   * Get role display labels for UI
   * @returns Record with role keys and display labels
   */
  public getRoleLabels(): Record<UserRole, string> {
    return ROLE_LABELS;
  }
}

export const RBACBridge = new RBACBridgeImpl();
