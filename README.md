# StudyFlow

Study planning and learning progress for students. Requirements, architecture,
design system, references, roadmap, and the Today specification are approved.
This repository currently contains the project foundation, not application features.

## Local setup

Use Node.js 24 LTS (`.nvmrc`) and npm 11.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. The neutral foundation page works without Supabase
credentials. No auth, study data, offline cache, or synchronization is implemented yet.

For later backend work, copy `.env.example` to `.env.local` and fill it using a
**development** Supabase project or the local CLI. Never commit `.env.local`.
Production services are not provisioned or linked by this setup.

## Checks

```sh
npm run check
npm run build
npx playwright install chromium
npm run test:e2e
```

Playwright builds and starts the production app on port 3100. Unit tests do not
need a browser or database. Database tests require running Docker and local Supabase;
no product schema or SQL tests exist at this stage.

See [development guide](docs/development.md), [architecture](docs/architecture.md),
[implementation plan](docs/implementation-plan.md), and [engineering instructions](AGENTS.md).
The design review HTML under `docs/design/prototypes` is separate from the app.
