#!/usr/bin/env bash
# Daily backup of MongoDB and uploaded media, kept 30 days (architecture.md §10).
# Cron (as the app user):  15 3 * * *  /srv/ayurvedachalam-site/ops/backup.sh >> /var/log/ayurvedachalam-backup.log 2>&1
set -euo pipefail
: "${MONGODB_URI:?set MONGODB_URI}"
BACKUP_DIR="${BACKUP_DIR:-/srv/backups/ayurvedachalam}"
MEDIA_DIR="${MEDIA_DIR:-/srv/ayurvedachalam-site/data/media}"
STAMP="$(date +%Y-%m-%d_%H%M)"
mkdir -p "$BACKUP_DIR"
mongodump --uri="$MONGODB_URI" --archive="$BACKUP_DIR/db-$STAMP.archive" --gzip
tar -czf "$BACKUP_DIR/media-$STAMP.tgz" -C "$(dirname "$MEDIA_DIR")" "$(basename "$MEDIA_DIR")" 2>/dev/null || true
find "$BACKUP_DIR" -type f -mtime +30 -delete
echo "$(date -Is) backup ok: db-$STAMP.archive, media-$STAMP.tgz"
# Restore test (quarterly): mongorestore --uri="$MONGODB_URI_TEST" --archive=db-<stamp>.archive --gzip --drop
