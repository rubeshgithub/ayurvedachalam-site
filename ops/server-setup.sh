#!/usr/bin/env bash
# One-time server setup for ayurvedachalam.ca on a shared OVH box (Ubuntu/Debian, nginx front door).
# Run once as a sudo-capable user:   sudo bash server-setup.sh
# Idempotent: safe to re-run. Nothing here prints or stores a secret you did not create yourself.
#
# What it does
#  1. Node 22 (NodeSource) if missing; MongoDB 7 if missing (local, bound to 127.0.0.1)
#  2. System user `ayur`, app at /srv/ayurvedachalam-site, media at /srv/ayurvedachalam-media, backups at /srv/backups/ayurvedachalam
#  3. Mongo database + user with a generated password, written only to .env.local (chmod 600)
#  4. .env.local with generated SESSION_SECRET, INGEST_KEY, CRON_SECRET (printed ONCE for you to copy into GitHub secrets)
#  5. Clone, install, seed, build; systemd service on PORT (default 3010); nginx vhost for the domain; cron for publish + backup
#  6. A dedicated deploy key for GitHub Actions (private key printed ONCE; add as repo secret DEPLOY_SSH_KEY)
set -euo pipefail

DOMAIN="${DOMAIN:-ayurvedachalam.ca}"
REPO="${REPO:-https://github.com/rubeshgithub/ayurvedachalam-site.git}"
APP_DIR="${APP_DIR:-/srv/ayurvedachalam-site}"
MEDIA_DIR="${MEDIA_DIR:-/srv/ayurvedachalam-media}"
BACKUP_DIR="${BACKUP_DIR:-/srv/backups/ayurvedachalam}"
APP_USER="${APP_USER:-ayur}"
PORT="${PORT:-3010}"
DB_NAME="${DB_NAME:-ayurvedachalam}"

say() { printf '\n\033[1;32m==> %s\033[0m\n' "$*"; }
need_root() { [ "$(id -u)" -eq 0 ] || { echo "run with sudo"; exit 1; }; }
need_root

say "1/6 Runtime: Node 22 and MongoDB"
if ! command -v node >/dev/null || [ "$(node -v | cut -c2-3)" -lt 22 ]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi
node -v
if ! command -v mongod >/dev/null; then
  . /etc/os-release
  curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
  if [ "$ID" = "ubuntu" ]; then
    echo "deb [signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg] https://repo.mongodb.org/apt/ubuntu ${VERSION_CODENAME}/mongodb-org/7.0 multiverse" > /etc/apt/sources.list.d/mongodb-org-7.0.list
  else
    echo "deb [signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg] https://repo.mongodb.org/apt/debian ${VERSION_CODENAME}/mongodb-org/7.0 main" > /etc/apt/sources.list.d/mongodb-org-7.0.list
  fi
  apt-get update && apt-get install -y mongodb-org
  systemctl enable --now mongod
fi
mongod --version | head -1
apt-get install -y nginx git curl >/dev/null

say "2/6 User and folders"
id -u "$APP_USER" >/dev/null 2>&1 || useradd --system --create-home --shell /bin/bash "$APP_USER"
mkdir -p "$APP_DIR" "$MEDIA_DIR" "$BACKUP_DIR"
chown -R "$APP_USER:$APP_USER" "$APP_DIR" "$MEDIA_DIR" "$BACKUP_DIR"

say "3/6 Database user"
DB_PASS="$(openssl rand -hex 24)"
mongosh --quiet --eval "
  const db = db.getSiblingDB('$DB_NAME');
  if (!db.getUser('$APP_USER')) { db.createUser({ user: '$APP_USER', pwd: '$DB_PASS', roles: [{ role: 'readWrite', db: '$DB_NAME' }] }); print('db user created'); }
  else { db.updateUser('$APP_USER', { pwd: '$DB_PASS' }); print('db user password rotated'); }
