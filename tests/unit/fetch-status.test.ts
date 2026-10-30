import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchStatus, RETRY_WAITS } from "../../e2e/fetch-status";

const NO_WAIT = [0, 0];

function answers(...steps: Array<number | "drop">) {
  const fetchMock = vi.fn(async () => {
    const step = steps.shift();
    if (step === undefined) throw new Error("unexpected extra request");
    if (step === "drop") throw new TypeError("fetch failed");
    return new Response(null, { status: step });
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchStatus, used for outbound links and their GitHub /raw/ fallback", () => {
  it("keeps the checker's backoff of 5 s, then 30 s", () => {
    expect(RETRY_WAITS).toEqual([5_000, 30_000]);
  });

  it("returns the first answer that is not a 429", async () => {
    const fetchMock = answers(404);
    expect(await fetchStatus("https://example.test/a", "ua", NO_WAIT)).toBe(
      404
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("retries a 429 and returns the answer that follows it", async () => {
    const fetchMock = answers(429, 200);
    expect(await fetchStatus("https://example.test/b", "ua", NO_WAIT)).toBe(
      200
    );
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("returns 429 once every attempt was throttled", async () => {
    const fetchMock = answers(429, 429, 429);
    expect(await fetchStatus("https://example.test/c", "ua", NO_WAIT)).toBe(
      429
    );
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("retries a dropped connection before giving a verdict", async () => {
    const fetchMock = answers("drop", "drop", 200);
    expect(await fetchStatus("https://example.test/d", "ua", NO_WAIT)).toBe(
      200
    );
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("reports a connection that fails on every attempt", async () => {
    const fetchMock = answers("drop", "drop", "drop");
    expect(await fetchStatus("https://example.test/e", "ua", NO_WAIT)).toBe(
      "connection failed"
    );
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});
