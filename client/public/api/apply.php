<?php

/**
 * Careers application endpoint.
 *
 * Why PHP, in a React repository: the site deploys as a prerendered static
 * build. scripts/deploy-branch.mjs publishes dist/public to an orphan `deploy`
 * branch that cPanel copies into the document root, and no Node process is
 * started — every /api/trpc/* path on the live site answers 404 with the 404
 * HTML page. server/ exists for local development and tests. PHP is the one
 * runtime the host already executes, so it is the only way to accept a form
 * post without changing how the site is deployed.
 *
 * Because vite copies client/public verbatim, this file ships to
 * dist/public/api/apply.php and is served at /api/apply.php.
 *
 * The client falls back to the mailto draft if this endpoint does not answer
 * with JSON, so a host without PHP degrades to the previous behaviour rather
 * than losing the application. Nothing here is load-bearing for the page.
 *
 * Sending uses mail(), not authenticated SMTP. On cPanel that hands off to the
 * local MTA, which already sends for this domain under its own SPF/DKIM, so it
 * needs no mailbox password — nothing to store, nothing to leak, nothing for an
 * operator to configure. Authenticated submission through
 * mail.embeddedos.org:587 is a deliverability upgrade, not a correctness one,
 * and would need the password held as a secret on the host.
 */

declare(strict_types=1);

// ── Configuration ────────────────────────────────────────────────────────────

/** Where applications are delivered. Never taken from the request. */
const STAFF_INBOX = 'careers@embeddedos.org';

/** Envelope sender. Must be a real mailbox on this domain for SPF to pass. */
const FROM_ADDRESS = 'careers@embeddedos.org';
const FROM_NAME    = 'EmbeddedOS Careers';

/** Requests permitted from one address per window. */
const RATE_LIMIT_MAX     = 5;
const RATE_LIMIT_WINDOW  = 3600; // seconds

/** A body larger than this is refused before it is parsed. */
const MAX_BODY_BYTES = 64 * 1024;

/**
 * Field rules, mirroring the zod schema in server/routers.ts so the two cannot
 * disagree about what a valid application is.
 */
const ENUMS = [
    'roleCategory' => [
        'Software Engineer', 'AI/ML Engineer', 'Embedded Systems Engineer',
        'Full-Stack Developer', 'DevOps & Cloud Engineer', 'Research Engineer',
        'Technical Writer', 'Open Source Contributor', 'Student Intern',
        'Volunteer', 'Research Fellow',
    ],
    'employmentType' => [
        'Full-Time', 'Part-Time', 'Contractor', 'Internship — Paid',
        'Internship — Unpaid', 'Research Internship', 'Open Source Internship',
        'Capstone / Academic Project', 'F-1 CPT', 'F-1 OPT', 'F-1 STEM OPT',
        'J-1 Intern / Trainee', 'Volunteer', 'Research Fellow',
    ],
    'workAuthorization' => [
        'US Citizen', 'Permanent Resident (Green Card)', 'EAD Holder',
        'F-1 CPT Authorized', 'F-1 OPT Authorized', 'F-1 STEM OPT Authorized',
        'J-1 Intern / Trainee', 'Other (please specify in statement)',
    ],
];

const MAX_LENGTHS = [
    'fullName' => 120, 'email' => 254, 'phone' => 30,
    'linkedin' => 300, 'github' => 300, 'portfolio' => 300,
    'statement' => 3000, 'availability' => 200, 'heardFrom' => 200,
];

// ── Pure helpers, unit-tested from tests/php/apply.test.php ──────────────────

/**
 * Strip anything that could start a new header line.
 *
 * The applicant's address goes into Reply-To. A bare CR or LF in it would let
 * a submitter append headers of their own — Bcc: to a list they control, or a
 * second body — turning this endpoint into an open relay for spam sent under
 * the Foundation's SPF record. This is the single most important function here.
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
 * body: staff_text() prints `Name: <fullName>`, and a name carrying newlines
 * let an applicant forge whole lines in the message staff read —
 *
 *     Name: Ada
 *     Bcc: victim@elsewhere.test
 *     X-Injected: yes
 *
 * — which is not header injection, because it lands after the header
 * terminator, but does let a submitter put words in the Foundation's email.
 * Found by sending exactly that through a real Apache and reading what the MTA
 * was handed.
 *
 * Every control character goes, not just CR and LF: a bare backspace or escape
 * can rewrite what a terminal or mail client shows.
 */
function single_line(string $value): string
{
    return trim((string) preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $value));
}

/**
 * The statement is the one field that may legitimately span lines, so it keeps
 * \n and \t and loses everything else.
 */
function multi_line(string $value): string
{
    return trim((string) preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]+/u', '', $value));
}

/**
 * Length in characters, without mbstring.
 *
 * mb_strlen would be the obvious call and is not safe to assume: mbstring is a
 * separate extension, this endpoint cannot be exercised against the production
 * host before it ships, and a missing function is a fatal error rather than a
 * degraded one. PCRE's /u mode is compiled in far more widely.
 *
 * On invalid UTF-8 preg_match_all returns false and this falls back to the byte
 * count, which is never smaller than the character count — so a limit still
 * holds, and the failure is a slightly stricter cap rather than a bypass.
 */
