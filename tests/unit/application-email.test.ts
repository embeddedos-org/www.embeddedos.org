/**
 * The careers form composes an email instead of POSTing to a server, so the
 * composition is where correctness now lives. A truncated `mailto:` would send
 * half an application without anyone noticing, which is the specific failure
 * these tests exist to prevent.
 */
import { describe, expect, it } from "vitest";
import {
  composeApplication,
  postApplication,
  shortMailto,
  APPLY_ENDPOINT,
  CAREERS_ADDRESS,
  MAILTO_MAX_LENGTH,
  type ApplicationFields,
} from "../../client/src/lib/application-email";

const base: ApplicationFields = {
  fullName: "Jane Smith",
  email: "jane@example.com",
  roleCategory: "Research Engineer",
  employmentType: "Full-Time",
  workAuthorization: "US Citizen",
  statement:
    "I have spent six years on ARM Cortex-M firmware and want to work on an " +
    "open-source RTOS where the results are published rather than licensed.",
};

describe("composeApplication", () => {
  it("puts the applicant, role and type in the subject", () => {
    expect(composeApplication(base).subject).toBe(
      "Application: Jane Smith — Research Engineer (Full-Time)"
    );
  });

  it("includes every provided field in the body", () => {
    const { body } = composeApplication({
      ...base,
      phone: "+1 555 0100",
      linkedin: "https://linkedin.com/in/janesmith",
      github: "https://github.com/janesmith",
      portfolio: "https://jane.dev",
      availability: "From March 2026",
      heardFrom: "GitHub",
    });

    for (const value of [
      "Jane Smith",
      "jane@example.com",
      "+1 555 0100",
      "https://linkedin.com/in/janesmith",
      "https://github.com/janesmith",
      "https://jane.dev",
      "From March 2026",
      "GitHub",
      "Research Engineer",
      "US Citizen",
    ]) {
      expect(body).toContain(value);
    }
  });

  it("omits optional fields that were left blank rather than printing empties", () => {
    const { body } = composeApplication(base);
    expect(body).not.toContain("Phone:");
    expect(body).not.toContain("Portfolio:");
    expect(body).not.toMatch(/LinkedIn:\s*$/m);
  });

  it("addresses the mailto to the careers inbox", () => {
    const { mailtoUrl } = composeApplication(base);
    expect(mailtoUrl).not.toBeNull();
    expect(mailtoUrl!.startsWith(`mailto:${CAREERS_ADDRESS}?`)).toBe(true);
  });

  it("percent-encodes the subject and body", () => {
    const { mailtoUrl } = composeApplication(base);
    // A raw newline or space in the query would be mangled by the mail client.
    expect(mailtoUrl!).not.toMatch(/[\n\r]/);
    expect(mailtoUrl!.split("?")[1]).not.toContain(" ");
  });

  it("round-trips the body through the URL without loss", () => {
    const { body, mailtoUrl } = composeApplication(base);
    const encoded = mailtoUrl!.split("&body=")[1];
    expect(decodeURIComponent(encoded)).toBe(body);
  });

  it("refuses a mailto that would exceed the length a mail client accepts", () => {
    // The statement field accepts up to 3,000 characters, which cannot fit.
    const long = composeApplication({ ...base, statement: "x".repeat(3000) });
    expect(long.mailtoUrl).toBeNull();
    expect(long.body).toContain("x".repeat(3000));
  });

  it("keeps every mailto it does return inside the limit", () => {
    const { mailtoUrl } = composeApplication(base);
    expect(mailtoUrl!.length).toBeLessThanOrEqual(MAILTO_MAX_LENGTH);
  });

  it("asks the applicant to attach a CV, which the form cannot accept", () => {
    expect(composeApplication(base).body).toContain("attach your CV");
  });
});

describe("shortMailto", () => {
  it("carries the subject and no body", () => {
    const url = shortMailto("Application: Jane Smith");
    expect(url).toBe(
      `mailto:${CAREERS_ADDRESS}?subject=Application%3A%20Jane%20Smith`
    );
    expect(url).not.toContain("body=");
  });
});

describe("postApplication", () => {
  /**
   * Every branch here decides between "the application was delivered" and "put
   * it in the applicant's own hands". Reporting success wrongly is the failure
   * that already happened once on this form: it posted to a tRPC route absent
   * from the static build, and every application was lost.
   */
  const ok = (body: unknown, status = 200): typeof fetch =>
    (async () =>
      new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
      })) as unknown as typeof fetch;

  it("reports success only on an explicit ok:true", async () => {
    expect(await postApplication(base, { fetchImpl: ok({ ok: true }) })).toBe(
      true
    );
  });

  it("treats ok:false as undelivered", async () => {
    expect(await postApplication(base, { fetchImpl: ok({ ok: false }) })).toBe(
      false
    );
  });

  it("treats a missing ok field as undelivered", async () => {
    expect(await postApplication(base, { fetchImpl: ok({}) })).toBe(false);
  });

  it("treats a 404 as undelivered, which is what a host without PHP returns", async () => {
    const html: typeof fetch = (async () =>
      new Response("<!DOCTYPE html><html>404</html>", {
        status: 404,
        headers: { "Content-Type": "text/html" },
      })) as unknown as typeof fetch;
    expect(await postApplication(base, { fetchImpl: html })).toBe(false);
  });

  it("treats a 200 that is not JSON as undelivered", async () => {
    const notJson: typeof fetch = (async () =>
      new Response("<!DOCTYPE html>not json", {
        status: 200,
        headers: { "Content-Type": "text/html" },
      })) as unknown as typeof fetch;
    expect(await postApplication(base, { fetchImpl: notJson })).toBe(false);
  });

  it("treats a network failure as undelivered rather than throwing", async () => {
    const boom: typeof fetch = (async () => {
      throw new TypeError("Failed to fetch");
    }) as unknown as typeof fetch;
    await expect(postApplication(base, { fetchImpl: boom })).resolves.toBe(
      false
    );
  });

  it("posts JSON to the endpoint that ships in the build", async () => {
    let url: string | undefined;
    let init: RequestInit | undefined;
    const spy: typeof fetch = (async (u: string, i: RequestInit) => {
      url = u;
      init = i;
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }) as unknown as typeof fetch;

    await postApplication(base, { fetchImpl: spy });

    expect(url).toBe(APPLY_ENDPOINT);
    expect(init?.method).toBe("POST");
    expect(JSON.parse(String(init?.body)).fullName).toBe(base.fullName);
  });

  it("forwards the honeypot so the endpoint judges the field the page renders", async () => {
    let body = "";
    const spy: typeof fetch = (async (_u: string, i: RequestInit) => {
      body = String(i.body);
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }) as unknown as typeof fetch;

    await postApplication(base, { fetchImpl: spy, honeypot: "bot-filled" });
    expect(JSON.parse(body).website).toBe("bot-filled");

    await postApplication(base, { fetchImpl: spy });
    expect(JSON.parse(body).website).toBe("");
  });
});
