import localFont from "next/font/local";

/**
 * Vazirmatn RD (Round-Dots) — trial swap-in for Estedad. Same soft/rounded
 * brief (brand.md's "curves are soft, nothing loud"), but Vazirmatn's dots
 * are circular instead of square, which reads noticeably gentler at body
 * text sizes. Free (SIL OFL), actively maintained: github.com/rastikerdar/vazirmatn.
 * Self-hosted — files live in /public/fonts/vazirmatn-rd. The exposed CSS
 * variable (--font-pinar) keeps its old name so Tailwind's `font-sans`
 * wiring in tailwind.config.ts and every component using it needs no changes.
 */
export const pinar = localFont({
  src: [
    {
      path: "../../public/fonts/vazirmatn-rd/Vazirmatn-RD-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/vazirmatn-rd/Vazirmatn-RD-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/vazirmatn-rd/Vazirmatn-RD-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/vazirmatn-rd/Vazirmatn-RD-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-pinar",
  // "optional", not "swap": with swap, a font that arrived after first render
  // re-flowed the hero text and shoved the «اول جلسه، بعد پرداخت» card down
  // (CLS 0.100 on /student/home — exactly the live audit figure). The files
  // are preloaded via a Link header (see scripts/patch-next-font-windows.mjs,
  // which is what makes that preload exist at all on Windows builds), so they
  // normally arrive before first render and are used; "optional" only stops a
  // LATE font from swapping in mid-read. Cost: on a slow first visit a weight
  // that misses the window shows the system Persian font for that page view.
  //
  // Not fixable with next/font's adjustFontFallback: it tunes an Arial-based
  // fallback, and Arial has no Persian glyphs, so Persian text falls through
  // to Tahoma/Noto with unrelated metrics regardless.
  display: "optional",
});
