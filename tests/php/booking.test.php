<?php

declare(strict_types=1);

require __DIR__ . '/../../client/public/api/booking.php';

$passed = 0;
$failed = 0;

function check(string $name, bool $ok, string $detail = ''): void
{
    global $passed, $failed;
    if ($ok) {
        $passed++;
        return;
    }
    $failed++;
    fwrite(STDERR, "  FAIL  $name" . ($detail !== '' ? "\n        $detail" : '') . "\n");
}

function equals(string $name, $expected, $actual): void
{
    check(
        $name,
        $expected === $actual,
        'expected ' . var_export($expected, true) . ', got ' . var_export($actual, true)
    );
}

const EVENT   = 'https://api.calendly.com/scheduled_events/GBGBDCAADAEDCRZ2';
const INVITEE = 'https://api.calendly.com/scheduled_events/GBGBDCAADAEDCRZ2/invitees/AAAAAAAAAAAAAAAA';

function valid_booking(array $overrides = []): array
{
    return array_merge([
        'event_uri'   => EVENT,
        'invitee_uri' => INVITEE,
        'page'        => '/contact',
    ], $overrides);
}

function errors_for(array $overrides): array
{
    return validate_booking(valid_booking($overrides))[1];
}

equals(
    'every booking goes to both work inboxes, and only those',
    ['kartikeydheer@embeddedos.org', 'srikanth@embeddedos.org'],
    BOOKING_INBOXES
);
foreach (BOOKING_INBOXES as $inbox) {
    check("$inbox is an embeddedos.org address", str_ends_with($inbox, '@embeddedos.org'));
    equals("$inbox is a valid address", $inbox, filter_var($inbox, FILTER_VALIDATE_EMAIL));
}
equals('the subject says what happened', 'New meeting booked via embeddedos.org', BOOKING_SUBJECT);

check('the site origin is allowed', same_origin_ok('https://www.embeddedos.org'));
check('the bare domain is allowed', same_origin_ok('https://embeddedos.org'));
check('an absent Origin is refused', !same_origin_ok(''));
check('the opaque origin "null" is refused', !same_origin_ok('null'));
check('plain http is refused', !same_origin_ok('http://www.embeddedos.org'));
check('a look-alike suffix is refused', !same_origin_ok('https://www.embeddedos.org.example.com'));
check('a look-alike prefix is refused', !same_origin_ok('https://evil-embeddedos.org'));
check('a trailing slash is refused', !same_origin_ok('https://www.embeddedos.org/'));
check('Calendly itself is refused', !same_origin_ok('https://calendly.com'));

equals('a well-formed notice validates', [], errors_for([]));
equals('the /eos-boards page validates', [], errors_for(['page' => '/eos-boards']));
equals(
    "Calendly's documented invitee form with /api/v2/ validates",
    [],
    errors_for(['invitee_uri' => 'https://api.calendly.com/api/v2/scheduled_events/GBGBDCAADAEDCRZ2/invitees/AAAAAAAAAAAAAAAA'])
);
equals('a UUID-style id validates', [], errors_for([
    'event_uri'   => 'https://api.calendly.com/scheduled_events/6f0c8e2a-1b2c-4d5e-8f90-0123456789ab',
    'invitee_uri' => 'https://api.calendly.com/scheduled_events/6f0c8e2a-1b2c-4d5e-8f90-0123456789ab/invitees/0d1e2f3a-4b5c-6d7e-8f90-abcdefabcdef',
]));

