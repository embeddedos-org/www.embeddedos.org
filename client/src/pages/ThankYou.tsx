import { Link } from "wouter";
import { BpPage, PageHero } from "@/components/bp";
import type { ConfirmedAction } from "@/lib/confirmation";

/**
 * The page a completed action lands on: a sent contact message, a delivered
 * job application, a confirmed card donation. Opened only by
 * openConfirmationPage() in lib/confirmation.ts, and never linked, listed or
 * indexed (see NOINDEX_ROUTES in lib/page-meta.ts).
 *
 * Each says no more than the in-place success state of the form it follows
 * already says, in the same words: this page is reached after that state, so
 * it cannot promise anything the form did not.
 */
const CONFIRMATIONS: Record<
  ConfirmedAction,
  { label: string; title: string; lead: string }
> = {
  contact: {
    label: "Contact",
    title: "Message sent",
    lead: "Thank you — a person will read this and reply to the address you provided.",
  },
  application: {
    label: "Careers",
    title: "Application received",
    lead: "Thank you — your application was received, and a confirmation is on its way to your inbox. A person reads every one; we usually reply within 5–10 business days.",
  },
  donation: {
    label: "Donate",
    title: "Thank you for your gift!",
    lead: "A receipt is on its way from Stripe. Your support keeps EmbeddedOS free and open.",
  },
};

export default function ThankYou({ action }: { action: ConfirmedAction }) {
  const { label, title, lead } = CONFIRMATIONS[action];
  return (
    <BpPage>
      <PageHero label={label} title={title} lead={lead}>
        <div className="ctas">
          <Link href="/" className="btn pri">
            Back to the homepage
          </Link>
          <Link href="/projects" className="btn gh">
            Projects
          </Link>
          <Link href="/get-involved" className="btn gh">
            Get involved
          </Link>
          <Link href="/contact" className="btn gh">
            Contact
          </Link>
        </div>
      </PageHero>
    </BpPage>
  );
}
