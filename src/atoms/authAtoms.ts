
import { atom } from 'jotai';
import { AuthStatus, AuthStatusEnum } from '@/shared/types/core/auth.types';

// We need to reference the enum values directly, not use the type as a value
const authStatusAtom = atom<AuthStatus>(AuthStatusEnum.IDLE);
const isAuthenticatedAtom = atom<boolean>(false);
const isAuthLoadingAtom = atom<boolean>(get => get(authStatusAtom) === AuthStatusEnum.LOADING);

export {
  authStatusAtom,
  isAuthenticatedAtom,
  isAuthLoadingAtom
};
