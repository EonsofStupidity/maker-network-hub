
// Basic shared types to avoid circular dependencies

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4
}

export enum LogCategory {
  APP = 'APP',
  ADMIN = 'ADMIN',
  AUTH = 'AUTH',
  API = 'API',
  UI = 'UI',
  PERFORMANCE = 'PERFORMANCE',
  ERROR = 'ERROR',
  SECURITY = 'SECURITY',
  THEME = 'THEME',
  RBAC = 'RBAC',
  SYSTEM = 'SYSTEM',
  CHAT = 'CHAT',
  DEBUG = 'DEBUG'
}

export enum ROLES {
  GUEST = 'guest',
  USER = 'user',
  MAKER = 'maker',
  MOD = 'mod',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export type UserRole = keyof typeof ROLES;

export enum AUTH_STATUS {
  LOADING = 'LOADING',
  AUTHENTICATED = 'AUTHENTICATED',
  GUEST = 'GUEST',
  ERROR = 'ERROR'
}

export type AuthStatus = keyof typeof AUTH_STATUS;

export interface UserProfile {
  id: string;
  email?: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt: string;
  roles?: UserRole[];
  [key: string]: any;
}
