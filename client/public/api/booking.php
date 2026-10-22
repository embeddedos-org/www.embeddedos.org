<?php

declare(strict_types=1);

/*
 * On, together with CALENDLY_EVENT_URL (README, "Booking"): the team's Calendly
 * event exists and /book embeds it. Set it back to false whenever
 * CALENDLY_EVENT_URL is null; every request then gets 503 and nothing is
 * mailed, because the site never calls this endpoint without a calendar. Even
 * when on, the endpoint checks only the Origin header, the shape of the
 * Calendly identifiers, the page path and a per-address rate limit; it cannot
 * confirm a booking with Calendly, which is why each notice says to check
 * Calendly first.
 */
const BOOKING_NOTICES_ENABLED = true;

const BOOKING_INBOXES = [
    'kartikeydheer@embeddedos.org',
    'srikanth@embeddedos.org',
];

const FROM_NAME = 'EmbeddedOS Foundation';

const BOOKING_SUBJECT = 'New meeting booked via embeddedos.org';

const ALLOWED_ORIGINS = [
    'https://www.embeddedos.org',
    'https://embeddedos.org',
];

const EVENT_URI_PATTERN   = '~^https://api\.calendly\.com/scheduled_events/([A-Za-z0-9-]{1,64})$~D';
const INVITEE_URI_PATTERN = '~^https://api\.calendly\.com/(?:api/v2/)?scheduled_events/([A-Za-z0-9-]{1,64})/invitees/[A-Za-z0-9-]{1,64}$~D';
const PAGE_PATTERN        = '~^/[a-z0-9-]{1,64}(?:/[a-z0-9-]{1,64})*$~D';

const SITE_ORIGIN = 'https://www.embeddedos.org';

const RATE_LIMIT_MAX    = 5;
const RATE_LIMIT_WINDOW = 3600;

const MAX_BODY_BYTES = 4 * 1024;

function header_safe(string $value): string
{
    return trim(str_replace(["\r", "\n", "\0", "%0a", "%0d", "%0A", "%0D"], '', $value));
}

function same_origin_ok(string $origin): bool
{
    return in_array($origin, ALLOWED_ORIGINS, true);
}

function validate_booking(array $in): array
{
    $errors = [];
    $out    = [];

    foreach (['event_uri', 'invitee_uri', 'page'] as $key) {
        $out[$key] = isset($in[$key]) && is_string($in[$key]) ? $in[$key] : '';
    }

    $event = [];
    if (preg_match(EVENT_URI_PATTERN, $out['event_uri'], $event) !== 1) {
        $errors[] = 'event_uri';
    }

    $invitee = [];
    if (preg_match(INVITEE_URI_PATTERN, $out['invitee_uri'], $invitee) !== 1) {
        $errors[] = 'invitee_uri';
    } elseif ($event !== [] && $invitee[1] !== $event[1]) {
        $errors[] = 'invitee_uri';
    }

    if (preg_match(PAGE_PATTERN, $out['page']) !== 1) {
        $errors[] = 'page';
    }

    return [$out, $errors];
}

function booking_text(array $b, string $receivedAt): string
{
    return BOOKING_SUBJECT . "\n\n"
        . "A visitor booked a meeting in the Calendly calendar embedded on the site.\n\n"
        . 'Page: ' . SITE_ORIGIN . $b['page'] . "\n"
        . 'Scheduled event: ' . $b['event_uri'] . "\n"
        . 'Invitee: ' . $b['invitee_uri'] . "\n"
        . "Received: $receivedAt\n\n"
        . "This notice comes from the visitor's browser and is not checked against\n"
        . "Calendly. Confirm the booking in Calendly before acting on it; Calendly\n"
        . "sends the invitee's name, email and answers to the event's host.\n";
}

function booking_headers(string $inbox): string
{
    return implode("\r\n", [
        'MIME-Version: 1.0',
        'From: ' . FROM_NAME . ' <' . header_safe($inbox) . '>',
        'Content-Type: text/plain; charset=UTF-8',
        'X-Mailer: embeddedos-booking',
    ]);
}

