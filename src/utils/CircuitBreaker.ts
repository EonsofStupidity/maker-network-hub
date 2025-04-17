
/**
 * Simple CircuitBreaker implementation to prevent cascading failures
 * in network requests and other operations that might fail.
 */

export interface CircuitBreakerOptions {
  maxFailures: number;
  resetTimeout: number;
}

enum CircuitState {
  CLOSED = 'CLOSED',  // Circuit is closed, requests flow through
  OPEN = 'OPEN',      // Circuit is open, requests are blocked
  HALF_OPEN = 'HALF_OPEN'  // Testing if the circuit can be closed again
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failures: number = 0;
  private lastFailureTime: number = 0;
  private readonly id: string;
  private readonly options: CircuitBreakerOptions;
  
  /**
   * Creates a new circuit breaker
   * @param id Identifier for this circuit breaker
   * @param options Configuration options
   */
  constructor(
    id: string,
    options: CircuitBreakerOptions = {
      maxFailures: 5,
      resetTimeout: 30000 // 30 seconds
    }
  ) {
    this.id = id;
    this.options = options;
  }
  
  /**
   * Executes the provided function with circuit breaker protection
   * @param fn The function to execute
   * @param fallback Optional fallback function to execute if circuit is open
   * @returns The result of fn or fallback
   */
  async execute<T>(
    fn: () => Promise<T>,
    fallback?: () => T | Promise<T>
  ): Promise<T> {
    // Check if circuit is open
    if (this.state === CircuitState.OPEN) {
      // Check if we should try half-open state
      const timeElapsed = Date.now() - this.lastFailureTime;
      
      if (timeElapsed >= this.options.resetTimeout) {
        this.state = CircuitState.HALF_OPEN;
        console.log(`[CircuitBreaker:${this.id}] Entering half-open state`);
      } else if (fallback) {
        console.log(`[CircuitBreaker:${this.id}] Circuit open, using fallback`);
        return await Promise.resolve(fallback());
      } else {
        throw new Error(`Circuit breaker [${this.id}] is open`);
      }
    }
    
    try {
      // Execute the function
      const result = await fn();
      
      // If we were in half-open, close the circuit on success
      if (this.state === CircuitState.HALF_OPEN) {
        this.reset();
        console.log(`[CircuitBreaker:${this.id}] Circuit closed after successful test`);
      }
      
      return result;
    } catch (error) {
      // Record the failure
      this.recordFailure();
      
      // Check if fallback is provided
      if (fallback) {
        console.log(`[CircuitBreaker:${this.id}] Using fallback after failure`);
        return await Promise.resolve(fallback());
      }
      
      throw error;
    }
  }
  
  /**
   * Records a failure and potentially opens the circuit
   */
  private recordFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.options.maxFailures || this.state === CircuitState.HALF_OPEN) {
      this.state = CircuitState.OPEN;
      console.log(`[CircuitBreaker:${this.id}] Circuit opened after ${this.failures} failures`);
    }
  }
  
  /**
   * Resets the circuit breaker to closed state
   */
  reset(): void {
    this.state = CircuitState.CLOSED;
    this.failures = 0;
    console.log(`[CircuitBreaker:${this.id}] Circuit reset`);
  }
  
  /**
   * Gets the current state of the circuit
   * @returns The current CircuitState
   */
  getState(): CircuitState {
    return this.state;
  }
  
  /**
   * Gets the number of recorded failures
   * @returns Number of failures
   */
  getFailureCount(): number {
    return this.failures;
  }
}
