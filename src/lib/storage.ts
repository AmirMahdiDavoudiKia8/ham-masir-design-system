/**
 * Storage layer for everything the app writes at runtime.
 *
 * The app's whole "database" is a handful of JSON files under src/data/ plus
 * an uploads directory (public/mentors/portal/). Where that state physically
 * lives depends on the host, and this module is the single seam:
 *
 *   - VPS (standalone server) / `next dev`: the real filesystem, rooted at
 *     process.cwd(), symlinked into persistent/ per deploy/README.md.
 *   - Cloudflare Workers: one KV namespace (binding HAMMASIR_STORE), keyed by
 *     the exact same relative paths — `src/data/studentBookings.json`,
 *     `src/data/mentorPortal/students/<id>.json`, `public/mentors/portal/*`,
 *     and so on. This is what makes the live site's state durable on CF,
 *     where the worker filesystem is per-isolate and ephemeral.
 *
 * Reads on Cloudflare fall back to the copy of src/data/** that ships inside
 * the worker bundle, so a key the namespace doesn't have yet behaves exactly
 * like the repo's empty placeholders instead of erroring. Writes always go
 * to the namespace. Locally/VPS everything is plain fs.
 *
 * Both runtimes keep their JSON file format byte-identical (`JSON.stringify(v,
 * null, 2) + "\n"`), so scripts that move data between them (VPS persistent/
 * → KV, see scripts/kv-seed.mjs) are trivial.
 *
 * KV has no object timestamps, so every put stores `mtime` (and binary
 * `contentType`) in the key's metadata; fileMtime reads it back via list().
 */
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { appendFile, mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

/** KVNamespace's API this module actually touches, declared minimally so the
 *  bundle doesn't depend on @cloudflare/workers-types being in the build. */
interface KVListKey {
  name: string;
  metadata?: Record<string, unknown>;
}
interface KVNamespaceLike {
  get(key: string, type: "text"): Promise<string | null>;
  get(key: string, type: "arrayBuffer"): Promise<ArrayBuffer | null>;
  put(
    key: string,
    value: string | Uint8Array | ArrayBuffer,
    options?: { metadata?: Record<string, unknown> },
  ): Promise<void>;
  list(options: {
    prefix?: string;
    limit?: number;
    cursor?: string;
  }): Promise<{ keys: KVListKey[]; list_complete: boolean; cursor?: string }>;
}

type StoreBackend = { kind: "kv"; kv: KVNamespaceLike } | { kind: "fs"; root: string };

const BINDING = "HAMMASIR_STORE";

let backendPromise: Promise<StoreBackend> | null = null;

/**
 * Resolves where state lives for the current request. On a deployed Cloudflare
 * Worker getCloudflareContext resolves and env exposes the KV binding; in any
 * other runtime (next dev, the VPS standalone server, a build) it throws or
 * the binding is absent, and we fall back to local fs. Memoized — the backend
 * is stable for the lifetime of an isolate/process.
 */
function resolveBackend(): Promise<StoreBackend> {
  if (!backendPromise) backendPromise = loadBackend();
  return backendPromise;
}

async function loadBackend(): Promise<StoreBackend> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const kv = (env as Record<string, unknown>)[BINDING] as KVNamespaceLike | undefined;
    if (kv) return { kind: "kv", kv };
  } catch {
    // Not on the Cloudflare runtime — dev, build, or the VPS standalone box.
  }
  return { kind: "fs", root: process.cwd() };
}

async function fsPath(relPath: string): Promise<string> {
  const backend = await resolveBackend();
  if (backend.kind === "fs") return path.join(backend.root, relPath);

  // KV is already the backend — there is no filesystem path to hold. This
  // only happens for a wrong api misuse (fs helpers called on KV), and the
  // caller's error is clearer than a dynamic throw here.
  throw new Error("filesystem path requested but storage backend is KV");
}

async function ensureFsDir(relPath: string): Promise<void> {
  // mkdir on a path that already exists as a directory is a no-op, so this is
  // safe to call before every write regardless of what's there.
  await mkdir(path.dirname(await fsPath(relPath)), { recursive: true });
}

/**
 * Reads a JSON store, returning `fallback` if it's missing, unparseable, or
 * the wrong shape — the same never-throws contract every caller had with the
 * filesystem (a missing file used to hit the catch and return the fallback).
 */
export async function readJson<T>(relPath: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await readText(relPath, "")) as T;
  } catch {
    return fallback;
  }
}

/** Reads any text store (JSON or otherwise); `fallback` on missing/unreadable. */
export async function readText(relPath: string, fallback: string): Promise<string> {
  const backend = await resolveBackend();
  if (backend.kind === "kv") {
    try {
      const value = await backend.kv.get(relPath, "text");
      if (value !== null) return value;
    } catch (err) {
      console.error(`[storage] kv read failed for ${relPath}:`, err);
    }
    // Namespace miss → the copy bundled inside the worker (repo placeholders /
    // shipped data), then fallback. The bundled copy is read-only by design.
    return readBundledText(relPath, fallback);
  }
  try {
    return await readFile(path.join(backend.root, relPath), "utf-8");
  } catch {
    return fallback;
  }
}