function rate_limit_ok(string $ip, string $dir, int $now): bool
{
    if ($ip === '') {
        return false;
    }
    $file = $dir . '/eos-booking-' . hash('sha256', $ip) . '.json';

    $handle = @fopen($file, 'c+');
    if ($handle === false) {
        return false;
    }
    try {
        if (!flock($handle, LOCK_EX)) {
            return false;
        }
        $raw = stream_get_contents($handle);
        if ($raw === false) {
            return false;
        }
        $decoded = $raw === '' ? [] : json_decode($raw, true);
        if (!is_array($decoded)) {
            return false;
        }
        $seen = array_values(array_filter(
            $decoded,
            static fn($t): bool => is_int($t) && $t > $now - RATE_LIMIT_WINDOW
        ));
        if (count($seen) >= RATE_LIMIT_MAX) {
            return false;
        }
        $seen[] = $now;
        $encoded = json_encode($seen);
        return $encoded !== false
            && rewind($handle)
            && ftruncate($handle, 0)
            && fwrite($handle, $encoded) === strlen($encoded)
            && fflush($handle);
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}

/**
 * Decide one request and return [HTTP status, JSON payload]. The request's
 * parts, the clock and the mailer come in as arguments, so the tests can run
 * every path, with the switch on or off, without sending mail. $readBody is
 * called only once the method and Origin have passed; $send is called once per
 * inbox and returns whether the mail was accepted.
 */
function handle_booking(
    bool $enabled,
    string $method,
    string $origin,
    callable $readBody,
    string $ip,
    string $limitDir,
    int $now,
    callable $send
): array {
    if (!$enabled) {
        return [503, ['ok' => false, 'error' => 'booking_notices_disabled']];
    }

    if ($method !== 'POST') {
        return [405, ['ok' => false, 'error' => 'method_not_allowed']];
    }

    if (!same_origin_ok($origin)) {
        return [403, ['ok' => false, 'error' => 'forbidden_origin']];
    }

    $raw = $readBody();
    if (!is_string($raw) || strlen($raw) > MAX_BODY_BYTES) {
        return [413, ['ok' => false, 'error' => 'too_large']];
    }

    $payload = json_decode($raw, true);
    if (!is_array($payload)) {
        return [400, ['ok' => false, 'error' => 'malformed_json']];
    }

    if (!rate_limit_ok($ip, $limitDir, $now)) {
        return [429, ['ok' => false, 'error' => 'rate_limited']];
    }

    [$booking, $errors] = validate_booking($payload);
    if ($errors !== []) {
        return [422, ['ok' => false, 'error' => 'invalid', 'fields' => $errors]];
    }

    $text   = booking_text($booking, gmdate('Y-m-d H:i', $now) . ' UTC');
    $failed = 0;
    foreach (BOOKING_INBOXES as $inbox) {
        if (!$send($inbox, BOOKING_SUBJECT, $text, booking_headers($inbox))) {
            $failed++;
        }
    }

    if ($failed > 0) {
        return [502, ['ok' => false, 'error' => 'send_failed']];
    }

    return [200, ['ok' => true]];
}

if (PHP_SAPI === 'cli') {
    return;
}

ini_set('display_errors', '0');

[$status, $payload] = handle_booking(
    BOOKING_NOTICES_ENABLED,
    (string) ($_SERVER['REQUEST_METHOD'] ?? ''),
    (string) ($_SERVER['HTTP_ORIGIN'] ?? ''),
    static fn() => file_get_contents('php://input', false, null, 0, MAX_BODY_BYTES + 1),
    (string) ($_SERVER['REMOTE_ADDR'] ?? ''),
    sys_get_temp_dir(),
    time(),
    static fn(string $to, string $subject, string $text, string $headers): bool
        => @mail($to, $subject, $text, $headers)
);

http_response_code($status);
if ($status === 405) {
    header('Allow: POST');
}
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
echo json_encode($payload, JSON_UNESCAPED_SLASHES);
