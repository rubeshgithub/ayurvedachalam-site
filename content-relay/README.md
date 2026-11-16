# content-relay

The hand-off between the scheduled article task and the site's CMS (architecture.md §7), kept
inside the site repo by the owner's decision (D-21). The task pushes a payload here; the
`Relay articles to CMS` Action (`.github/workflows/relay.yml`) POSTs it to the site.

```
scheduled task ──push content-relay/inbox/<slug>.json──► main ──Action POSTs──► $SITE_URL/api/cms/ingest
                                                            ▲                         │
                                                            └── "relay: delivered …" ◄┘  (file removed, delivered.log appended)
```

| Path | Purpose |
| --- | --- |
| `queue.md` | The article queue (24 seeded rows) and publishing log. The task edits it; humans may too. |
| `inbox/` | One payload per article, schema 1 (`examples/payload-schema-1.json`). Deleted by the Action on delivery. |
| `delivered.log` | Append-only record of deliveries. |
| `runbook/` | `rules.md`, `product.md` (refresh from `docs/` when they change) and `task-prompt.md`. |

## Secrets (repo → Settings → Secrets and variables → Actions)

`SITE_URL` (`https://ayurvedachalam.com`, or staging for a dry run) and `INGEST_KEY` (the same
value as the site's `INGEST_KEY` environment variable; rotate every 90 days).

## The task's token

A fine-grained GitHub token for this repo only, Contents read/write. Because the relay lives in
the site repo, the token can technically reach the code; the task prompt forbids changes outside
`content-relay/`, CI runs on every push to code, and the owner reviews the commit list. Keep the
token out of every document and chat.

## Result codes

| HTTP | Meaning | Action does |
| --- | --- | --- |
| 201 / 200 | stored / duplicate payload | log, delete the file, commit |
| 409 | slug already exists | leaves the file; the task picks a new slug |
| 422 | invalid payload | leaves the file; read the response in the Action log |
| 401 | wrong key | leaves the file; fix the secret |
| 5xx / 000 | site unreachable | leaves the file; re-run the workflow when the site is back |

The site's `CI` workflow ignores this folder, so a relay commit does not trigger a build.

## Dry run

Point the secrets at staging, copy `examples/payload-schema-1.json` to `inbox/dry-run-<date>.json`
with a real 1,000-word body and the slug changed, push, and expect HTTP 201 with `status: review`.
Reject the article in the staging CMS afterwards.
