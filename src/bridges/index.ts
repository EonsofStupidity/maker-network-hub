
/**
 * Bridges index file
 * Re-exports all bridge instances for convenient imports
 */

// Auth bridge
export { authBridge, useAuthBridge } from './auth/bridge';

// RBAC bridge
export { rbacBridge, useRBACBridge } from './rbac/bridge';

// Theme bridge
export { themeBridge, useThemeBridge } from './theme/bridge';

// Content bridge
export { contentBridge, useContentBridge } from './content/bridge';

// Logging bridge
export { logBridge } from './logging/bridge';
