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
  display: "swap",
});
