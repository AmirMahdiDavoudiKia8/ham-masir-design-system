// Patches a Windows-only bug in Next.js that silently disables font preloading.
//
// THE BUG (next 15.5.x, node_modules/next/dist/build/webpack/plugins/
// next-font-manifest-plugin.js): the plugin decides whether a webpack module
// came from next/font with
//
//     mod.request.includes('/next-font-loader/index.js?')
//
// — a hard-coded forward slash. On Windows `mod.request` uses backslashes, so
// the check never matches, no font is attributed to any route, and
// .next/server/next-font-manifest.json ends up with `"app": {}`. The font
// files are still emitted as preloadable (`*.p.woff2`), they just never get a
// `Link: rel=preload` header.
//
// WHY IT MATTERS HERE: this project is built on a Windows laptop and shipped to
// the VPS, so production had NO font preload at all. The browser found the
// Persian font only after downloading and parsing the CSS, rendered the page
// in a fallback font, then swapped — re-flowing the hero text and pushing the
// «اول جلسه، بعد پرداخت» card down. Measured on /student/home, mobile, real
// (devtools) Slow-4G throttling, same local production build:
//
//     before: score 89, LCP 3.18s, CLS 0.100
//     after : score 96, LCP 2.08s, CLS 0.047   (together with display:"optional"
//                                               in src/lib/fonts.ts and the
//                                               transform-only hero animation)
//
// Runs before every `next build` (see package.json) and on postinstall, so a
// fresh `npm install` can't quietly bring the bug back. Idempotent. If Next
// changes this code, it FAILS the build on purpose rather than skipping —
// check whether upstream fixed it (then delete this script) or re-find the
// line.

import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const target = path.join(
  path.dirname(require.resolve("next/package.json")),
  "dist/build/webpack/plugins/next-font-manifest-plugin.js",
);

const ORIGINAL = "_mod_request.includes('/next-font-loader/index.js?')";
// String.fromCharCode(92) is a backslash — avoids every layer of string/regex
// escaping, which is exactly what breaks a hand-written `/\\/g` here.
const PATCHED = "_mod_request.split(String.fromCharCode(92)).join('/').includes('/next-font-loader/index.js?')";

const source = readFileSync(target, "utf8");

if (source.includes(PATCHED)) {
  console.log("[patch-next-font-windows] already applied");
} else if (source.includes(ORIGINAL)) {
  writeFileSync(target, source.replace(ORIGINAL, PATCHED), "utf8");
  console.log("[patch-next-font-windows] applied: font preloading enabled for Windows builds");
} else {
  console.error(
    "[patch-next-font-windows] FAILED: the expected code was not found in\n" +
      `  ${target}\n` +
      "Next.js has changed this plugin. Check whether the Windows path bug is fixed upstream\n" +
      "(build, then confirm .next/server/next-font-manifest.json has entries under \"app\").\n" +
      "If fixed, delete this script and its package.json hooks; if not, update ORIGINAL/PATCHED.",
  );
  process.exit(1);
}
