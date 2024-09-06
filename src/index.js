const Retry = require("./retry");
const CircuitBreaker = require("./circuitBreaker");
const Timeout = require("./timeout");
const Fallback = require("./fallback");
const Bulkhead = require("./bulkhead");

class Resilience {
  constructor(config = {}) {
    this.retry = new Retry(config.retry);
    this.circuitBreaker = new CircuitBreaker(
      config.circuitBreaker.fn,
      config.circuitBreaker
    );
    this.timeout = new Timeout(config.timeout.timeout);
    this.fallback = new Fallback(config.fallback.fn);
    this.bulkhead = new Bulkhead(config.bulkhead.limit);
  }

  async execute(fn) {
    const wrappedFunction = async () => {
      try {
        // Apply bulkhead
        const bulkheadResult = await this.bulkhead.exec(async () => {
          // Apply timeout and circuit breaker
          const timeoutResult = await this.timeout.exec(() =>
            this.circuitBreaker.exec(fn)
          );
          return timeoutResult;
        });
        return bulkheadResult;
      } catch (error) {
        throw error;
      }
    };

    try {
      const result = await this.retry.exec(wrappedFunction);
      return result;
    } catch (error) {
      console.error("Error during resilience execution:", error.message);
      return await this.fallback.exec(fn);
    }
  }
}

module.exports = Resilience;
