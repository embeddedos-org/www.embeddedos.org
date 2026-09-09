<?php

/**
 * Sitewide contact-form endpoint.
 *
 * Mirrors client/public/api/apply.php's architecture and its reasoning: the
 * site deploys as a prerendered static build (see that file's header comment
 * for why PHP, not the Node/tRPC server, is what actually runs in
 * production — every /api/trpc/* path on the live site answers 404, and
 * server/ exists only for local development and tests). This endpoint is
 * what every non-Careers "email us" link on the site now posts to instead of
 * rendering a mailto: link.
 *
 * No email address is ever sent to the browser. TOPIC_INBOXES below is the
 * only place a topic resolves to a mailbox, and it exists only here, on the
 * server; the client only ever knows the topic *keys*, via
 * client/src/data/foundation.ts's CONTACT_TOPICS (label + description, no
 * address) and ContactFormModal.tsx (the form that posts here).
 *
 * Because vite copies client/public verbatim, this file ships to
 * dist/public/api/contact.php and is served at /api/contact.php.
 *
 * Sending uses mail(), not authenticated SMTP, for the same reason
 * apply.php does: on cPanel that hands off to the local MTA, which already
 * sends for this domain under its own SPF/DKIM, so it needs no mailbox
 * password — nothing to store, nothing to leak, nothing for an operator to
 * configure.
 */

declare(strict_types=1);

// ── Configuration ────────────────────────────────────────────────────────────

/**
 * Topic key (matches the `key` field of CONTACT_TOPICS, and every key of
 * CONTACT_EMAILS, in client/src/data/foundation.ts) to the mailbox that
 * receives it. Never taken from the request beyond selecting one of these
 * fixed keys — this is the entire address book, and it lives only here.
 */
const TOPIC_INBOXES = [
    'contact'   => 'contact@embeddedos.org',
    'support'   => 'support@embeddedos.org',
    'security'  => 'security@embeddedos.org',
    'press'     => 'press@embeddedos.org',
    'partners'  => 'partners@embeddedos.org',
    'careers'   => 'careers@embeddedos.org',
    'donations' => 'donate@embeddedos.org',
    'finance'   => 'foundation@embeddedos.org',
    'sponsors'  => 'sponsors@embeddedos.org',
    'conduct'   => 'conduct@embeddedos.org',
];

/** Human-readable label per topic, for the email subject line only. Kept in
 *  sync with CONTACT_TOPICS' `label` field by tests/php/contact.test.php. */
const TOPIC_LABELS = [
    'contact'   => 'General Inquiries',
    'support'   => 'Technical Support',
    'security'  => 'Security Vulnerabilities',
    'press'     => 'Press & Media',
    'partners'  => 'Partnerships',
    'careers'   => 'Careers & Internships',
    'donations' => 'Donations & Fundraising',
    'finance'   => 'Finance & Governance',
    'sponsors'  => 'Sponsorship',
    'conduct'   => 'Code of Conduct',
];

/** Envelope sender name. The address is always the topic's own inbox (see
 *  send, below) so SPF passes for whichever domain mailbox is used. */
const FROM_NAME = 'EmbeddedOS Foundation';

/** Requests permitted from one address per window. */
const RATE_LIMIT_MAX    = 5;
const RATE_LIMIT_WINDOW = 3600; // seconds

/** A body larger than this is refused before it is parsed. */
const MAX_BODY_BYTES = 32 * 1024;

const MAX_LENGTHS = [
    'name'    => 120,
    'email'   => 254,
    'subject' => 200,
    'message' => 3000,
];

// ── Pure helpers, unit-tested from tests/php/contact.test.php ────────────────
//
// Behaviourally identical to apply.php's helpers of the same name; duplicated
// rather than shared so each /api/*.php file stays a single file that can be
// copied to the host verbatim, with nothing else to deploy alongside it.

/**
 * Strip anything that could start a new header line.
 *
 * The sender's address goes into Reply-To. A bare CR or LF in it would let a
 * submitter append headers of their own — Bcc: to a list they control, or a
 * second body — turning this endpoint into an open relay for spam sent under
 * the Foundation's SPF record. This is the single most important function
 * here.
 */
function header_safe(string $value): string
{
    return trim(str_replace(["\r", "\n", "\0", "%0a", "%0d", "%0A", "%0D"], '', $value));
}

/** Escape for interpolation into the HTML body of an email. */
function h(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/**
 * Flatten a value that is meant to occupy one line.
 *
 * header_safe() protects the headers, and validation rejects a CRLF inside an
 * email address, so neither of those is the gap this closes. The gap is the
 * body: staff_text() prints `Name: <name>`, and a name carrying newlines
 * would let a submitter forge whole lines in the message staff read. Every
 * control character goes, not just CR and LF: a bare backspace or escape can
 * rewrite what a terminal or mail client shows.
 */
function single_line(string $value): string
{
    return trim((string) preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $value));
}

