<?php

/**
 * Tests for the sitewide contact endpoint's pure functions.
 *
 * Run with `pnpm test:php`. contact.php returns early under the CLI SAPI, so
 * requiring it here defines the functions without processing a request.
 *
 * Mirrors tests/php/apply.test.php's structure and, for the helpers the two
 * files share (header_safe, h, single_line, multi_line, char_len,
 * rate_limit_ok), its cases: those functions are duplicated verbatim between
 * apply.php and contact.php, so the injection-safety cases must hold in both.
 */

declare(strict_types=1);

require __DIR__ . '/../../client/public/api/contact.php';

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

/** A payload that must validate, so each test can vary one field. */
function valid_payload(array $overrides = []): array
{
    return array_merge([
        'topic'   => 'contact',
        'name'    => 'Ada Lovelace',
        'email'   => 'ada@example.org',
        'subject' => 'A question about the kernel',
        'message' => 'I would like to know more about the scheduler internals.',
    ], $overrides);
}

// ── TOPIC_INBOXES / TOPIC_LABELS: the address book stays server-side ────────

check(
    'every CONTACT_EMAILS key in client/src/data/foundation.ts has an inbox here',
    array_keys(TOPIC_INBOXES) === [
        'contact', 'support', 'security', 'press', 'partners',
        'careers', 'donations', 'finance', 'sponsors', 'conduct',
    ],
    'TOPIC_INBOXES keys: ' . implode(', ', array_keys(TOPIC_INBOXES))
);

check(
    'every topic has a label',
    array_keys(TOPIC_INBOXES) === array_keys(TOPIC_LABELS)
);

foreach (TOPIC_INBOXES as $key => $inbox) {
    check("$key inbox is an embeddedos.org address", str_ends_with($inbox, '@embeddedos.org'));
}

// ── header_safe: the open-relay guard (shared with apply.php) ───────────────

equals('header_safe strips a bare LF', 'a@b.orgBcc: x@y.org', header_safe("a@b.org\nBcc: x@y.org"));
equals('header_safe strips a bare CR', 'a@b.orgBcc: x@y.org', header_safe("a@b.org\rBcc: x@y.org"));
equals('header_safe strips CRLF', 'a@b.orgBcc: x@y.org', header_safe("a@b.org\r\nBcc: x@y.org"));
equals('header_safe strips a NUL', 'ab', header_safe("a\0b"));
equals('header_safe strips percent-encoded CRLF', 'a@b.orgBcc:', header_safe('a@b.org%0d%0aBcc:'));
equals('header_safe trims surrounding space', 'a@b.org', header_safe("  a@b.org  "));
equals('header_safe leaves a clean address alone', 'ada@example.org', header_safe('ada@example.org'));

check(
    'no newline survives header_safe',
    !preg_match('/[\r\n]/', header_safe("x\r\ny\nz\rw"))
);

// ── h: HTML escaping (shared with apply.php) ─────────────────────────────────

equals('h escapes angle brackets', '&lt;script&gt;', h('<script>'));
equals('h escapes double quotes', '&quot;', h('"'));
equals('h escapes single quotes', '&#039;', h("'"));
equals('h escapes ampersands first', '&amp;lt;', h('&lt;'));

// ── validate_contact ──────────────────────────────────────────────────────────

[$clean, $errors] = validate_contact(valid_payload());
equals('a good message has no errors', [], $errors);
equals('a good message keeps the name', 'Ada Lovelace', $clean['name']);
equals('a good message keeps the topic', 'contact', $clean['topic']);

[, $errors] = validate_contact(valid_payload(['topic' => 'not-a-real-topic']));
check('an unknown topic is rejected', in_array('topic', $errors, true));

[, $errors] = validate_contact(valid_payload(['topic' => '']));
check('a blank topic is rejected, not defaulted to contact@', in_array('topic', $errors, true));

foreach (array_keys(TOPIC_INBOXES) as $key) {
    [, $errors] = validate_contact(valid_payload(['topic' => $key]));
    check("topic '$key' on its own validates", $errors === []);
}

[, $errors] = validate_contact(valid_payload(['name' => 'A']));
check('a one-character name is rejected', in_array('name', $errors, true));

[, $errors] = validate_contact(valid_payload(['email' => 'not-an-address']));
check('a malformed email is rejected', in_array('email', $errors, true));

[, $errors] = validate_contact(valid_payload(['message' => 'too short']));
check('a short message is rejected', in_array('message', $errors, true));

[, $errors] = validate_contact(valid_payload(['message' => str_repeat('x', 3001)]));
check('an over-long message is rejected', in_array('message', $errors, true));

[, $errors] = validate_contact(valid_payload(['subject' => str_repeat('x', 201)]));
check('an over-long subject is rejected', in_array('subject', $errors, true));

// The subject is optional: blank must not fail validation on its own.
[$clean, $errors] = validate_contact(valid_payload(['subject' => '']));
check('a blank subject is accepted', $errors === []);
equals('a blank subject stays blank', '', $clean['subject']);

