# Milestone 1 — Application Foundation

Date: 2026-10-26. Status: implemented and verified; stop before business features.
The user explicitly requested the shell first. Backend/data architecture is unchanged.

## Implemented

- Static `/app?view=...` shell; `/` redirects to `/app`. Seven sections use native
  History API, working deep links, Back/Forward, and accessible active states.
- Fixed desktop navigation: 216/248/264 px at the approved width ranges. Below
  960 px, use a modal navigation drawer with Escape, outside-click, focus containment,
  focus return, scroll locking, and automatic closure when resizing to desktop.
- Header, main-content skip link, reusable page title/content, explicit temporary
  page shells. No tasks, subjects, charts, session controls, or fake account status.
- Navigation search by Russian or English section name; Ctrl/Cmd+K, arrow navigation,
  explicit search buttons, labeled input, no-results feedback. This is not study-data search.
- System/light/dark appearance, local preference, system and cross-tab listeners,
  before-paint initialization, immediate theme changes, and visible storage-failure feedback.
- Shared buttons, input, modal dialog, loading state, and labeled/retryable error state.
  Native dialogs and select reuse platform accessibility without a new dependency.
- Existing Inter Variable, Font Awesome Free packages, palette, radii, and spacing.
  Functional input/error tokens are documented in design-system.md.

## Changed files

- `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`.
- `src/app/app/{page,loading,error}.tsx`.
- `src/components/{app-shell,sidebar,navigation-search,theme-switcher,page-layout}.tsx`.
- `src/components/ui/{button,input,dialog,feedback}.tsx`.
- `src/lib/{navigation,theme}.ts`.
- `tests/e2e/foundation.spec.ts`.
- README, development guide, design-system/reference implementation notes, and roadmap.

No dependency/lockfile, Supabase configuration, business data, or credentials changed.

## Verification

- `npm run check`: ESLint with zero warnings, formatting, generated route types,
  strict TypeScript, and all 10 existing unit tests passed.
- `npm run test:e2e`: production build and 17 Chromium scenarios passed; one
  mobile-only drawer scenario is intentionally skipped in the desktop project.
- All seven sections: correct URL, title, active link, keyboard focus, no document
  navigation or RSC requests while switching. Deep links/reload/history/root redirect verified.
- Keyboard: search/empty search/arrow activation, Escape, modal Tab boundary,
  focus return, mobile resize/backdrop dismissal, and skip link verified.
- Theme: persistence after reload, explicit override of OS setting, system changes,
  and storage rejection verified. No page runtime errors in navigation scenarios.
- Layouts: 320, 390, 768, 960, 1280, 1440, 1600 px; correct sidebar widths and no
  horizontal overflow or spurious vertical scrolling on the temporary page.
- Build manifest confirms `/app` is static. No server cookies or personalized HTML.
- Actual desktop/mobile light/dark screenshots were inspected against R03/R05 and
  the approved shell measurements. R01 remains placement-only; no source widget inventory
  or personal information was copied. Test screenshots are ignored outputs under `test-results/`.
  A live in-app browser review is preserved in [desktop screenshot](design/verification/milestone-1-desktop.jpg);
  the local production preview is available at http://127.0.0.1:3000/app.
- Tracked diff and new source files reviewed; `git diff --check` passed.

Initial browser runs caught Escape being consumed by the search input and native
Tab leaving the drawer. Both were corrected and passed in the final run. Theme
changes suppress hover transitions so light surfaces do not linger in dark mode.

## Limits and next work

- All seven content views are intentionally temporary. The detailed Today plan,
  Auth, IndexedDB, service worker/offline reload, sync, Focus, analytics, export, and
  account deletion are not implemented or claimed complete.
- UI language is Russian; English names are search aliases, not a locale switcher.
- Browser coverage here is Chromium desktop/mobile emulation. Real Safari/iOS,
  Firefox/WebKit, screen-reader review, and 200% text-zoom acceptance remain later checks.
- A restrictive production CSP must authorize the static theme bootstrap script
  with the agreed hash/nonce policy. No user input is interpolated into that script.
- Earlier Auth readiness findings (12-character policy versus local minimum 8,
  local Supabase/Docker setup, and Auth page specifications) remain for that increment.
