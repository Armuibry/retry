const Fallback = require("../src/fallback");

describe("Fallback", () => {
  it("should return the result of the fallback function if the primary function fails", async () => {
    const fallbackFn = jest.fn().mockResolvedValue("Fallback Success");
    const primaryFn = jest.fn().mockRejectedValue("Primary Error");
    const fallback = new Fallback(fallbackFn);

    const result = await fallback.exec(primaryFn);

    expect(primaryFn).toHaveBeenCalled(); // Verify the primary function was called
    expect(fallbackFn).toHaveBeenCalled(); // Verify the fallback function was called
    expect(result).toBe("Fallback Success"); // Verify the result is from the fallback function
  });

  it("should throw an error if both the primary and fallback functions fail", async () => {
    const fallbackFn = jest.fn().mockRejectedValue("Fallback Error");
    const primaryFn = jest.fn().mockRejectedValue("Primary Error");
    const fallback = new Fallback(fallbackFn);

    await expect(fallback.exec(primaryFn)).rejects.toBe("Fallback Error");

    expect(primaryFn).toHaveBeenCalled(); // Verify the primary function was called
    expect(fallbackFn).toHaveBeenCalled(); // Verify the fallback function was called
  });

  it("should throw an error if the fallback function is not a function", () => {
    expect(() => new Fallback("not a function")).toThrow(
      "Fallback must be a function."
    );
  });
});
