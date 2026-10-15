<?php

declare(strict_types=1);

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

if (PHP_SAPI === 'cli') {
    return;
}

function respond(int $status, array $payload): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

ini_set('display_errors', '0');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

if (!same_origin_ok((string) ($_SERVER['HTTP_ORIGIN'] ?? ''))) {
    respond(403, ['ok' => false, 'error' => 'forbidden_origin']);
}

$raw = file_get_contents('php://input', false, null, 0, MAX_BODY_BYTES + 1);
if ($raw === false || strlen($raw) > MAX_BODY_BYTES) {
    respond(413, ['ok' => false, 'error' => 'too_large']);
}

$payload = json_decode((string) $raw, true);
if (!is_array($payload)) {
    respond(400, ['ok' => false, 'error' => 'malformed_json']);
}

$ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
if (!rate_limit_ok($ip, sys_get_temp_dir(), time())) {
    respond(429, ['ok' => false, 'error' => 'rate_limited']);
}

[$booking, $errors] = validate_booking($payload);
if ($errors !== []) {
    respond(422, ['ok' => false, 'error' => 'invalid', 'fields' => $errors]);
}

$text   = booking_text($booking, gmdate('Y-m-d H:i') . ' UTC');
$failed = 0;
foreach (BOOKING_INBOXES as $inbox) {
    if (!@mail($inbox, BOOKING_SUBJECT, $text, booking_headers($inbox))) {
        $failed++;
    }
}

if ($failed > 0) {
    respond(502, ['ok' => false, 'error' => 'send_failed']);
}

respond(200, ['ok' => true]);
