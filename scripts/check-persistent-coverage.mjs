/**
 * Fails the build when the app writes to a path that deploy/persistent-manifest.txt
 * doesn't cover.
 *
 *   node scripts/check-persistent-coverage.mjs
 *
 * This is the automated version of the warning in deploy/README.md: "If you add
 * a new src/data/*.json file or directory that the app writes to at runtime, add
 * its symlink here immediately — don't rely on remembering it next release."
 * Relying on remembering is exactly what failed twice, and it failed silently
 * both times — the release ships, the app writes to its own directory, and the
 * data disappears at the next deploy with nothing in the logs.
 *
 * It scans for two ways a runtime path is declared in this codebase:
 *
 *   - `path.join(process.cwd(), "…")` literals — the VPS-era convention.
 *   - bare relative-path literals passed to lib/storage.ts
 *     ("src/data/…", "public/mentors/portal/…") — the Cloudflare/R2-era
 *     convention, where the same paths are R2 bucket keys.
 *
 * Every one must be either linked into persistent/ or explicitly marked
 * `read` in the manifest.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const MANIFEST = path.join(ROOT, 'deploy', 'persistent-manifest.txt');
const SCAN_DIRS = ['src'];
const EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.mjs']);

/** `path.join(process.cwd(), "src/data/x.json")` — captures the literal. */
const CWD_PATH = /process\.cwd\(\)\s*,\s*["'`]([^"'`]+)["'`]/g;

/** bare storage keys like "src/data/studentBookings.json" or
 * "public/mentors/portal/x.jpg" (also matches inside template literals). */
const REL_PATH = /["'`]((?:src\/data|public\/mentors\/portal)\/(?:[^"'`]|\.)+)["'`]/g;

const posix = (p) => p.split(path.sep).join('/').replace(/^\.\//, '');

async function loadManifest() {
  const raw = await readFile(MANIFEST, 'utf-8');
  const linked = [];
  const readOnly = [];

  for (const rawLine of raw.split('\n')) {
    const line = rawLine.split('#')[0].trim();
    if (!line) continue;

    const [kind, target] = line.split('|').map((part) => part.trim());
    if (!target) continue;

    if (kind === 'read') readOnly.push(posix(target));
    else linked.push({ kind, target: posix(target) });
  }

  return { linked, readOnly };
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (EXTENSIONS.has(path.extname(entry.name))) yield full;
  }
}

/** A path is covered if it is listed, or sits under a listed directory. */
function coveredBy(target, entries) {
  return entries.some((entry) => target === entry || target.startsWith(`${entry}/`));
}

const { linked, readOnly } = await loadManifest();
const linkedPaths = linked.map((entry) => entry.target);
const dirPaths = linked.filter((entry) => entry.kind === 'dir').map((entry) => entry.target);

const found = new Map();

function recordMatch(file, target) {
  const key = posix(target);
  if (!found.has(key)) found.set(key, []);
  found.get(key).push(posix(path.relative(ROOT, file)));
}

function scanSource(file, source) {
  for (const match of source.matchAll(CWD_PATH)) recordMatch(file, match[1]);
  for (const match of source.matchAll(REL_PATH)) recordMatch(file, match[1].replace(/\$\{[^}]+\}/g, '*'));
}

for (const scanDir of SCAN_DIRS) {
  for await (const file of walk(path.join(ROOT, scanDir))) {
    const source = await readFile(file, 'utf-8');
    scanSource(file, source);
  }
}

const uncovered = [];
for (const [target, files] of found) {
  // Covered directly, nested under a linked directory, or declared read-only.
  if (coveredBy(target, linkedPaths) || coveredBy(target, dirPaths) || coveredBy(target, readOnly)) {
    continue;
  }
  uncovered.push({ target, files });
}

// A manifest entry whose path no longer appears anywhere is dead weight that
// makes the next reader trust the list less.
const stale = linkedPaths.filter(
  (target) =>
    target !== '.env.local' &&
    ![...found.keys()].some((used) => used === target || used.startsWith(`${target}/`)),
);

console.log(`scanned ${found.size} runtime path(s) against ${linkedPaths.length} manifest entries`);

if (stale.length > 0) {
  console.log('\nmanifest entries no longer referenced by any code (check whether they are still needed):');
  for (const target of stale) console.log(`  ${target}`);
}

if (uncovered.length > 0) {
  console.error('\nNOT COVERED by deploy/persistent-manifest.txt:\n');
  for (const { target, files } of uncovered) {
    console.error(`  ${target}`);
    for (const file of files) console.error(`      used in ${file}`);
  }
  console.error(
    '\nIf the app writes here, add it to deploy/persistent-manifest.txt and create the\n' +
      'matching entry under persistent/ on the VPS. If it only ever reads, add a `read`\n' +
      'line with the reason. Shipping without one of those silently loses this data on\n' +
      'the next deploy.',
  );
  process.exit(1);
}

console.log('\nevery runtime path is either persisted or declared read-only.');
