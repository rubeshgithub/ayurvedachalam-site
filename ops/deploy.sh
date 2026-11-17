#!/usr/bin/env bash
# Deploy on push to main. Invoked by GitHub Actions over SSH (the deploy key is restricted to this
# script via authorized_keys command=), or by hand:  sudo -u ayur /srv/ayurvedachalam-site/ops/deploy.sh
set -euo pipefail
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$APP_DIR"
set -a; . ./.env.local; set +a
echo "$(date -Is) deploy start on $(hostname)"
git fetch -q origin main
git reset -q --hard origin/main
npm ci --no-audit --no-fund
npm run seed            # upserts the page map; never overwrites published records
npm run build
sudo /bin/systemctl restart ayurvedachalam
sleep 4
curl -fsS -o /dev/null -u "x:${STAGING_PASSWORD:-}" "http://127.0.0.1:${PORT:-3010}/" && echo "$(date -Is) deployed $(git rev-parse --short HEAD) OK" || { echo "health check failed"; sudo /bin/systemctl status ayurvedachalam --no-pager | tail -20; exit 1; }
