import type { ContactTopicKey } from "@/data/foundation";

/**
 * The global trigger for `ContactFormModal`, mirroring how `Navbar.tsx` opens
 * `DonateModal` with `window.dispatchEvent(new CustomEvent("open-donate"))`.
 *
 * Every page that used to render a `mailto:` link now calls `openContactForm`
 * instead, so the event name and its payload shape are typed and centralised
 * here rather than re-typed at ~20 call sites — a typo in a bare string event
 * name fails silently (the modal just never opens), which is exactly the kind
 * of mistake worth making impossible to repeat by hand.
 */
export const OPEN_CONTACT_EVENT = "open-contact";

export interface OpenContactDetail {
  /** Which inbox this should route to. Defaults to "contact" if omitted. */
  topic?: ContactTopicKey;
  /**
   * Optional context to prefill the subject with — a programme name, "Host
   * an Event", "Internship Application". Shown to the visitor and included
   * in the email subject line; never an address.
   */
  subject?: string;
}

/** Open the contact form, optionally pre-selecting a topic and subject. */
export function openContactForm(detail: OpenContactDetail = {}): void {
  window.dispatchEvent(
    new CustomEvent<OpenContactDetail>(OPEN_CONTACT_EVENT, { detail })
  );
}
