# StudyFlow engineering instructions

## Sources of truth

Read relevant files before changing code. Follow [requirements](docs/requirements.md),
[architecture](docs/architecture.md), [decisions](docs/decisions.md), and the
[implementation plan](docs/implementation-plan.md). Keep documentation current.
Communicate in Russian; write code, identifiers, and new technical docs in English.
Respect stage approvals and the requested scope; do not infer approval from silence.

## Engineering

- Write clean, maintainable, idiomatic code. Prefer simple composition over cleverness.
- Follow the existing architecture; avoid premature abstractions, extra layers,
  unnecessary dependencies, duplicated logic, and unrelated changes.
- Keep business rules in `src/domain`, separate from UI, networking, and storage.
  Keep feature UI in `src/features`; shared primitives belong in `src/components/ui`.
- Use strict TypeScript and explicit boundary types. Avoid `any` unless justified.
- Validate inputs, handle errors and edge cases, and preserve existing behavior.
  Never disguise mocks, placeholders, or incomplete implementations as working features.
- Keep Task completion, Study Session time, and Topic mastery independent.
  Mastered is a self-assessment; session difficulty is not a knowledge score.

## Frontend

- Follow [design system](docs/design-system.md), [reference mapping](docs/design-references.md),
  and [page specifications](docs/page-specifications.md); maintain high visual fidelity.
- Use Inter Variable and genuine Font Awesome icons. R01 controls placement only.
  Preserve consistent spacing, rounding, and colors; avoid generic dashboard patterns.
- Build responsive layouts with keyboard access, visible focus, accessible labels,
  and meaningful interaction feedback. Include loading, empty, and error states.
- Use motion sparingly and respect reduced motion. Do not add decorative animations.

## Security

- Validate untrusted input with Zod at system boundaries. Enforce authorization on
  the server and ownership in Postgres; client checks are never sufficient.
- Follow secure Supabase authentication practices. Never authorize from user-editable
  metadata or an unverified client session. Follow the approved RLS/RPC design.
- Never expose secrets in browser code, `NEXT_PUBLIC_*`, logs, tests, or commits.
  Keep privileged code `server-only`; protect export, deletion, and reauthentication.
- Preserve account isolation in local storage and synchronization. Do not silently
  discard conflicting edits or count unconfirmed/overlapping study time.

## Workflow

1. Before changes: inspect relevant files and conventions; choose the simplest solution.
2. During changes: stay focused, follow approved architecture, avoid unrelated refactors,
   and preserve existing functionality. Add dependencies or abstractions only with a reason.
3. After changes: run relevant checks, review the diff or changed files, identify regressions,
   remove unnecessary complexity, and report verification results and limitations.
4. After each stage or implementation milestone, include a ready-to-copy English
   commit message with a concise subject and body in the final report.

Use `npm run check` and `npm run build` for foundation changes. Run browser or
local database tests when the changed behavior requires them; see
[development guide](docs/development.md). Pin dependencies and preserve the lockfile.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
