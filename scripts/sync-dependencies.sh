#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel)"
cd "$ROOT_DIR"

if [[ ! -f "pnpm-lock.yaml" || ! -f "package.json" ]]; then
    exit 0
fi

if command -v vp >/dev/null 2>&1; then
    SYNC_CMD="vp install --frozen-lockfile"
elif [ -x "$ROOT_DIR/node_modules/.bin/vp" ]; then
    SYNC_CMD="$ROOT_DIR/node_modules/.bin/vp install --frozen-lockfile"
elif command -v pnpm >/dev/null 2>&1; then
    SYNC_CMD="pnpm install --frozen-lockfile"
elif command -v npx >/dev/null 2>&1; then
    SYNC_CMD="npx vp install --frozen-lockfile"
else
    echo "ERROR: neither vp, pnpm, nor npx is installed. Install Vite+ or pnpm, then run: vp install --frozen-lockfile" >&2
    exit 1
fi

echo "Synchronizing project dependencies with pnpm-lock.yaml..."
$SYNC_CMD
echo "Dependencies are synchronized."
