# Development guide

## Runtime and conventions

Use Node.js 24 LTS and npm 11 (`.nvmrc`, pinned package-lock.json). Run `npm ci`
on a fresh checkout. The approved stack remains Next.js App Router, React, strict
TypeScript, Tailwind, Zod, Supabase SSR/JS and later Dexie offline storage.
No dependencies were added for authentication. Use the existing source-owned UI
primitives, local Inter Variable and genuine Font Awesome Free icons.

- `src/app`: routes, HTTP boundaries, global tokens and generic static `/app`.
- `src/domain`: pure validation/contracts; no React or infrastructure.
- `src/features/auth`, `src/features/account`: authentication and profile UI.
- `src/components`: reusable shell, navigation and accessible UI primitives.
- `src/lib/supabase`: request-scoped server client, verified-user helper and generated DB types.
- `supabase/migrations`, `supabase/tests`: real schema/RPC migrations and pgTAP tests.
- `tests/e2e`: production-build browser tests against local Supabase and Mailpit.

Reserved directories are placeholders, not completed features. Do not add an ORM,
repository classes, generic services or state frameworks without a demonstrated need.

## Local setup

1. Start Docker (Colima works), then `npm run db:start`. Auth requires the database,
   Auth, REST, gateway and Mailpit services. On a small machine, the verified reduced
   command is `npx supabase start --exclude studio,postgres-meta,realtime,storage-api,imgproxy,edge-runtime,logflare,vector,supavisor`.
2. Copy `.env.example` to untracked `.env.local`. Read local connection values with
   `npx supabase status`; never paste its secret output into logs or issues.
3. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and the
   exact canonical `APP_ORIGIN=http://127.0.0.1:3000` (no trailing slash).
   Authentication uses no secret/service-role key.
4. Run `npm run dev`, then open `http://127.0.0.1:3000`. The browser origin must
   match APP_ORIGIN. Local email is available at `http://127.0.0.1:54324`.

Next loads `.env.local`; existing process variables take precedence. Public values
are bundled at build time; rebuild after changing them. Environment validation is
lazy so the generic static shell can build without backend configuration. Missing
configuration fails safely at runtime. `getSupabaseSecretKey()` remains reserved
for the later account-deletion implementation.

Local Supabase exposes only `api`. User tables in `app_data` and service tables in
`private` have forced RLS and no client DML grants. RPCs verify active Auth sessions
and own rows. See [authentication contract](authentication.md) for the narrow role,
Auth-table RLS policies and request/cookie boundaries.

## Commands and verification

| Command                                                                        | Purpose                                                              |
| ------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| `npm run check`                                                                | ESLint, formatting, strict TypeScript and unit tests                 |
| `npm run build` / `npm start`                                                  | Production build/server                                              |
| `npm run test:e2e`                                                             | Production-build desktop and mobile Chromium tests                   |
| `npm run test:db`                                                              | Local pgTAP isolation, grants, RLS, versions and session checks      |
| `npx supabase db lint --local --schema api,private,app_data --fail-on warning` | SQL function checks                                                  |
| `npm run db:stop`                                                              | Stop the local Supabase stack                                        |
| `npx supabase gen types --local --schema api`                                  | Regenerate database.types.ts from the real schema; format its output |

E2E requires local Supabase and Mailpit, refuses hosted Supabase URLs, and creates
unique test-only accounts. Its server overrides APP_ORIGIN to port 3100, which is
allowlisted in local Auth configuration. Confirmation links stay in the browser
that initiated PKCE. Tests do not bypass authorization or use admin credentials.
Traces contain synthetic test credentials/sessions; keep ignored test-results
private and never run these fixtures against real users.

ESLint's Next preset currently requires ESLint 9 and TypeScript below 6.1; keep the
pinned versions until their declared peer ranges change together. Formatting skips
approved historical design/architecture artifacts to preserve their review history.
`next typegen` runs before strict TypeScript checks.

## Shell and themes

`/app?view=...` stays a generic static document without cookies or personal HTML.
AuthenticatedWorkspace obtains the profile through a server-authenticated endpoint;
all data RPCs independently enforce authorization. Navigation uses native History
API and does not make document/RSC requests between sections. Study sections remain
clearly labeled temporary pages; Settings now includes the real basic profile.

Reuse Button, Input, Dialog, LoadingState, ErrorState, PageHeader and PageContent.
The auth forms reuse ThemeSwitcher and its system/storage listeners. The shared
before-paint theme script requires a hash/nonce if a restrictive CSP is introduced.
Do not remove it or interpolate user data into it.

## Hosted setup remains a separate step

No cloud project was created or modified. Before production, apply the migration,
expose only `api`, configure trusted HTTPS APP_ORIGIN, matching Auth redirect URLs,
real SMTP, email templates and production rate limits. Verify confirmation/recovery
through real email clients, including prefetch/link scanners and supported browsers.
Local Mailpit delivery is not proof of production deliverability. Review region,
backups and deletion retention before real use. See [Milestone 2](milestone-2.md).

## Registration troubleshooting

If registration reports an unavailable service, first verify that the process on
port 3000 is the current application. A running `next start` process retains its
route manifest even when another build replaces `.next`; restart that process
after an implementation/build change. Do not run dev and production servers
against the same build directory concurrently.

Use the canonical APP_ORIGIN URL. With the supplied local environment this is
`http://127.0.0.1:3000`, not `http://localhost:3000`. A mismatched Origin is correctly
rejected with 403; do not weaken the CSRF check to work around it. The UI now
distinguishes this configuration mismatch from a Supabase outage.

On 2026-10-26, the stale server returned 404 for `/api/auth/register`. After
restarting the current dev server, a real browser registration returned 200,
Mailpit received its confirmation email, and the callback opened the protected
workspace. This verifies the local flow, not production email delivery.
