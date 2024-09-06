class Bulkhead {
  constructor(limit = 10) {
    this.limit = limit; // Maximum number of concurrent executions
    this.current = 0; // Number of currently executing functions
    this.queue = []; // Queue for pending functions
  }

  async exec(fn, ...args) {
    // If limit is reached, queue the function
    if (this.current >= this.limit) {
      return new Promise((resolve, reject) => {
        this.queue.push({
          fn: () =>
            this.exec(fn, ...args)
              .then(resolve)
              .catch(reject),
        });
      });
    }

    this.current++; // Increment the count of executing functions

    try {
      const result = await fn(...args); // Execute the function

      return result;
    } catch (error) {
      console.log("error1", error);
      throw error;
    } finally {
      this.current--; // Decrement the count of executing functions

      // If there are pending functions in the queue, execute the next one
      if (this.queue.length > 0) {
        const next = this.queue.shift(); // Get the next function from the queue
        next.fn(); // Execute the next function
      }
    }
  }
}

module.exports = Bulkhead;
