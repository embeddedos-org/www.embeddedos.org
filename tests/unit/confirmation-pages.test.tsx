/** @vitest-environment jsdom */

/**
 * The confirmation pages that report completions to Google Ads.
 *
 * The Google tag on /thank-you/<action>/ sends the completion to the account's
 * conversion action when a completed action opened the page. So what has to
 * hold is: the three pages exist and are prerendered; they are never indexed,
 * listed or linked, so nothing but a completed action reaches them; each opens
 * with a full page load after its action really completed, never after a
 * failure or a fallback whose outcome the site cannot see; and the conversion
 * is sent from that page alone, once, and from nowhere else.
 */
import "@testing-library/jest-dom/vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

// Radix Select needs pointer capture and layout that jsdom lacks. A native
// select drives the same onValueChange, which is all the Careers form reads.
vi.mock("../../client/src/components/ui/select", () => ({
  Select: ({
    value,
    onValueChange,
    children,
  }: {
    value: string;
    onValueChange: (v: string) => void;
    children: ReactNode;
  }) => (
    <select value={value} onChange={e => onValueChange(e.target.value)}>
      <option value="" />
      {children}
    </select>
  ),
  SelectTrigger: () => null,
  SelectValue: () => null,
  SelectContent: ({ children }: { children: ReactNode }) => <>{children}</>,
  SelectItem: ({ value, children }: { value: string; children: ReactNode }) => (
    <option value={value}>{children}</option>
  ),
}));

import {
  CONFIRMATION_PAGES,
  CONFIRMATION_TOKEN_KEY,
  openConfirmationPage,
  type ConfirmedAction,
} from "../../client/src/lib/confirmation";
import {
  applyRouteMeta,
  NOINDEX_ROUTES as CLIENT_NOINDEX,
} from "../../client/src/lib/page-meta";
// @ts-expect-error - plain .mjs script, no type declarations
import {
  applyMeta,
  discoverRoutes,
  NOINDEX_ROUTES as BUILD_NOINDEX,
  stripComments,
} from "../../scripts/prerender.mjs";
// @ts-expect-error - plain .mjs script, no type declarations
import { audit } from "../../scripts/seo-audit.mjs";
import { PAGES, searchSite } from "../../shared/site-index";
import ContactFormModal from "../../client/src/components/ContactFormModal";
import { openContactForm } from "../../client/src/lib/contact-form";
import Careers from "../../client/src/pages/Careers";
import Donate from "../../client/src/pages/Donate";
import ThankYou from "../../client/src/pages/ThankYou";

const ROOT = path.resolve(__dirname, "../..");
const read = (p: string) => fs.readFileSync(path.join(ROOT, p), "utf8");
const squash = (s: string) => s.replace(/\s+/g, " ");

const ACTIONS = Object.keys(CONFIRMATION_PAGES) as ConfirmedAction[];
/** The routes as App.tsx declares them: the served URL without its slash. */
const ROUTES = Object.values(CONFIRMATION_PAGES).map(p => p.slice(0, -1));

const SHELL = `<!doctype html><html lang="en"><head>
<title>x</title>
<meta name="description" content="x" />
<link rel="canonical" href="https://www.embeddedos.org/" />
</head><body><div id="root"></div></body></html>`;
const NOINDEX_TAG = '<meta name="robots" content="noindex" />';

/** Replace window.location so assign() is observable and navigates nowhere. */
function stubLocation(pathname: string) {
  const assign = vi.fn();
  const location = {
    href: `http://localhost${pathname}`,
    origin: "http://localhost",
    pathname,
    search: "",
    hash: "",
    assign,
  };
  vi.stubGlobal("location", location);
  return { assign, location };
}

/** A Storage that lives only in the test. */
function fakeStorage(): Storage {
  const items = new Map<string, string>();
  return {
    get length() {
      return items.size;
    },
    key: i => [...items.keys()][i] ?? null,
    getItem: k => items.get(k) ?? null,
    setItem: (k, v) => void items.set(k, String(v)),
    removeItem: k => void items.delete(k),
    clear: () => items.clear(),
  };
}

function stubFetch(respond: () => Promise<Response>) {
  const fetchMock = vi.fn(respond);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

const json = (body: unknown, status = 200) =>
  Promise.resolve(
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    })
  );

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  delete window.Stripe;
});

