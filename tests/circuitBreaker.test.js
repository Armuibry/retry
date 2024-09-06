// tests/circuitBreaker.test.js
const CircuitBreaker = require("../src/circuitBreaker");

describe("Circuit Breaker", () => {
  it("should trip the breaker after the failure threshold is exceeded", async () => {
    const failingFunction = jest.fn().mockRejectedValue(new Error("Failed"));

    const breaker = new CircuitBreaker(failingFunction, {
      failureThreshold: 3, // Trip after 3 failures
      cooldownPeriod: 1000,
    });

    // Trigger failures
    try {
      await breaker.exec(); // First failure
    } catch (e) {}

    try {
      await breaker.exec(); // Second failure
    } catch (e) {}

    try {
      await breaker.exec(); // Third failure
    } catch (e) {}

    // The circuit should now be open (tripped)
    expect(breaker.isOpen()).toBe(true);
  });

  it("should close the circuit after cooldown period", async () => {
    const failingFunction = jest.fn().mockRejectedValue(new Error("Failed"));

    const breaker = new CircuitBreaker(failingFunction, {
      failureThreshold: 1, // Trip after 1 failure
      cooldownPeriod: 500, // Short cooldown period for testing
    });

    // Trigger failure
    try {
      await breaker.exec(); // First failure
    } catch (e) {}

    // Circuit should be open now
    expect(breaker.isOpen()).toBe(true);

    // Wait for cooldown period
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Circuit should be closed now
    expect(breaker.isOpen()).toBe(false);
  });
});
