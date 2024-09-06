const Resilience = require("retry-breaker");
const axios = require("axios");

// Define fetchPosts
const fetchPosts = async () => {
  try {
    const response = await axios.get("https://randomuser.me/api/?results=10");
    return response; // Return the entire response object
  } catch (error) {
    throw error; // Propagate errors if necessary
  }
};

// Initialize Resilience
const resilience = new Resilience({
  retry: { retries: 3, delay: 2000 },
  circuitBreaker: {
    fn: fetchPosts,
    failureThreshold: 3,
    cooldownPeriod: 10000,
  },
  timeout: { timeout: 2000 },
  fallback: { fn: async () => ({ data: "Fallback response" }) },
  bulkhead: { limit: 10 },
});

const testResilience = async () => {
  try {
    const response = await resilience.execute(fetchPosts);
    console.log("Response:", response?.data); // Access the data property of the response
  } catch (error) {
    console.error("Error during resilience test:", error.message);
  }
};

testResilience();
