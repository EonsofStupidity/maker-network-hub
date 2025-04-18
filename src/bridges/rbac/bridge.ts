
import { z } from 'zod';
import { UserRole } from '@/shared/types/core/rbac.types';

// Define the shape of RBACBridge using Zod schema
export const RBACBridgeSchema = z.object({
  getRoles: z.function().returns(z.array(z.string())),
  hasRole: z.function().args(z.union([z.string(), z.array(z.string())])).returns(z.boolean()),
  setRoles: z.function().args(z.array(z.string())).returns(z.void()),
  initialize: z.function().returns(z.promise(z.void())),
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
  }
  
  async initialize(): Promise<void> {
    // Default to guest access until roles are loaded
    this._roles = ['guest'];
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
  } catch (error) {
    console.error('RBACBridge fails schema validation:', error);
  }
}
