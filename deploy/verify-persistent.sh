#!/usr/bin/env bash
#
# Checks that a release really is pointed at persistent/ — every manifest
# entry must be a symlink, resolving to the right place, with the target
# present. Run it after linking, and any time you suspect a release is
# writing to the wrong place:
#
#   bash deploy/verify-persistent.sh /var/www/hammasir/current
#
# Exits non-zero on the first problem so a deploy script can stop before
# swapping the release live.

set -uo pipefail

RELEASE_DIR="${1:-}"
PERSISTENT_DIR="${2:-/var/www/hammasir/persistent}"

if [ -z "$RELEASE_DIR" ]; then
  echo "usage: $0 <release-dir> [persistent-dir]" >&2
  exit 2
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MANIFEST="$SCRIPT_DIR/persistent-manifest.txt"
[ -f "$MANIFEST" ] || { echo "manifest not found: $MANIFEST" >&2; exit 1; }

problems=0
checked=0

report() {
  echo "  FAIL  $1"
  echo "        $2"
  problems=$((problems + 1))
}

while IFS= read -r line || [ -n "$line" ]; do
  line="${line%%#*}"
  [ -z "${line// }" ] && continue

  IFS='|' read -r kind rel target <<< "$line"
  kind="$(echo "$kind" | xargs)"
  rel="$(echo "$rel" | xargs)"
  target="$(echo "$target" | xargs)"

  [ "$kind" = "read" ] && continue

  link="$RELEASE_DIR/$rel"
  dest="$PERSISTENT_DIR/$target"
  checked=$((checked + 1))

  if [ ! -e "$link" ] && [ ! -L "$link" ]; then
    report "$rel" "does not exist — the deploy never linked it"
    continue
  fi

  # The failure that bit this project: a real directory sits here and the
  # link ended up nested inside it, so the app reads and writes the stale
  # build-time copy while everything looks fine.
  if [ ! -L "$link" ]; then
    report "$rel" "is a real $( [ -d "$link" ] && echo directory || echo file ), not a symlink — the app is writing to the release, and this data dies on the next deploy"
    continue
  fi

  actual="$(readlink "$link")"
  if [ "$actual" != "$dest" ]; then
    report "$rel" "points at '$actual' instead of '$dest'"
    continue
  fi

  if [ ! -e "$dest" ]; then
    report "$rel" "link target '$dest' does not exist"
    continue
  fi

  echo "  ok    $rel -> $target"
done < "$MANIFEST"

echo
if [ "$problems" -gt 0 ]; then
  echo "$problems of $checked persistent path(s) are WRONG — do not swap this release live."
  exit 1
fi

echo "all $checked persistent path(s) verified."
