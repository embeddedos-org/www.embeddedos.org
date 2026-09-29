# Enabling card payments: setting STRIPE_SECRET_KEY on the host

The /donate page's **Card** tab is fully built and deployed, but it stays in
its graceful "not enabled yet" state until the Stripe **secret** key exists in
the production PHP environment. This guide sets it without ever putting the
key in git, in chat, or in any tracked file.

> The **publishable** key (`pk_live_…`, in `client/src/lib/payments.ts`) is
> public by design. The **secret** key (`sk_live_…`) moves money and must live
> only on the server. A unit test
> (`tests/unit/public-claims-policy.test.ts`, "no committed payment secrets")
> fails the build if anything shaped like a secret is committed.

## 1. Get the secret key (Stripe Dashboard)

1. Open https://dashboard.stripe.com/apikeys (log in as the Foundation's
   Stripe account owner).
2. Under **Secret key**, click **Reveal live key**. It starts with `sk_live_`.
3. Copy it into a password manager entry. Do **not** paste it into chat,
   email, docs, or any file in this repository.

## 2. Set it on the host (cPanel) — pick ONE method

### Method A — cPanel "Set Environment Variable" UI (recommended)

Newer cPanel versions (with the CloudLinux PHP Selector) expose per-domain
environment variables with no file edits:

1. cPanel → **Software → Select PHP Version** (or **Setup Python App**'s
   environment section on some themes — the variable list is shared).
2. Switch to the domain's PHP version tab if shown, then open the
   **Environment variables** (or "Set environment variable") section.
3. Add exactly:
   - Name: `STRIPE_SECRET_KEY`
   - Value: the `sk_live_…` key from step 1.
4. Save / Apply. PHP-FPM picks it up within a minute; no Apache restart
   needed on most hosts. If the Card tab still reports unconfigured after a
   few minutes, use **Restart PHP-FPM** if the panel offers one, else Method B.

### Method B — `.user.ini` outside the document root (fallback)

If the panel has no environment-variable UI, PHP still reads per-directory
`.user.ini` files — but it **must not** live in `public_html` (it would be
web-readable and it would be overwritten by the next deploy, which copies
only tracked build output). Place it in the account home **above**
`public_html` and point PHP at it via `.htaccess`… except our `.htaccess` is
tracked in git, so keep the secret out of it too. Instead:

1. In cPanel **File Manager** (show hidden files on), create
   `/home/<user>/stripe-env/.user.ini` containing exactly one line:
   `STRIPE_SECRET_KEY=sk_live_…` (no quotes, no `export`, no spaces around
   `=`).
2. Restrict it: right-click → **Change Permissions** → `600` (owner
   read/write only).
3. Ask the host (or use **MultiPHP INI Editor → Editor Mode** for the domain
   and add under no section): `user_ini.filename` already defaults to
   `.user.ini` per directory — for a file _above_ the docroot it is **not**
   picked up automatically. Prefer Method A; use this only if the host
   confirms a custom `user_ini.filename` path, e.g. via a ticket asking:
   "please set `user_ini.filename` for embeddedos.org to
   `/home/<user>/stripe-env/.user.ini`".

> **Never** put the key in `client/public/.htaccess` (`SetEnv` leaks it into
> git and every deploy), in `.cpanel.yml`, in any `.env` file in this repo,
> or in the Stripe dashboard's _publishable_ key field by mistake.

## 3. Verify (no real charge)

1. Deploy first if needed: `pnpm build && pnpm deploy:branch --push`, then
   cPanel **Update from Remote → Deploy HEAD Commit**.
2. Open `https://www.embeddedos.org/donate/`, switch to the **Card** tab, pick
   **$10**, click **Continue** — the secure card form should render inline.
   (Do **not** enter a real card unless you intend a real gift.)
3. Read-only check without a browser: the endpoint answers 503 while
   unconfigured and stops doing so once the key is set —
   `curl -s -o /dev/null -w "%{http_code}\n" -X POST
https://www.embeddedos.org/api/stripe-intent.php
-H 'Content-Type: application/json' -d '{"amount_cents":1000}'`
   should print `503` before setup and `200` after (the 200 body contains
   only a `client_secret`, never the key).
4. To confirm end-to-end cheaply, make a real **$1** gift with a real card,
   then refund it from **Stripe Dashboard → Payments** (full refund, no fee
   loss on most plans). Refund, do not abandon: an uncaptured PaymentIntent
   auto-cancels, but a confirmed $1 stays until refunded.

## 4. Rotate or revoke

- **Rotate:** Dashboard → Developers → API keys → roll the secret key, then
  repeat step 2 with the new value. The old key stops working immediately;
  the Card tab shows "unavailable" until the new value is saved.
- **If the key ever leaks** (pasted anywhere public, committed, emailed):
  roll it in the Dashboard **first**, then update the host. Treat the old
  value as compromised even if "nothing happened".
- The publishable key needs no rotation and no secrecy.

## 5. What the code expects

- `client/public/api/stripe-intent.php` reads `getenv('STRIPE_SECRET_KEY')`
  and also accepts the key via `$_SERVER` (some PHP handlers populate one
  but not the other — the endpoint checks both).
- `client/src/lib/payments.ts` holds only the publishable key.
- Zeffy and PayPal keep working with no key set; only the Card tab gates on
  it.
