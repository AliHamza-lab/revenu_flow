#!/bin/bash
# =============================================================================
# RevenuFlow — Full EC2 Server Setup Script
# Run once from: /home/ubuntu/djangoapp
# Usage: bash backend/scripts/setup_server.sh
# =============================================================================
set -e

APP_DIR="/home/ubuntu/djangoapp"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"
VENV_DIR="$APP_DIR/venv"

echo ""
echo "============================================="
echo " RevenuFlow — EC2 Server Setup"
echo "============================================="
echo ""

# ── Step 1: Pull latest code (handle dirty db.sqlite3) ────────────────────────
echo "[1/9] Pulling latest code from GitHub..."
cd "$APP_DIR"
git stash --include-untracked 2>/dev/null || true   # stash local changes (db etc)
git pull origin main

# ── Step 2: Install system packages ───────────────────────────────────────────
echo "[2/9] Installing system packages (nginx, nodejs)..."
sudo apt-get update -qq
sudo apt-get install -y nginx

# Install Node.js 20 if not present or too old
NODE_VERSION=$(node --version 2>/dev/null | cut -d'v' -f2 | cut -d'.' -f1 || echo "0")
if [ "$NODE_VERSION" -lt 18 ] 2>/dev/null; then
    echo "  Installing Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "  Node.js $NODE_VERSION already installed."
fi

# ── Step 3: Python virtual environment + dependencies ─────────────────────────
echo "[3/9] Setting up Python venv and installing dependencies..."
cd "$APP_DIR"
python3 -m venv "$VENV_DIR"
source "$VENV_DIR/bin/activate"
pip install --upgrade pip -q
pip install -r "$BACKEND_DIR/requirements.txt" -q
echo "  Python deps installed."

# ── Step 4: Build React frontend ───────────────────────────────────────────────
echo "[4/9] Building React frontend..."
cd "$FRONTEND_DIR"
npm install --silent
npm run build
echo "  Frontend built at $FRONTEND_DIR/dist"

# ── Step 5: Django setup ───────────────────────────────────────────────────────
echo "[5/9] Running Django migrate + collectstatic..."
cd "$BACKEND_DIR"
source "$VENV_DIR/bin/activate"
python manage.py migrate --noinput
python manage.py collectstatic --noinput
echo "  Django setup complete."

# ── Step 6: Install Gunicorn systemd service ───────────────────────────────────
echo "[6/9] Installing Gunicorn systemd service..."
sudo cp "$BACKEND_DIR/scripts/gunicorn.service" /etc/systemd/system/gunicorn.service
sudo systemctl daemon-reload
sudo systemctl enable gunicorn
sudo systemctl restart gunicorn
echo "  Gunicorn service installed and running."

# ── Step 7: Configure Nginx ────────────────────────────────────────────────────
echo "[7/9] Configuring Nginx..."
sudo cp "$BACKEND_DIR/scripts/nginx.conf" /etc/nginx/sites-available/revenuflow
sudo ln -sf /etc/nginx/sites-available/revenuflow /etc/nginx/sites-enabled/revenuflow
# Remove default nginx site if present
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl restart nginx
echo "  Nginx configured."

# ── Step 8: Fix permissions ────────────────────────────────────────────────────
echo "[8/9] Fixing file permissions..."
sudo chown -R ubuntu:www-data "$APP_DIR"
sudo chmod -R 755 "$BACKEND_DIR/staticfiles" 2>/dev/null || true
sudo chmod -R 755 "$BACKEND_DIR/media" 2>/dev/null || true

# ── Step 9: Status report ─────────────────────────────────────────────────────
echo "[9/9] Checking service status..."
echo ""
sudo systemctl status gunicorn --no-pager -l | head -20
echo ""
sudo systemctl status nginx --no-pager -l | head -10
echo ""
echo "============================================="
echo " Setup complete!"
echo " App should be live at: http://44.195.33.227"
echo "============================================="
