import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { withFileLock } from "@/lib/fileLock";
import { forwardToSheet, type LeadType } from "@/lib/sheetForward";

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
 * The primary record of every lead (quiz answer, registration, booking,
 * cancellation, mentor signup/request) — written to this app's own
 * persistent storage, same reliability model as bookings/payments, which
 * has never had a silent outage. Forwarding to the Google Sheet (see
 * lib/sheetForward.ts) is kept as a best-effort *secondary* copy for
 * convenient phone/spreadsheet access — see /mentor/admin/leads for the
 * authoritative one that doesn't depend on an external Google deployment
 * staying correctly configured.
 *
 * Awaits the local write (fast local disk I/O — negligible latency) but
 * still fire-and-forgets the Sheet forward, since that's a network call to
 * an external service that has been observed taking 15-20s and shouldn't
 * ever stall a caller's actual flow (quiz submit, registration, booking).
 */
export async function logLead(type: LeadType, data: Record<string, string>): Promise<void> {
  await recordLead(type, data);
  forwardToSheet(type, data).catch(() => {});
}

/** All recorded leads, newest first — read by the internal admin dashboard (see /mentor/admin/leads). */
export async function getLeads(): Promise<Lead[]> {
  const all = await getAll();
  return all.slice().reverse();
}
