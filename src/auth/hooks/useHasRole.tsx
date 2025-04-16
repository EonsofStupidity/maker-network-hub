
import { useCallback } from 'react';
import { useRbac } from '@/auth/rbac/use-rbac';
import { UserRole, ROLES } from '@/shared/types/core/rbac.types';

export function useHasRole(role: UserRole | UserRole[]) {
  const { hasRole } = useRbac();
  return useCallback(() => hasRole(role), [hasRole, role]);
}

export function useIsAdmin() {
  const { hasRole } = useRbac();
  return useCallback(() => {
    return hasRole([ROLES.admin, ROLES.super_admin]);
  }, [hasRole]);
}

export function useIsSuperAdmin() {
  const { hasRole } = useRbac();
  return useCallback(() => {
    return hasRole(ROLES.super_admin);
  }, [hasRole]);
}

export function useIsModerator() {
  const { hasRole } = useRbac();
  return useCallback(() => {
    return hasRole([ROLES.mod, ROLES.admin, ROLES.super_admin]);
  }, [hasRole]);
}

export function useIsBuilder() {
  const { hasRole } = useRbac();
  return useCallback(() => {
    return hasRole([ROLES.maker, ROLES.admin, ROLES.super_admin]);
  }, [hasRole]);
}
