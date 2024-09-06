class Timeout {
  constructor(ms = 2000, errorMessage = "Operation timed out") {
    this.timeout = ms;
    this.errorMessage = errorMessage;
  }

  async exec(fn) {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(this.errorMessage));
      }, this.timeout);
    });

    try {
      const result = await Promise.race([fn(), timeoutPromise]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Timeout;
