import { readBinary } from "@/lib/storage";

/**
 * Serves mentor-portal uploads (photos/voice intros) at /mentors/portal/<file>.
 *
 * On the VPS these files live under public/mentors/portal (a persistent
 * volume) and Next/nginx hands them out as static assets. Cloudflare can't do
 * that for files uploaded after the build — the worker bundle ships a frozen
 * copy — so on Cloudflare this route streams the object back from the
 * hammasir-store R2 bucket instead. The read-through storage layer (see
 * lib/storage.ts) keeps the VPS path working unchanged.
 *
 * Filenames are random UUID snippets (cache-busting, see
 * /mentor/portal/profile/actions.ts saveUpload), so the immutable cache header
 * is safe: a changed upload always arrives on a new URL.
 */
const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  mp3: "audio/mpeg",
  m4a: "audio/mp4",
  mp4: "audio/mp4",
  ogg: "audio/ogg",
  wav: "audio/wav",
  weba: "audio/webm",
};

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  // No slashes, no traversal: a plain filename in a flat uploads dir.
  if (!name || name.includes("/") || name.includes("\\") || name.includes("..")) {
    return new Response("not found", { status: 404 });
  }

  const bytes = await readBinary(`public/mentors/portal/${name}`);
  if (!bytes) return new Response("not found", { status: 404 });

  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return new Response(bytes as BodyInit, {
    headers: {
      "Content-Type": CONTENT_TYPES[ext] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Length": String(bytes.byteLength),
    },
  });
}