
import { z } from 'zod';
import { UserRole } from '@/shared/types/core/rbac.types';

// Define the shape of RBACBridge using Zod schema
export const RBACBridgeSchema = z.object({
  getRoles: z.function().returns(z.array(z.string())),
  hasRole: z.function().args(z.union([z.string(), z.array(z.string())])).returns(z.boolean()),
  setRoles: z.function().args(z.array(z.string())).returns(z.void()),
  initialize: z.function().returns(z.promise(z.void())),
  hasAdminAccess: z.function().returns(z.boolean()),
  hasPermission: z.function().args(z.string()).returns(z.boolean()),
});

// Export the type of RBACBridge
export type IRBACBridge = z.infer<typeof RBACBridgeSchema>;

/**
 * RBACBridge provides role-based access control functionality
 * without exposing direct access to the underlying store
 */
class RBACBridgeClass implements IRBACBridge {
  private _roles: string[] = [];
  private _isInitialized = false;
  private _permissions: Set<string> = new Set();
  
  getRoles(): string[] {
    return [...this._roles];
  }
  
  hasRole(role: string | string[]): boolean {
    if (Array.isArray(role)) {
      return role.some(r => this._roles.includes(r));
    }
    return this._roles.includes(role);
  }
  
  setRoles(roles: string[]): void {
    this._roles = [...roles];
    this._updatePermissions();
  }
  
  /**
   * Check if the current user has admin access
   */
  hasAdminAccess(): boolean {
    return this.hasRole(['admin', 'superadmin']);
  }
  
  /**
   * Check if user has a specific permission
   */
  hasPermission(permission: string): boolean {
    return this._permissions.has(permission);
  }
  
  /**
   * Update the permissions set based on roles
   */
  private _updatePermissions(): void {
    // Clear existing permissions
    this._permissions.clear();
    
    // Add permissions based on roles
    // This is a simple implementation - in a real app, you would fetch these from a mapping
    if (this.hasRole('admin')) {
      // Admin permissions
      this._permissions.add('users:read');
      this._permissions.add('users:write');
      this._permissions.add('content:read');
      this._permissions.add('content:write');
      this._permissions.add('settings:read');
      this._permissions.add('settings:write');
    } else if (this.hasRole('editor')) {
      // Editor permissions
      this._permissions.add('content:read');
      this._permissions.add('content:write');
    } else if (this.hasRole('viewer')) {
      // Viewer permissions
      this._permissions.add('content:read');
    }
    
    // All authenticated users
    if (this._roles.length > 0 && !this.hasRole('guest')) {
      this._permissions.add('profile:read');
      this._permissions.add('profile:write');
    }
  }
  
  async initialize(): Promise<void> {
    // Default to guest access until roles are loaded
    this._roles = ['guest'];
    this._updatePermissions();
    this._isInitialized = true;
    console.log('RBAC Bridge initialized');
  }
}

export const rbacBridge = new RBACBridgeClass();
export const useRBACBridge = () => rbacBridge;

// Validate at runtime in development
if (process.env.NODE_ENV === 'development') {
  try {
    RBACBridgeSchema.parse(rbacBridge);
    console.log('RBACBridge passes schema validation');
  } catch (error) {
    console.error('RBACBridge fails schema validation:', error);
  }
}
