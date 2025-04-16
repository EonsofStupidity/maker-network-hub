
import { atom } from 'jotai';
import { AuthStatus, AUTH_STATUS } from '@/shared/types/core/auth.types';

const authStatusAtom = atom<AuthStatus>(AUTH_STATUS.IDLE);
const isAuthenticatedAtom = atom<boolean>(false);
const isAuthLoadingAtom = atom<boolean>(get => get(authStatusAtom) === AUTH_STATUS.LOADING);

export {
  authStatusAtom,
  isAuthenticatedAtom,
  isAuthLoadingAtom
};
