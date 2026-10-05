#!/usr/bin/env bash
#
# Points a freshly-uploaded release at persistent/ and refuses to finish if
# even one link is wrong.
#
# Runs ON the VPS:
#   bash deploy/link-persistent.sh /var/www/hammasir/releases/$RELEASE
#
# Replaces the hand-typed rm+ln pairs the deploy README used to carry. Two
# separate incidents came from running those by hand: one entry drifting out
# of the list, and `ln -s` nesting a link inside a directory it failed to
# replace. Both were silent — the app kept serving, writing to the wrong
# place. This script reads every entry from deploy/persistent-manifest.txt so
# nothing can drift, and verifies the result so nothing can be silent.

set -euo pipefail

RELEASE_DIR="${1:-}"
PERSISTENT_DIR="${2:-/var/www/hammasir/persistent}"

if [ -z "$RELEASE_DIR" ]; then
  echo "usage: $0 <release-dir> [persistent-dir]" >&2
  exit 2
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MANIFEST="$SCRIPT_DIR/persistent-manifest.txt"

[ -d "$RELEASE_DIR" ]    || { echo "release dir not found: $RELEASE_DIR" >&2; exit 1; }
[ -d "$PERSISTENT_DIR" ] || { echo "persistent dir not found: $PERSISTENT_DIR" >&2; exit 1; }
[ -f "$MANIFEST" ]       || { echo "manifest not found: $MANIFEST" >&2; exit 1; }

linked=0

# Trailing `|| [ -n "$line" ]` so a final line without a newline is still read.
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

  if [ ! -e "$dest" ]; then
    echo "MISSING in persistent/: $target" >&2
    echo "  create it first — see 'One-time server setup' in deploy/README.md" >&2
    exit 1
  fi

  mkdir -p "$(dirname "$link")"

  # The rm is what makes this safe. `ln -s` onto an existing directory does
  # not replace it — it drops the link inside instead, leaving the stale
  # directory as the path the app actually uses.
  case "$kind" in
    dir)  rm -rf "$link" ;;
    file) rm -f  "$link" ;;
    *)    echo "unknown kind '$kind' for $rel" >&2; exit 1 ;;
  esac

  ln -s "$dest" "$link"
  linked=$((linked + 1))
done < "$MANIFEST"

echo "linked $linked path(s)"

# Never leave a release half-linked: verify before the caller swaps it live.
bash "$SCRIPT_DIR/verify-persistent.sh" "$RELEASE_DIR" "$PERSISTENT_DIR"