$badEvents = [
    'a trailing newline'          => EVENT . "\n",
    'a CRLF and a header'         => EVENT . "\r\nBcc: x@example.org",
    'a query string'              => EVENT . '?x=1',
    'a fragment'                  => EVENT . '#x',
    'a trailing slash'            => EVENT . '/',
    'plain http'                  => 'http://api.calendly.com/scheduled_events/GBGBDCAADAEDCRZ2',
    'the scheduling host'         => 'https://calendly.com/scheduled_events/GBGBDCAADAEDCRZ2',
    'a look-alike host'           => 'https://api.calendly.com.example.com/scheduled_events/GBGBDCAADAEDCRZ2',
    'user info before the host'   => 'https://x@api.calendly.com/scheduled_events/GBGBDCAADAEDCRZ2',
    'path traversal'              => 'https://api.calendly.com/scheduled_events/../users/me',
    'another collection'          => 'https://api.calendly.com/users/GBGBDCAADAEDCRZ2',
    'an id of 65 characters'      => 'https://api.calendly.com/scheduled_events/' . str_repeat('A', 65),
    'an empty id'                 => 'https://api.calendly.com/scheduled_events/',
    'an underscore in the id'     => 'https://api.calendly.com/scheduled_events/GBGB_DCAA',
];
foreach ($badEvents as $why => $uri) {
    check("an event URI with $why is refused", in_array('event_uri', errors_for(['event_uri' => $uri]), true));
}

check(
    'an invitee of a different event is refused',
    in_array('invitee_uri', errors_for([
        'invitee_uri' => 'https://api.calendly.com/scheduled_events/ZZZZZZZZZZZZZZZZ/invitees/AAAAAAAAAAAAAAAA',
    ]), true)
);
check(
    'an invitee URI with a trailing newline is refused',
    in_array('invitee_uri', errors_for(['invitee_uri' => INVITEE . "\n"]), true)
);
check(
    'an event URI in the invitee field is refused',
    in_array('invitee_uri', errors_for(['invitee_uri' => EVENT]), true)
);

foreach ([
    'an absolute URL'     => 'https://example.org/contact',
    'a protocol-relative' => '//example.org/contact',
    'a newline'           => "/contact\n",
    'a traversal'         => '/../etc/passwd',
    'a query string'      => '/contact?x=1',
    'upper case'          => '/Contact',
    'the bare root'       => '/',
    'an empty string'     => '',
] as $why => $page) {
    check("a page with $why is refused", in_array('page', errors_for(['page' => $page]), true));
}

equals(
    'every field must be a string',
    ['event_uri', 'invitee_uri', 'page'],
    validate_booking(['event_uri' => ['x'], 'invitee_uri' => 1, 'page' => null])[1]
);
equals('an empty payload names all three fields', ['event_uri', 'invitee_uri', 'page'], validate_booking([])[1]);

$text = booking_text(valid_booking(['page' => '/eos-boards']), '2026-10-12 06:00 UTC');
check('the notice names the page', str_contains($text, 'Page: https://www.embeddedos.org/eos-boards'));
check('the notice names the scheduled event', str_contains($text, 'Scheduled event: ' . EVENT));
check('the notice names the invitee', str_contains($text, 'Invitee: ' . INVITEE));
check('the notice says it is unverified', str_contains($text, 'not checked against'));
check('the notice opens with the subject', str_starts_with($text, BOOKING_SUBJECT));

foreach (BOOKING_INBOXES as $inbox) {
    $headers = booking_headers($inbox);
    check("$inbox: the copy is sent from that inbox", str_contains($headers, "From: EmbeddedOS Foundation <$inbox>"));
    equals("$inbox: four header lines, CRLF-separated", 4, count(explode("\r\n", $headers)));
    check("$inbox: no bare LF in the headers", !preg_match("/(?<!\r)\n/", $headers));
}
check('header_safe removes a CRLF', header_safe("a@b.org\r\nBcc: x@y.org") === 'a@b.orgBcc: x@y.org');
check('header_safe removes percent-encoded CRLF', header_safe('a@b.org%0d%0aBcc:') === 'a@b.orgBcc:');

