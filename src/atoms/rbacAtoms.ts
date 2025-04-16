
import { atom } from 'jotai';
import { UserRole } from '@/shared/types/core/rbac.types';
import { RBACBridge } from '@/bridges/RBACBridge';

// Ensure we're using the functions correctly
const rolesAtom = atom<UserRole[]>([]);

const hasRoleAtom = atom(
  (get) => (role: UserRole | UserRole[]) => RBACBridge.hasRole(role)
);

const hasAdminAccessAtom = atom(
  (get) => () => RBACBridge.hasAdminAccess()
);

const isSuperAdminAtom = atom(
  (get) => () => RBACBridge.isSuperAdmin()
);

const isModeratorAtom = atom(
  (get) => () => RBACBridge.isModerator && RBACBridge.isModerator()
);

const isBuilderAtom = atom(
  (get) => () => RBACBridge.isBuilder && RBACBridge.isBuilder()
);

export {
  rolesAtom,
  hasRoleAtom,
  hasAdminAccessAtom,
  isSuperAdminAtom,
  isModeratorAtom,
  isBuilderAtom
};
