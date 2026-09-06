/**
 * Serializes async work against the same key — this app's whole "database"
 * is JSON files under src/data/ (see lib/mentorPortal.ts, studentBookings.ts,
 * studentIdentities.ts, paymentRequests.ts), each read-modified-and-written
 * back as a unit with no other write coordination. Two requests landing close
 * together (e.g. a student ticking a task the same moment their mentor saves
 * the plan, or two people registering the same phone number at once) could
 * otherwise both read the old file, and whichever write lands second would
 * silently discard the first one's change.
 *
 * In-process only — relies on this app running as a single Node instance
 * (see deploy/ecosystem.config.js: instances: 1, fork mode). If that ever
 * changes, this stops being sufficient and a real cross-process lock (or a
 * real database) would be needed instead.
 */
const queues = new Map<string, Promise<unknown>>();

export function withFileLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const prior = queues.get(key) ?? Promise.resolve();
  const run = prior.then(fn, fn);
  // Stored tail must never reject, or it'd break every future call chained
  // onto this key — the real error still propagates through `run`, which is
  // what this call's own caller actually awaits.
  queues.set(key, run.catch(() => {}));
  return run;
}
