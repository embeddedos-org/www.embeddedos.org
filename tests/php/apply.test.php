<?php

/**
 * Tests for the careers endpoint's pure functions.
 *
 * Run with `pnpm test:php`. apply.php returns early under the CLI SAPI, so
 * requiring it here defines the functions without processing a request.
 *
 * The header-injection and href cases are the reason this file exists. The
 * nodemailer implementation this endpoint replaces interpolated applicant
 * fields into email HTML unescaped, and validated `linkedin` only as a string
 * of at most 300 characters before putting it inside `href="..."`.
 */

declare(strict_types=1);

require __DIR__ . '/../../client/public/api/apply.php';

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
        'fullName'          => 'Ada Lovelace',
        'email'             => 'ada@example.org',
        'roleCategory'      => 'Embedded Systems Engineer',
        'employmentType'    => 'Full-Time',
        'workAuthorization' => 'US Citizen',
        'statement'         => str_repeat('I would like to work on the kernel. ', 3),
    ], $overrides);
}

// ── header_safe: the open-relay guard ────────────────────────────────────────

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

// ── safe_url: what may go inside href ────────────────────────────────────────

equals('safe_url accepts https', 'https://github.com/ada', safe_url('https://github.com/ada'));
equals('safe_url accepts http', 'http://example.org/a', safe_url('http://example.org/a'));
equals('safe_url rejects javascript:', null, safe_url('javascript:alert(1)'));
equals('safe_url rejects data:', null, safe_url('data:text/html,<script>alert(1)</script>'));
equals('safe_url rejects a bare host', null, safe_url('github.com/ada'));
equals('safe_url rejects an attribute break-out', null, safe_url('" onmouseover="alert(1)'));
equals('safe_url rejects empty', null, safe_url(''));
equals('safe_url rejects over-long input', null, safe_url('https://e.org/' . str_repeat('a', 300)));

// ── h: HTML escaping ─────────────────────────────────────────────────────────

equals('h escapes angle brackets', '&lt;script&gt;', h('<script>'));
equals('h escapes double quotes', '&quot;', h('"'));
equals('h escapes single quotes', '&#039;', h("'"));
equals('h escapes ampersands first', '&amp;lt;', h('&lt;'));

// ── validate_application ─────────────────────────────────────────────────────

[$clean, $errors] = validate_application(valid_payload());
equals('a good application has no errors', [], $errors);
equals('a good application keeps the name', 'Ada Lovelace', $clean['fullName']);

[, $errors] = validate_application(valid_payload(['fullName' => 'A']));
check('a one-character name is rejected', in_array('fullName', $errors, true));

[, $errors] = validate_application(valid_payload(['email' => 'not-an-address']));
check('a malformed email is rejected', in_array('email', $errors, true));

[, $errors] = validate_application(valid_payload(['statement' => 'too short']));
check('a short statement is rejected', in_array('statement', $errors, true));

[, $errors] = validate_application(valid_payload(['statement' => str_repeat('x', 3001)]));
check('an over-long statement is rejected', in_array('statement', $errors, true));

[, $errors] = validate_application(valid_payload(['roleCategory' => 'Chief Executive']));
check('an unlisted role is rejected', in_array('roleCategory', $errors, true));

[, $errors] = validate_application(valid_payload(['employmentType' => 'Whenever']));
check('an unlisted employment type is rejected', in_array('employmentType', $errors, true));

[, $errors] = validate_application(valid_payload(['workAuthorization' => 'None of your business']));
check('an unlisted work authorization is rejected', in_array('workAuthorization', $errors, true));

[, $errors] = validate_application([]);
check('an empty payload is rejected, not defaulted', $errors !== []);

// A bad link costs the applicant nothing: it is dropped, not refused.
[$clean, $errors] = validate_application(valid_payload(['linkedin' => 'javascript:alert(1)']));
equals('a dangerous link does not fail the application', [], $errors);
equals('a dangerous link is dropped', '', $clean['linkedin']);

[$clean] = validate_application(valid_payload(['github' => 'https://github.com/ada']));
equals('a good link is kept', 'https://github.com/ada', $clean['github']);

// ── Escaping reaches the rendered bodies ─────────────────────────────────────

[$clean] = validate_application(valid_payload([
    'fullName'  => 'Ada <img src=x onerror=alert(1)>',
    'heardFrom' => '</td><td>injected',
]));
$html = staff_html($clean, '2026-01-01 00:00 UTC');

check('injected markup in a name does not reach the email raw', !str_contains($html, '<img src=x'));
check('the escaped form is present instead', str_contains($html, '&lt;img src=x'));
check('injected markup in heardFrom does not close a cell', !str_contains($html, '</td><td>injected'));
check('the statement is escaped in HTML', !str_contains(staff_html(
    validate_application(valid_payload(['statement' => '<b>' . str_repeat('x', 60) . '</b>']))[0],
    'now'
), '<b>' . str_repeat('x', 60)));

// The plain-text part is not HTML and must not be escaped into mojibake.
[$clean] = validate_application(valid_payload(['fullName' => "Ada O'Brien"]));
check("the text part keeps an apostrophe as typed", str_contains(staff_text($clean, 'now'), "Ada O'Brien"));

// Optional fields that were left blank are omitted rather than printed empty.
[$clean] = validate_application(valid_payload());
check('a blank phone line is omitted from the text part', !str_contains(staff_text($clean, 'now'), 'Phone:'));

// ── single_line / multi_line: body forgery ───────────────────────────────────

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
[$clean] = validate_application(valid_payload([
    'fullName' => "Ada\r\nBcc: victim@elsewhere.test\r\nX-Injected: yes",
]));
$text = staff_text($clean, 'now');
check(
    'a name cannot open a new line in the plain-text body',
    !preg_match('/^Bcc:/m', $text),
    'forged line survived into the body'
);
check('the name still appears, flattened', str_contains($text, 'Ada Bcc: victim@elsewhere.test'));

// A statement may span lines; that must not have been broken by the above.
[$clean] = validate_application(valid_payload([
    'statement' => "First paragraph.\n\nSecond paragraph, still well over the fifty character minimum.",
]));
check('the statement keeps its paragraphs', str_contains($clean['statement'], "\n\n"));

// ── rate_limit_ok ────────────────────────────────────────────────────────────

$dir = sys_get_temp_dir() . '/eos-apply-test-' . bin2hex(random_bytes(4));
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
