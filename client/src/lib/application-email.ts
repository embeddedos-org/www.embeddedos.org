/**
 * Turns a careers application into an email the visitor sends themselves.
 *
 * The form used to POST to `careers.submitApplication`, which notified the
 * owner and sent two SMTP messages. None of that ran in production: the site
 * deploys as a prerendered static build to cPanel with no server process, so
 * `/api/trpc/careers.submitApplication` answered 404 with the 404 HTML page and
 * the applicant saw "Submission failed". Every application submitted through
 * that form was lost, and no notification was ever sent.
 *
 * Static hosting cannot send mail, so the application is composed here and
 * handed to the visitor's own mail client. That has a property the old flow
 * lacked even when it worked: the applicant keeps a copy in their Sent folder
 * and can attach a CV, which the form never accepted.
 *
 * The alternative — POSTing to a third-party form service — was rejected while
 * this data includes work-authorization and visa status. That is exactly the
 * category of personal data that should not pass through an unvetted processor
 * on a nonprofit's behalf without a decision to do so being made deliberately.
 */

/** Where applications are sent. */
export const CAREERS_ADDRESS = "careers@embeddedos.org";

/**
 * Longest `mailto:` URL to hand to the browser.
 *
 * Windows caps the command line it uses to launch a mail client at roughly
 * 2,048 characters and silently truncates past it, which would send a
 * half-written application. The statement field alone accepts 3,000
 * characters, so overflow is normal rather than exceptional and gets the
 * clipboard path instead.
 */
export const MAILTO_MAX_LENGTH = 1900;

/** The fields the email is built from. Mirrors the careers form state. */
export type ApplicationFields = {
  fullName: string;
  email: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  roleCategory: string;
  employmentType: string;
  workAuthorization: string;
  statement: string;
  availability?: string;
  heardFrom?: string;
};

/** A composed application, ready to send or copy. */
export type ComposedApplication = {
  subject: string;
  body: string;
  /**
   * `mailto:` URL for the full application, or `null` when the body is too long
   * to survive the URL. Callers fall back to the clipboard in that case.
   */
  mailtoUrl: string | null;
};

const line = (label: string, value?: string): string =>
  value && value.trim() ? `${label}: ${value.trim()}\n` : "";

/**
 * Compose the application email.
 *
 * @param fields Validated form values.
 * @returns The subject, the plain-text body, and a `mailto:` URL when the body
 *   fits inside one.
 *
 * @example
 * const { subject, mailtoUrl } = composeApplication({
 *   fullName: "Jane Smith",
 *   email: "jane@example.com",
 *   roleCategory: "Research Engineer",
 *   employmentType: "Full-Time",
 *   workAuthorization: "US Citizen",
 *   statement: "…",
 * });
 * subject; // "Application: Jane Smith — Research Engineer (Full-Time)"
 */
export function composeApplication(
  fields: ApplicationFields
): ComposedApplication {
  const subject = `Application: ${fields.fullName} — ${fields.roleCategory} (${fields.employmentType})`;

  const body =
    `APPLICANT\n` +
    line("Name", fields.fullName) +
    line("Email", fields.email) +
    line("Phone", fields.phone) +
    `\nPOSITION\n` +
    line("Role category", fields.roleCategory) +
    line("Employment type", fields.employmentType) +
    line("Work authorization", fields.workAuthorization) +
    line("Availability", fields.availability) +
    `\nLINKS\n` +
    line("LinkedIn", fields.linkedin) +
    line("GitHub", fields.github) +
    line("Portfolio", fields.portfolio) +
    `\nSTATEMENT OF INTEREST\n${fields.statement.trim()}\n` +
    (fields.heardFrom?.trim()
      ? `\nHow they heard about us: ${fields.heardFrom.trim()}\n`
      : "") +
    `\n— Sent from the careers form at https://www.embeddedos.org/careers\n` +
    `Please attach your CV to this email before sending.\n`;

  const url =
    `mailto:${CAREERS_ADDRESS}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  return {
    subject,
    body,
    mailtoUrl: url.length <= MAILTO_MAX_LENGTH ? url : null,
  };
}

/**
 * A short `mailto:` that opens a blank-bodied message to the careers address.
 *
 * Used when the full application will not fit in a URL: the visitor gets an
 * addressed, subject-filled draft and pastes the body from the clipboard.
 *
 * @param subject Subject line to prefill.
 * @returns A `mailto:` URL with no body.
 *
 * @example
 * shortMailto("Application: Jane Smith — Research Engineer (Full-Time)");
 * // "mailto:careers@embeddedos.org?subject=Application%3A%20Jane…"
 */
export function shortMailto(subject: string): string {
  return `mailto:${CAREERS_ADDRESS}?subject=${encodeURIComponent(subject)}`;
}
