import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Send, CheckCircle2, AlertTriangle } from "lucide-react";
import { CONTACT_TOPICS, type ContactTopicKey } from "@/data/foundation";
import { OPEN_CONTACT_EVENT, type OpenContactDetail } from "@/lib/contact-form";

/**
 * The sitewide contact form, replacing every `mailto:` link on the site.
 *
 * No email address is ever present in this component, in the bundle it ships
 * in, or in anything it renders — the visitor picks a topic (a label from
 * `CONTACT_TOPICS`, which deliberately carries no address), and the address
 * that topic resolves to lives only in `client/public/api/contact.php`'s
 * `TOPIC_INBOXES`, on the server. See that file's header comment for why PHP
 * rather than the Node/tRPC server is what actually runs in production.
 *
 * Shell, animation and focus-trap pattern copied from `DonateModal.tsx` —
 * the established custom modal look on this site, not the generic
 * shadcn/Radix `Dialog` primitive.
 */

const DEFAULT_TOPIC: ContactTopicKey = "contact";

type Status = "form" | "submitting" | "sent" | "error";
type ErrorKind = "invalid" | "rate_limited" | "send_failed" | "network";

/** Focusable descendants, in tab order, skipping anything disabled or hidden. */
const focusableWithin = (root: HTMLElement) =>
  Array.from(
    root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter(el => el.offsetParent !== null || el === document.activeElement);

const ERROR_COPY: Record<ErrorKind, string> = {
  invalid:
    "Something in the form didn't validate. Check the fields and try again.",
  rate_limited:
    "You've sent several messages recently. Please wait a few minutes before sending another.",
  send_failed:
    "The message couldn't be delivered right now. Please try again in a moment.",
  network: "Couldn't reach the server. Check your connection and try again.",
};

const emptyForm = (detail: OpenContactDetail) => ({
  topic: detail.topic ?? DEFAULT_TOPIC,
  name: "",
  email: "",
  subject: detail.subject ?? "",
  message: "",
  website: "", // honeypot — left blank by people, filled in by naive bots
});

export default function ContactFormModal() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("form");
  const [errorKind, setErrorKind] = useState<ErrorKind>("network");
  const [form, setForm] = useState(() => emptyForm({}));
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusTo = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  // Listen for the global trigger — see client/src/lib/contact-form.ts.
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<OpenContactDetail>).detail ?? {};
      setForm(emptyForm(detail));
      setStatus("form");
      setOpen(true);
    };
    window.addEventListener(OPEN_CONTACT_EVENT, handler);
    return () => window.removeEventListener(OPEN_CONTACT_EVENT, handler);
  }, []);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [close]);

  // Focus trap — identical in behaviour to DonateModal's; see that file for
  // why this is manual rather than relying on a Dialog primitive.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    returnFocusTo.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    (focusableWithin(panel)[0] ?? panel).focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = focusableWithin(panel);
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (!panel.contains(active)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      returnFocusTo.current?.focus();
    };
  }, [open]);

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (form.website.trim() !== "") return; // honeypot tripped; say nothing
      setStatus("submitting");
      try {
        const res = await fetch("/api/contact.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic: form.topic,
            name: form.name,
            email: form.email,
            subject: form.subject,
            message: form.message,
            website: form.website,
          }),
        });
        const payload: { ok?: boolean; error?: string } = await res
          .json()
          .catch(() => ({}));
        if (res.ok && payload.ok) {
          setStatus("sent");
          return;
        }
        setErrorKind(
          payload.error === "rate_limited"
            ? "rate_limited"
            : payload.error === "invalid"
              ? "invalid"
              : "send_failed"
        );
        setStatus("error");
      } catch {
        setErrorKind("network");
        setStatus("error");
      }
    },
    [form]
  );

  const topic =
    CONTACT_TOPICS.find(t => t.key === form.topic) ?? CONTACT_TOPICS[0];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="contact-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm"
            onClick={close}
            aria-hidden="true"
          />

          <motion.div
            key="contact-modal"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              ref={panelRef}
              tabIndex={-1}
              className="relative w-full max-w-lg pointer-events-auto rounded-2xl overflow-hidden shadow-2xl outline-none max-h-[90vh] overflow-y-auto"
              style={{
                background: "linear-gradient(145deg, #0d1526 0%, #0a0f1e 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-title"
            >
              <div
                className="h-1 w-full"
                style={{
                  background:
                    "linear-gradient(90deg, #F97316, #F59E0B, #34D399, #60A5FA)",
                }}
              />

              <button
                onClick={close}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close contact dialog"
              >
                <X size={16} />
              </button>

              <div className="p-6">
                {status === "sent" ? (
                  <div className="text-center py-4">
                    <div className="w-12 h-12 rounded-xl bg-[#34D399]/15 border border-[#34D399]/30 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={24} className="text-[#34D399]" />
                    </div>
                    <h2
                      id="contact-title"
                      className="font-heading font-extrabold text-white text-xl mb-2"
                    >
                      Message sent
                    </h2>
                    <p className="text-sm text-white/60 leading-relaxed mb-6">
                      Thank you — a person will read this and reply to{" "}
                      {form.email || "the address you provided"}.
                      {topic.key === "security"
                        ? " Security reports are answered within 48 hours."
                        : ""}
                    </p>
                    <button
                      onClick={close}
                      className="w-full px-4 py-3 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 text-sm font-semibold text-white transition-colors"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
                        <Mail size={24} className="text-orange-400" />
                      </div>
                      <div>
                        <h2
                          id="contact-title"
                          className="font-heading font-extrabold text-white text-xl"
                        >
                          Contact Us
                        </h2>
                        <p className="text-xs text-white/50">
                          Replies come from a person, not a queue.
                        </p>
                      </div>
                    </div>

                    {status === "error" && (
                      <div className="flex items-start gap-2 mb-4 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/25 text-red-300 text-xs">
                        <AlertTriangle
                          size={14}
                          className="flex-shrink-0 mt-0.5"
                        />
                        <span>{ERROR_COPY[errorKind]}</span>
                      </div>
                    )}

                    <form onSubmit={submit} className="space-y-3">
                      <div>
                        <label
                          htmlFor="contact-topic"
                          className="block text-xs font-medium text-white/50 mb-1.5"
                        >
                          What is this about?
                        </label>
                        <select
                          id="contact-topic"
                          value={form.topic}
                          onChange={e =>
                            setForm(f => ({
                              ...f,
                              topic: e.target.value as ContactTopicKey,
                            }))
                          }
                          className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-orange-500/50"
                        >
                          {CONTACT_TOPICS.map(t => (
                            <option
                              key={t.key}
                              value={t.key}
                              className="bg-[#0d1526]"
                            >
                              {t.label}
                            </option>
                          ))}
                        </select>
                        <p className="text-[11px] text-white/50 mt-1">
                          {topic.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label
                            htmlFor="contact-name"
                            className="block text-xs font-medium text-white/50 mb-1.5"
                          >
                            Name
                          </label>
                          <input
                            id="contact-name"
                            type="text"
                            required
                            maxLength={120}
                            value={form.name}
                            onChange={e =>
                              setForm(f => ({ ...f, name: e.target.value }))
                            }
                            className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-orange-500/50"
                            placeholder="Ada Lovelace"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="contact-email"
                            className="block text-xs font-medium text-white/50 mb-1.5"
                          >
                            Your email
                          </label>
                          <input
                            id="contact-email"
                            type="email"
                            required
                            maxLength={254}
                            value={form.email}
                            onChange={e =>
                              setForm(f => ({ ...f, email: e.target.value }))
                            }
                            className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-orange-500/50"
                            placeholder="you@example.org"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="contact-subject"
                          className="block text-xs font-medium text-white/50 mb-1.5"
                        >
                          Subject{" "}
                          <span className="text-white/50">(optional)</span>
                        </label>
                        <input
                          id="contact-subject"
                          type="text"
                          maxLength={200}
                          value={form.subject}
                          onChange={e =>
                            setForm(f => ({ ...f, subject: e.target.value }))
                          }
                          className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-orange-500/50"
                          placeholder="A short summary"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contact-message"
                          className="block text-xs font-medium text-white/50 mb-1.5"
                        >
                          Message
                        </label>
                        <textarea
                          id="contact-message"
                          required
                          minLength={10}
                          maxLength={3000}
                          rows={4}
                          value={form.message}
                          onChange={e =>
                            setForm(f => ({ ...f, message: e.target.value }))
                          }
                          className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-orange-500/50 resize-none"
                          placeholder="What would you like to tell us?"
                        />
                      </div>

                      {/* Honeypot — hidden from people, visible to naive bots.
                          Not display:none: some scrapers skip those. */}
                      <div
                        className="absolute -left-[9999px] top-0"
                        aria-hidden="true"
                      >
                        <label htmlFor="contact-website">Website</label>
                        <input
                          id="contact-website"
                          type="text"
                          tabIndex={-1}
                          autoComplete="off"
                          value={form.website}
                          onChange={e =>
                            setForm(f => ({ ...f, website: e.target.value }))
                          }
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20 hover:border-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 text-sm font-bold text-white"
                      >
                        <Send size={14} className="text-orange-400" />
                        {status === "submitting" ? "Sending…" : "Send Message"}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
