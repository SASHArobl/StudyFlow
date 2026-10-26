# Milestone 2 — Authentication and Profiles

Scope: email/password registration, confirmation, sign-in/out, PKCE recovery,
server-validated session persistence, and an owned basic profile. The current user
explicitly authorized implementation; use the approved visual foundation.

## UX contract

- Restrained single-column auth surface, local Inter, existing theme/spacing/radius
  tokens, visible labels, appropriate autocomplete, inline field errors, one primary
  submit action, keyboard access, and descriptive pending states.
- Registration and new-password forms require 12 characters and confirmation.
  Password paste and password managers remain available. Sign-in accepts existing
  credentials without imposing the new-password minimum again.
- Registration and recovery acknowledge requests without disclosing whether an
  address exists. Confirmation failures explain expired/used links and the need
  to use the same browser for PKCE; query tokens never appear in rendered errors.
- Reset-password is a server-protected online route. A completed reset signs out
  sessions and returns to sign-in. Failures never appear as success.
- Settings displays the verified email and basic profile name. Name changes use
  an expected account identity and version; stale changes require reload instead of silently overwriting.

## Security and architecture

- Preserve the approved generic static `/app` route: no cookies or personal HTML.
  Its client boundary obtains a profile only from a protected server endpoint.
  Anonymous visitors are directed to sign-in. The shell itself is public, not user data.
- Supabase SSR owns cookies, refresh and PKCE. Create a server client per request;
  propagate every cookie and refresh/cache header. No custom token store or password backend.
- Protected endpoints verify the current Auth user. RPC additionally verifies the
  live JWT session, confirmed/non-deleted user, and active account state.
- Profiles live in non-exposed `app_data`, with RLS and no client DML. Only narrow
  `api` RPCs are exposed. Their NOLOGIN owner is not a table owner or BYPASSRLS role;
  use empty search_path, explicit grants, and ownership policies. The role inherits
  the standard authenticated schema privileges (membership INHERIT true, SET false);
  column grants plus own-user/current-session SELECT policies on auth.users and
  auth.sessions allow live-session checks without bypassing their system RLS.
  Keep these managed-schema policies under migration/upgrade verification.
- Cookie mutations require the configured exact APP_ORIGIN, JSON content type and
  bounded JSON input. Redirects are fixed or restricted to the local `/app` path.
  Personalized responses are private/no-store. Never log tokens/passwords/raw auth errors.
- No admin key is used by the application in this milestone. Local-only fixtures,
  real email delivery and production infrastructure are separate concerns.
- Profile initialization is idempotent; deleting accounts and revoked sessions
  cannot recreate a profile. Display names are untrusted plain text, never permission claims.
- No study data, IndexedDB, offline identity, sync engine, exports, deletion workflow,
  or subscription functionality is added here. Later offline work must preserve
  pending data on expiry and explicitly separate accounts.

## Verification

Record actual unit, SQL/RLS, integration and browser results in milestone-2.md.
Do not treat mocks, build success, or local Mailpit delivery as proof of production email delivery.
