
/**
 * Circuit Breaker implementation to prevent cascading failures
 */
export class CircuitBreaker {
  // Properties
  public isOpen: boolean = false;
  public failureCount: number = 0;
  public successCount: number = 0;
  public lastFailureTime: number = 0;
  public count: number = 0;
  
  // Options with defaults
  private readonly maxFailures: number;
  private readonly resetTimeout: number;
  private readonly halfOpenAttemptsAllowed: number;
  
  constructor(
    public name: string,
    options?: {
      maxFailures?: number;
      resetTimeout?: number;
      halfOpenAttemptsAllowed?: number;
    }
  ) {
    this.name = name;
    this.maxFailures = options?.maxFailures ?? 5;
    this.resetTimeout = options?.resetTimeout ?? 30000;
    this.halfOpenAttemptsAllowed = options?.halfOpenAttemptsAllowed ?? 1;
  }

  // Static factory method for convenience
  static init(name: string, options?: {
    maxFailures?: number;
    resetTimeout?: number;
    halfOpenAttemptsAllowed?: number;
  }): CircuitBreaker {
    return new CircuitBreaker(name, options);
  }

  /**
   * Executes a function with circuit breaker protection
   * 
   * @param fn The function to execute
   * @param fallback Optional fallback function to call if circuit is open
   * @returns The result of the function or fallback
   */
  async execute<T>(
    fn: () => Promise<T>, 
    fallback?: () => T | Promise<T>
  ): Promise<T> {
    // Check if circuit is open
    if (this.isOpen) {
      // Check if we should allow a test request
      const now = Date.now();
      if (this.lastFailureTime && (now - this.lastFailureTime) > this.resetTimeout) {
        // Try to reset the circuit with a test request
        this.isOpen = false;
      } else if (fallback) {
        // Circuit is still open, use fallback
        return await Promise.resolve(fallback());
      } else {
        // Circuit is open with no fallback
        throw new Error(`Circuit [${this.name}] is open`);
      }
    }

    // Execute the function
    try {
      const result = await fn();
      // Success, increment success count and reset failure count if needed
      this.successCount++;
      this.count++;
      if (this.failureCount > 0) {
        this.failureCount = 0;
      }
      return result;
    } catch (error) {
      // Handle failure
      this.recordFailure();
      
      // Check if we've hit the threshold and open the circuit
      if (this.failureCount >= this.maxFailures) {
        this.isOpen = true;
        this.lastFailureTime = Date.now();
      }
      
      // Use fallback if available
      if (fallback) {
        return await Promise.resolve(fallback());
      }
      
      // No fallback, re-throw the error
      throw error;
    }
  }
  
  /**
   * Reset the circuit breaker
   */
  reset(): void {
    this.failureCount = 0;
    this.isOpen = false;
    this.lastFailureTime = 0;
  }
  
  /**
   * Record a failure and increment the count
   */
  recordFailure(): void {
    this.failureCount++;
    this.count++;
  }
  
  /**
   * Get the current status as a plain object
   */
  getStatus(): {
    isOpen: boolean;
    failureCount: number;
    successCount: number; 
    count: number;
    lastFailureTime: number | null;
  } {
    return {
      isOpen: this.isOpen,
      failureCount: this.failureCount,
      successCount: this.successCount,
      count: this.count,
      lastFailureTime: this.lastFailureTime || null
    };
  }
}