/**
 * The message is the one field that may legitimately span lines, so it keeps
 * \n and \t and loses everything else.
 */
function multi_line(string $value): string
{
    return trim((string) preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]+/u', '', $value));
}

/**
 * Length in characters, without mbstring — see apply.php's char_len() for why
 * PCRE's /u mode is used instead of mb_strlen().
 */
function char_len(string $value): int
{
    $count = preg_match_all('/./us', $value);
    return $count === false ? strlen($value) : $count;
}

/**
 * Validate a decoded payload.
 *
 * Returns [cleaned, errors]. `errors` empty means the message is good.
 */
function validate_contact(array $in): array
{
    $errors = [];
    $out    = [];

    // Single-line by default: every field below is one line except the
    // message, which uses multi_line() where it is read.
    $str = static fn(string $k): string => isset($in[$k]) && is_string($in[$k])
        ? single_line($in[$k])
        : '';

    $out['topic'] = $str('topic');
    if (!array_key_exists($out['topic'], TOPIC_INBOXES)) {
        $errors[] = 'topic';
    }

    $out['name'] = $str('name');
    if (char_len($out['name']) < 2 || char_len($out['name']) > MAX_LENGTHS['name']) {
        $errors[] = 'name';
    }

    $out['email'] = $str('email');
    if (
        char_len($out['email']) > MAX_LENGTHS['email']
        || filter_var($out['email'], FILTER_VALIDATE_EMAIL) === false
    ) {
        $errors[] = 'email';
    }

    // Optional context a caller can prefill — e.g. a programme name, or
    // "Host an Event" — shown in the subject line. Blank is fine; too long
    // is the only way this field fails on its own.
    $out['subject'] = $str('subject');
    if (char_len($out['subject']) > MAX_LENGTHS['subject']) {
        $errors[] = 'subject';
    }

    $out['message'] = multi_line(
        isset($in['message']) && is_string($in['message']) ? $in['message'] : ''
    );
    if (char_len($out['message']) < 10 || char_len($out['message']) > MAX_LENGTHS['message']) {
        $errors[] = 'message';
    }

    return [$out, $errors];
}

/** The subject line shared by the staff copy and its headers. */
function subject_line(array $c): string
{
    $label = TOPIC_LABELS[$c['topic']] ?? 'General Inquiries';
    return $c['subject'] === '' ? "[Contact] $label" : "[Contact] {$c['subject']} ($label)";
}

/** The plain-text body delivered to the topic's inbox. */
function staff_text(array $c, string $submittedAt): string
{
    $line  = static fn(string $label, string $value): string => $value === '' ? '' : "$label: $value\n";
    $label = TOPIC_LABELS[$c['topic']] ?? 'General Inquiries';

    return "New contact-form message — EmbeddedOS Research Foundation\n\n"
        . $line('Topic', $label)
        . $line('Name', $c['name'])
        . $line('Email', $c['email'])
        . $line('Subject', $c['subject'])
        . "\nMessage:\n" . $c['message'] . "\n"
        . "\nSubmitted: $submittedAt\n";
}

/** The HTML body delivered to the topic's inbox. Every field is escaped. */
function staff_html(array $c, string $submittedAt): string
{
    $row = static function (string $label, string $value): string {
        if ($value === '') {
            return '';
        }
        return '<tr><td style="padding:6px 16px 6px 0;color:#64748B;font-size:13px;'
            . 'white-space:nowrap;vertical-align:top">' . h($label) . '</td>'
            . '<td style="padding:6px 0;color:#0F172A;font-size:14px">' . h($value) . '</td></tr>';
    };

    $label = TOPIC_LABELS[$c['topic']] ?? 'General Inquiries';

    return '<!doctype html><html><body style="margin:0;background:#F8FAFC;'
        . 'font-family:-apple-system,Segoe UI,Arial,sans-serif">'
        . '<div style="max-width:640px;margin:0 auto;background:#fff;padding:32px">'
        . '<h1 style="margin:0 0 4px;font-size:18px;color:#0F172A">New contact-form message</h1>'
        . '<p style="margin:0 0 24px;color:#64748B;font-size:13px">'
        . 'EmbeddedOS Research Foundation — ' . h($label) . '</p>'
        . '<table style="border-collapse:collapse;width:100%">'
        . $row('Topic', $label)
        . $row('Name', $c['name'])
        . $row('Email', $c['email'])
        . $row('Subject', $c['subject'])
        . '</table>'
        . '<h2 style="margin:24px 0 8px;font-size:13px;text-transform:uppercase;'
        . 'letter-spacing:.08em;color:#C2410C">Message</h2>'
        . '<div style="white-space:pre-wrap;line-height:1.6;color:#0F172A;font-size:14px;'
        . 'border-left:3px solid #FDBA74;padding-left:16px">' . h($c['message']) . '</div>'
        . '<p style="margin:24px 0 0;color:#94A3B8;font-size:12px">Submitted '
        . h($submittedAt) . '. Reply to this message to reach the sender.</p>'
        . '</div></body></html>';
}