describe("the confirmation routes", () => {
  it("serves each URL at /thank-you/<action>/, slash included", () => {
    for (const action of ACTIONS)
      expect(CONFIRMATION_PAGES[action]).toBe(`/thank-you/${action}/`);
  });

  it("declares each in App.tsx and prerenders each", () => {
    const app = stripComments(read("client/src/App.tsx"));
    const discovered: string[] = discoverRoutes();
    for (const route of ROUTES) {
      expect(app).toContain(`<Route path="${route}">`);
      expect(discovered).toContain(route);
    }
  });

  it("keeps the build's and the client's noindex lists identical", () => {
    expect([...BUILD_NOINDEX].sort()).toEqual([...ROUTES].sort());
    expect([...CLIENT_NOINDEX].sort()).toEqual([...ROUTES].sort());
  });
});

describe("never indexed", () => {
  it("prerenders each confirmation page with a robots noindex tag", () => {
    for (const route of ROUTES) {
      const html: string = applyMeta(SHELL, { route, heading: "Sent" });
      expect(html).toContain(NOINDEX_TAG);
      expect(html.indexOf(NOINDEX_TAG)).toBeLessThan(html.indexOf("</head>"));
    }
  });

  it("prerenders every other route without one", () => {
    for (const route of ["/", "/contact", "/careers", "/donate", "/404"])
      expect(applyMeta(SHELL, { route, heading: "Page" })).not.toContain(
        "robots"
      );
  });

  it("adds noindex on a client-side visit and removes it on the way out", () => {
    const doc = document.implementation.createHTMLDocument("x");
    const robots = () =>
      doc.querySelectorAll('meta[name="robots"]') as NodeListOf<Element>;

    applyRouteMeta("/thank-you/contact", doc);
    expect(robots()).toHaveLength(1);
    expect(robots()[0].getAttribute("content")).toBe("noindex");

    applyRouteMeta("/projects", doc);
    expect(robots()).toHaveLength(0);

    // Back through history to the URL a first load used: trailing slash.
    applyRouteMeta("/thank-you/donation/", doc);
    expect(robots()).toHaveLength(1);

    // From one confirmation page to another: still one tag, not two.
    applyRouteMeta("/thank-you/application", doc);
    expect(robots()).toHaveLength(1);
    expect(robots()[0].getAttribute("content")).toBe("noindex");
  });
});

describe("never listed", () => {
  it("leaves them out of the committed sitemap, and the generator agrees", () => {
    expect(read("client/public/sitemap.xml")).not.toContain("thank-you");
    // --check exits 1 when the committed sitemap differs from what the
    // generator builds, so passing means the generator excludes them too.
    execFileSync(
      process.execPath,
      [path.join(ROOT, "scripts/gen-sitemap.mjs"), "--check"],
      { stdio: "pipe" }
    );
  });

  it("does not count them as orphans or as missing from the sitemap", () => {
    const doc = (route: string, internal: string[] = []) => ({
      route,
      title: `${route} title`,
      description: [`A description of ${route} long enough to pass the audit.`],
      canonical: [`https://www.embeddedos.org${route === "/" ? "" : route}/`],
      h1: [{ level: 1, text: route }],
      headings: [{ level: 1, text: route }],
      landmarks: { main: 1, nav: 1, footer: 1 },
      lang: "en",
      ld: [],
      og: {
        "og:title": [],
        "og:description": [],
        "og:url": [],
        "og:image": [],
      },
      twitter: {
        "twitter:card": [],
        "twitter:title": [],
        "twitter:image": [],
      },
      internal,
      contentLinks: internal,
      httpLinks: [],
      weakAnchors: [],
      imagesWithoutAlt: 0,
      imagesWithoutDimensions: 0,
      imageCount: 0,
    });
    const docs = [doc("/", ["/projects"]), doc("/projects", ["/"])];
    for (const route of ROUTES) docs.push(doc(route, ["/"]));
    const findings: { check: string; route: string }[] = audit(docs, [
      "/",
      "/projects",
    ]);
    const flagged = findings.filter(
      f =>
        ROUTES.includes(f.route) &&
        ["orphan-page", "sitemap-missing-page"].includes(f.check)
    );
    expect(flagged).toEqual([]);
    // The exemption is theirs alone: an ordinary unlinked page still fails.
    docs.push(doc("/unlinked"));
    expect(
      audit(docs, ["/", "/projects", "/unlinked"]).filter(
        (f: { check: string; route: string }) =>
          f.check === "orphan-page" && f.route === "/unlinked"
      )
    ).toHaveLength(1);
  });

  it("leaves them out of the site search", () => {
    const indexed = PAGES.map(p => p.path);
    for (const route of ROUTES) expect(indexed).not.toContain(route);
    const found = searchSite("thank you message sent application gift").pages;
    expect(found.filter(p => p.path.startsWith("/thank-you"))).toEqual([]);
  });
});

