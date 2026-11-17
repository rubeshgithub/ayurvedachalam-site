#!/usr/bin/env bash
# Daily backup of MongoDB (Docker container) and uploaded media, kept 30 days (architecture.md §10).
# Installed in the ayur user's crontab by server-setup.sh:  15 3 * * *  ops/backup.sh
set -euo pipefail
BACKUP_DIR="${BACKUP_DIR:-/srv/backups/ayurvedachalam}"
MEDIA_DIR="${MEDIA_DIR:-/srv/ayurvedachalam-media}"
MONGO_CONTAINER="${MONGO_CONTAINER:-ayur-mongo}"
: "${MONGODB_URI:?set MONGODB_URI}"
# The URI points at 127.0.0.1:<host port>; inside the container the server listens on 27017.
IN_CONTAINER_URI="$(echo "$MONGODB_URI" | sed -E 's#@127\.0\.0\.1:[0-9]+/#@127.0.0.1:27017/#')"
STAMP="$(date +%Y-%m-%d_%H%M)"
mkdir -p "$BACKUP_DIR"
docker exec "$MONGO_CONTAINER" mongodump --uri="$IN_CONTAINER_URI" --archive --gzip > "$BACKUP_DIR/db-$STAMP.archive.gz"
tar -czf "$BACKUP_DIR/media-$STAMP.tgz" -C "$(dirname "$MEDIA_DIR")" "$(basename "$MEDIA_DIR")" 2>/dev/null || true
find "$BACKUP_DIR" -type f -mtime +30 -delete
echo "$(date -Is) backup ok: db-$STAMP.archive.gz, media-$STAMP.tgz"
# Restore test (quarterly):  docker exec -i ayur-mongo mongorestore --uri="<uri of a scratch db>" --archive --gzip --drop < db-<stamp>.archive.gz
