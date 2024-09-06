class Fallback {
  constructor(fallbackFn) {
    if (typeof fallbackFn !== "function") {
      throw new Error("Fallback must be a function.");
    }
    this.fallbackFn = fallbackFn;
  }

  async exec(fn) {
    try {
      return await fn();
    } catch (error) {
      try {
        return await this.fallbackFn();
      } catch (fallbackError) {
        // Optionally log the fallback error or handle it in some way
        throw fallbackError; // Rethrow the fallback error
      }
    }
  }
}

module.exports = Fallback;
