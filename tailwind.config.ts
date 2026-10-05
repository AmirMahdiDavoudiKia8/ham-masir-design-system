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
        canvas: "var(--color-bg-canvas)",
        action: {
          primary: {
            DEFAULT: "var(--color-action-primary)",
            hover: "var(--color-action-primary-hover)",
            pressed: "var(--color-action-primary-pressed)",
            foreground: "var(--color-action-primary-foreground)",
          },
          secondary: {
            DEFAULT: "var(--color-action-secondary)",
            hover: "var(--color-action-secondary-hover)",
            pressed: "var(--color-action-secondary-pressed)",
            foreground: "var(--color-action-secondary-foreground)",
          },
          ghost: {
            hover: "var(--color-action-ghost-hover)",
            pressed: "var(--color-action-ghost-pressed)",
          },
        },
        link: { DEFAULT: "var(--color-text-link)" },
        inverse: { DEFAULT: "var(--color-text-inverse)" },
        disabled: { DEFAULT: "var(--color-text-disabled)" },
        info: {
          DEFAULT: "var(--color-info)",
          strong: "var(--color-info-strong)",
          soft: "var(--color-info-soft)",
        },
        feedback: {
          success: {
            bg: "var(--color-feedback-success-bg)",
            text: "var(--color-feedback-success-text)",
            border: "var(--color-feedback-success-border)",
          },
          warning: {
            bg: "var(--color-feedback-warning-bg)",
            text: "var(--color-feedback-warning-text)",
            border: "var(--color-feedback-warning-border)",
          },
          danger: {
            bg: "var(--color-feedback-danger-bg)",
            text: "var(--color-feedback-danger-text)",
            border: "var(--color-feedback-danger-border)",
          },
          info: {
            bg: "var(--color-feedback-info-bg)",
            text: "var(--color-feedback-info-text)",
            border: "var(--color-feedback-info-border)",
          },
        },
        cream: {
          DEFAULT: "var(--color-cream)",
          foreground: "var(--color-cream-foreground)",
        },
        background: "var(--color-background)",
        surface: {
          DEFAULT: "var(--color-surface)",
          alt: "var(--color-surface-alt)",
          raised: "var(--color-bg-surface-raised)",
          sunken: "var(--color-bg-surface-sunken)",
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
        "border-strong": "var(--color-border-strong)",
        "border-subtle": "var(--color-border-subtle)",
        "border-focus": "var(--color-border-focus)",
        "border-disabled": "var(--color-border-disabled)",
        "border-danger": "var(--color-border-danger)",
        "border-success": "var(--color-border-success)",
        verified: "var(--color-verified)",
        "verified-strong": "var(--color-verified-strong)",
        "primary-soft-foreground": "var(--color-primary-soft-foreground)",
        success: {
          DEFAULT: "var(--color-success)",
          strong: "var(--color-success-strong)",
          soft: "var(--color-success-soft)",
          foreground: "var(--color-success-foreground)",
        },
        alert: {
          DEFAULT: "var(--color-alert)",
          strong: "var(--color-alert-strong)",
          soft: "var(--color-alert-soft)",
          foreground: "var(--color-alert-foreground)",
        },
        danger: {
          DEFAULT: "var(--color-danger)",
          strong: "var(--color-danger-strong)",
          foreground: "var(--color-danger-foreground)",
        },
        scrim: "var(--color-scrim)",
      },
      borderRadius: {
        none: "var(--radius-none)",
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        full: "var(--radius-full)",
        button: "var(--radius-button)",
        input: "var(--radius-input)",
        card: "var(--radius-card)",
        dialog: "var(--radius-dialog)",
        sheet: "var(--radius-sheet)",
        badge: "var(--radius-badge)",
        chip: "var(--radius-chip)",
        avatar: "var(--radius-avatar)",
      },
      fontFamily: {
        sans: ["var(--font-estedad)", "Tahoma", "sans-serif"],
      },
      fontSize: {
        display: ["var(--text-display)", { lineHeight: "var(--leading-display)" }],
        "display-lg": ["var(--text-display-lg)", { lineHeight: "var(--leading-display-lg)" }],
        "display-md": ["var(--text-display-md)", { lineHeight: "var(--leading-display-md)" }],
        "display-lg-fluid": ["var(--text-display-lg-fluid)", { lineHeight: "var(--leading-display-lg)" }],
        "display-md-fluid": ["var(--text-display-md-fluid)", { lineHeight: "var(--leading-display-md)" }],
        h1: ["var(--text-h1)", { lineHeight: "var(--leading-h1)" }],
        h2: ["var(--text-h2)", { lineHeight: "var(--leading-h2)" }],
        h3: ["var(--text-h3)", { lineHeight: "var(--leading-h3)" }],
        h4: ["var(--text-h4)", { lineHeight: "var(--leading-h4)" }],
        h5: ["var(--text-h5)", { lineHeight: "var(--leading-h5)" }],
        h6: ["var(--text-h6)", { lineHeight: "var(--leading-h6)" }],
        body: ["var(--text-body)", { lineHeight: "var(--leading-body)" }],
        "body-lg": ["var(--text-body-lg)", { lineHeight: "var(--leading-body-lg)" }],
        "body-sm": ["var(--text-body-sm)", { lineHeight: "var(--leading-body-sm)" }],
        caption: ["var(--text-caption)", { lineHeight: "var(--leading-caption)" }],
        label: ["var(--text-label)", { lineHeight: "var(--leading-label)" }],
        "label-lg": ["var(--text-label-lg)", { lineHeight: "var(--leading-label-lg)" }],
        "label-sm": ["var(--text-label-sm)", { lineHeight: "var(--leading-label-sm)" }],
        overline: ["var(--text-overline)", { lineHeight: "var(--leading-overline)" }],
      },
      letterSpacing: {
        normal: "var(--tracking-normal)",
        latin: "var(--tracking-latin)",
      },
      borderWidth: {
        DEFAULT: "var(--border-width-default)",
        hairline: "var(--border-width-hairline)",
        medium: "var(--border-width-medium)",
        strong: "var(--border-width-strong)",
      },
      boxShadow: {
        none: "var(--shadow-none)",
        card: "var(--shadow-card)",
        dropdown: "var(--shadow-dropdown)",
        popover: "var(--shadow-popover)",
        dialog: "var(--shadow-dialog)",
        sheet: "var(--shadow-sheet)",
        floating: "var(--shadow-floating)",
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
