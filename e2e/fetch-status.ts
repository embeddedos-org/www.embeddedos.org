export const RETRY_WAITS: readonly number[] = [5_000, 30_000];

export async function fetchStatus(
  url: string,
  userAgent: string,
  waits: readonly number[] = RETRY_WAITS
): Promise<number | "connection failed"> {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url, {
        redirect: "follow",
        signal: AbortSignal.timeout(30_000),
        headers: { "User-Agent": userAgent },
      });
      await res.arrayBuffer().catch(() => undefined);
      if (res.status !== 429 || attempt >= waits.length) return res.status;
    } catch {
      if (attempt >= waits.length) return "connection failed";
    }
    await new Promise(r => setTimeout(r, waits[attempt]));
  }
}
