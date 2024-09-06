const Bulkhead = require("../src/bulkhead");

describe("Bulkhead", () => {
  it("should execute function immediately when below the limit", async () => {
    const bulkhead = new Bulkhead(2);
    const mockFn = jest.fn().mockResolvedValue("result");

    const result = await bulkhead.exec(mockFn);

    expect(mockFn).toHaveBeenCalled();
    expect(result).toBe("result");
  });

  it("should queue functions when the limit is reached and then execute them in order", async () => {
    const bulkhead = new Bulkhead(1);
    const mockFn = jest
      .fn()
      .mockResolvedValueOnce("result1")
      .mockResolvedValueOnce("result2");

    // First call should execute immediately
    const result1Promise = bulkhead.exec(mockFn);

    // Second call should be queued
    const result2Promise = bulkhead.exec(mockFn);

    const result1 = await result1Promise;
    const result2 = await result2Promise;

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(result1).toBe("result1");
    expect(result2).toBe("result2");
  });

  it("should handle errors correctly and propagate them", async () => {
    const bulkhead = new Bulkhead(2);
    const mockFn = jest.fn().mockRejectedValue(new Error("Test Error"));

    try {
      await bulkhead.exec(mockFn);
    } catch (error) {
      expect(mockFn).toHaveBeenCalled();
      expect(error).toEqual(new Error("Test Error"));
    }
  });
});
