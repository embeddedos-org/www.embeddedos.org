<?php

/**
 * Tests for the Stripe PaymentIntent endpoint's pure functions.
 *
 * Run with `pnpm test:php` (after adding the invocation to package.json).
 * stripe-intent.php returns early under the CLI SAPI, so requiring it here
 * defines the functions without processing a request or touching the
 * STRIPE_SECRET_KEY environment variable.
 */

declare(strict_types=1);

require __DIR__ . '/../../client/public/api/stripe-intent.php';

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

// ── validate_stripe_amount ───────────────────────────────────────────────────

[$cents, $errors] = validate_stripe_amount(['amount_cents' => 2500]);
check('accepts a normal amount', $errors === [] && $cents === 2500);

[$cents, $errors] = validate_stripe_amount(['amount_cents' => '2500']);
check('accepts a numeric string', $errors === [] && $cents === 2500);

[$cents, $errors] = validate_stripe_amount(['amount_cents' => 100]);
check('accepts the $1 minimum', $errors === [] && $cents === 100);

[$cents, $errors] = validate_stripe_amount(['amount_cents' => 99]);
check('rejects below the minimum', $errors !== []);

[$cents, $errors] = validate_stripe_amount(['amount_cents' => 10000000]);
check('accepts the $100,000 maximum', $errors === [] && $cents === 10000000);

[$cents, $errors] = validate_stripe_amount(['amount_cents' => 10000001]);
check('rejects above the maximum', $errors !== []);

[$cents, $errors] = validate_stripe_amount(['amount_cents' => 0]);
check('rejects zero', $errors !== []);

[$cents, $errors] = validate_stripe_amount(['amount_cents' => -500]);
check('rejects negatives', $errors !== []);

[$cents, $errors] = validate_stripe_amount(['amount_cents' => 25.5]);
check('rejects floats', $errors !== []);

[$cents, $errors] = validate_stripe_amount(['amount_cents' => '25.5']);
check('rejects decimal strings', $errors !== []);

[$cents, $errors] = validate_stripe_amount(['amount_cents' => 'abc']);
check('rejects non-numeric strings', $errors !== []);

[$cents, $errors] = validate_stripe_amount([]);
check('rejects a missing amount', $errors !== []);

[$cents, $errors] = validate_stripe_amount(['amount_cents' => [2500]]);
check('rejects arrays', $errors !== []);

// ── stripe_intent_body ───────────────────────────────────────────────────────

$body = stripe_intent_body(2500);
parse_str($body, $parsed);
check(
    'wire body carries amount and USD',
    ($parsed['amount'] ?? null) === '2500' && ($parsed['currency'] ?? null) === 'usd',
    $body
);
check(
    'wire body enables automatic payment methods without redirects',
    ($parsed['automatic_payment_methods']['enabled'] ?? null) === 'true'
        && ($parsed['automatic_payment_methods']['allow_redirects'] ?? null) === 'never',
    $body
);
check(
    'wire body tags the source',
    ($parsed['metadata']['source'] ?? null) === 'embeddedos.org-donate',
    $body
);
check(
    'wire body carries no card or donor data',
    strpos($body, 'card') === false && strpos($body, 'email') === false,
    $body
);

// ── stripe_rate_limit_ok ─────────────────────────────────────────────────────

$dir = sys_get_temp_dir() . '/eos-stripe-test-' . bin2hex(random_bytes(8));
mkdir($dir);
$now = time();
$allowed = 0;
for ($i = 0; $i < 25; $i++) {
    if (stripe_rate_limit_ok('10.0.0.1', $dir, $now)) {
        $allowed++;
    }
}
check('rate limiter allows the first 20 then refuses', $allowed === 20, "allowed=$allowed");
check('an empty address never blocks', stripe_rate_limit_ok('', $dir, $now));
array_map('unlink', glob($dir . '/*'));
rmdir($dir);

// ── report ───────────────────────────────────────────────────────────────────

fwrite(STDOUT, "stripe-intent: $passed passed, $failed failed\n");
exit($failed === 0 ? 0 : 1);