[, $errors] = validate_contact([]);
check('an empty payload is rejected, not defaulted', $errors !== []);

// ── subject_line ──────────────────────────────────────────────────────────────

[$clean] = validate_contact(valid_payload(['topic' => 'support', 'subject' => '']));
equals(
    'a blank subject falls back to the topic label',
    '[Contact] Technical Support',
    subject_line($clean)
);

[$clean] = validate_contact(valid_payload(['topic' => 'press', 'subject' => 'Podcast interview request']));
equals(
    'a provided subject is kept alongside the topic label',
    '[Contact] Podcast interview request (Press & Media)',
    subject_line($clean)
);

// ── Escaping reaches the rendered bodies ─────────────────────────────────────

[$clean] = validate_contact(valid_payload([
    'name'    => 'Ada <img src=x onerror=alert(1)>',
    'subject' => '</td><td>injected',
]));
$html = staff_html($clean, '2026-01-01 00:00 UTC');

check('injected markup in a name does not reach the email raw', !str_contains($html, '<img src=x'));
check('the escaped form is present instead', str_contains($html, '&lt;img src=x'));
check('injected markup in subject does not close a cell', !str_contains($html, '</td><td>injected'));
check('the message is escaped in HTML', !str_contains(staff_html(
    validate_contact(valid_payload(['message' => '<b>' . str_repeat('x', 20) . '</b>']))[0],
    'now'
), '<b>' . str_repeat('x', 20)));

// The plain-text part is not HTML and must not be escaped into mojibake.
[$clean] = validate_contact(valid_payload(['name' => "Ada O'Brien"]));
check("the text part keeps an apostrophe as typed", str_contains(staff_text($clean, 'now'), "Ada O'Brien"));

// Optional fields left blank are omitted rather than printed empty.
[$clean] = validate_contact(valid_payload(['subject' => '']));
check('a blank subject line is omitted from the text part', !str_contains(staff_text($clean, 'now'), 'Subject:'));

// ── single_line / multi_line: body forgery (shared with apply.php) ──────────

equals('single_line flattens a CRLF', 'Ada Bcc: x@y.org', single_line("Ada\r\nBcc: x@y.org"));
equals('single_line flattens a bare LF', 'a b', single_line("a\nb"));
equals('single_line strips a NUL', 'a b', single_line("a\0b"));
equals('single_line strips backspace and escape', 'a b', single_line("a\x08\x1bb"));
equals('single_line trims the result', 'ada', single_line("  ada\n "));
equals('single_line leaves ordinary text alone', "Ada O'Brien", single_line("Ada O'Brien"));

equals('multi_line keeps real newlines', "one\ntwo", multi_line("one\ntwo"));
equals('multi_line keeps tabs', "a\tb", multi_line("a\tb"));
equals('multi_line still strips NUL', 'ab', multi_line("a\0b"));
equals('multi_line still strips escape', 'ab', multi_line("a\x1bb"));

// The forgery this closes, end to end through the validator and renderer.
[$clean] = validate_contact(valid_payload([
    'name' => "Ada\r\nBcc: victim@elsewhere.test\r\nX-Injected: yes",
]));
$text = staff_text($clean, 'now');
check(
    'a name cannot open a new line in the plain-text body',
    !preg_match('/^Bcc:/m', $text),
    'forged line survived into the body'
);
check('the name still appears, flattened', str_contains($text, 'Ada Bcc: victim@elsewhere.test'));

// A message may span lines; that must not have been broken by the above.
[$clean] = validate_contact(valid_payload([
    'message' => "First paragraph.\n\nSecond paragraph, still well over the ten character minimum.",
]));
check('the message keeps its paragraphs', str_contains($clean['message'], "\n\n"));

// ── rate_limit_ok (shared with apply.php) ────────────────────────────────────

$dir = sys_get_temp_dir() . '/eos-contact-test-' . bin2hex(random_bytes(4));
mkdir($dir);
$now = 1000000;

$allowed = 0;
for ($i = 0; $i < 8; $i++) {
    if (rate_limit_ok('203.0.113.7', $dir, $now)) {
        $allowed++;
    }
}
equals('the limit admits exactly RATE_LIMIT_MAX in a window', RATE_LIMIT_MAX, $allowed);

check(
    'a different address is unaffected',
    rate_limit_ok('203.0.113.8', $dir, $now)
);

check(
    'the same address is admitted again in the next window',
    rate_limit_ok('203.0.113.7', $dir, $now + RATE_LIMIT_WINDOW + 1)
);

check(
    'the store holds no readable address',
    !str_contains(implode(' ', scandir($dir) ?: []), '203.0.113')
);

check('an unknown address is not blocked', rate_limit_ok('', $dir, $now));

array_map('unlink', glob("$dir/*") ?: []);
rmdir($dir);

// ── Result ───────────────────────────────────────────────────────────────────

echo "\n  php: $passed passed" . ($failed > 0 ? ", $failed failed" : '') . "\n\n";
exit($failed > 0 ? 1 : 0);