$dir = sys_get_temp_dir() . '/eos-booking-test-' . bin2hex(random_bytes(4));
@mkdir($dir);
$now = 1_700_000_000;
$allowed = 0;
for ($i = 0; $i < RATE_LIMIT_MAX + 3; $i++) {
    if (rate_limit_ok('203.0.113.7', $dir, $now)) {
        $allowed++;
    }
}
equals('the limit admits exactly RATE_LIMIT_MAX in a window', RATE_LIMIT_MAX, $allowed);
check('a different address is unaffected', rate_limit_ok('203.0.113.8', $dir, $now));
check(
    'the same address is admitted again in the next window',
    rate_limit_ok('203.0.113.7', $dir, $now + RATE_LIMIT_WINDOW + 1)
);
check(
    'the store holds no readable address',
    !str_contains(implode(' ', @scandir($dir) ?: []), '203.0.113')
);
check('an unknown address is refused', !rate_limit_ok('', $dir, $now));
check('an unavailable store fails closed', !rate_limit_ok('203.0.113.9', "$dir/missing", $now));
$corrupt = $dir . '/eos-booking-' . hash('sha256', '203.0.113.10') . '.json';
file_put_contents($corrupt, '{broken');
check('an unreadable count fails closed', !rate_limit_ok('203.0.113.10', $dir, $now));

// Hold the store lock until every process is about to enter the limiter. A
// read-before-lock implementation lets them all see the same empty count.
$concurrentIp = '203.0.113.11';
$counter = $dir . '/eos-booking-' . hash('sha256', $concurrentIp) . '.json';
file_put_contents($counter, '[]');
$lock = fopen($counter, 'r+');
flock($lock, LOCK_EX);
$workers = [];
for ($i = 0; $i < RATE_LIMIT_MAX + 3; $i++) {
    $code = 'require ' . var_export(realpath(__DIR__ . '/../../client/public/api/booking.php'), true) . ';'
        . 'file_put_contents(' . var_export("$dir/ready-$i", true) . ', "ready");'
        . 'echo rate_limit_ok(' . var_export($concurrentIp, true) . ', '
        . var_export($dir, true) . ", $now) ? '1' : '0';";
    $pipes = [];
    $process = proc_open([PHP_BINARY, '-r', $code], [1 => ['pipe', 'w'], 2 => ['pipe', 'w']], $pipes);
    check("concurrent worker $i starts", is_resource($process));
    if (is_resource($process)) {
        $workers[] = [$process, $pipes];
    }
}
$deadline = microtime(true) + 10;
while (count(glob("$dir/ready-*") ?: []) < count($workers) && microtime(true) < $deadline) {
    usleep(10000);
}
equals('all concurrent workers reached the limiter', count($workers), count(glob("$dir/ready-*") ?: []));
usleep(100000);
flock($lock, LOCK_UN);
fclose($lock);
$concurrentAllowed = 0;
foreach ($workers as [$process, $pipes]) {
    $output = stream_get_contents($pipes[1]);
    $errors = stream_get_contents($pipes[2]);
    fclose($pipes[1]);
    fclose($pipes[2]);
    equals('concurrent worker exits successfully', 0, proc_close($process));
    equals('concurrent worker reports no errors', '', $errors);
    check('concurrent worker returns a decision', $output === '0' || $output === '1');
    $concurrentAllowed += $output === '1' ? 1 : 0;
}
equals('concurrent calls admit exactly the limit', RATE_LIMIT_MAX, $concurrentAllowed);
equals('every admitted concurrent call is persisted', RATE_LIMIT_MAX, count(json_decode(file_get_contents($counter), true)));
array_map('unlink', glob("$dir/*") ?: []);
@rmdir($dir);

// ── The switch: off until the Calendly event exists ────────────────────────
// handle_booking() is the whole request path; the mailer and the body reader
// are passed in, so these calls record mail instead of sending it.

equals('booking notices are off until the Calendly event exists', false, BOOKING_NOTICES_ENABLED);

$site      = 'https://www.embeddedos.org';
$switchDir = sys_get_temp_dir() . '/eos-booking-switch-' . bin2hex(random_bytes(4));
@mkdir($switchDir);
$sent  = [];
$reads = 0;
$send  = static function (string $to, string $subject, string $text, string $headers) use (&$sent): bool {
    $sent[] = [$to, $subject, $text, $headers];
    return true;
};
$bodyOf = static function (string $body) use (&$reads): callable {
    return static function () use ($body, &$reads): string {
        $reads++;
        return $body;
    };
};
$valid = (string) json_encode(valid_booking());

