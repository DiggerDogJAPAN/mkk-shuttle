# Local security remediation — October 24, 2026

## Scope and Git safety

- Initial tracked/untracked Git status was clean. A pattern scan of tracked text files found no private keys, Stripe secrets, JWTs, or credential-bearing PostgreSQL URLs. This is a targeted scan, not a guarantee that every possible secret format was detected.
- Local empty checkpoint commit: `edd8d0c` (`Checkpoint before local security remediation`). No unrelated files or credentials were committed.
- Remediation changes were reviewed against checkpoint `edd8d0c` for a local commit. No push, deployment, production settings change, database schema/data change, real payment, live booking mutation, or actual email delivery was performed.

## Changes

- Added `engines.node: "24.x"` and `.nvmrc` containing `24`. The confirmed Vercel Node 24.x setting was not changed.
- Verified the requested package releases through the public npm registry, then upgraded Next.js and its ESLint configuration to 16.4.3, React/React DOM together to 19.2.9, and shadcn to 4.22.1.
- Applied compatible transitive security fixes with `npm audit fix --ignore-scripts`, without `--force`, dependency overrides, or direct major upgrades. Package installation used `--ignore-scripts` and an isolated temporary npm cache.
- Kept shadcn in production dependencies: `src/app/globals.css` imports `shadcn/tailwind.css`. The import and all application source files are unchanged. The CSS export resolves and compiles successfully.
- Verified exactly one sharp entry, version 0.35.5, in both the lockfile and installed dependency tree. No vulnerable duplicate remains.
- Added `npm test` and 39 isolated regression tests in `tests/security-regression.test.mjs`. The tests execute application modules with explicitly supplied dependencies; service transports are mocked in memory. No additional test framework dependency was added.
- Read the updated bundled Next.js upgrade, `use cache`, and Image documentation. Cache Components remain disabled; no Server Actions were introduced.

## Runtime and dependency verification

The only pre-existing local Node installation was 22.22.0. Official Node 24.22.1 for macOS arm64 was downloaded to `/private/tmp/myoko-security-node/node-v24.22.1-darwin-arm64` and verified against the official SHA256 checksum:

`89c682593d76cd44233fa53b1563264e7de9cbb189cad169135c5b4fadfbc0a7`

All project tests, audits, TypeScript checks, lint and build used this isolated **Node v24.22.1 / npm 11.19.1**. No global Node installation or shell configuration was changed. The ordinary shell may therefore still select the vulnerable Node 22.22.0. Temporary runtime files are not a permanent installation; select/install a patched Node 24 before subsequent development.

For this local session, commands can be prefixed with:

```sh
PATH=/private/tmp/myoko-security-node/node-v24.22.1-darwin-arm64/bin:$PATH npm test
```

Manifest dependencies, development dependencies and engines match the lockfile root. All 586 installed package manifests represented in the lockfile match their locked versions. Optional packages for other platforms are recorded in the lockfile but are not installed on this Mac.

### Final direct packages

| Package | Installed version |
| --- | --- |
| @base-ui/react | 1.4.1 |
| @marsidev/react-turnstile | 1.5.3 |
| @stripe/stripe-js | 9.8.0 |
| @supabase/supabase-js | 2.105.3 |
| class-variance-authority | 0.7.1 |
| clsx | 2.1.1 |
| lucide-react | 1.14.0 |
| next | 16.4.3 |
| next-themes | 0.4.6 |
| react | 19.2.9 |
| react-dom | 19.2.9 |
| resend | 6.16.0 |
| shadcn | 4.22.1 |
| sonner | 2.0.7 |
| stripe | 22.2.2 |
| tailwind-merge | 3.5.0 |
| tw-animate-css | 1.4.0 |
| @tailwindcss/postcss | 4.2.4 |
| @types/node | 20.19.39 |
| @types/react | 19.2.14 |
| @types/react-dom | 19.2.3 |
| eslint | 9.39.4 |
| eslint-config-next | 16.4.3 |
| tailwindcss | 4.2.4 |
| typescript | 5.9.3 |

Selected final transitive versions: sharp 0.35.5, @modelcontextprotocol/sdk 1.32.2, proxy-addr 2.0.8, postcss 8.5.23, ws 8.22.0. The existing `@types/node` major was retained; it is a type-definition package, not the runtime.

## Results

| Check | Result |
| --- | --- |
| `npm audit --json` | PASS: 0 vulnerabilities at every severity |
| `npm audit --omit=dev --json` | PASS: 0 vulnerabilities at every severity |
| `tsc --noEmit --incremental false` | PASS |
| `npm test` | PASS: 39 tests, 0 failures/skips |
| `npm run build` | PASS: Next.js 16.4.3/Turbopack; 40/40 generated static pages |
| `npm run lint` | FAIL: 111 errors, 58 warnings in existing files |
| ESLint on new regression tests | PASS: 0 errors/warnings |
| `git diff --check` | PASS |
| Local production HTTP checks | PASS: nine pages, compiled CSS, image optimization and safe API rejection |