"
# Enable auth once a user exists (bind stays 127.0.0.1)
if ! grep -q "authorization: enabled" /etc/mongod.conf; then
  printf '\nsecurity:\n  authorization: enabled\n' >> /etc/mongod.conf
  systemctl restart mongod
fi

say "4/6 Code and environment"
if [ ! -d "$APP_DIR/.git" ]; then
  sudo -u "$APP_USER" git clone -q "$REPO" "$APP_DIR"
else
  sudo -u "$APP_USER" git -C "$APP_DIR" pull -q
fi
ENV="$APP_DIR/.env.local"
if [ ! -f "$ENV" ]; then
  SESSION_SECRET="$(openssl rand -hex 32)"; INGEST_KEY="$(openssl rand -hex 24)"; CRON_SECRET="$(openssl rand -hex 24)"
  cat > "$ENV" <<EOF
MONGODB_URI=mongodb://$APP_USER:$DB_PASS@127.0.0.1:27017/$DB_NAME?authSource=$DB_NAME
SITE_URL=https://$DOMAIN
PORT=$PORT
SESSION_SECRET=$SESSION_SECRET
INGEST_KEY=$INGEST_KEY
CRON_SECRET=$CRON_SECRET
MEDIA_DIR=$MEDIA_DIR
BACKUP_DIR=$BACKUP_DIR
BOOKING_URL=https://example.janeapp.com
BOOKING_EMBED_URL=
GA4_ID=
INDEXNOW_KEY=
SMTP_URL=
MAIL_FROM=Ayurvedachalam <no-reply@$DOMAIN>
CONTACT_TO=
# Until the real address exists the site stays private: basic-auth gate + robots disallow (rules.md R3.8)
STAGING=1
STAGING_PASSWORD=$(openssl rand -base64 12 | tr -d '/+=' | cut -c1-14)
PREVIEW_DRAFTS=1
EOF
  chown "$APP_USER:$APP_USER" "$ENV"; chmod 600 "$ENV"
  echo "wrote $ENV"
else
  sed -i "s#^MONGODB_URI=.*#MONGODB_URI=mongodb://$APP_USER:$DB_PASS@127.0.0.1:27017/$DB_NAME?authSource=$DB_NAME#" "$ENV"
  echo "kept existing $ENV (database password updated)"
fi
sudo -u "$APP_USER" bash -c "cd '$APP_DIR' && npm ci --no-audit --no-fund && set -a && . ./.env.local && set +a && npm run seed && npm run build"

