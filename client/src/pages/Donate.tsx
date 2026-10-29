import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { openConfirmationPage } from "@/lib/confirmation";
import { openContactForm } from "@/lib/contact-form";
import {
  STRIPE_PUBLISHABLE_KEY,
  STRIPE_INTENT_ENDPOINT,
  PAYPAL_HOSTED_BUTTON_ID,
  PAYPAL_DONATE_URL,
  loadStripeJs,
  type StripeInstance,
  type StripeElements,
  type StripePaymentElement,
} from "@/lib/payments";
import { REPO_COUNT } from "@/data/stack";
import { BpPage, PageHero, Section, Stats } from "@/components/bp";
import "./Donate.css";

type PrerenderWindow = Window & { __EOS_PRERENDER__?: boolean };

const STATS = [
  {
    value: String(REPO_COUNT),
    label: "Open-Source Repos",
  },
  {
    value: "14",
    label: "Free Technical Books",
  },
  { value: "40+", label: "Countries Using EoS" },
  { value: "100%", label: "To the Foundation" },
];

const IMPACT_ITEMS = [
  {
    title: "Hardware Research",
    detail: "Every $100 funds one new board bring-up",
  },
  {
    title: "Technical Books",
    detail: "14 books, 100% free forever",
  },
  {
    title: "Security Audits",
    detail: "CVE-0 track record since 2023",
  },
  {
    title: "501(c)(3) Nonprofit",
    detail: "EIN 41-4821627 · deductible under IRC §170",
  },
  {
    title: "Student Internships",
    detail: "Paid internships for embedded devs",
  },
  {
    title: "Contributor Grants",
    detail: "Grants for open-source contributors",
  },
];

const ZEFFY_URL =
  "https://www.zeffy.com/en-US/embed/donation-form/donate-to-change-lives-17596";

// Same form, hosted by Zeffy rather than embedded. Used as the fallback when the
// iframe cannot load (ad/tracker blockers and strict corporate proxies routinely
// block third-party payment frames), so the donation path never dead-ends.
const ZEFFY_HOSTED_URL =
  "https://www.zeffy.com/en-US/donation-form/donate-to-change-lives-17596";

type GivingMethod = "zeffy" | "card" | "paypal";

/** Preset one-off amounts in cents. The card tab reuses these. */
const AMOUNT_PRESETS = [1000, 2500, 5000, 10000];

function formatUsd(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US")}`;
}

