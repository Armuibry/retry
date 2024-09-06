const Retry = require("../src/retry");

describe("Retry Mechanism", () => {
  it("should retry the function and succeed on the second attempt", async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error("Fail"))
      .mockResolvedValueOnce("Success");

    const retry = new Retry({ retries: 2 });
    const result = await retry.exec(fn);

    expect(fn).toHaveBeenCalledTimes(2);
    expect(result).toBe("Success");
  });
});
