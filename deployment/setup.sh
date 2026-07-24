#!/usr/bin/env bash

# Provision the host and configure this checkout for production use on Ubuntu 24.04 LTS.
set -Eeuo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SITE_NAME="pdkd"
DEPLOY_USER="${SUDO_USER:-$(id -un)}"
DEPLOY_HOME="$(getent passwd "$DEPLOY_USER" | cut -d: -f6)"

if [[ -z "$DEPLOY_HOME" ]]; then
  echo "Could not determine the home directory for $DEPLOY_USER." >&2
  exit 1
fi

if ! command -v sudo >/dev/null 2>&1; then
  echo "sudo is required to provision system packages and Nginx." >&2
  exit 1
fi

echo "Installing required system packages..."
sudo apt-get update
sudo apt-get install -y curl ca-certificates nginx

if ! command -v git >/dev/null 2>&1; then
  sudo apt-get install -y git
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Installing the current Node.js LTS release..."
  curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

if ! command -v npm >/dev/null 2>&1; then
  sudo apt-get install -y npm
fi

echo "Installing PM2..."
sudo npm install --global pm2

echo "Configuring Nginx..."
sudo install -m 0644 "$APP_DIR/deployment/nginx.conf" \
  "/etc/nginx/sites-available/$SITE_NAME"
sudo ln -sfn "/etc/nginx/sites-available/$SITE_NAME" \
  "/etc/nginx/sites-enabled/$SITE_NAME"
# This deployment is intended to be the host's HTTP site. Remove Ubuntu's
# placeholder site so the catch-all server block below receives traffic.
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl enable --now nginx
sudo systemctl reload nginx

echo "Preparing the application..."
mkdir -p "$APP_DIR/uploads"
cd "$APP_DIR"
npm install

if [[ ! -f "$APP_DIR/.env" ]]; then
  echo "Warning: .env is missing. Copy .env.production.example to .env and set secure values."
fi

echo "Configuring PM2 startup for $DEPLOY_USER..."
sudo env PATH="$PATH" pm2 startup systemd -u "$DEPLOY_USER" --hp "$DEPLOY_HOME"

if pm2 describe "$SITE_NAME" >/dev/null 2>&1; then
  pm2 restart "$SITE_NAME" --update-env
else
  pm2 start "$APP_DIR/deployment/ecosystem.config.js"
fi
pm2 save

echo "Success: Pyaru Didi Ki Dukan is running through PM2 and Nginx."
