/**
 * Removes credential fields from leads that were recorded before logLead
 * started stripping them (see lib/leads.ts).
 *
 * The mentor signup used to pass the chosen password into the lead record,
 * so every mentor who registered before that fix has their password sitting
 * in clear text in persistent/leads.json. Fixing the code stops new ones;
 * this clears the ones already written.
 *
 * Runs ON the VPS, against the real file:
 *
 *   node scripts/purge-lead-secrets.mjs /var/www/hammasir/persistent/leads.json --dry
 *   node scripts/purge-lead-secrets.mjs /var/www/hammasir/persistent/leads.json
 *
 * Writes a timestamped .bak next to the file before changing anything, and
 * never prints a secret value — only counts and key names.
 */
import { readFile, writeFile, copyFile } from "node:fs/promises";

// Same pattern lib/leads.ts uses, kept deliberately narrow so it can't eat
// a legitimate field such as the payment tracking code.
const SECRET_KEY = /pass|رمز|token|secret/i;

const file = process.argv[2];
const dryRun = process.argv.includes("--dry");

if (!file) {
  console.error("usage: node scripts/purge-lead-secrets.mjs <leads.json> [--dry]");
  process.exit(2);
}

const raw = await readFile(file, "utf-8");
const parsed = JSON.parse(raw);
const leads = Array.isArray(parsed) ? parsed : (parsed.leads ?? []);

if (!Array.isArray(leads)) {
  console.error("unexpected shape — expected an array of leads");
  process.exit(1);
}

const removed = new Map();
let touched = 0;

for (const lead of leads) {
  const data = lead?.data;
  if (!data || typeof data !== "object") continue;

  let changedHere = false;
  for (const key of Object.keys(data)) {
    if (!SECRET_KEY.test(key)) continue;
    delete data[key];
    removed.set(key, (removed.get(key) ?? 0) + 1);
    changedHere = true;
  }
  if (changedHere) touched++;
}

console.log(`leads: ${leads.length}`);
console.log(`records containing a credential field: ${touched}`);
for (const [key, count] of removed) console.log(`  "${key}" removed from ${count} record(s)`);

if (touched === 0) {
  console.log("nothing to do.");
  process.exit(0);
}

if (dryRun) {
  console.log("\n--dry: file not modified.");
  process.exit(0);
}

const backup = `${file}.${new Date().toISOString().replace(/[:.]/g, "-")}.bak`;
await copyFile(file, backup);
await writeFile(file, `${JSON.stringify(parsed, null, 2)}\n`, "utf-8");

console.log(`\nbackup: ${backup}`);
console.log("leads file rewritten without the credential fields.");
console.log("\nThe Google Sheet holds a second copy of every lead — clear the");
console.log("password column there too; this script cannot reach it.");
