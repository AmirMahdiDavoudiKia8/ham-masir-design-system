import type { Preview } from "@storybook/nextjs";
import { useEffect } from "react";
import "../src/app/globals.css";
import "./preview.css";

/**
 * Ham-Masir dark mood — "night walk together".
 * The toolbar toggle flips the `.dark` class on <html> so ONLY the semantic
 * token layer flips (primitives/radii/motion/type never change). Components
 * bind to semantic tokens, so they re-skin with zero code changes.
 */
function RtlWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.lang = "fa";
    document.documentElement.dir = "rtl";
  }, []);
  return <div className="font-sans">{children}</div>;
}

function ThemeWrapper({
  theme,
  children,
}: {
  theme: "light" | "dark";
  children: React.ReactNode;
}) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
    // Keep the canvas backdrop in sync when the backgrounds addon is off.
    // Reads the semantic token (flips with .dark) — never a hardcoded hex.
    document.body.style.backgroundColor = "var(--color-background)";
  }, [theme]);
  return <>{children}</>;
}

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Ham-Masir mood — day walk / night walk",
      defaultValue: "light",
      toolbar: {
        title: "Mood",
        icon: "moon",
        items: [
          { value: "light", title: "Light — day walk", icon: "sun" },
          { value: "dark", title: "Dark — night walk", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
  },
  parameters: {
    layout: "centered",
    // One theme control only (the Mood toolbar above). The built-in
    // backgrounds toolbar is disabled: it painted a second, identical
    // "day walk / night walk" menu that only recolored the canvas backdrop
    // while tokens stayed light — a fake, broken-looking dark mode.
    backgrounds: { disable: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          "Introduction",
          "FOUNDATIONS",
          ["Colors", "Surfaces", "Typography", "Spacing", "Radius", "Borders", "Shadows", "Motion", "Icons"],
          "COMPONENTS",
          ["Avatar", "Badge", "Button", "Card", "Chip", "Tag", "ThemeToggle"],
          "FORMS",
          ["Checkbox", "Input", "Textarea"],
          "FEEDBACK",
          ["Alert", "EmptyState", "ProgressBar", "Spinner & Skeleton", "Toast"],
          "OVERLAYS",
          ["Sheet"],
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = (context.globals.theme as "light" | "dark" | undefined) ?? "light";
      const mood: "light" | "dark" = theme === "dark" ? "dark" : "light";
      return (
        <ThemeWrapper theme={mood}>
          <RtlWrapper>
            <Story />
          </RtlWrapper>
        </ThemeWrapper>
      );
    },
  ],
};

export default preview;