function char_len(string $value): int
{
    $count = preg_match_all('/./us', $value);
    return $count === false ? strlen($value) : $count;
}

/**
 * A URL safe to place in an href.
 *
 * Returns null for anything that is not plainly http(s). The previous
 * nodemailer implementation dropped applicant-supplied `linkedin` straight into
 * `href="..."` after validating it only as a string of at most 300 characters,
 * so `javascript:` — or a quote and a second attribute — went into an email
 * that staff open.
 */
function safe_url(string $value): ?string
{
    $value = trim($value);
    if ($value === '' || strlen($value) > 300) {
        return null;
    }
    if (!preg_match('#^https?://#i', $value)) {
        return null;
    }
    if (filter_var($value, FILTER_VALIDATE_URL) === false) {
        return null;
    }
    return $value;
}

/**
 * Validate a decoded payload.
 *
 * Returns [cleaned, errors]. `errors` empty means the application is good.
 */
function validate_application(array $in): array
{
    $errors = [];
    $out    = [];

    // Single-line by default: every field below is one line except the
    // statement, which uses multi_line() where it is read.
    $str = static fn(string $k): string => isset($in[$k]) && is_string($in[$k])
        ? single_line($in[$k])
        : '';

    // Required, free text.
    $out['fullName'] = $str('fullName');
    if (char_len($out['fullName']) < 2 || char_len($out['fullName']) > MAX_LENGTHS['fullName']) {
        $errors[] = 'fullName';
    }

    $out['email'] = $str('email');
    if (
        char_len($out['email']) > MAX_LENGTHS['email']
        || filter_var($out['email'], FILTER_VALIDATE_EMAIL) === false
    ) {
        $errors[] = 'email';
    }

    $out['statement'] = multi_line(
        isset($in['statement']) && is_string($in['statement'])
            ? $in['statement']
            : ''
    );
    if (char_len($out['statement']) < 50 || char_len($out['statement']) > MAX_LENGTHS['statement']) {
        $errors[] = 'statement';
    }

    // Required, closed sets. An unlisted value is rejected rather than coerced:
    // these reach the email as-is and are the fields most worth pinning down.
    foreach (ENUMS as $field => $allowed) {
        $out[$field] = $str($field);
        if (!in_array($out[$field], $allowed, true)) {
            $errors[] = $field;
        }
    }

    // Optional free text.
    foreach (['phone', 'availability', 'heardFrom'] as $field) {
        $out[$field] = $str($field);
        if (char_len($out[$field]) > MAX_LENGTHS[$field]) {
            $errors[] = $field;
        }
    }

    // Optional links. Anything not plainly http(s) is dropped, not rejected —
    // a malformed portfolio URL should not cost someone their application.
    foreach (['linkedin', 'github', 'portfolio'] as $field) {
        $out[$field] = safe_url($str($field)) ?? '';
    }

    return [$out, $errors];
}

/** The plain-text body delivered to the careers inbox. */
function staff_text(array $a, string $submittedAt): string
{
    $line = static fn(string $label, string $value): string => $value === '' ? '' : "$label: $value\n";

    return "New application — EmbeddedOS Research Foundation\n\n"
        . $line('Name', $a['fullName'])
        . $line('Email', $a['email'])
        . $line('Phone', $a['phone'])
        . "\n"
        . $line('Role', $a['roleCategory'])
        . $line('Type', $a['employmentType'])
        . $line('Work authorization', $a['workAuthorization'])
        . $line('Availability', $a['availability'])
        . "\n"
        . $line('LinkedIn', $a['linkedin'])
        . $line('GitHub', $a['github'])
        . $line('Portfolio', $a['portfolio'])
        . "\nStatement of interest:\n" . $a['statement'] . "\n"
        . $line("\nHeard about us via", $a['heardFrom'])
        . "\nSubmitted: $submittedAt\n";
}

