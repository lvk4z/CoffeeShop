#!/bin/bash
# ── setup-ssl.sh ─────────────────────────────────────────────────────────────
# Run ONCE on the Azure VM after first docker compose up.
# Gets a free Let's Encrypt certificate and switches nginx to HTTPS.
#
# Usage:
#   chmod +x setup-ssl.sh
#   ./setup-ssl.sh copijesz.com admin@copijesz.com
# ─────────────────────────────────────────────────────────────────────────────
set -e

DOMAIN="${1:-}"
EMAIL="${2:-}"

if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
    echo "Usage: ./setup-ssl.sh <domain> <email>"
    echo "  e.g. ./setup-ssl.sh copijesz.com admin@copijesz.com"
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "==> [1/5] Installing certbot..."
sudo apt-get update -qq
sudo apt-get install -y certbot

echo ""
echo "==> [2/5] Creating webroot directory for ACME challenge..."
sudo mkdir -p /var/www/certbot
sudo chmod 755 /var/www/certbot

echo ""
echo "==> [3/5] Starting nginx in HTTP mode (if not already running)..."
cd "$SCRIPT_DIR"
docker compose up -d nginx
sleep 3

echo ""
echo "==> [4/5] Obtaining SSL certificate for $DOMAIN..."
sudo certbot certonly \
    --webroot \
    --webroot-path /var/www/certbot \
    -d "$DOMAIN" \
    -d "www.$DOMAIN" \
    --non-interactive \
    --agree-tos \
    --email "$EMAIL" \
    --rsa-key-size 4096

echo ""
echo "==> [5/5] Switching nginx to HTTPS config..."
sed "s/DOMAIN/$DOMAIN/g" "$SCRIPT_DIR/nginx/nginx.ssl.conf" > "$SCRIPT_DIR/nginx/nginx.conf"
docker compose restart nginx

echo ""
echo "==> Setting up automatic certificate renewal (cron, every 12h)..."
CRON_CMD="0 */12 * * * certbot renew --quiet && docker compose -f $SCRIPT_DIR/docker-compose.yml restart nginx"
(crontab -l 2>/dev/null | grep -v "certbot renew"; echo "$CRON_CMD") | crontab -

echo ""
echo "========================================================"
echo " SSL setup complete!"
echo " https://$DOMAIN  is ready."
echo "========================================================"
