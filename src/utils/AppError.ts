
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: Record<string, unknown>,
    public recoverable: boolean = true,
    public phase?: string
  ) {
    super(message);
    this.name = 'AppError';
  }

  static isAppError(error: unknown): error is AppError {
    return error instanceof AppError;
  }

  static fromUnknown(error: unknown, phase?: string): AppError {
    if (error instanceof AppError) {
      if (phase && !error.phase) {
        error.phase = phase;
      }
      return error;
    }

    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return new AppError(message, undefined, undefined, true, phase);
  }
  
  // Helper for connection errors
  static connection(message: string = 'Connection failed', details?: Record<string, unknown>): AppError {
    return new AppError(message, 'CONNECTION_ERROR', details, true);
  }
  
  // Helper for authentication errors
  static auth(message: string = 'Authentication failed', details?: Record<string, unknown>): AppError {
    return new AppError(message, 'AUTH_ERROR', details, true);
  }
  
  // Helper for permission errors
  static permission(message: string = 'Permission denied', details?: Record<string, unknown>): AppError {
    return new AppError(message, 'PERMISSION_ERROR', details, true);
  }
  
  // Helper for critical system errors
  static critical(message: string, details?: Record<string, unknown>): AppError {
    return new AppError(message, 'CRITICAL_ERROR', details, false);
  }
}
