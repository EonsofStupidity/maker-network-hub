
/**
 * Auth permissions constants
 */
export const AUTH_PERMISSIONS = {
  // Admin permissions
  ADMIN_ACCESS: 'admin:access',
  
  // Content permissions
  VIEW_CONTENT: 'content:view',
  CREATE_CONTENT: 'content:create',
  EDIT_CONTENT: 'content:edit',
  DELETE_CONTENT: 'content:delete',
  
  // User management
  VIEW_USERS: 'users:view',
  EDIT_USERS: 'users:edit',
  DELETE_USERS: 'users:delete',
  
  // System permissions
  SYSTEM_VIEW: 'system:view',
  SYSTEM_EDIT: 'system:edit'
} as const;

export type AuthPermissionValue = typeof AUTH_PERMISSIONS[keyof typeof AUTH_PERMISSIONS];
