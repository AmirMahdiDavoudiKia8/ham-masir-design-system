import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { notifyAdmin } from "@/lib/adminNotify";
import { withFileLock } from "@/lib/fileLock";
import type { LeadType } from "@/lib/leadTypes";

export interface Lead {
  type: LeadType;
  data: Record<string, string>;
  at: string;
}

const LEADS_FILE = path.join(process.cwd(), "src/data/leads.json");

async function getAll(): Promise<Lead[]> {
  try {
    const raw = JSON.parse(await readFile(LEADS_FILE, "utf-8"));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

async function recordLead(type: LeadType, data: Record<string, string>): Promise<void> {
  await withFileLock(LEADS_FILE, async () => {
    const all = await getAll();
    all.push({ type, data, at: new Date().toISOString() });
    await writeFile(LEADS_FILE, `${JSON.stringify(all, null, 2)}\n`, "utf-8");
  });
}

/**
 * The record of every lead (quiz answer, registration, booking,
 * cancellation, mentor signup/request) — written to this app's own
 * persistent storage, same reliability model as bookings/payments, which
 * has never had a silent outage. Read back at /mentor/admin/leads, which
 * also exports the whole history as CSV.
 *
 * Leads used to be forwarded to an external Google Sheet as well. That is
 * gone: the dashboard covers the same need without depending on an Apps
 * Script deployment staying correctly configured (it silently broke once,
 * for an unknown stretch of time), and it removes a second copy of every
 * lead — which mattered, because the mentor signup used to include the
 * chosen password in that payload.
 */
export async function logLead(type: LeadType, data: Record<string, string>): Promise<void> {
  const clean = withoutSecrets(data);
  await recordLead(type, clean);
  // After the write, and not awaited: the phone ping is a convenience on top
  // of the real record above, so a slow or unreachable Bale API must never
  // hold up (or fail) the request that produced the lead. See adminNotify.
  void notifyAdmin(type, clean);
}

/**
 * Strips credential-ish fields before a lead is persisted or forwarded.
 *
 * The mentor signup used to pass the chosen password straight through, which
 * put it in clear text in three places at once: leads.json on the VPS, the
 * external Google Sheet, and the /mentor/admin/leads dashboard. That call
 * site no longer sends it, but /api/leads accepts an arbitrary `data` object
 * from the client, so the guard belongs here too — a caller shouldn't be
 * able to leak a secret into permanent storage by accident.
 */
// Deliberately narrow: only credential names. An earlier draft also matched
// keys ending in "code", which would have silently dropped the payment
// tracking code PaymentForm sends — a field the leads dashboard needs.
const SECRET_KEY = /pass|رمز|token|secret/i;

function withoutSecrets(data: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(data)) {
    if (!SECRET_KEY.test(key)) out[key] = value;
  }
  return out;
}

/** All recorded leads, newest first — read by the internal admin dashboard (see /mentor/admin/leads). */
export async function getLeads(): Promise<Lead[]> {
  const all = await getAll();
  return all.slice().reverse();
}