/** The HTML body delivered to the careers inbox. Every field is escaped. */
function staff_html(array $a, string $submittedAt): string
{
    $row = static function (string $label, string $value): string {
        if ($value === '') {
            return '';
        }
        return '<tr><td style="padding:6px 16px 6px 0;color:#64748B;font-size:13px;'
            . 'white-space:nowrap;vertical-align:top">' . h($label) . '</td>'
            . '<td style="padding:6px 0;color:#0F172A;font-size:14px">' . h($value) . '</td></tr>';
    };

    $link = static function (string $label, string $url): string {
        if ($url === '') {
            return '';
        }
        return '<tr><td style="padding:6px 16px 6px 0;color:#64748B;font-size:13px;'
            . 'white-space:nowrap;vertical-align:top">' . h($label) . '</td>'
            . '<td style="padding:6px 0;font-size:14px">'
            . '<a href="' . h($url) . '" style="color:#C2410C">' . h($url) . '</a></td></tr>';
    };

    return '<!doctype html><html><body style="margin:0;background:#F8FAFC;'
        . 'font-family:-apple-system,Segoe UI,Arial,sans-serif">'
        . '<div style="max-width:640px;margin:0 auto;background:#fff;padding:32px">'
        . '<h1 style="margin:0 0 4px;font-size:18px;color:#0F172A">New job application</h1>'
        . '<p style="margin:0 0 24px;color:#64748B;font-size:13px">'
        . 'EmbeddedOS Research Foundation — careers</p>'
        . '<table style="border-collapse:collapse;width:100%">'
        . $row('Name', $a['fullName'])
        . $row('Email', $a['email'])
        . $row('Phone', $a['phone'])
        . $row('Role', $a['roleCategory'])
        . $row('Type', $a['employmentType'])
        . $row('Authorization', $a['workAuthorization'])
        . $row('Availability', $a['availability'])
        . $link('LinkedIn', $a['linkedin'])
        . $link('GitHub', $a['github'])
        . $link('Portfolio', $a['portfolio'])
        . $row('Heard via', $a['heardFrom'])
        . '</table>'
        . '<h2 style="margin:24px 0 8px;font-size:13px;text-transform:uppercase;'
        . 'letter-spacing:.08em;color:#C2410C">Statement of interest</h2>'
        . '<div style="white-space:pre-wrap;line-height:1.6;color:#0F172A;font-size:14px;'
        . 'border-left:3px solid #FDBA74;padding-left:16px">' . h($a['statement']) . '</div>'
        . '<p style="margin:24px 0 0;color:#94A3B8;font-size:12px">Submitted '
        . h($submittedAt) . '. Reply to this message to reach the applicant.</p>'
        . '</div></body></html>';
}

/** The acknowledgement sent to the applicant. */
function applicant_text(array $a): string
{
    return "Dear {$a['fullName']},\n\n"
        . "Thank you for applying to the EmbeddedOS Research Foundation. Your "
        . "application has been received and a person will read it.\n\n"
        . "  Role: {$a['roleCategory']}\n"
        . "  Type: {$a['employmentType']}\n\n"
        . "We usually reply within 5-10 business days. You can reply to this "
        . "message with anything you would like to add, including a CV.\n\n"
        . "EmbeddedOS Research Foundation\n"
        . STAFF_INBOX . "\nhttps://www.embeddedos.org/careers\n";
}

/**
 * Allow this request under the per-address limit, and record it.
 *
 * Deliberately crude: a JSON file of timestamps per hashed address in the
 * system temp directory. The address is hashed so the store holds no readable
 * IP, and failure to read or write it never blocks an application — losing a
 * genuine application to a full disk would be worse than accepting an extra
 * one from a flooder.
 */
function rate_limit_ok(string $ip, string $dir, int $now): bool
{
    if ($ip === '') {
        return true;
    }
    $file = $dir . '/eos-apply-' . hash('sha256', $ip) . '.json';

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

[$application, $errors] = validate_application($payload);
if ($errors !== []) {
    respond(422, ['ok' => false, 'error' => 'invalid', 'fields' => $errors]);
}

$submittedAt = gmdate('Y-m-d H:i') . ' UTC';
$boundary    = 'eos' . bin2hex(random_bytes(16));
$replyTo     = header_safe($application['email']);
$subjectName = header_safe($application['fullName']);

$headers = implode("\r\n", [
    'MIME-Version: 1.0',
    'From: ' . FROM_NAME . ' <' . FROM_ADDRESS . '>',
    'Reply-To: ' . $replyTo,
    'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
    'X-Mailer: embeddedos-apply',
]);

$body = "--$boundary\r\n"
    . "Content-Type: text/plain; charset=UTF-8\r\n\r\n"
    . staff_text($application, $submittedAt) . "\r\n"
    . "--$boundary\r\n"
    . "Content-Type: text/html; charset=UTF-8\r\n\r\n"
    . staff_html($application, $submittedAt) . "\r\n"
    . "--$boundary--\r\n";

$subject = "[Application] $subjectName — {$application['roleCategory']}";

// The staff copy is the one that must not be lost. If it fails, the caller is
// told, and the client falls back to opening a mail draft.
if (!@mail(STAFF_INBOX, $subject, $body, $headers)) {
    respond(502, ['ok' => false, 'error' => 'send_failed']);
}

// The acknowledgement is best-effort: the application is already safe, so a
// bounce here must not report failure and send the applicant round again.
@mail(
    header_safe($application['email']),
    'Application received — EmbeddedOS Research Foundation',
    applicant_text($application),
    implode("\r\n", [
        'MIME-Version: 1.0',
        'From: ' . FROM_NAME . ' <' . FROM_ADDRESS . '>',
        'Reply-To: ' . STAFF_INBOX,
        'Content-Type: text/plain; charset=UTF-8',
        'X-Mailer: embeddedos-apply',
    ])
);

respond(200, ['ok' => true]);
