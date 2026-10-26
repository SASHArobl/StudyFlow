# StudyFlow Today — Stage 3 review prototype

Status: **Visual review requested; not final design approval.**

## Open

Open `studyflow-today.html` in a modern browser. It is a single self-contained file: Inter Variable and Font Awesome Free 6.7.2 are embedded; no network or installation is required. Source licenses are embedded as HTML comments and retained under assets/.

A local preview may also be served with Python's standard-library HTTP server. This is review tooling, not project initialization.

## Scope

One responsive Today screen, not the Next.js application. Selected target: direction 2 / Quiet Canvas, refined with the Things collage, more rounding, Inter Variable, Font Awesome, and the original layout-only grid.

Try:
- Filter subjects; select a session to update its Focus context.
- Add/check a task; create/edit a session.
- Start Focus, pause/resume, finish, optionally rate, and save the demo result.
- Open command search with the search button or Ctrl/Cmd+K; add a task with Ctrl/Cmd+N.
- Switch light/dark appearance; use the navigation drawer on narrow screens.

Not included: backend, login, permanent persistence, production sync/offline engine, other product pages. Demo edits reset on reload. Unavailable sidebar destinations are marked aria-disabled. No accounts or external state are changed.

## Files

- `studyflow-today.html`: portable review artifact.
- `studyflow-today.template.html`: editable design prototype source.
- `build-preview.py`: standard-library packager; embeds existing local font assets, no package installation.
- `preview-desktop.jpg`, `preview-mobile.jpg`, `preview-dark.jpg`: browser-rendered QA evidence, not generated mockups.
- Project-root `design-qa.md`: checks, intentional deviations and limitations.

## Assets and attribution

Inter Variable: https://rsms.me/inter/ — SIL Open Font License 1.1.
Font Awesome Free 6.7.2: https://github.com/FortAwesome/Font-Awesome/releases/tag/6.7.2 — font files SIL OFL; CSS MIT; icons CC BY 4.0. The fonts are unmodified. No Pro/Rounded package is claimed.

No CDN is contacted by the delivered HTML. Full author/license notices are embedded and retained under assets/.