foreach (['POST', 'GET'] as $method) {
    $sent  = [];
    $reads = 0;
    [$status, $payload] = handle_booking(false, $method, $site, $bodyOf($valid), '203.0.113.30', $switchDir, $now, $send);
    equals("switch off, $method: answers 503", 503, $status);
    equals("switch off, $method: says why", ['ok' => false, 'error' => 'booking_notices_disabled'], $payload);
    equals("switch off, $method: sends no mail", [], $sent);
    equals("switch off, $method: does not read the body", 0, $reads);
}
equals('switch off: the rate-limit store is not touched', [], glob("$switchDir/*") ?: []);

$sent  = [];
$reads = 0;
equals(
    'switch on: a well-formed notice from the site is accepted',
    [200, ['ok' => true]],
    handle_booking(true, 'POST', $site, $bodyOf($valid), '203.0.113.31', $switchDir, $now, $send)
);
equals('switch on: one mail to each inbox', BOOKING_INBOXES, array_column($sent, 0));
foreach ($sent as [$to, $subject, $text, $headers]) {
    equals("switch on: $to gets the fixed subject", BOOKING_SUBJECT, $subject);
    equals("switch on: $to gets the fixed headers", booking_headers($to), $headers);
    check("switch on: $to's notice names the event", str_contains($text, 'Scheduled event: ' . EVENT));
    check("switch on: $to's notice says it is unverified", str_contains($text, 'not checked against'));
}

$refusals = [
    'a GET'                  => ['GET', $site, $valid, 405, 'method_not_allowed', false],
    'no Origin header'       => ['POST', '', $valid, 403, 'forbidden_origin', false],
    'another origin'         => ['POST', 'https://evil.example', $valid, 403, 'forbidden_origin', false],
    'an oversized body'      => ['POST', $site, str_repeat('x', MAX_BODY_BYTES + 1), 413, 'too_large', true],
    'malformed JSON'         => ['POST', $site, '{', 400, 'malformed_json', true],
    'an invalid notice'      => ['POST', $site, (string) json_encode(valid_booking(['page' => '//x'])), 422, 'invalid', true],
];
$ipNumber = 32;
foreach ($refusals as $why => [$method, $origin, $body, $code, $error, $bodyRead]) {
    $sent  = [];
    $reads = 0;
    [$status, $payload] = handle_booking(true, $method, $origin, $bodyOf($body), '203.0.113.' . $ipNumber++, $switchDir, $now, $send);
    equals("switch on, $why: answers $code", $code, $status);
    equals("switch on, $why: says $error", $error, $payload['error'] ?? null);
    equals("switch on, $why: sends no mail", [], $sent);
    equals("switch on, $why: " . ($bodyRead ? 'reads' : 'does not read') . ' the body', $bodyRead ? 1 : 0, $reads);
}

$sent = [];
[$status] = handle_booking(true, 'POST', $site, static fn() => false, '203.0.113.40', $switchDir, $now, $send);
equals('switch on: an unreadable body answers 413', 413, $status);

$sent     = [];
$statuses = [];
for ($i = 0; $i < RATE_LIMIT_MAX + 1; $i++) {
    $statuses[] = handle_booking(true, 'POST', $site, $bodyOf($valid), '203.0.113.41', $switchDir, $now, $send)[0];
}
equals(
    'switch on: one address gets RATE_LIMIT_MAX notices, then 429',
    array_merge(array_fill(0, RATE_LIMIT_MAX, 200), [429]),
    $statuses
);
equals('switch on: only the admitted notices are mailed', RATE_LIMIT_MAX * count(BOOKING_INBOXES), count($sent));

$failing = static fn(string $to, string $subject, string $text, string $headers): bool => false;
equals(
    'switch on: a mail the server refuses answers 502',
    [502, ['ok' => false, 'error' => 'send_failed']],
    handle_booking(true, 'POST', $site, $bodyOf($valid), '203.0.113.42', $switchDir, $now, $failing)
);

array_map('unlink', glob("$switchDir/*") ?: []);
@rmdir($switchDir);

echo "\n  php: $passed passed" . ($failed > 0 ? ", $failed failed" : '') . "\n\n";
exit($failed > 0 ? 1 : 0);
