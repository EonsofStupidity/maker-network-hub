
export interface CircuitBreakerOptions {
  maxFailures: number;
  resetTimeout: number;
  reconnectInterval?: number;
}

enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN'
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failures: number = 0;
  private lastFailureTime: number = 0;
  private reconnectTimer?: number;

  constructor(
    private readonly id: string,
    private readonly options: CircuitBreakerOptions = {
      maxFailures: 5,
      resetTimeout: 30000,
      reconnectInterval: 5000
    }
  ) {}

  async execute<T>(fn: () => Promise<T>, fallback?: () => T | Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      const timeElapsed = Date.now() - this.lastFailureTime;
      
      if (timeElapsed >= this.options.resetTimeout) {
        this.state = CircuitState.HALF_OPEN;
        console.log(`[CircuitBreaker:${this.id}] Attempting recovery`);
      } else if (fallback) {
        return await Promise.resolve(fallback());
      } else {
        throw new Error(`Circuit ${this.id} is open`);
      }
    }

    try {
      const result = await fn();
      
      if (this.state === CircuitState.HALF_OPEN) {
        this.reset();
      }
      
      return result;
    } catch (error) {
      this.recordFailure();
      
      if (this.options.reconnectInterval && this.state === CircuitState.OPEN) {
        this.scheduleReconnect();
      }
      
      if (fallback) {
        return await Promise.resolve(fallback());
      }
      throw error;
    }
  }

  private recordFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.options.maxFailures || this.state === CircuitState.HALF_OPEN) {
      this.state = CircuitState.OPEN;
      console.log(`[CircuitBreaker:${this.id}] Circuit opened after ${this.failures} failures`);
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      return;
    }

    this.reconnectTimer = window.setInterval(() => {
      if (this.state === CircuitState.CLOSED) {
        this.clearReconnectTimer();
        return;
      }

      const timeElapsed = Date.now() - this.lastFailureTime;
      if (timeElapsed >= this.options.resetTimeout) {
        this.state = CircuitState.HALF_OPEN;
        console.log(`[CircuitBreaker:${this.id}] Attempting reconnection`);
      }
    }, this.options.reconnectInterval);
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearInterval(this.reconnectTimer);
      this.reconnectTimer = undefined;
    }
  }

  reset(): void {
    this.state = CircuitState.CLOSED;
    this.failures = 0;
    this.clearReconnectTimer();
    console.log(`[CircuitBreaker:${this.id}] Circuit reset`);
  }

  getState(): CircuitState {
    return this.state;
  }

  getFailureCount(): number {
    return this.failures;
  }
}
