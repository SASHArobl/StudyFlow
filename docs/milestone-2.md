# Milestone 2 — Authentication and User Profiles

Implemented on 2026-10-26. Scope stops at Auth and the basic owned profile.
No new dependencies, hosted project, study features, offline identity or sync engine.

## Delivered

- Registration, email confirmation, sign-in, device-local sign-out, PKCE password
  recovery and new-password flow. Successful reset signs out all sessions.
- Request-scoped official Supabase SSR clients, SDK cookie persistence/refresh,
  preserved refresh/cache headers, verified current user and protected API routes.
- Server-protected reset screen; generic static `/app` document remains free of
  personal HTML. Its client boundary obtains authorized data and redirects anonymous users.
- Private profiles/account state, forced RLS, narrow SECURITY DEFINER RPCs owned
  by a limited NOLOGIN/NOBYPASSRLS role, live-session checks and explicit grants.
- Basic Settings profile: confirmed email, editable name, account/version conflict
  guards. No caller-selected owner; stale forms cannot overwrite another account.
- Restrained responsive forms, existing tokens/Inter/Font Awesome, keyboard labels,
  field errors, pending states, neutral email acknowledgments and theme control.
- Unit, real pgTAP/RLS and local Supabase/Mailpit browser tests; generated DB types.

See [authentication contract](authentication.md) and [development guide](development.md).

## Verification

- `npm run check`: ESLint, Prettier, strict TypeScript; 13 unit tests passed.
- Production build passed as part of Playwright startup.
- Full E2E: 25 passed, one expected desktop skip for the mobile-only drawer.
  Chromium desktop and Pixel 7 emulation use real local Auth, REST and Mailpit.
- Verified registration and same-browser confirmation, unconfirmed/wrong-password
  rejection, profile persistence/reload, two-user isolation, version/account
  conflicts, logout, recovery email, password replacement and successful new login.
- Direct RPC rejects anonymous callers and a revoked session's still-signed JWT.
  Private-schema REST access is rejected. API Origin/input and anonymous access
  are rejected; fixed callbacks do not accept arbitrary redirect targets.
- Real SSR refresh exercised by forcing the SDK's stored expiry boundary while
  retaining real signed/refresh tokens: provider rotates refresh token and response
  persists cookies plus private/no-store and no-cache headers. This does not claim
  a timed 15-minute browser JWT-expiry soak test.
- Cross-tab logout, generic static HTML, keyboard submission, 320–1440px auth
  reflow, both themes, shell navigation/history/keyboard and 320–1600px shell checks.
- pgTAP: 19 passed. Includes role ownership/grants, forced RLS, missing/mismatched
  identity, unconfirmed user, stale version, deleting account, expired/revoked session.
- SQL lint: no warnings/errors in api, private and app_data.
- Migration replay reached successful application in an isolated shadow database.
  The subsequent full schema comparison was cancelled after repeated registry TLS/
  image-download failures; no zero-drift claim is made. A requested local reset was
  rejected by automatic approval review as potentially destructive and was not run;
  the safer shadow replay preserved the existing local database.
- Screenshots inspected for desktop/light, desktop/dark and mobile/profile; corrected
  spacing below the Settings page header. Test screenshots remain in ignored test-results.
- Final diff and whitespace reviewed. Existing AGENTS.md commit-message instruction preserved.

## Operational boundary and manual checks

- Local `.env.local` is ignored and contains only local public configuration and
  APP_ORIGIN. No administrative key is needed or configured for this milestone.
- Colima and the reduced local Supabase stack were started for real verification;
  they remain available. Browser test servers stop after each run.
- No production SMTP or hosted Auth configuration was changed. Before release,
  configure SMTP/templates, canonical HTTPS origin, callback allowlist, exposed api
  schema and hosted rate limits; verify actual email delivery/link scanners,
  PKCE links opened in a different browser, Safari/iOS and browser restart persistence.
- System Auth table SELECT policies are intentionally narrow but touch managed
  schemas; recheck grants/RLS and these tests after Supabase upgrades.
- Registration/recovery need network. Offline storage/account switching is deferred
  to its approved milestone; current failures do not delete any study queue.

Stop here and wait for approval before the next milestone.
