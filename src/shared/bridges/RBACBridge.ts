
import { ROLES, UserRole } from '../types/SharedTypes';

/**
 * RBACBridge - Role-Based Access Control Bridge
 * Provides a unified interface for checking user roles and permissions
 * without requiring direct access to the RBAC store
 */
export interface IRBACBridge {
  hasRole: (role: UserRole | UserRole[]) => boolean;
  getRoles: () => UserRole[];
  setRoles: (roles: UserRole[]) => void;
}

class RBACBridgeClass implements IRBACBridge {
  private roles: UserRole[] = [ROLES.GUEST];

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
}

// Export singleton instance
export const RBACBridge = new RBACBridgeClass();
