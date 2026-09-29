<?php

/**
 * Stripe PaymentIntent endpoint for the /donate page's card tab.
 *
 * Architecture mirrors client/public/api/contact.php: the site deploys as a
 * prerendered static build, so PHP — not the Node/tRPC server — is what
 * actually runs in production. This file ships to dist/public/api/ and is
 * served at /api/stripe-intent.php.
 *
 * Why a server endpoint at all: Stripe's browser library (Stripe.js) is
 * public by design and initialised with the publishable key, but confirming
 * a payment needs a PaymentIntent created with the SECRET key — and that key
 * must never reach the browser. This endpoint is the only place the secret
 * lives: it reads STRIPE_SECRET_KEY from the server environment (set in
 * cPanel, never committed), creates a one-off PaymentIntent for the exact
 * amount the donor chose, and returns only the client_secret the browser
 * needs to confirm it.
 *
 * Without STRIPE_SECRET_KEY set, this endpoint answers 503 and the /donate
 * card tab shows a graceful "unavailable" state — Zeffy and PayPal keep
 * working. Nothing card-related is ever logged or stored here: amounts and
 * currency pass through, card numbers never touch this server (Stripe.js
 * sends them straight to Stripe).
 *
 * Amount validation is strict: integer cents, USD only, $1–$100,000 bounds.
 * The donor's chosen amount is echoed back in the response so the client can
 * confirm what was authorised, but the authorised figure is the one Stripe
 * returns, not anything the browser sent twice.
 */

declare(strict_types=1);

// ── Configuration ────────────────────────────────────────────────────────────

/** Smallest and largest single gift this endpoint will authorise, in cents. */
const STRIPE_MIN_CENTS = 100;        // $1
const STRIPE_MAX_CENTS = 10000000;   // $100,000

/** Only USD is enabled on the Stripe account today. */
const STRIPE_CURRENCY = 'usd';

/** A body larger than this is refused before it is parsed. */
const STRIPE_MAX_BODY_BYTES = 4 * 1024;

/** PaymentIntent creations permitted from one address per window. */
const STRIPE_RATE_LIMIT_MAX    = 20;
const STRIPE_RATE_LIMIT_WINDOW = 3600; // seconds

/** Stripe API version pinned the way the dashboard integration expects. */
const STRIPE_API_VERSION = '2025-03-31.basil';

// ── Pure helpers, unit-tested from tests/php/stripe-intent.test.php ──────────
//
// Duplicated rather than shared so this file stays a single file that can be
// copied to the host verbatim, with nothing else to deploy alongside it.

/**
 * Validate a decoded payload.
 *
 * Returns [cents, errors]. `errors` empty means the amount is good and
 * `cents` is the integer cent value to authorise.
 */
function validate_stripe_amount(array $in): array
{
    if (!array_key_exists('amount_cents', $in)) {
        return [0, ['amount_cents']];
    }
    $raw = $in['amount_cents'];
    if (is_string($raw) && preg_match('/^\d+$/', $raw) === 1) {
        $raw = (int) $raw;
    }
    if (!is_int($raw)) {
        return [0, ['amount_cents']];
    }
    if ($raw < STRIPE_MIN_CENTS || $raw > STRIPE_MAX_CENTS) {
        return [0, ['amount_cents']];
    }
    return [$raw, []];
}

/**
 * Build the form-encoded body for Stripe's PaymentIntent creation call.
 *
 * Pure (no network) so the exact wire format is unit-tested. Only automatic
 * payment methods are enabled: the Payment Element in the browser decides
 * which methods to offer (card today), and Stripe handles any 3-D Secure
 * redirect itself — this server never sees card details.
 */
function stripe_intent_body(int $cents): string
{
    return http_build_query([
        'amount'   => $cents,
        'currency' => STRIPE_CURRENCY,
        'automatic_payment_methods' => ['enabled' => 'true', 'allow_redirects' => 'never'],
        'metadata' => ['source' => 'embeddedos.org-donate'],
    ], '', '&');
}

