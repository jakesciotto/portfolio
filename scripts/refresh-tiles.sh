#!/usr/bin/env bash
# Refreshes the Obsidian + Strava Redis snapshots consumed by the portfolio tiles.
# Invoked daily by launchd (com.jakesciotto.portfolio-tiles.plist).
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO"

if [ -f .env.local ]; then
  set -a
  . ./.env.local
  set +a
fi

NODE="$(command -v node)"
echo "=== $(date) refresh start ==="
"$NODE" scripts/import-obsidian-data.mjs
"$NODE" scripts/import-strava-data.mjs
echo "=== $(date) refresh done ==="
