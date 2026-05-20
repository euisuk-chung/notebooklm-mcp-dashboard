#!/usr/bin/env bash
# Manual launcher for macOS / Linux.
# Starts the FastAPI backend (port 8000) and the Vite frontend (port 5173)
# as detached background processes.
#
# Usage:
#   bash start-dashboard.sh
#   # or after `chmod +x start-dashboard.sh`:
#   ./start-dashboard.sh

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$REPO_ROOT/backend"
FRONTEND_DIR="$REPO_ROOT/frontend"
LOG_DIR="$REPO_ROOT/.logs"

mkdir -p "$LOG_DIR"

port_in_use() {
    if command -v lsof >/dev/null 2>&1; then
        lsof -nP -iTCP:"$1" -sTCP:LISTEN >/dev/null 2>&1
    else
        # Fallback: try connecting with bash's /dev/tcp
        (echo > "/dev/tcp/127.0.0.1/$1") >/dev/null 2>&1
    fi
}

# Backend ---------------------------------------------------------------------
if port_in_use 8000; then
    echo "[$(date '+%Y-%m-%dT%H:%M:%S')] backend skip: port 8000 already in use" \
        >> "$LOG_DIR/launcher.log"
else
    (
        cd "$BACKEND_DIR"
        nohup uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --app-dir src \
            > "$LOG_DIR/backend.log" 2> "$LOG_DIR/backend.err.log" < /dev/null &
    )
fi

# Frontend --------------------------------------------------------------------
if port_in_use 5173; then
    echo "[$(date '+%Y-%m-%dT%H:%M:%S')] frontend skip: port 5173 already in use" \
        >> "$LOG_DIR/launcher.log"
else
    (
        cd "$FRONTEND_DIR"
        nohup npm run dev \
            > "$LOG_DIR/frontend.log" 2> "$LOG_DIR/frontend.err.log" < /dev/null &
    )
fi

echo "Dashboard launched."
echo "  Frontend: http://localhost:5173/"
echo "  Backend : http://localhost:8000/"
echo "  Logs    : $LOG_DIR"
