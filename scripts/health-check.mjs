#!/usr/bin/env node
/**
 * Quick production health check for the Cloudflare deployment.
 *
 *   npm run cf:health
 *
 * Exits 1 if any check fails — usable as a smoke test after deploy or from
 * a scheduled task. Detects the Free-plan CPU kill (HTTP 530 / "error code:
 * 1102") explicitly so a regression is obvious.
 */
const BASE = process.env.HAMMASIR_BASE_URL || "https://hammasirsite.ir";
const WORKER = "https://hammasir.amirmahdidavoodi7983.workers.dev";

/** @type {{ name: string; url: string; expect: number[] }[]} */
const CHECKS = [
  { name: "home", url: `${BASE}/student/home`, expect: [200] },
  { name: "root redirect", url: `${BASE}/`, expect: [308, 200] },
  { name: "discover", url: `${BASE}/student/discover`, expect: [200] },
  { name: "about (static)", url: `${BASE}/about`, expect: [200] },
  { name: "planner (static)", url: `${BASE}/planner`, expect: [200] },
  { name: "admin login", url: `${BASE}/mentor/admin/login`, expect: [200] },
  { name: "sitemap", url: `${BASE}/sitemap.xml`, expect: [200] },
  { name: "robots", url: `${BASE}/robots.txt`, expect: [200] },
  { name: "google verify", url: `${BASE}/google4282a803d978c25d.html`, expect: [200] },
  { name: "http→https", url: `${BASE.replace("https://", "http://")}/about`, expect: [301] },
  { name: "www→apex", url: `https://www.hammasirsite.ir/about`, expect: [301] },
  { name: "worker.dev fallback", url: `${WORKER}/about`, expect: [200] },
];

let failures = 0;

async function check({ name, url, expect }) {
  try {
    const res = await fetch(url, { redirect: "manual" });
    const status = res.status;
    const body = status >= 400 || status === 301 || status === 308 ? await res.text().catch(() => "") : "";
    const cpuKill = /1102|CPU/i.test(body) || status === 530;
    const ok = expect.includes(status) && !cpuKill;
    const note = cpuKill ? " CPU_LIMIT(1102)!" : "";
    console.log(`${ok ? "ok  " : "FAIL"} ${name.padEnd(20)} ${status}${note}`);
    if (!ok) failures++;
  } catch (err) {
    console.log(`FAIL ${name.padEnd(20)} ${err.message}`);
    failures++;
  }
}

for (const c of CHECKS) await check(c);

if (failures) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log(`\nall ${CHECKS.length} checks passed`);
