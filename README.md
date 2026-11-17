# ayurvedachalam-site

The website for Ayurvedachalam (ayurvedachalam.ca): Next.js 16 (App Router), TypeScript,
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
| `npm run check:pages` | Against a running server: one H1, title, meta, canonical, JSON-LD, disclaimer, no "Dr." |
| Lighthouse | CI runs `@lhci/cli` on three URLs with the budget in `lighthouserc.json` |

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

## Deploy (OVH, shared server, nginx in front, Cloudflare DNS)

**Once**, as a sudo user on the server:

```bash
curl -fsSL https://raw.githubusercontent.com/rubeshgithub/ayurvedachalam-site/main/ops/server-setup.sh -o server-setup.sh
sudo PORT=3010 bash server-setup.sh
```

It installs Node 22 and MongoDB if missing, creates the `ayur` user, clones to `/srv/ayurvedachalam-site`,
writes `.env.local` with generated secrets, builds, installs the systemd service, the nginx vhost for
`ayurvedachalam.ca`, the publish and backup cron lines, and a deploy key restricted to `ops/deploy.sh`.
At the end it prints the GitHub secrets to copy (once). Then add the Cloudflare Origin Certificate to
`/etc/ssl/ayurvedachalam.ca/` and `nginx -t && systemctl reload nginx`, and create the first CMS user.

**Every push to `main`**: the `CI` workflow runs; if green, the `Deploy` workflow SSHes in with the deploy
key and the server runs `ops/deploy.sh` (pull, install, seed, build, restart, health check). Secrets on the
site repo: `DEPLOY_SSH_HOST`, `DEPLOY_SSH_USER`, `DEPLOY_SSH_KEY`.

The site starts **private**: `STAGING=1` (robots disallow) and `STAGING_PASSWORD` (basic auth) in
`.env.local`. When the real address is in and the owner says go, remove those two lines and
`PREVIEW_DRAFTS=1`, restart, and the site is public.

## Server files

`ops/` holds `server-setup.sh` (one-time), `deploy.sh` (every push), and `backup.sh` (mongodump + media, 30-day rotation; cron is installed by setup). Uploaded media lives in `MEDIA_DIR` (default `data/media`, git-ignored); set `STAGING_PASSWORD` on staging to gate the whole site behind basic auth; set `SMTP_URL` and `CONTACT_TO` for owner notifications.

## Not built yet

Booking embed configuration (B-21, waits on the booking tool). See `docs/tasks.md`.

## CMS

`/cms` — email + password + authenticator code. Pages: fields, blocks as JSON, FAQ, summary box;
publishing runs the compliance linter. Articles: queue by status with lint results; publish now,
schedule, send back, reject. Settings: NAP, hours, booking URL, publish mode and hold, required
notices, price book. Media: uploads with required alt text. Redirects: 301s, no chains. "Preview" opens drafts through Next draft mode.
