# Development foundation

## Runtime and dependencies

Use Node.js 24 LTS and npm 11; the exact local runtime is in `.nvmrc`.
`package-lock.json` is the reproducible dependency source: use `npm ci` on a fresh
checkout. Direct versions are pinned. Dependency updates are deliberate changes.

The foundation uses Next.js App Router, React, strict TypeScript, Tailwind CSS,
Zod, official Supabase JS/SSR packages, Dexie, and Dexie React hooks.
shadcn/ui is source-owned: `components.json` and `cn` are configured; add only
needed primitives in their implementation increment. No component kit or generated
product pages are installed. Use genuine Font Awesome Free Regular/Classic Solid;
Pro/Rounded assets are not included. Inter Variable is local, with its license.

## Directory boundaries

| Path                                                                   | Responsibility                                                                                      |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `src/app`                                                              | Next.js routes, root layout, global tokens; static application shell and labeled temporary sections |
| `src/features/{today,subjects,tasks,planner,focus,analytics,settings}` | Feature UI and local commands/queries when implemented                                              |
| `src/domain`                                                           | Pure business rules and contracts, without React or storage                                         |
| `src/components/ui`                                                    | Selective accessible shadcn/ui primitives                                                           |
| `src/lib/env`                                                          | Validated public environment and server-only secret access                                          |
| `src/lib/{supabase,sync,i18n}`                                         | Future infrastructure and locale dictionaries                                                       |
| `src/assets/fonts`                                                     | Licensed local Inter Variable asset                                                                 |
| `public`                                                               | Future static assets; no service worker yet                                                         |
| `supabase/migrations`                                                  | Future SQL migrations; no invented schema or generated types                                        |
| `supabase/tests`                                                       | Future pgTAP ownership, RLS, transaction, and concurrency tests                                     |
| `tests/integration`                                                    | Future storage/sync boundary tests                                                                  |
| `tests/e2e`                                                            | Browser checks against a production build                                                           |

Reserved directories use `.gitkeep`; they do not expose API endpoints or imply
working features. The `/app` shell now exists. Create auth, API, proxy, and service-worker files only
when implementing their approved behavior. Do not add repositories, service classes,
state frameworks, or an ORM.

## Environment

`.env.example` contains empty placeholders. Next.js loads `.env.local` automatically;
existing process variables take precedence. `NEXT_PUBLIC_*` values are bundled at
build time and are public. Rebuild after changing them. Private keys belong only
in untracked local files or the deployment secret store.

`getPublicEnv()` validates only when called; the static foundation must build
without backend configuration. It accepts HTTPS (or HTTP loopback for local work)
and a publishable key, strips unknown fields, and never substitutes fake values.
`getSupabaseSecretKey()` is guarded by `server-only`; use it only for the future
approved administrative account-deletion operation. Missing/invalid configuration
throws a sanitized error; never print raw credentials or validation input.

No Supabase clients, auth/session handling, database types, or application schema
are fabricated for this stage. Generate database types from actual migrations later.

## Commands and tests

| Command                                | Purpose                                                                  |
| -------------------------------------- | ------------------------------------------------------------------------ |
| `npm run dev`                          | Local Next development server                                            |
| `npm run check`                        | ESLint, formatting, strict typecheck, Vitest                             |
| `npm run build` / `npm start`          | Production build / server                                                |
| `npm run lint:fix` / `npm run format`  | Focused code style repair; review changes                                |
| `npm run test:watch`                   | Unit test watch mode                                                     |
| `npx playwright install chromium`      | Install the browser needed by E2E tests                                  |
| `npm run test:e2e`                     | Build and launch production app; desktop and mobile Chromium smoke tests |
| `npm run db:start` / `npm run db:stop` | Start / stop the local Supabase stack; requires Docker                   |
| `npm run test:db`                      | Run pgTAP tests after the first real migration and SQL tests exist       |

Vitest uses Node with `@/*` aliases. Add a browser-like environment or IndexedDB
shim only when a real integration test needs it. Current unit coverage verifies
missing/unsafe environment rejection and the public/private boundary. E2E verifies all seven navigation states, URL/history behavior without RSC requests,
drawer/search keyboard interaction, theme persistence/system changes/storage errors,
unknown views, skip links, and responsive widths without auth.
Use meaningful behavior tests; do not test duplicate copies of implementation logic.

ESLint uses Next's flat configuration plus strict `no-explicit-any`; Prettier handles
formatting separately. Existing approved design/architecture artifacts are excluded
from bulk formatting to preserve their review history. Format new source/config/docs.
TypeScript is strict with unchecked index access. The typecheck command first runs
`next typegen`, so a fresh checkout does not depend on a pre-existing `.next` build.
Next generated types stay generated.
The Next ESLint preset currently requires TypeScript below 6.1 and plugins accepting
ESLint 9. Pin TypeScript 6.0.3 and ESLint 9.39.5 rather than overriding peer ranges.
ESLint 9 is deprecated upstream; upgrade the preset/plugins and ESLint together once
their declared ranges support ESLint 10. Installation currently reports no known
vulnerabilities; deprecation is tracked separately from the audit result.

## Local Supabase

The CLI is a pinned dev dependency; `supabase/config.toml` is local-only configuration.
It does not create a hosted project. Run Docker first, then `npm run db:start`.
Read `npx supabase status` locally for development connection values; never paste
secret output into issues or logs. Auth redirect origins use localhost:3000.

The product's narrow `api` RPC schema must be exposed only once it exists in a
migration; the initial empty local database exposes no application schema. Do not
create placeholder RPCs or permissive public tables to make initialization look done.
No schema test success is claimed before real SQL tests and a running database exist.

## Next increment

Follow the approved roadmap: email/password authentication and ownership rules first.
Hosting region/plan, SMTP, backup retention, and deletion retention remain deployment
choices requiring actual infrastructure context; no production deployment is included.

## Setup references

The foundation follows the official [Next manual installation](https://nextjs.org/docs/app/getting-started/installation),
[Tailwind PostCSS setup](https://tailwindcss.com/docs/installation/using-postcss),
[shadcn manual setup](https://ui.shadcn.com/docs/installation/manual), and
[Supabase local configuration](https://supabase.com/docs/guides/local-development/cli/config).
The approved StudyFlow tokens override generic component defaults.

## Application shell

`src/components/app-shell.tsx` owns presentation/navigation state; section metadata
lives in `src/lib/navigation.ts`. `useSearchParams` observes native History API
changes within one statically generated `/app` route. Do not replace section links
with server navigation or add cookie checks to that generic entry point.

`PageHeader`/`PageContent`, `Button`, `Input`, `Dialog`, `LoadingState`, and `ErrorState`
are reusable primitives. Native modal dialogs provide inert background/focus return;
explicit Escape and Tab boundaries cover search-input/browser behavior. No dialog
dependency or generic component factory was added. Search finds sections only.

The theme initialization function is self-contained and shared with the before-paint
script. A future restrictive CSP must authorize that script using the chosen hash/nonce
policy; do not silently remove the script and reintroduce a theme flash. No user input
is interpolated into it. Only the theme preference is stored; no account data exists.
