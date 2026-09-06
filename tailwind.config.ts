import type { Config } from "tailwindcss";

/**
 * Tailwind reads all design tokens from CSS variables defined in
 * `src/styles/tokens.css`. To rebrand the app, edit that file only —
 * never hard-code colors/radii/durations/easing in components.
 */
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          light: "var(--color-primary-light)",
          soft: "var(--color-primary-soft)",
          foreground: "var(--color-primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          dark: "var(--color-secondary-dark)",
          soft: "var(--color-secondary-soft)",
          foreground: "var(--color-secondary-foreground)",
        },
        cream: {
          DEFAULT: "var(--color-cream)",
          foreground: "var(--color-cream-foreground)",
        },
        background: "var(--color-background)",
        surface: {
          DEFAULT: "var(--color-surface)",
          alt: "var(--color-surface-alt)",
        },
        foreground: {
          DEFAULT: "var(--color-foreground)",
          faint: "var(--color-foreground-faint)",
        },
        muted: {
          DEFAULT: "var(--color-muted)",
          foreground: "var(--color-muted-foreground)",
        },
        border: "var(--color-border)",
        verified: "var(--color-verified)",
        success: {
          DEFAULT: "var(--color-success)",
          soft: "var(--color-success-soft)",
          foreground: "var(--color-success-foreground)",
        },
        alert: {
          DEFAULT: "var(--color-alert)",
          soft: "var(--color-alert-soft)",
          foreground: "var(--color-alert-foreground)",
        },
        danger: "var(--color-danger)",
        scrim: "var(--color-scrim)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        full: "var(--radius-full)",
      },
      fontFamily: {
        sans: ["var(--font-pinar)", "Tahoma", "sans-serif"],
      },
      fontSize: {
        display: ["var(--text-display)", { lineHeight: "var(--leading-display)" }],
        h1: ["var(--text-h1)", { lineHeight: "var(--leading-h1)" }],
        h2: ["var(--text-h2)", { lineHeight: "var(--leading-h2)" }],
        h3: ["var(--text-h3)", { lineHeight: "var(--leading-h3)" }],
        body: ["var(--text-body)", { lineHeight: "var(--leading-body)" }],
        caption: ["var(--text-caption)", { lineHeight: "var(--leading-caption)" }],
        label: ["var(--text-label)", { lineHeight: "var(--leading-label)" }],
      },
      boxShadow: {
        card: "var(--shadow-card)",
        elevated: "var(--shadow-lifted)",
        nav: "var(--shadow-lifted)",
        lifted: "var(--shadow-lifted)",
        brand: "var(--shadow-brand)",
      },
      transitionDuration: {
        micro: "var(--duration-micro)",
        standard: "var(--duration-standard)",
        entrance: "var(--duration-entrance)",
        sheet: "var(--duration-sheet)",
      },
      transitionTimingFunction: {
        gentle: "var(--ease-gentle)",
      },
    },
  },
  plugins: [],
};

export default config;
