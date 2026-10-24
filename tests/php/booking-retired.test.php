<?php

/**
 * The retired booking-notice endpoint, client/public/api/booking.php, must
 * answer every request with 410 Gone and a fixed JSON body, and do nothing
 * else (tests/unit/booking.test.tsx pins its exact statements).
 *
 * Run with `pnpm test:php`. The file has no CLI guard: requiring it runs it,
 * so its output is captured here and the status it set is read back. Under the
 * CLI SAPI header() sends nothing, so the headers are checked by the unit test.
 */

declare(strict_types=1);

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

ob_start();
require __DIR__ . '/../../client/public/api/booking.php';
$body = (string) ob_get_clean();

check(
    'the body says the endpoint is gone',
    $body === '{"ok":false,"error":"gone"}',
    'got ' . var_export($body, true)
);

check(
    'the status is 410 Gone',
    http_response_code() === 410,
    'got ' . var_export(http_response_code(), true)
);

check(
    'the body is JSON with ok false',
    json_decode($body, true) === ['ok' => false, 'error' => 'gone']
);

// ── Result ───────────────────────────────────────────────────────────────────

echo "\n  php: $passed passed" . ($failed > 0 ? ", $failed failed" : '') . "\n\n";
exit($failed > 0 ? 1 : 0);
