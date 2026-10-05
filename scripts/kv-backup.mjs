#!/usr/bin/env node
/**
 * Downloads every key from the Cloudflare KV namespace that holds the app's
 * runtime data (HAMMASIR_STORE) into a timestamped folder under
 * %USERPROFILE%\HamMasirBackups\ — the Cloudflare twin of
 * scripts/backup-persistent.ps1 (which still pulls the VPS copy).
 *
 *   npm run cf:backup
 *
 * Layout under the stamp folder mirrors VPS persistent/ so
 * `npm run cf:restore -- <dir>` (kv-seed.mjs) can put it all back:
 *   src/data/**  and  public/mentors/portal/**
 *
 * Keeps the last 14 archives; writes to .partial and renames only after
 * every key downloaded (same kill-safe pattern as backup-persistent.ps1).
 */
import { mkdirSync, readdirSync, renameSync, rmSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

const NAMESPACE_ID = "b2234081ec8e45eb9db81702c9be460a";
const KEEP = 14;

function resolveAuth() {
  if (process.env.CLOUDFLARE_API_TOKEN) return process.env.CLOUDFLARE_API_TOKEN;
  const candidates = [
    process.env.WRANGLER_CONFIG,
    process.env.APPDATA && path.join(process.env.APPDATA, "xdg.config", ".wrangler", "config", "default.toml"),
    path.join(homedir(), ".wrangler", "config", "default.toml"),
  ].filter(Boolean);
  for (const file of candidates) {
    if (!existsSync(file)) continue;
    const m = readFileSync(file, "utf-8").match(/oauth_token\s*=\s*"([^"]+)"/);
    if (m) return m[1];
  }
  console.error("no wrangler OAuth token / CLOUDFLARE_API_TOKEN");
  process.exit(1);
}

function resolveAccountId() {
  if (process.env.CLOUDFLARE_ACCOUNT_ID) return process.env.CLOUDFLARE_ACCOUNT_ID;
  const fromWrangler = readFileSync(path.join(process.cwd(), "wrangler.jsonc"), "utf-8").match(
    /"account_id"\s*:\s*"([^"]+)"/,
  );
  if (fromWrangler) return fromWrangler[1];
  console.error("no account_id");
  process.exit(1);
}

const TOKEN = resolveAuth();
const ACCOUNT_ID = resolveAccountId();
const API = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}`;

async function listAllKeys() {
  const keys = [];
  let cursor;
  do {
    const url = new URL(`${API}/keys`);
    url.searchParams.set("per_page", "1000");
    if (cursor) url.searchParams.set("cursor", cursor);
    const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
    const j = await res.json();
    if (!j.success) {
      console.error("list keys failed:", JSON.stringify(j.errors));
      process.exit(1);
    }
    keys.push(...(j.result ?? []));
    cursor = j.result_info?.cursor;
  } while (cursor);
  return keys;
}

async function getValue(key) {
  const res = await fetch(`${API}/values/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) throw new Error(`GET ${key}: HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

function keyToPath(key) {
  // Keys already look like filesystem paths under persistent/
  return key;
}

const backupRoot = path.join(homedir(), "HamMasirBackups");
mkdirSync(backupRoot, { recursive: true });

// Sweep stale partials from killed runs
for (const name of readdirSync(backupRoot)) {
  if (name.endsWith(".partial")) rmSync(path.join(backupRoot, name), { force: true });
}

const stamp = new Date().toISOString().replace(/[:T]/g, "-").slice(0, 16);
const finalDir = path.join(backupRoot, `hammasir-kv-${stamp}`);
const partialDir = `${finalDir}.partial`;

console.log("listing KV keys…");
const keys = await listAllKeys();
console.log(`found ${keys.length} key(s)`);

rmSync(partialDir, { recursive: true, force: true });
mkdirSync(partialDir, { recursive: true });

let failed = 0;
for (const { name } of keys) {
  try {
    const buf = await getValue(name);
    const dest = path.join(partialDir, keyToPath(name));
    mkdirSync(path.dirname(dest), { recursive: true });
    writeFileSync(dest, buf);
  } catch (err) {
    failed++;
    console.error(`  FAIL ${name}: ${err.message}`);
  }
}

if (failed > 0 || keys.length === 0) {
  console.error(`aborting: ${failed} failed / ${keys.length} total`);
  rmSync(partialDir, { recursive: true, force: true });
  process.exit(1);
}

// Atomic promote
renameSync(partialDir, finalDir);
console.log(`ok → ${finalDir} (${keys.length} keys)`);

// Prune old archives (keep newest KEEP; ignore .partial)
const archives = readdirSync(backupRoot)
  .filter((n) => n.startsWith("hammasir-kv-") && !n.endsWith(".partial"))
  .sort();
while (archives.length > KEEP) {
  const old = archives.shift();
  rmSync(path.join(backupRoot, old), { recursive: true, force: true });
  console.log(`pruned ${old}`);
}
