const Timeout = require("../src/timeout");

describe("Timeout", () => {
  it("should return the result of the function if it completes within the timeout", async () => {
    const timeout = new Timeout(2000); // 2 seconds timeout
    const mockFn = jest.fn().mockResolvedValue("Success");

    const result = await timeout.exec(mockFn);

    expect(mockFn).toHaveBeenCalled();
    expect(result).toBe("Success");
  });

  it("should throw an error if the function takes longer than the timeout", async () => {
    const timeout = new Timeout(1000); // 1 second timeout
    const mockFn = jest
      .fn()
      .mockReturnValue(
        new Promise((resolve) => setTimeout(() => resolve("Delayed"), 2000))
      );

    await expect(timeout.exec(mockFn)).rejects.toThrow("Operation timed out");
  });

  it("should use a custom error message", async () => {
    const customMessage = "Custom timeout error";
    const timeout = new Timeout(1000, customMessage); // 1 second timeout
    const mockFn = jest
      .fn()
      .mockReturnValue(
        new Promise((resolve) => setTimeout(() => resolve("Delayed"), 2000))
      );

    await expect(timeout.exec(mockFn)).rejects.toThrow(customMessage);
  });
});