/** On Cloudflare the shipped src/data/** files exist in the bundle root (the
 * OpenNext server functions dir), so a miss in the namespace degrades to what a
 * fresh repo checkout would have served before KV had the key. */
async function readBundledText(relPath: string, fallback: string): Promise<string> {
  try {
    return await readFile(path.join(process.cwd(), relPath), "utf-8");
  } catch {
    return fallback;
  }
}

/** Writes a JSON store in the exact format everything else in this repo uses
 * (`JSON.stringify(v, null, 2)\n`). KV key or fs file — always durable. */
export async function writeJson(relPath: string, value: unknown): Promise<void> {
  await writeText(relPath, `${JSON.stringify(value, null, 2)}\n`);
}

/** Writes raw text (JSONL lines, etc.) to durable storage. */
export async function writeText(relPath: string, text: string): Promise<void> {
  const backend = await resolveBackend();
  if (backend.kind === "kv") {
    await backend.kv.put(relPath, text, { metadata: { mtime: Date.now() } });
    return;
  }
  await ensureFsDir(relPath);
  await writeFile(path.join(backend.root, relPath), text, "utf-8");
}

/** Appends a line to a text store (analytics day files). On KV this is a
 * read-modify-write of one key, so two isolates appending to the *same* key
 * in the same instant could race — the same hazard the VPS solved with a
 * single Node process + in-process lock (lib/fileLock.ts), which still
 * serializes within an isolate here. */
export async function appendText(relPath: string, text: string): Promise<void> {
  const backend = await resolveBackend();
  if (backend.kind === "kv") {
    const existing = await readTextFromKV(backend.kv, relPath);
    await backend.kv.put(relPath, existing + text, { metadata: { mtime: Date.now() } });
    return;
  }
  await ensureFsDir(relPath);
  await appendFile(path.join(backend.root, relPath), text, "utf-8");
}

async function readTextFromKV(kv: KVNamespaceLike, relPath: string): Promise<string> {
  try {
    const value = await kv.get(relPath, "text");
    if (value !== null) return value;
  } catch (err) {
    console.error(`[storage] kv append-read failed for ${relPath}:`, err);
  }
  return "";
}

/** Lists top-level file names under a directory prefix (no recursion). */
export async function listFileNames(relPath: string): Promise<string[]> {
  const backend = await resolveBackend();
  if (backend.kind === "kv") {
    const prefix = `${relPath.replace(/\/+$/, "")}/`;
    const names: string[] = [];
    let cursor: string | undefined;
    // KV lists return at most 1000 keys per page — page through the rest.
    do {
      const page = await backend.kv.list({ prefix, limit: 1000, cursor });
      for (const key of page.keys) {
        const name = key.name.slice(prefix.length);
        if (name.length > 0 && !name.includes("/")) names.push(name);
      }
      cursor = page.list_complete ? undefined : page.cursor;
    } while (cursor);
    return names;
  }
  try {
    return await readdir(path.join(backend.root, relPath));
  } catch {
    return [];
  }
}

/** Modification time of a store — used only by sitemap.ts as a `lastmod`
 * signal. On KV the mtime lives in the key metadata (set on every put); local
 * fs has real mtimes. */
export async function fileMtime(relPath: string): Promise<Date | undefined> {
  const backend = await resolveBackend();
  if (backend.kind === "kv") {
    try {
      const page = await backend.kv.list({ prefix: relPath, limit: 10 });
      const key = page.keys.find((k) => k.name === relPath);
      const mtime = key?.metadata?.mtime;
      if (typeof mtime === "number") return new Date(mtime);
    } catch (err) {
      console.error(`[storage] kv stat failed for ${relPath}:`, err);
    }
    try {
      return (await stat(path.join(process.cwd(), relPath))).mtime;
    } catch {
      return undefined;
    }
  }
  try {
    return (await stat(path.join(backend.root, relPath))).mtime;
  } catch {
    return undefined;
  }
}

/** Reads a binary store (mentor photo/voice uploads); null if absent. */
export async function readBinary(relPath: string): Promise<Uint8Array | null> {
  const backend = await resolveBackend();
  if (backend.kind === "kv") {
    try {
      const buffer = await backend.kv.get(relPath, "arrayBuffer");
      if (buffer !== null) return new Uint8Array(buffer);
    } catch (err) {
      console.error(`[storage] kv read failed for ${relPath}:`, err);
    }
    return readBundledBinary(relPath);
  }
  try {
    return new Uint8Array(await readFile(path.join(backend.root, relPath)));
  } catch {
    return null;
  }
}

async function readBundledBinary(relPath: string): Promise<Uint8Array | null> {
  try {
    return new Uint8Array(await readFile(path.join(process.cwd(), relPath)));
  } catch {
    return null;
  }
}

/** Writes a binary store (mentor uploads) with its MIME type. */
export async function writeBinary(relPath: string, bytes: Uint8Array, contentType: string): Promise<void> {
  const backend = await resolveBackend();
  if (backend.kind === "kv") {
    await backend.kv.put(relPath, bytes, { metadata: { mtime: Date.now(), contentType } });
    return;
  }
  await ensureFsDir(relPath);
  await writeFile(path.join(backend.root, relPath), bytes);
}
