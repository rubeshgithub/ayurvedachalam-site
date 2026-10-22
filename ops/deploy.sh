#!/usr/bin/env bash
# Deploy on push to main (run by a webhook or by hand): pull, install, build, restart.
set -euo pipefail
cd /srv/ayurvedachalam-site
git fetch -q origin main && git reset -q --hard origin/main
npm ci --omit=dev --ignore-scripts=false
npm run build
sudo systemctl restart ayurvedachalam
echo "$(date -Is) deployed $(git rev-parse --short HEAD)"