/**
 * Allow this request under the per-address limit, and record it.
 *
 * Same crude-but-safe design as contact.php's rate_limit_ok(): a JSON file
 * of timestamps per hashed address in the system temp directory. Failure to
 * read or write never blocks a donation — losing a genuine gift to a full
 * disk would be worse than accepting an extra intent from a flooder, and an
 * unauthorised intent moves no money by itself.
 */
function stripe_rate_limit_ok(string $ip, string $dir, int $now): bool
{
    if ($ip === '') {
        return true;
    }
    $file = $dir . '/eos-stripe-' . hash('sha256', $ip) . '.json';

    $seen = [];
    if (is_readable($file)) {
        $decoded = json_decode((string) @file_get_contents($file), true);
        if (is_array($decoded)) {
            $seen = array_values(array_filter(
                $decoded,
                static fn($t): bool => is_int($t) && $t > $now - STRIPE_RATE_LIMIT_WINDOW
            ));
        }
    }

    if (count($seen) >= STRIPE_RATE_LIMIT_MAX) {
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
function stripe_respond(int $status, array $payload): void
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
    stripe_respond(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

$raw = file_get_contents('php://input');
if ($raw === false || strlen($raw) > STRIPE_MAX_BODY_BYTES) {
    stripe_respond(413, ['ok' => false, 'error' => 'too_large']);
}

$payload = json_decode((string) $raw, true);
if (!is_array($payload)) {
    stripe_respond(400, ['ok' => false, 'error' => 'malformed_json']);
}

[$cents, $errors] = validate_stripe_amount($payload);
if ($errors !== []) {
    stripe_respond(422, ['ok' => false, 'error' => 'invalid', 'fields' => $errors]);
}

$ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
if (!stripe_rate_limit_ok($ip, sys_get_temp_dir(), time())) {
    stripe_respond(429, ['ok' => false, 'error' => 'rate_limited']);
}

// The secret key lives in the server environment (cPanel → SetEnv or the
// account's environment editor), never in this file and never in git. Without
// it the Stripe tab cannot work; answer 503 so the client shows its graceful
// fallback instead of a spinner that never resolves.
// getenv() misses the key under some PHP handlers (php-fpm with a
// variables_order that omits 'S' populates $_SERVER but not the getenv
// store, and vice versa), so check both. Either way the value comes from
// the server environment — never from the request, never from a file.
$secret = getenv('STRIPE_SECRET_KEY');
if ((!is_string($secret) || $secret === '') && isset($_SERVER['STRIPE_SECRET_KEY'])) {
    $secret = $_SERVER['STRIPE_SECRET_KEY'];
}
if (!is_string($secret) || $secret === '') {
    stripe_respond(503, ['ok' => false, 'error' => 'stripe_not_configured']);
}

$ch = curl_init('https://api.stripe.com/v1/payment_intents');
if ($ch === false) {
    stripe_respond(500, ['ok' => false, 'error' => 'request_failed']);
}
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, stripe_intent_body($cents));
curl_setopt($ch, CURLOPT_TIMEOUT, 15);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $secret,
    'Stripe-Version: ' . STRIPE_API_VERSION,
]);
$stripeRaw = curl_exec($ch);
$httpCode  = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if (!is_string($stripeRaw) || $stripeRaw === '') {
    stripe_respond(502, ['ok' => false, 'error' => 'provider_unreachable']);
}

$stripe = json_decode($stripeRaw, true);
if (!is_array($stripe) || !isset($stripe['client_secret']) || !is_string($stripe['client_secret'])) {
    // Stripe answers 4xx with {"error": {...}} for bad requests; either way
    // there is no client_secret to hand the browser, so this is a failure —
    // reported without Stripe's detail, which can name account state.
    stripe_respond(502, ['ok' => false, 'error' => 'provider_error']);
}

// Echo the authorised amount and currency from Stripe's own response, not
// from the request: the client displays these as what will actually be
// charged.
$stripeAmount = isset($stripe['amount']) && is_int($stripe['amount'])
    ? $stripe['amount']
    : $cents;
stripe_respond(200, [
    'ok'            => true,
    'client_secret' => $stripe['client_secret'],
    'amount_cents'  => $stripeAmount,
    'currency'      => STRIPE_CURRENCY,
]);
