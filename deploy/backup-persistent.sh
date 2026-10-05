#!/bin/bash
# Runs ON the VPS itself via cron — archives persistent/ into a local,
# rotating backup dir on the same box. This is a *fast local restore point*
# (accidental delete/corruption in persistent/), not a replacement for
# scripts/backup-persistent.ps1's off-server copy (that one protects against
# losing the VPS itself) — keep running both.
#
# Lives at /var/www/hammasir/persistent/backup-persistent.sh on the server
# (persistent/ is never touched by a deploy, so it survives every release —
# see deploy/README.md) — this copy in the repo is the source of truth to
# re-copy from if it's ever lost, not something a deploy re-ships on its own.
set -euo pipefail

APP_DIR="/var/www/hammasir"
BACKUP_DIR="/var/backups/hammasir"
KEEP_COUNT=14

mkdir -p "$BACKUP_DIR"
stamp=$(date +%Y-%m-%d_%H%M)
tar -czf "$BACKUP_DIR/hammasir-persistent-$stamp.tar.gz" -C "$APP_DIR" persistent

# Prune, keeping only the newest $KEEP_COUNT archives.
ls -1t "$BACKUP_DIR"/hammasir-persistent-*.tar.gz | tail -n "+$((KEEP_COUNT + 1))" | xargs -r rm -f

echo "Backed up to $BACKUP_DIR/hammasir-persistent-$stamp.tar.gz"
