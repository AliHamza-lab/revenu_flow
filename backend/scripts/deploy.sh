#!/bin/bash
set -e  # Exit immediately on any error

APP_DIR="/home/ubuntu/djangoapp"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"

echo "=== [1/7] Setting working directory ==="
cd "$APP_DIR"

echo "=== [2/7] Setting up Python virtual environment ==="
python3 -m venv venv
source venv/bin/activate

echo "=== [3/7] Installing Python dependencies ==="
pip install --upgrade pip
pip install -r backend/requirements.txt

echo "=== [4/7] Building React frontend ==="
cd "$FRONTEND_DIR"
# Install Node deps if not cached
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run build

echo "=== [5/7] Django: migrate + collectstatic ==="
cd "$BACKEND_DIR"
source "$APP_DIR/venv/bin/activate"
python manage.py migrate --noinput
python manage.py collectstatic --noinput

echo "=== [6/7] Restarting Gunicorn ==="
sudo systemctl restart gunicorn

echo "=== [7/7] Restarting Nginx ==="
sudo systemctl restart nginx

echo "=== Deployment complete! ==="