export default function Donate() {
  const [method, setMethod] = useState<GivingMethod>("zeffy");
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [embedFailed, setEmbedFailed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Card tab state.
  const [amountCents, setAmountCents] = useState(2500);
  const [customAmount, setCustomAmount] = useState("");
  const [cardStatus, setCardStatus] = useState<
    | "idle"
    | "preparing"
    | "ready"
    | "confirming"
    | "processing"
    | "done"
    | "error"
    | "unavailable"
  >("idle");
  const [cardError, setCardError] = useState("");
  const [confirmedAmount, setConfirmedAmount] = useState("");
  const stripeElementRef = useRef<StripePaymentElement | null>(null);
  const stripeElementsRef = useRef<StripeElements | null>(null);
  const stripeRef = useRef<StripeInstance | null>(null);
  const cardMountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if ((window as PrerenderWindow).__EOS_PRERENDER__) return;
    // If onLoad has not fired by now the embed is blocked or unreachable.
    timerRef.current = setTimeout(() => setEmbedFailed(true), 6000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Tear down the Stripe element when leaving the card tab so a stale
  // client_secret can never be confirmed twice.
  useEffect(() => {
    if (method !== "card" && stripeElementRef.current) {
      stripeElementRef.current.unmount();
      stripeElementRef.current = null;
      stripeElementsRef.current = null;
      setCardStatus("idle");
      setCardError("");
    }
  }, [method]);

  /** The amount the card tab will charge, in cents. */
  function chosenAmountCents(): number {
    const custom = customAmount.trim().replace(/[$,]/g, "");
    if (custom !== "") {
      const dollars = Number(custom);
      if (Number.isFinite(dollars) && dollars > 0)
        return Math.round(dollars * 100);
      return NaN;
    }
    return amountCents;
  }

  /** Prepare the inline card form: load Stripe.js, create an intent, mount. */
  async function prepareCardForm() {
    const cents = chosenAmountCents();
    if (!Number.isFinite(cents) || cents < 100) {
      setCardError("Enter an amount of at least $1.");
      setCardStatus("error");
      return;
    }
    setCardStatus("preparing");
    setCardError("");
    const jsOk = await loadStripeJs();
    if (!jsOk || !window.Stripe) {
      setCardStatus("unavailable");
      setCardError(
        "The card form could not load (a blocker may be stopping Stripe). " +
          "Zeffy or PayPal above work without it."
      );
      return;
    }
    let intent: {
      ok?: boolean;
      client_secret?: string;
      amount_cents?: number;
      error?: string;
    };
    try {
      const res = await fetch(STRIPE_INTENT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount_cents: cents }),
      });
      intent = await res.json();
    } catch {
      setCardStatus("error");
      setCardError(
        "Could not reach the payment server. Check your connection and try again."
      );
      return;
    }
    if (!intent.ok || typeof intent.client_secret !== "string") {
      if (intent.error === "stripe_not_configured") {
        setCardStatus("unavailable");
        setCardError(
          "Card payments are not enabled yet. Please give with Zeffy or PayPal above."
        );
      } else {
        setCardStatus("error");
        setCardError(
          "Could not start the card payment. Please try again or use Zeffy or PayPal."
        );
      }
      return;
    }
    try {
      const stripe = window.Stripe(STRIPE_PUBLISHABLE_KEY);
      const elements = stripe.elements({
        clientSecret: intent.client_secret,
      });
      const payment = elements.create("payment");
      if (cardMountRef.current) payment.mount(cardMountRef.current);
      stripeRef.current = stripe;
      stripeElementsRef.current = elements;
      stripeElementRef.current = payment;
      payment.on("change", e => {
        if (e.error?.message) setCardError(e.error.message);
      });
      setCardStatus("ready");
    } catch {
      setCardStatus("error");
      setCardError(
        "Could not render the card form. Please try again or use Zeffy or PayPal."
      );
    }
  }

  /** Confirm the payment with the mounted element. */
  async function confirmCardPayment() {
    if (!stripeRef.current || !stripeElementsRef.current) return;
    setCardStatus("confirming");
    setCardError("");
    const { error, paymentIntent } = await stripeRef.current.confirmPayment({
      elements: stripeElementsRef.current,
      confirmParams: {
        return_url: "https://www.embeddedos.org/donate/#donate-now",
      },
      redirect: "if_required",
    });
    // Any error, even one without a message, means the payment did not go
    // through, so it must never reach the confirmation page below.
    if (error) {
      setCardStatus("ready");
      setCardError(error.message ?? "");
      return;
    }
    // Only "succeeded" is a completed gift. Anything else (a delayed method
    // still "processing") may yet fail, so it is not confirmed or counted.
    if (paymentIntent?.status !== "succeeded") {
      setCardStatus("processing");
      return;
    }
    setConfirmedAmount(formatUsd(chosenAmountCents()));
    setCardStatus("done");
    openConfirmationPage("donation");
  }

  return (
    <BpPage className="donate">
      {/* Hero */}
      <PageHero
        sig
        label="501(c)(3) Nonprofit · Secure Donation"
        title="Support the EmbeddedOS Foundation"
        lead="Your donation funds open-source embedded OS research, developer tooling, and the next generation of real-time operating systems — freely available to everyone."
      >
        <p className="dn-reg">
          Embedded Operating Systems Research Foundation · EIN: 41-4821627 ·
          501(c)(3) Public Charity
        </p>
      </PageHero>

      {/* Stats bar */}
      <div className="wrap dn-stats">
        <Stats items={STATS} />
      </div>

      {/* Main donation section */}
      <section className="sec dn-main" id="donate-now">
        <div className="wrap">
          <div className="dn-grid">
            {/* Left: giving methods */}
            <div className="dn-give">
              <div className="dn-head">
                <h2>Make a Donation</h2>
                <p>
                  Three secure ways to give — every one reaches the Foundation.
                  Zeffy charges 0% platform fees; card and PayPal gifts are
                  subject to the processor's standard nonprofit fees.
                </p>
              </div>
              {/* Method tabs */}
              <div
                role="tablist"
                aria-label="Donation methods"
                className="dn-tabs"
              >
                {(
                  [
                    { key: "zeffy", label: "Zeffy · 0% fees" },
                    { key: "card", label: "Card" },
                    { key: "paypal", label: "PayPal" },
                  ] as const
                ).map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={method === key}
                    onClick={() => setMethod(key)}
                    className="dn-tab"
                  >
                    {label}
                  </button>
                ))}
              </div>
              {method === "zeffy" && (
                <>
                  <p className="dn-small">
                    Powered by{" "}
                    <a
                      href="https://www.zeffy.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tl"
                    >
                      Zeffy
                    </a>{" "}
                    — 0% platform fees, all funds go directly to the Foundation.
                  </p>
                </>
              )}
              {method === "zeffy" && (
                <>
                  <div className="gnote dn-tip">
                    <span aria-hidden="true">ℹ</span>
                    <span>
                      Zeffy may show an optional tip on the payment page
                      (default 17%). You can set it to 0% using the dropdown —
                      it is completely optional and does not affect your
                      donation amount.
                    </span>
                  </div>
                  <div className="dn-embed" style={{ minHeight: 820 }}>
                    {!iframeLoaded && !embedFailed && (
                      <div className="dn-over">
                        <span className="dn-spin" aria-hidden="true" />
                        <p className="dn-small">Loading donation form…</p>
                      </div>
                    )}

                    {embedFailed && !iframeLoaded && (
                      <div className="dn-over">
                        <p className="dn-fail-t">
                          The embedded donation form could not load
                        </p>
                        <p className="dn-small dn-fail-d">
                          A browser extension or network policy is most likely
                          blocking it. You can still give securely on Zeffy's
                          own page — 100% of your donation reaches the
                          Foundation either way.
                        </p>
                        <a
                          href={ZEFFY_HOSTED_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn or"
                        >
                          Donate on Zeffy
                        </a>
                      </div>
                    )}

                    <iframe
                      title="Donation form powered by Zeffy"
                      src={ZEFFY_URL}
                      allow="payment"
                      onLoad={() => {
                        setIframeLoaded(true);
                        setEmbedFailed(false);
                        if (timerRef.current) clearTimeout(timerRef.current);
                      }}
                      style={{
                        overflow: "hidden",
                        width: "100%",
                        border: "none",
                        display: "block",
                        opacity: iframeLoaded ? 1 : 0,
                        transition: "opacity 0.4s ease",
                      }}
                      height={820}
                    />
                    <noscript>
                      <div className="dn-nojs">
                        <p>The donation form requires JavaScript.</p>
                        <a href={ZEFFY_HOSTED_URL} className="tl">
                          Donate on Zeffy instead
                        </a>
                      </div>
                    </noscript>
                  </div>
                </>
              )}
              {method === "card" && (
                <div
                  role="tabpanel"
                  aria-label="Donate by card"
                  className="dn-panel"
                >
                  <h3>Donate by card</h3>
                  <p className="dn-small">
                    Secure card payment via Stripe. Your card details go
                    directly to Stripe — this site never sees or stores them.
                  </p>
                  {cardStatus === "done" ? (
                    <div className="dn-done">
                      <p className="dn-done-t">
                        Thank you for your {confirmedAmount} gift!
                      </p>
                      <p className="dn-small">
                        A receipt is on its way from Stripe. Your support keeps
                        EmbeddedOS free and open.
                      </p>
                    </div>
                  ) : cardStatus === "processing" ? (
                    <div className="dn-done">
                      <p role="status" className="dn-small">
                        Your payment is processing. Stripe will confirm it
                        shortly.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="label dn-amt-l">Amount (USD)</div>
                      <div className="dn-amts">
                        {AMOUNT_PRESETS.map(cents => (
                          <button
                            key={cents}
                            type="button"
                            onClick={() => {
                              setAmountCents(cents);
                              setCustomAmount("");
                            }}
                            aria-pressed={
                              customAmount === "" && amountCents === cents
                            }
                            className="btn gh"
                          >
                            {formatUsd(cents)}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        inputMode="decimal"
                        placeholder="Other amount, e.g. 75"
                        value={customAmount}
                        onChange={e => setCustomAmount(e.target.value)}
                        aria-label="Custom amount in US dollars"
                        className="dn-input"
                      />
                      {cardStatus !== "ready" &&
                        cardStatus !== "confirming" && (
                          <button
                            type="button"
                            onClick={prepareCardForm}
                            disabled={cardStatus === "preparing"}
                            className="btn or dn-wide"
                          >
                            {cardStatus === "preparing"
                              ? "Preparing secure form…"
                              : `Continue with ${formatUsd(
                                  Number.isFinite(chosenAmountCents())
                                    ? chosenAmountCents()
                                    : amountCents
                                )}`}
                          </button>
                        )}
                      <div
                        ref={cardMountRef}
                        aria-label="Secure card details"
                        className={
                          cardStatus === "ready" || cardStatus === "confirming"
                            ? "dn-mount"
                            : "hidden"
                        }
                      />
                      {cardStatus === "ready" && (
                        <button
                          type="button"
                          onClick={confirmCardPayment}
                          className="btn pri dn-wide"
                        >
                          Donate {formatUsd(chosenAmountCents())} now
                        </button>
                      )}
                      {cardStatus === "confirming" && (
                        <p className="dn-small dn-center">
                          Confirming your payment…
                        </p>
                      )}
                      {(cardStatus === "error" ||
                        cardStatus === "unavailable") && (
                        <p role="alert" className="dn-alert">
                          {cardError}
                        </p>
                      )}
                      {cardError !== "" &&
                        (cardStatus === "ready" ||
                          cardStatus === "confirming") && (
                          <p role="alert" className="dn-alert dn-err">
                            {cardError}
                          </p>
                        )}
                      <div className="dn-stripe">
                        {/* Stripe wordmark, drawn as text: no external brand
                            image to fetch, nothing to license. */}
                        <span className="dn-stripe-w">stripe</span>
                        <span>· secured · PCI-DSS</span>
                      </div>
                    </>
                  )}
                </div>
              )}
              {method === "paypal" && (
                <div
                  role="tabpanel"
                  aria-label="Donate with PayPal"
                  className="dn-panel dn-pp"
                >
                  <h3>Donate with PayPal</h3>
                  <p className="dn-small">
                    Embedded Operating Systems Research Foundation · Non-profit
                    organization · PayPal Giving Fund ID WJLA5PCYU8V7S.
                  </p>
                  <p className="dn-small">
                    You will complete your gift on paypal.com — this site never
                    sees your payment details. PayPal's standard nonprofit fees
                    apply.
                  </p>
                  {/* PayPal's own hosted-button form, verbatim fields. Opens
                      PayPal in a new tab; nothing is iframed. */}
                  <form action={PAYPAL_DONATE_URL} method="post" target="_top">
                    <input
                      type="hidden"
                      name="hosted_button_id"
                      value={PAYPAL_HOSTED_BUTTON_ID}
                    />
                    <button
                      type="submit"
                      title="Donate with PayPal"
                      className="btn dn-ppbtn"
                    >
                      Donate with PayPal
                    </button>
                    <img
                      alt=""
                      aria-hidden="true"
                      src="https://www.paypal.com/en_US/i/scr/pixel.gif"
                      width={1}
                      height={1}
                      className="dn-pixel"
                    />
                  </form>
                  <p className="fine">
                    PayPal, the PayPal logo marks shown, and the yellow button
                    style are trademarks of PayPal, Inc.
                  </p>
                </div>
              )}
              <div className="dn-other">
                <div className="label">Other ways to give</div>
                <dl>
                  <div>
                    <dt>Wire / check:</dt>{" "}
                    <dd>
                      <button
                        type="button"
                        onClick={() => openContactForm({ topic: "finance" })}
                        className="tl"
                      >
                        contact Finance &amp; Governance
                      </button>
                    </dd>
                  </div>
                  <div>
                    <dt>Card:</dt>{" "}
                    <dd>
                      <button
                        type="button"
                        onClick={() => setMethod("card")}
                        className="tl"
                      >
                        pay by card via Stripe
                      </button>
                    </dd>
                  </div>
                  <div>
                    <dt>PayPal:</dt>{" "}
                    <dd>
                      <button
                        type="button"
                        onClick={() => setMethod("paypal")}
                        className="tl"
                      >
                        give with PayPal
                      </button>
                    </dd>
                  </div>
                  <div>
                    <dt>GitHub Sponsors:</dt>{" "}
                    <dd>
                      <a
                        href="https://github.com/sponsors/embeddedos-org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tl"
                      >
                        github.com/sponsors/embeddedos-org
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Right: trust + impact */}
            <aside className="dn-side">
              <div className="card">
                <h3>Donation Assurance</h3>
                <ul className="dn-assure">
                  {[
                    { label: "501(c)(3)", sub: "Tax-exempt nonprofit" },
                    {
                      label: "0% Platform Fee",
                      sub: "100% goes to Foundation",
                    },
                    { label: "MIT License", sub: "100% open source" },
                    { label: "Secure Checkout", sub: "PCI-DSS processors" },
                  ].map(b => (
                    <li key={b.label}>
                      <b>{b.label}</b>
                      <span>{b.sub}</span>
                    </li>
                  ))}
                </ul>
                <p className="st ok dn-proc">
                  {method === "zeffy" &&
                    "Donation processed on Zeffy · EIN 41-4821627"}
                  {method === "card" &&
                    "Card processed by Stripe · EIN 41-4821627"}
                  {method === "paypal" &&
                    "Processed by PayPal · EIN 41-4821627"}
                </p>
              </div>
              <div className="card">
                <h3 className="label">Your Impact</h3>
                <ul className="dn-impact">
                  {IMPACT_ITEMS.map(item => (
                    <li key={item.title}>
                      <b>{item.title}</b>
                      <span>{item.detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card hl">
                <h3>Want recurring impact?</h3>
                <p>
                  Become a Foundation Member for sustained support — with
                  recognition, early access, and voting rights.
                </p>
                <Link href="/membership" className="btn pri dn-wide">
                  View Membership Tiers <span aria-hidden="true">→</span>
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Why donate */}
      <Section
        title="Why Support EmbeddedOS?"
        lead="The Embedded Operating Systems Research Foundation is a 501(c)(3) nonprofit that develops and maintains free, open-source software for embedded systems, IoT, AI edge computing, aerospace, and healthcare devices."
        alt
      >
        <ul className="cards">
          {[
            {
              title: "Open-Source First",
              desc: "Every line of code is MIT-licensed and freely available. Your donation keeps it that way.",
            },
            {
              title: "Global Impact",
              desc: "EoS powers devices in 40+ countries — from hospital monitors to satellite edge nodes.",
            },
            {
              title: "Community Driven",
              desc: "Donations fund student internships, contributor grants, and open research programs.",
            },
          ].map(c => (
            <li key={c.title}>
              <div className="card">
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="ctas dn-more">
          <Link href="/membership" className="btn gh">
            Become a Member
          </Link>
          <Link href="/get-involved" className="btn gh">
            Volunteer / Contribute
          </Link>
          <Link href="/sponsors" className="btn gh">
            Corporate Sponsorship
          </Link>
        </div>
      </Section>
    </BpPage>
  );
}
