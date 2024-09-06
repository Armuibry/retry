class Retry {
  constructor(options = {}) {
    this.retries = options.retries || 3;
    this.delay = options.delay || 1000;
    this.delayFn = options.delayFn || this._delay; // Allow custom delay function
  }

  async exec(fn) {
    let attempts = 0;
    while (attempts < this.retries) {
      try {
        return await fn();
      } catch (error) {
        attempts++;
        if (attempts >= this.retries) {
          throw error;
        }
        await this.delayFn(this.delay, attempts);
      }
    }
  }

  _delay(ms, attempt) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

module.exports = Retry;