say "5/6 systemd, nginx, cron"
cat > /etc/systemd/system/ayurvedachalam.service <<EOF
[Unit]
Description=Ayurvedachalam site (Next.js)
After=network.target mongod.service
[Service]
WorkingDirectory=$APP_DIR
EnvironmentFile=$ENV
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm start -- -p $PORT
Restart=always
User=$APP_USER
Group=$APP_USER
[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload && systemctl enable --now ayurvedachalam && sleep 3 && systemctl --no-pager --lines=0 status ayurvedachalam | head -3

cat > /etc/nginx/sites-available/$DOMAIN <<EOF
# Cloudflare sits in front (proxied). SSL mode on Cloudflare: "Full (strict)" with an Origin Certificate
# placed at the two paths below, or run certbot for Let's Encrypt and point these at its files.
server {
  listen 80; listen [::]:80;
  server_name $DOMAIN www.$DOMAIN;
  return 301 https://$DOMAIN\$request_uri;
}
server {
  listen 443 ssl http2; listen [::]:443 ssl http2;
  server_name $DOMAIN www.$DOMAIN;
  ssl_certificate     /etc/ssl/$DOMAIN/origin.pem;
  ssl_certificate_key /etc/ssl/$DOMAIN/origin.key;
  if (\$host = www.$DOMAIN) { return 301 https://$DOMAIN\$request_uri; }
  client_max_body_size 15m;
  location / {
    proxy_pass http://127.0.0.1:$PORT;
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
    proxy_set_header CF-Connecting-IP \$http_cf_connecting_ip;
    proxy_read_timeout 60s;
  }
}
EOF
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/$DOMAIN
mkdir -p /etc/ssl/$DOMAIN
if [ ! -f /etc/ssl/$DOMAIN/origin.pem ]; then
  echo "NOTE: no origin certificate yet at /etc/ssl/$DOMAIN/origin.pem — nginx will not reload until you add it (Cloudflare → SSL/TLS → Origin Server → Create Certificate; paste cert to origin.pem, key to origin.key, chmod 600 origin.key), then: nginx -t && systemctl reload nginx"
else
  nginx -t && systemctl reload nginx
fi

( crontab -u "$APP_USER" -l 2>/dev/null | grep -v 'ayurvedachalam' ; cat <<EOF
*/15 * * * * . $ENV; curl -fsS -H "Authorization: Bearer \$CRON_SECRET" http://127.0.0.1:$PORT/api/cron/publish > /dev/null   # ayurvedachalam publish
15 3 * * *   . $ENV; MEDIA_DIR=$MEDIA_DIR BACKUP_DIR=$BACKUP_DIR $APP_DIR/ops/backup.sh >> /var/log/ayurvedachalam-backup.log 2>&1   # ayurvedachalam backup
EOF
) | crontab -u "$APP_USER" -
touch /var/log/ayurvedachalam-backup.log && chown "$APP_USER" /var/log/ayurvedachalam-backup.log
# deploy.sh needs to restart the service without a password
echo "$APP_USER ALL=(root) NOPASSWD: /bin/systemctl restart ayurvedachalam, /bin/systemctl status ayurvedachalam" > /etc/sudoers.d/ayurvedachalam && chmod 440 /etc/sudoers.d/ayurvedachalam

say "6/6 Deploy key for GitHub Actions"
sudo -u "$APP_USER" mkdir -p "/home/$APP_USER/.ssh" && chmod 700 "/home/$APP_USER/.ssh"
KEY="/home/$APP_USER/.ssh/github-deploy"
if [ ! -f "$KEY" ]; then
  sudo -u "$APP_USER" ssh-keygen -q -t ed25519 -N "" -C "github-actions-deploy@$DOMAIN" -f "$KEY"
  # restrict the key to the deploy script only
  echo "command=\"$APP_DIR/ops/deploy.sh\",no-port-forwarding,no-agent-forwarding,no-X11-forwarding,no-pty $(cat $KEY.pub)" >> "/home/$APP_USER/.ssh/authorized_keys"
  chmod 600 "/home/$APP_USER/.ssh/authorized_keys"; chown "$APP_USER:$APP_USER" "/home/$APP_USER/.ssh/authorized_keys"
fi

say "DONE. Copy these into GitHub now; they are not shown again."
echo "---- Site repo → Settings → Secrets → Actions ----"
echo "DEPLOY_SSH_HOST = $(curl -s -4 ifconfig.me || hostname -I | awk '{print $1}')"
echo "DEPLOY_SSH_USER = $APP_USER"
echo "DEPLOY_SSH_KEY  = (the private key below, all lines)"
cat "$KEY"
echo "---- Relay repo → Settings → Secrets → Actions ----"
echo "SITE_URL   = https://$DOMAIN"
echo "INGEST_KEY = $(grep ^INGEST_KEY= "$ENV" | cut -d= -f2)"
echo "---- Staging gate (site is private until the address is in) ----"
echo "user: anything   password: $(grep ^STAGING_PASSWORD= "$ENV" | cut -d= -f2)"
echo
echo "Next: create the first CMS user:"
echo "  sudo -u $APP_USER bash -c 'cd $APP_DIR && set -a && . ./.env.local && set +a && npx tsx scripts/create-user.ts you@example.com \"Your Name\" owner'"
