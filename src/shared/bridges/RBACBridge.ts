
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
    // Validate incoming roles to ensure they match our enum
    const validRoles = roles.filter(role => 
      Object.values(ROLES).includes(role)
    );
    
    // Ensure we always have at least GUEST role
    const safeRoles = validRoles.length > 0 ? validRoles : [ROLES.GUEST];
    
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
   * Check if user has a specific permission
   * @param permission The permission to check
   * @returns True if the user has the permission
   */
  public hasPermission(permission: string): boolean {
    // Super admin has all permissions
    if (this.hasRole(ROLES.SUPER_ADMIN)) return true;
    
    // Check if any role has this permission through the store
    return useRBACStore.getState().hasPermission(permission);
  }
  
  /**
   * Check if user can access an admin section
   * @param section The admin section to check
   * @returns True if the user has access to the section
   */
  public canAccessAdminSection(section: AdminSection): boolean {
    // Get the allowed roles for this section
    const allowedRoles = SECTION_PERMISSIONS[section] || [];
    
    // Check if user has any of the allowed roles
    return this.hasRole(allowedRoles);
  }
  
  /**
   * Get role labels for UI display
   * @returns Record mapping roles to their display labels
   */
  public getRoleLabels(): Record<UserRole, string> {
    return ROLE_LABELS;
  }
}

export const RBACBridge = new RBACBridgeImpl();