/** The acknowledgement sent to the sender. */
function sender_text(array $c): string
{
    $label = TOPIC_LABELS[$c['topic']] ?? 'General Inquiries';

    return "Hello {$c['name']},\n\n"
        . "Thank you for contacting the EmbeddedOS Research Foundation about "
        . "$label. Your message has been received and a person will read it.\n\n"
        . "We usually reply within a few business days; security reports are "
        . "answered within 48 hours. You can reply to this message with "
        . "anything you would like to add.\n\n"
        . "EmbeddedOS Research Foundation\nhttps://www.embeddedos.org/contact\n";
}

/**
 * Allow this request under the per-address limit, and record it.
 *
 * Deliberately crude, mirroring apply.php's rate_limit_ok(): a JSON file of
 * timestamps per hashed address in the system temp directory. The address is
 * hashed so the store holds no readable IP, and failure to read or write it
 * never blocks a message — losing a genuine one to a full disk would be worse
 * than accepting an extra one from a flooder.
 */
function rate_limit_ok(string $ip, string $dir, int $now): bool
{
    if ($ip === '') {
        return true;
    }
    $file = $dir . '/eos-contact-' . hash('sha256', $ip) . '.json';

    $seen = [];
    if (is_readable($file)) {
        $decoded = json_decode((string) @file_get_contents($file), true);
        if (is_array($decoded)) {
            $seen = array_values(array_filter(
                $decoded,
                static fn($t): bool => is_int($t) && $t > $now - RATE_LIMIT_WINDOW
            ));
        }
    }

    if (count($seen) >= RATE_LIMIT_MAX) {
        return false;
    }

    $seen[] = $now;
    @file_put_contents($file, json_encode($seen), LOCK_EX);
    return true;
}

// ── Request handling ─────────────────────────────────────────────────────────
//
// Guarded so the test harness can require this file for the functions above
// without a request being processed.

if (PHP_SAPI === 'cli') {
    return;
}

/** Answer as JSON and stop. */
function respond(int $status, array $payload): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

// Never print a stack trace to a visitor; a failure is a 500 with no detail.
ini_set('display_errors', '0');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

$raw = file_get_contents('php://input');
if ($raw === false || strlen($raw) > MAX_BODY_BYTES) {
    respond(413, ['ok' => false, 'error' => 'too_large']);
}

$payload = json_decode((string) $raw, true);
if (!is_array($payload)) {
    respond(400, ['ok' => false, 'error' => 'malformed_json']);
}

// Honeypot: a field hidden from people and irresistible to naive bots. Answer
// 200 so a bot cannot tell it was caught and retry with the field cleared.
if (isset($payload['website']) && trim((string) $payload['website']) !== '') {
    respond(200, ['ok' => true]);
}

$ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
if (!rate_limit_ok($ip, sys_get_temp_dir(), time())) {
    respond(429, ['ok' => false, 'error' => 'rate_limited']);
}

[$contact, $errors] = validate_contact($payload);
if ($errors !== []) {
    respond(422, ['ok' => false, 'error' => 'invalid', 'fields' => $errors]);
}

$inbox       = TOPIC_INBOXES[$contact['topic']];
$submittedAt = gmdate('Y-m-d H:i') . ' UTC';
$boundary    = 'eos' . bin2hex(random_bytes(16));
$replyTo     = header_safe($contact['email']);
$subject     = header_safe(subject_line($contact));

$headers = implode("\r\n", [
    'MIME-Version: 1.0',
    'From: ' . FROM_NAME . ' <' . $inbox . '>',
    'Reply-To: ' . $replyTo,
    'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
    'X-Mailer: embeddedos-contact',
]);

$body = "--$boundary\r\n"
    . "Content-Type: text/plain; charset=UTF-8\r\n\r\n"
    . staff_text($contact, $submittedAt) . "\r\n"
    . "--$boundary\r\n"
    . "Content-Type: text/html; charset=UTF-8\r\n\r\n"
    . staff_html($contact, $submittedAt) . "\r\n"
    . "--$boundary--\r\n";

// The staff copy is the one that must not be lost. If it fails, the caller is
// told, and the client shows a "try again later" state — see
// ContactFormModal.tsx.
if (!@mail($inbox, $subject, $body, $headers)) {
    respond(502, ['ok' => false, 'error' => 'send_failed']);
}

// The acknowledgement is best-effort: the message is already safe, so a
// bounce here must not report failure and send the sender round again.
@mail(
    header_safe($contact['email']),
    'We received your message — EmbeddedOS Research Foundation',
    sender_text($contact),
    implode("\r\n", [
        'MIME-Version: 1.0',
        'From: ' . FROM_NAME . ' <' . $inbox . '>',
        'Reply-To: ' . $inbox,
        'Content-Type: text/plain; charset=UTF-8',
        'X-Mailer: embeddedos-contact',
    ])
);

respond(200, ['ok' => true]);
