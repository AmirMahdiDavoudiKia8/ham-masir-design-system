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
    document.body.style.backgroundColor =
      theme === "dark" ? "#202b29" : "#f6f1e9";
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
    backgrounds: { value: "light" },
  },
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "light",
      options: {
        light: { name: "Light — day walk", value: "#f6f1e9" },
        dark: { name: "Dark — night walk", value: "#202b29" },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ["Introduction", "FOUNDATIONS", "Core", "Forms", "Application"],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme =
        (context.globals.theme as "light" | "dark" | undefined) ??
        (context.globals.backgrounds?.value === "#202b29" ? "dark" : "light");
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
