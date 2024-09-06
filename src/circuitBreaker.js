// lib/circuitBreaker.js
class CircuitBreaker {
  constructor(fn, options = {}) {
    this.fn = fn;
    this.failureThreshold = options.failureThreshold || 5;
    this.cooldownPeriod = options.cooldownPeriod || 10000;
    this.retryTimeout = options.retryTimeout || 1000;
    this.failures = 0;
    this.lastFailureTime = null;
  }

  async exec(...args) {
    if (this.isOpen()) {
      const now = Date.now();
      if (now - this.lastFailureTime > this.cooldownPeriod) {
        // Cooldown period has passed, reset failures and try again
        this.failures = 0;
        this.lastFailureTime = null;
      } else {
        throw new Error("Circuit Breaker is open");
      }
    }

    try {
      const result = await this.fn(...args);
      this.failures = 0; // Reset failures on success
      return result;
    } catch (error) {
      this.failures++;
      this.lastFailureTime = Date.now();
      if (this.failures >= this.failureThreshold) {
        // The circuit breaker should be open after exceeding the failure threshold
        this.lastFailureTime = Date.now();
      }
      throw error;
    }
  }

  isOpen() {
    const now = Date.now();
    // The circuit breaker is open if the number of failures is above the threshold
    // and the time since the last failure is within the cooldown period
    return (
      this.failures >= this.failureThreshold &&
      this.lastFailureTime !== null &&
      now - this.lastFailureTime <= this.cooldownPeriod
    );
  }
}

module.exports = CircuitBreaker;
