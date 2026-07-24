#!/usr/bin/env bash

# Update the current checkout and restart the production process.
set -Eeuo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$APP_DIR"

git pull
npm install
if [ -f package.json ]; then
  npm run migrate 2>/dev/null || true
fi
pm2 restart pdkd --update-env || pm2 start deployment/ecosystem.config.js
pm2 save
