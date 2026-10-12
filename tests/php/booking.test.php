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
check('an unknown address is not blocked', rate_limit_ok('', $dir, $now));
array_map('unlink', glob("$dir/*") ?: []);
@rmdir($dir);

echo "\n  php: $passed passed" . ($failed > 0 ? ", $failed failed" : '') . "\n\n";
exit($failed > 0 ? 1 : 0);
