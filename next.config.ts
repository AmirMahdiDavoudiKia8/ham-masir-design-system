import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pins the workspace root to this project directory. Without this, Next
  // auto-detects the root by walking up for the nearest lockfile and picks
  // whichever one it finds first — on this machine that's a stray, unrelated
  // package-lock.json at C:\Users\Techramz.co\ (outside this repo entirely),
  // which made `next build` nest the standalone output an extra two levels
  // deep (.next/standalone/Desktop/HAMMASIR - FULL/server.js instead of
  // .next/standalone/server.js), silently breaking the deploy README's `cp
  // -r .next/standalone/. ...` step. Pinning it here makes the standalone
  // output flat regardless of what other lockfiles exist elsewhere on disk.
  outputFileTracingRoot: path.join(__dirname),
  // Next's own Server Actions body limit defaults to 1MB — well under the
  // 2MB/3MB photo/voice limits the mentor portal advertises in its own UI
  // (see lib/mentorPortalLimits.ts), so any upload between 1MB and those
  // limits was silently 500ing with no error shown to the mentor. Raised to
  // cover the largest allowed upload (voice, 3MB) with headroom for
  // multipart/form-data overhead.
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  // Bundles a minimal server (only the deps each page actually needs) into
  // .next/standalone — cuts what has to live on the VPS from the full
  // node_modules tree to a few tens of MB, and keeps memory/startup light on
  // a 1 vCPU / 2GB box. Deploy by copying .next/standalone + .next/static +
  // public, then `node server.js` (see next.config docs for the exact tree).
  output: "standalone",
  images: {
    // AVIF first (smallest, tried first for browsers that support it),
    // falling back to WebP — both far smaller than the source JPEGs for
    // every mentor photo/logo served through next/image.
    formats: ["image/avif", "image/webp"],
    // Optimized variants are cached on disk keyed by url+width+format; a
    // longer minimum TTL means re-optimizing (CPU + memory on that 1 vCPU
    // box) happens far less often instead of every 60s by default.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
