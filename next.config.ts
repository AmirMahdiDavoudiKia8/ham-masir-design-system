import path from "node:path";
import type { NextConfig } from "next";

/**
 * Security headers that deploy/security-headers.conf adds on the VPS. On
 * Cloudflare there is no nginx to include the snippet, so the worker sets the
 * same headers itself — but only when actually running there: the VPS keeps
 * owning them via nginx, and doubling up would send every header twice.
 * CF_RUNTIME is a wrangler var that only exists in wrangler.jsonc.
 */
const cfSecurityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.kavenegar.com https://*.kavenegar.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://*.kavenegar.com; font-src 'self' data:; media-src 'self' blob:; connect-src 'self' https://*.kavenegar.com; worker-src 'self'; manifest-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    if (!process.env.CF_RUNTIME) return [];
    return [{ source: "/(.*)", headers: cfSecurityHeaders }];
  },
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
