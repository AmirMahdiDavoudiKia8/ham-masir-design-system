#!/usr/bin/env node
/**
 * Upload a VPS persistent/ directory into the Cloudflare Workers KV
 * namespace `hammasir-store` (binding HAMMASIR_STORE) under the exact keys
 * the storage layer (src/lib/storage.ts) reads.
 *
 *   node scripts/kv-seed.mjs <persistent-dir>
 *
 *   e.g.  node scripts/kv-seed.mjs /var/www/hammasir/persistent
 *
 * Uses the Cloudflare REST API directly (auth: wrangler's OAuth token from
 * ~/.wrangler config, or CLOUDFLARE_API_TOKEN if set) — spawning `wrangler kv
 * key put` per file breaks on Windows because cmd.exe eats the JSON quotes
 * in --metadata.
 *
 * Each key gets `mtime` metadata (source file mtime) so fileMtime()/sitemap
 * lastmod keep working on KV. Re-runs are safe: PUT overwrites.
 *
 * .env.local is deliberately NOT uploaded — those values belong in wrangler
 * secrets (see deploy/README.md), not in KV.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

const PERSISTENT_DIR = process.argv[2];
if (!PERSISTENT_DIR) {
  console.error("usage: node scripts/kv-seed.mjs <persistent-dir>");
  process.exit(1);
}
if (!existsSync(PERSISTENT_DIR)) {
  console.error(`no such directory: ${PERSISTENT_DIR}`);
  process.exit(1);
}

// Must match kv_namespaces HAMMASIR_STORE id in wrangler.jsonc.
const NAMESPACE_ID = "b2234081ec8e45eb9db81702c9be460a";

/** [persistent-relative path, KV key] — same mapping as deploy/persistent-manifest.txt. */
const MAPPING = [
  ["mentorPortal/mentors.json", "src/data/mentorPortal/mentors.json"],
  ["paymentRequests.json", "src/data/paymentRequests.json"],
  ["studentBookings.json", "src/data/studentBookings.json"],
  ["studentIdentities.json", "src/data/studentIdentities.json"],
  ["studentProfiles.json", "src/data/studentProfiles.json"],
  ["leads.json", "src/data/leads.json"],
  ["mentors-catalogue.json", "src/data/mentors/mentors.json"],
  ["progress.json", "src/data/progress/progress.json"],
  ["pushSubscriptions.json", "src/data/pushSubscriptions.json"],
];

function readFirstMatch(file, regex) {
  if (!existsSync(file)) return null;
  const m = readFileSync(file, "utf-8").match(regex);
  return m ? m[1] : null;
}

function resolveAuth() {
  if (process.env.CLOUDFLARE_API_TOKEN) return process.env.CLOUDFLARE_API_TOKEN;
  const candidates = [
    process.env.WRANGLER_CONFIG,
    process.env.APPDATA && path.join(process.env.APPDATA, "xdg.config", ".wrangler", "config", "default.toml"),
    path.join(homedir(), ".wrangler", "config", "default.toml"),
  ].filter(Boolean);
  for (const file of candidates) {
    const token = readFirstMatch(file, /oauth_token\s*=\s*"([^"]+)"/);
    if (token) return token;
  }
  console.error("no wrangler OAuth token found and CLOUDFLARE_API_TOKEN not set");
  process.exit(1);
}

function resolveAccountId() {
  const fromEnv = process.env.CLOUDFLARE_ACCOUNT_ID;
  if (fromEnv) return fromEnv;
  const fromWrangler = readFirstMatch(path.join(process.cwd(), "wrangler.jsonc"), /"account_id"\s*:\s*"([^"]+)"/);
  if (fromWrangler) return fromWrangler;
  console.error("no account_id: set CLOUDFLARE_ACCOUNT_ID or add account_id to wrangler.jsonc");
  process.exit(1);
}

const TOKEN = resolveAuth();
const ACCOUNT_ID = resolveAccountId();

async function put(localPath, kvKey) {
  const body = readFileSync(localPath);
  const metadata = { mtime: statSync(localPath).mtimeMs };
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/values/${encodeURIComponent(kvKey)}`;
  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/octet-stream",
    "cf-kv-metadata": Buffer.from(JSON.stringify(metadata)).toString("base64"),
  };
  let res = await fetch(url, { method: "PUT", headers, body });
  if (!res.ok) {
    // Some token types reject the metadata header; retry without it rather
    // than failing the whole seed (sitemap lastmod degrades to build mtime).
    const retryHeaders = { ...headers };
    delete retryHeaders["cf-kv-metadata"];
    res = await fetch(url, { method: "PUT", headers: retryHeaders, body });
  }
  if (!res.ok) {
    const text = await res.text();
    console.error(`  FAILED ${kvKey}: HTTP ${res.status} ${text.slice(0, 300)}`);
    return false;
  }
  console.log(`  ok ${kvKey}`);
  return true;
}

let count = 0;
let failed = 0;

async function track(promise) {
  if (await promise) count++;
  else failed++;
}

console.log("==> JSON stores");
for (const [rel, key] of MAPPING) {
  const localPath = path.join(PERSISTENT_DIR, rel);
  if (existsSync(localPath)) await track(put(localPath, key));
}

console.log("==> analytics day files");
const analyticsDir = path.join(PERSISTENT_DIR, "analytics");
if (existsSync(analyticsDir)) {
  for (const name of readdirSync(analyticsDir)) {
    if (!name.endsWith(".jsonl")) continue;
    await track(put(path.join(analyticsDir, name), `src/data/analytics/${name}`));
  }
} else {
  console.log("    (none)");
}

console.log("==> mentor portal student files");
const studentsDir = path.join(PERSISTENT_DIR, "mentorPortal", "students");
if (existsSync(studentsDir)) {
  for (const name of readdirSync(studentsDir)) {
    if (!name.endsWith(".json")) continue;
    await track(put(path.join(studentsDir, name), `src/data/mentorPortal/students/${name}`));
  }
} else {
  console.log("    (none)");
}

console.log("==> mentor portal uploads");
const uploadsDir = path.join(PERSISTENT_DIR, "mentors-uploads");
if (existsSync(uploadsDir)) {
  const walk = async (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(full);
      else await track(put(full, `public/mentors/portal/${entry.name}`));
    }
  };
  await walk(uploadsDir);
} else {
  console.log("    (none)");
}

console.log(`\n==> done. ${count} key(s) written, ${failed} failed (namespace ${NAMESPACE_ID})`);
if (failed > 0) process.exit(1);
