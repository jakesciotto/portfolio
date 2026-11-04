#!/usr/bin/env bash
set -uo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO"

if [ -f .env.local ]; then
  set -a
  . ./.env.local
  set +a
fi

export OBSIDIAN_VAULT_PATH="${OBSIDIAN_VAULT_PATH:-$HOME/github/obsidian}"
NODE="$(command -v node)"
status=0

echo "=== $(date) refresh start ==="

if GIT_TERMINAL_PROMPT=0 git -C "$OBSIDIAN_VAULT_PATH" pull --ff-only --quiet; then
  "$NODE" scripts/import-obsidian-data.mjs || { echo "obsidian import failed" >&2; status=1; }
else
  echo "obsidian: git pull --ff-only failed in $OBSIDIAN_VAULT_PATH, snapshot not refreshed" >&2
  status=1
fi

"$NODE" scripts/import-strava-data.mjs || { echo "strava import failed" >&2; status=1; }

echo "=== $(date) refresh done (status $status) ==="
exit "$status"
