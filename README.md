# ayurvedachalam-site

The website for Ayurvedachalam (ayurvedachalam.com): Next.js 16 (App Router), TypeScript,
Tailwind 4, MongoDB, custom CMS. The six project documents live in `docs/` and are the
source of truth; read `docs/memory.md` first.

## Run locally

```bash
cp .env.example .env.local      # leave MONGODB_URI empty to use the JSON seed
npm install
npm run seed                    # page map + article drafts → content/seed/*.json (and MongoDB if MONGODB_URI is set)
npm run dev                     # http://localhost:3000  (drafts are visible in dev)
```

Production shows only `published` records. To preview drafts on a server, set `PREVIEW_DRAFTS=1`.

## Checks

| Command | What |
| --- | --- |
| `npm run typecheck` | TypeScript |
| `npm test` | Unit tests (compliance linter, markdown) |
| `npm run lint:content` | Lints every seeded page and article against `rules.md` R1.3 |
| `npm run build` | Production build; fails if a page lacks a title or description |

## Where things are

| Path | Purpose |
| --- | --- |
| `docs/` | product, architecture, rules, design, tasks, memory |
| `app/(site)/` | Public routes: home, `[...slug]` (all CMS pages), `learn/*`, `styleguide` |
| `app/api/cms/ingest` | Article ingest from the content relay (`x-ingest-key`) |
| `app/api/cron/publish` | Publishes due articles (`Authorization: Bearer CRON_SECRET`), every 15 min |
| `app/api/forms/*` | Contact and newsletter (no health fields; CASL consent stored) |
| `templates/` | One component per template (architecture.md §5) |
| `lib/content/repo.ts` | Data access: MongoDB, or `content/seed/*.json` when no database |
| `lib/compliance/` | Linter, banned terms, legal-check slugs |
| `content/seed/` | `page-map.xlsx` (the 100-page map), generated JSON, prices, settings, authors |
| `content/learn/` | Article drafts in Markdown with front matter |
| `scripts/` | `seed-pages.ts`, `lint-content.ts` |

## Deploy (OVH, same pattern as docu10)

1. Node 22 and MongoDB on the server; create the database and a user.
2. `git clone`, `npm ci`, write `.env.local` from `.env.example` with real secrets (never commit it).
3. `npm run seed` once (upserts the page map; never overwrites non-draft pages), then `npm run build && npm start` under pm2 or systemd behind nginx with TLS.
4. System cron every 15 minutes: `curl -fsS -H "Authorization: Bearer $CRON_SECRET" https://ayurvedachalam.com/api/cron/publish`.
5. Deploy on push to `main`: the CI above must be green; the server pulls, `npm ci`, `npm run build`, restarts.
6. Staging: same app with `STAGING=1` (robots disallow all) and `PREVIEW_DRAFTS=1`, behind basic auth in nginx.

## Not built yet

`/cms` admin UI (B-15, B-16), owner notifications (B-25), booking embed configuration (B-21),
redirects admin, security CSP header (B-24), Lighthouse budget in CI (B-23). See `docs/tasks.md`.
