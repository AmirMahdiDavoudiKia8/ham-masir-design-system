import type { PushSubscription } from "web-push";
import { withFileLock } from "@/lib/fileLock";
import { readJson, writeJson } from "@/lib/storage";

/**
 * The founder's devices that asked to be notified (see adminNotify). One
 * entry per browser/phone that pressed «فعال‌سازی نوتیف» on an admin page —
 * keyed by `endpoint`, which the browser's push service makes unique per
 * subscription, so pressing it twice on the same phone doesn't double up.
 *
 * Lives in persistent/ on the VPS (deploy/persistent-manifest.txt) / the
 * hammasir-store R2 bucket on Cloudflare (key src/data/pushSubscriptions.json).
 */
const FILE = "src/data/pushSubscriptions.json";

export interface StoredSubscription {
  subscription: PushSubscription;
  /** Browser/OS string at the time of subscribing — only so the list is recognisable if it ever needs pruning by hand. */
  userAgent?: string;
  at: string;
}

async function readAll(): Promise<StoredSubscription[]> {
  return readJson<StoredSubscription[]>(FILE, []);
}

async function writeAll(all: StoredSubscription[]): Promise<void> {
  await writeJson(FILE, all);
}

export async function getSubscriptions(): Promise<StoredSubscription[]> {
  return readAll();
}

export async function addSubscription(subscription: PushSubscription, userAgent?: string): Promise<void> {
  await withFileLock(FILE, async () => {
    const all = (await readAll()).filter((s) => s.subscription.endpoint !== subscription.endpoint);
    all.push({ subscription, userAgent, at: new Date().toISOString() });
    await writeAll(all);
  });
}

export async function removeSubscriptions(endpoints: string[]): Promise<void> {
  if (endpoints.length === 0) return;
  const dead = new Set(endpoints);
  await withFileLock(FILE, async () => {
    await writeAll((await readAll()).filter((s) => !dead.has(s.subscription.endpoint)));
  });
}