describe("never linked", () => {
  it("names the URLs only where they are routed, mirrored and opened", () => {
    const allowed = new Set([
      "client/src/App.tsx",
      "client/src/lib/confirmation.ts",
      "client/src/lib/page-meta.ts",
      // The Google tag's one-time-token guard, not a link.
      "client/index.html",
    ]);
    const files = [
      ...fs.globSync("client/src/**/*.{ts,tsx,js,jsx,json}", { cwd: ROOT }),
      ...fs.globSync("shared/**/*.{ts,json}", { cwd: ROOT }),
      ...fs.globSync("client/public/**/*.{html,xml,txt,json}", { cwd: ROOT }),
      "client/index.html",
    ];
    expect(files.length).toBeGreaterThan(100);
    const mentions = files.filter(
      f => !allowed.has(f) && read(f).includes("/thank-you")
    );
    expect(mentions).toEqual([]);
  });
});

describe("the confirmation page", () => {
  /** Where each page's copy comes from: the success state it follows. */
  const SOURCES: Record<ConfirmedAction, [string, string[]]> = {
    contact: [
      "client/src/components/ContactFormModal.tsx",
      ["a person will read this and reply to", "the address you provided"],
    ],
    application: [
      "client/src/pages/Careers.tsx",
      [
        "your application was received, and a confirmation is on its way to your inbox.",
        "A person reads every one; we usually reply within 5–10 business days.",
        "To add a CV, reply to that confirmation email with it attached.",
      ],
    ],
    donation: [
      "client/src/pages/Donate.tsx",
      ["Your support keeps EmbeddedOS free and open."],
    ],
  };

  it.each(ACTIONS)("%s says only what its form already says", action => {
    const [file, phrases] = SOURCES[action];
    const { container } = render(<ThankYou action={action} />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    const text = squash(container.textContent ?? "");
    const source = squash(read(file));
    for (const phrase of phrases) {
      expect(text).toContain(phrase);
      expect(source).toContain(phrase);
    }
  });

  it("promises no receipt for a gift", () => {
    // stripe-intent.php sets no receipt_email, so nothing backs the claim.
    const { container } = render(<ThankYou action="donation" />);
    expect(container.textContent).not.toMatch(/receipt/i);
  });

  it("links onward to Home, Projects, Get involved and Contact, all real routes", () => {
    const app = read("client/src/App.tsx");
    render(<ThankYou action="contact" />);
    const hrefs = screen
      .getAllByRole("link")
      .map(a => a.getAttribute("href") ?? "");
    expect(hrefs).toEqual(["/", "/projects", "/get-involved", "/contact"]);
    for (const href of hrefs) expect(app).toContain(`<Route path="${href}">`);
  });
});

describe("openConfirmationPage", () => {
  it.each(ACTIONS)("loads /thank-you/%s/ as a full page load", action => {
    const { assign } = stubLocation("/");
    openConfirmationPage(action);
    expect(assign).toHaveBeenCalledTimes(1);
    expect(assign).toHaveBeenCalledWith(`/thank-you/${action}/`);
  });

  it("leaves a one-time token naming the page, before it loads", () => {
    const { assign } = stubLocation("/");
    const storage = fakeStorage();
    vi.stubGlobal("sessionStorage", storage);
    assign.mockImplementation(() =>
      expect(storage.getItem(CONFIRMATION_TOKEN_KEY)).toBe(
        "/thank-you/application/"
      )
    );
    openConfirmationPage("application");
    expect(assign).toHaveBeenCalledTimes(1);
  });

  it("still opens the page when sessionStorage is unavailable", () => {
    const { assign } = stubLocation("/");
    vi.stubGlobal("sessionStorage", {
      setItem: () => {
        throw new DOMException("blocked", "SecurityError");
      },
    });
    openConfirmationPage("contact");
    expect(assign).toHaveBeenCalledWith("/thank-you/contact/");
  });
});

describe("the Google tag reports a completion only with its token", () => {
  const SHELL_HTML = read("client/index.html");
  /** The shell's inline snippet that configures the tag. */
  const snippet = (() => {
    const scripts = [
      ...SHELL_HTML.matchAll(/<script>([\s\S]*?)<\/script>/g),
    ].map(m => m[1]);
    const found = scripts.filter(s => s.includes('gtag("js"'));
    expect(found).toHaveLength(1);
    return found[0];
  })();

  const CONFIG = ["config", "AW-18484485270"];
  const CONVERSION = [
    "event",
    "conversion",
    { send_to: "AW-18484485270/UwZ-CNmDoowdEJa5i-5E" },
  ];

  /**
   * Run the snippet as a page at `pathname` would, and return every gtag()
   * call it made after gtag("js"). A fake dataLayer records each call: the
   * snippet's gtag() pushes its arguments there and nowhere else.
   */
  function load(pathname: string, storage: Storage | object) {
    const calls: unknown[][] = [];
    const context: Record<string, unknown> = {
      location: { pathname },
      sessionStorage: storage,
      Date,
      dataLayer: { push: (args: IArguments) => calls.push([...args]) },
    };
    context.window = context;
    vm.runInNewContext(snippet, context);
    expect(calls[0]?.[0]).toBe("js");
    // Plain objects from this realm, so they compare by value.
    return JSON.parse(JSON.stringify(calls.slice(1)));
  }

  const blocked = () => ({
    getItem: () => {
      throw new DOMException("blocked", "SecurityError");
    },
  });

  it("configures the tag and sends one conversion when the token names this page, then spends it", () => {
    for (const page of Object.values(CONFIRMATION_PAGES)) {
      const storage = fakeStorage();
      storage.setItem(CONFIRMATION_TOKEN_KEY, page);
      expect(load(page, storage)).toEqual([CONFIG, CONVERSION]);
      expect(storage.getItem(CONFIRMATION_TOKEN_KEY)).toBeNull();
      // A reload after that finds no token: no config, no conversion.
      expect(load(page, storage)).toEqual([]);
    }
  });

  it("sends nothing on a confirmation page without its exact token", () => {
    for (const page of Object.values(CONFIRMATION_PAGES)) {
      expect(load(page, fakeStorage())).toEqual([]);
      const wrong = fakeStorage();
      wrong.setItem(CONFIRMATION_TOKEN_KEY, "/thank-you/elsewhere/");
      expect(load(page, wrong)).toEqual([]);
      const other = fakeStorage();
      other.setItem(
        CONFIRMATION_TOKEN_KEY,
        Object.values(CONFIRMATION_PAGES).find(p => p !== page)!
      );
      expect(load(page, other)).toEqual([]);
      expect(load(page.slice(0, -1), fakeStorage())).toEqual([]);
      expect(load(`${page}index.html`, fakeStorage())).toEqual([]);
      expect(load(page, blocked())).toEqual([]);
    }
  });

  it("configures the tag on every other page and sends no conversion", () => {
    for (const page of ["/", "/contact/", "/careers", "/donate/", "/404"]) {
      expect(load(page, fakeStorage())).toEqual([CONFIG]);
      expect(load(page, blocked())).toEqual([CONFIG]);
      // Not even a stray token for a confirmation page makes one count here.
      const stray = fakeStorage();
      stray.setItem(CONFIRMATION_TOKEN_KEY, CONFIRMATION_PAGES.donation);
      expect(load(page, stray)).toEqual([CONFIG]);
      expect(stray.getItem(CONFIRMATION_TOKEN_KEY)).toBeNull();
    }
  });

  it("reports the page openConfirmationPage() opens", () => {
    stubLocation("/careers");
    const storage = fakeStorage();
    vi.stubGlobal("sessionStorage", storage);
    openConfirmationPage("application");
    expect(load("/thank-you/application/", storage)).toEqual([
      CONFIG,
      CONVERSION,
    ]);
  });

  it("has one conversion call in the shell, inside the guarded branch", () => {
    // Static form of the same rule, for the prerendered HTML: no page load
    // sends a conversion unconditionally.
    expect(SHELL_HTML.match(/"conversion"/g)).toHaveLength(1);
    expect(SHELL_HTML.match(/gtag\(\s*"event"/g)).toHaveLength(1);
    expect(snippet).toMatch(/var counted = guarded && token === here;/);
    expect(snippet).toMatch(
      /if \(counted\)\s*gtag\(\s*"event",\s*"conversion"/
    );
  });
});

describe("contact form", () => {
  async function submitContact(honeypot = "") {
    render(<ContactFormModal />);
    openContactForm();
    const field = (id: string, value: string) =>
      fireEvent.change(document.getElementById(id) as HTMLElement, {
        target: { value },
      });
    await waitFor(() =>
      expect(document.getElementById("contact-name")).not.toBeNull()
    );
    field("contact-name", "Ada Lovelace");
    field("contact-email", "ada@example.org");
    field("contact-subject", "A question");
    field("contact-message", "A question about the board files.");
    if (honeypot) field("contact-website", honeypot);
    fireEvent.submit(
      (document.getElementById("contact-name") as HTMLElement).closest("form")!
    );
  }

  it("opens /thank-you/contact/ once the endpoint accepts the message", async () => {
    const { assign } = stubLocation("/contact");
    const fetchMock = stubFetch(() => json({ ok: true }));
    await submitContact();
    await waitFor(() => expect(assign).toHaveBeenCalledTimes(1));
    expect(assign).toHaveBeenCalledWith("/thank-you/contact/");
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/contact.php",
      expect.anything()
    );
  });

  it("stays put when the honeypot holds only a non-breaking space", async () => {
    // The browser's trim() lets it through; contact.php's trim() does not, so
    // the endpoint answers ok without sending anything.
    const { assign } = stubLocation("/contact");
    const fetchMock = stubFetch(() => json({ ok: true }));
    await submitContact("\u00a0");
    await screen.findByText("Message sent");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(assign).not.toHaveBeenCalled();
  });

  it.each([
    [
      "the endpoint refuses",
      () => json({ ok: false, error: "send_failed" }, 500),
    ],
    [
      "the endpoint rate-limits",
      () => json({ ok: false, error: "rate_limited" }, 429),
    ],
    ["a 200 does not say ok", () => json({ ok: false })],
    ["the body is not JSON", () => Promise.resolve(new Response("<html>"))],
    ["the network fails", () => Promise.reject(new TypeError("offline"))],
  ])("stays put when %s", async (_label, respond) => {
    const { assign } = stubLocation("/contact");
    stubFetch(respond);
    await submitContact();
    await screen.findByRole("button", { name: /send message/i });
    await waitFor(() =>
      expect(screen.getByText(/try again|wait a few/i)).toBeInTheDocument()
    );
    expect(assign).not.toHaveBeenCalled();
  });
});

describe("job application", () => {
  async function submitApplication(honeypot = "") {
    const { container } = render(<Careers />);
    const field = (id: string, value: string) =>
      fireEvent.change(container.querySelector(`#${id}`) as HTMLElement, {
        target: { value },
      });
    field("fullName", "Ada Lovelace");
    field("email", "ada@example.org");
    field(
      "statement",
      "I would like to work on the bootloader and the board bring-up tooling."
    );
    if (honeypot) field("website", honeypot);
    const form = (container.querySelector("#fullName") as HTMLElement).closest(
      "form"
    )!;
    for (const select of form.querySelectorAll("select"))
      fireEvent.change(select, {
        target: { value: (select as HTMLSelectElement).options[1].value },
      });
    fireEvent.submit(form);
  }

  it("opens /thank-you/application/ once the endpoint confirms delivery", async () => {
    const { assign } = stubLocation("/careers");
    const fetchMock = stubFetch(() => json({ ok: true }));
    await submitApplication();
    await waitFor(() => expect(assign).toHaveBeenCalledTimes(1));
    expect(assign).toHaveBeenCalledWith("/thank-you/application/");
    expect(fetchMock).toHaveBeenCalledWith("/api/apply.php", expect.anything());
  });

  it("stays put when the honeypot is filled, though the endpoint says ok", async () => {
    // apply.php answers a filled honeypot with { ok: true } and sends nothing.
    const { assign } = stubLocation("/careers");
    const fetchMock = stubFetch(() => json({ ok: true }));
    await submitApplication("https://bot.example");
    await screen.findByText("Application received");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(assign).not.toHaveBeenCalled();
  });

  it.each([
    ["the endpoint refuses", () => json({ ok: false, error: "invalid" }, 400)],
    ["a 200 does not say ok", () => json({ ok: false })],
    [
      "the host has no PHP",
      () => Promise.resolve(new Response("<html>", { status: 404 })),
    ],
    ["the network fails", () => Promise.reject(new TypeError("offline"))],
  ])("opens only the mail draft when %s", async (_label, respond) => {
    const { assign, location } = stubLocation("/careers");
    stubFetch(respond);
    await submitApplication();
    // The fallback ran: it hands the visitor a mail draft, which is not a
    // confirmed delivery and must not count as one.
    await waitFor(() => expect(location.href).toMatch(/^mailto:/));
    expect(assign).not.toHaveBeenCalled();
  });

  it("does not post or redirect when the form is invalid", async () => {
    const { assign } = stubLocation("/careers");
    const fetchMock = stubFetch(() => json({ ok: true }));
    const { container } = render(<Careers />);
    fireEvent.submit(
      (container.querySelector("#fullName") as HTMLElement).closest("form")!
    );
    await screen.findByText(/Full name is required/);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(assign).not.toHaveBeenCalled();
  });
});

describe("card donation", () => {
  type ConfirmResult = {
    error?: { message?: string };
    paymentIntent?: { status?: string };
  };
  const SUCCEEDED = { paymentIntent: { status: "succeeded" } };

  function stubStripe(result: ConfirmResult) {
    const confirmPayment = vi.fn(async () => result);
    const element = { mount: vi.fn(), unmount: vi.fn(), on: vi.fn() };
    const stripe = {
      elements: vi.fn(() => ({ create: vi.fn(() => element) })),
      confirmPayment,
    };
    window.Stripe = vi.fn(() => stripe) as unknown as typeof window.Stripe;
    return confirmPayment;
  }

  async function payByCard() {
    render(<Donate />);
    fireEvent.click(screen.getByRole("tab", { name: "Card" }));
    fireEvent.click(screen.getByRole("button", { name: /Continue with \$25/ }));
    fireEvent.click(
      await screen.findByRole("button", { name: /Donate \$25 now/ })
    );
  }

  it("opens /thank-you/donation/ once Stripe confirms the payment", async () => {
    const { assign } = stubLocation("/donate");
    stubFetch(() => json({ ok: true, client_secret: "pi_1_secret_2" }));
    const confirmPayment = stubStripe(SUCCEEDED);
    await payByCard();
    await waitFor(() => expect(assign).toHaveBeenCalledTimes(1));
    expect(assign).toHaveBeenCalledWith("/thank-you/donation/");
    // A payment that leaves the page for a bank or wallet still returns to
    // /donate: that landing is not verified as a success, so it is unchanged.
    expect(confirmPayment).toHaveBeenCalledWith(
      expect.objectContaining({
        confirmParams: {
          return_url: "https://www.embeddedos.org/donate/#donate-now",
        },
        redirect: "if_required",
      })
    );
  });

  it.each([
    ["the card is declined", { error: { message: "Your card was declined." } }],
    ["Stripe reports an error with no message", { error: {} }],
  ])("stays put when %s", async (_label, result) => {
    const { assign } = stubLocation("/donate");
    stubFetch(() => json({ ok: true, client_secret: "pi_1_secret_2" }));
    const confirmPayment = stubStripe(result);
    await payByCard();
    await waitFor(() => expect(confirmPayment).toHaveBeenCalled());
    await screen.findByRole("button", { name: /Donate \$25 now/ });
    expect(screen.queryByText(/Thank you for your/)).toBeNull();
    expect(assign).not.toHaveBeenCalled();
  });

  it.each([
    ["processing", { paymentIntent: { status: "processing" } }],
    ["requires_action", { paymentIntent: { status: "requires_action" } }],
    ["missing", {}],
  ])(
    "says processing and stays put when the status is %s",
    async (_label, result) => {
      const { assign } = stubLocation("/donate");
      stubFetch(() => json({ ok: true, client_secret: "pi_1_secret_2" }));
      const confirmPayment = stubStripe(result);
      await payByCard();
      await waitFor(() => expect(confirmPayment).toHaveBeenCalled());
      expect(
        await screen.findByText(
          "Your payment is processing. Stripe will confirm it shortly."
        )
      ).toBeInTheDocument();
      expect(screen.queryByText(/Thank you for your/)).toBeNull();
      expect(assign).not.toHaveBeenCalled();
    }
  );

  it("stays put when the payment cannot start", async () => {
    const { assign } = stubLocation("/donate");
    stubFetch(() => json({ ok: false, error: "stripe_error" }, 500));
    const confirmPayment = stubStripe(SUCCEEDED);
    render(<Donate />);
    fireEvent.click(screen.getByRole("tab", { name: "Card" }));
    fireEvent.click(screen.getByRole("button", { name: /Continue with \$25/ }));
    await screen.findByText(/Could not start the card payment/);
    expect(confirmPayment).not.toHaveBeenCalled();
    expect(assign).not.toHaveBeenCalled();
  });
});
