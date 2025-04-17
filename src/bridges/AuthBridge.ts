
import { UserProfile, AUTH_STATUS, AuthStatus } from '../shared/types/core/auth.types';

/**
 * AuthBridge provides a clean abstraction over authentication functionality 
 * without exposing direct access to the underlying store or provider
 */
class AuthBridgeClass {
  private _isAuthenticated = false;
  private _user: UserProfile | null = null;
  private _status: AuthStatus = AUTH_STATUS.GUEST;
  private _error: Error | null = null;
  
  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }
  
  get isLoading(): boolean {
    return this._status === AUTH_STATUS.LOADING;
  }
  
  get isInitialized(): boolean {
    return this._status !== AUTH_STATUS.LOADING;
  }
  
  getUser(): UserProfile | null {
    return this._user;
  }
  
  getStatus(): AuthStatus {
    return this._status;
  }
  
  getError(): Error | null {
    return this._error;
  }
  
  setUser(user: UserProfile | null): void {
    this._user = user;
    this._isAuthenticated = !!user;
    this._status = user ? AUTH_STATUS.AUTHENTICATED : AUTH_STATUS.GUEST;
  }
  
  setStatus(status: AuthStatus): void {
    this._status = status;
  }
  
  setError(error: Error | null): void {
    this._error = error;
    if (error) {
      this._status = AUTH_STATUS.ERROR;
    }
  }
}

export const AuthBridge = new AuthBridgeClass();
export const authBridge = AuthBridge;