Lint findings include explicit `any`, React hook rules, `require` imports, unused variables, and existing suppression comments. All error-bearing tracked application files are unchanged; two errors also come from the pre-existing Git-ignored `scratch/fetch_openapi.js`. No lint rules were disabled and no unrelated lint cleanup was attempted. These counts describe existing code under the updated rules, not a comparison against the old ESLint package version.

The production build/server used explicit dummy Supabase, Stripe and Resend credentials, a Supabase URL at unreachable localhost port 9, local site URLs and live display mode. Existing environment files were not modified. The build fetched the existing Google font but did not use live business APIs.

During subsequent local inspection, the dummy preview was replaced with a development server at `http://localhost:3100` using the existing `.env.local` under Node 24.22.1. The browser bundle was checked for the configured public Supabase values and absence of the service-role key. Anonymous read-only queries returned HTTP 200 with four routes and ten schedules; January 15, 2027 had one blocked schedule, leaving four routes and nine schedules available. No database writes were made. The final pre-commit audits, 39-test suite and production build were rerun successfully; the build continued to use dummy service credentials independently of the development server.

### Compatibility exercised

- Pricing: schedule override priority, standard fallback, absent fares, zero override handling and missing stops.
- Availability: route and schedule blackouts, unrelated blackouts, season limits, invalid schedule/stop order.
- Booking limits: accepted 1 and 15 passengers; rejected zero, negative, fractional, string and over-limit counts.
- Checkout: authenticated identity and server price replace forged client values; JPY totals/metadata; simulated Stripe failure rolls back only the in-memory booking.
- Webhooks: real Stripe SDK HMAC verification, missing/invalid signatures, tampered raw bodies, irrelevant events, unpaid sessions, missing metadata, paid update and duplicate-event handling.
- Supabase: application query behavior through mocked clients plus actual SDK query serialization through an in-memory fetch.
- Stripe: actual installed SDK checkout serialization through an in-memory transport; no real session or payment created.
- Resend: confirmation HTML/reference/fare rendering and actual SDK serialization through an in-memory fetch; no email sent.
- Admin guard: anonymous and non-admin redirects, and admin authorization using mocked session/profile results. This does not certify production Supabase RLS or real sign-in.
- Local production pages `/`, `/book`, `/login`, `/admin` and all five service pages returned HTTP 200. HTTP 200 for `/admin` verifies the page shell, not authorization.
- Compiled CSS returned HTTP 200 and contained shadcn `data-open` variants, brand variables, background/text utilities and Inter font definitions. A local JPEG passed through `/_next/image` and returned optimized image bytes with HTTP 200.
- Unauthenticated checkout and unsigned webhook requests were rejected with the expected HTTP 400/401 statuses before external calls.

## Remaining advisories and deployment risks

No remaining advisories were reported by either npm audit. This is a dependency advisory result, not a guarantee of application security. Node CVE-2026-111497 is addressed by the runtime used here; npm audit does not scan Node itself. Next.js 16.4.3 and sharp 0.35.5 supersede the fixes for CVE-2026-96889, GHSA-673q-mjm6-r5xr and the October 14 Server Actions DoS advisory.

No direct dependency major upgrade was introduced. The mandated shadcn update and its upstream compatible ranges selected some different transitive majors: @hono/node-server 2.1.5, content-disposition 2.0.1, path-to-regexp 8.4.2, type-fest 4.41.0 and wsl-utils 1.0.1. These are upstream shadcn/MCP/CLI dependencies, not application API migrations or forced overrides. Next.js 16.2 to 16.4 also changes bundler/server internals, so production-like staging verification is still appropriate.

The confirmed Vercel Node 24.x setting should be retained. Deployment is required to publish these dependency fixes, and the actual managed production runtime must be checked for the Node security patch. No deployment was performed. Reusing an old vulnerable deployment for rollback would reintroduce its dependency vulnerabilities.

## Manual verification still required

No browser was connected; browser discovery returned an empty list. Visual desktop/mobile checks, hydration, interactive dropdowns, responsive styling and navigation were not verified. HTTP/CSS checks do not substitute for visual QA.

Before deployment approval, use an isolated staging environment with a test database, Stripe test mode and intercepted email delivery to check:

1. Booking form availability, blackout handling, displayed fares, schedule overrides, date limits, 1–15 passenger selection and the full details/payment journey.
2. Real test-mode Stripe checkout, verified webhook delivery, duplicate event behavior, cancellation/refund flows and database persistence.
3. Actual Supabase sign-in/session refresh, admin and non-admin behavior, and RLS enforcement for customer/admin data. No live credentials or authenticated production operations were used here.
4. Resend provider acceptance using safe test recipients or a mail sink. Customer/admin delivery was not exercised.
5. Desktop/mobile page screenshots, dropdown states, forms, service timetables, fonts and image rendering.

Real payments, live booking mutations/refunds, production database writes, customer emails and production environment changes require separate authorization and were deliberately not executed.
