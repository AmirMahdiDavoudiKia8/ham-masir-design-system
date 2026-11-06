import type { Meta, StoryObj } from "@storybook/nextjs";
import * as React from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Card } from "../Card";
import { Button } from "../Button";
import { Alert } from "../Alert";
import { MentorCard } from "../MentorCard";

const meta: Meta<typeof ThemeToggle> = {
  title: "COMPONENTS/ThemeToggle",
  component: ThemeToggle,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "دکمه تغییر تم (Theme Toggle) یک سوییچ تعاملی است که وضعیت فعلی تم سیستم (روشن/تاریک) را مدیریت می‌کند. برای رعایت استانداردهای دسترسی‌پذیری (WCAG)، این کامپوننت وضعیت خود را از طریق صفت `aria-pressed` به صفحه‌خوان‌ها اعلام کرده و تغییرات بصری را با تغییر آیکون‌ها (خورشید/ماه) همراه می‌سازد تا وابستگی صرف به رنگ از بین برود.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {
  render: () => <ControlledToggle initial="light" />,
};

export const Dark: Story = {
  render: () => <ControlledToggle initial="dark" />,
};

/** Fully controlled toggle: displayed icon and state always move together.
 * Page mood stays owned by the toolbar decorator — demos never touch it. */
function ControlledToggle({ initial }: { initial: "light" | "dark" }) {
  const [theme, setTheme] = React.useState<"light" | "dark">(initial);
  return (
    <ThemeToggle theme={theme} onToggle={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} />
  );
}

/**
 * مثال تعاملی: با کلیک (یا کلیدهای Enter/Space روی دکمه‌ی فوکوس‌شده) تم تغییر می‌کند و
 * aria-pressed و aria-label هم‌زمان به‌روز می‌شوند. این استوری فقط وضعیت
 * داخلی دکمه را نشان می‌دهد و تم کل صفحه را تغییر نمی‌دهد.
 */
function InteractiveDemo() {
  const [theme, setTheme] = React.useState<"light" | "dark">("light");
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <ThemeToggle theme={theme} onToggle={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} />
      <span className="text-caption text-muted-foreground">
        تم فعلی: {theme === "dark" ? "شب (aria-pressed=true)" : "روز (aria-pressed=false)"}
      </span>
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};

export const Disabled: Story = {
  args: { theme: "light", disabled: true },
};

/**
 * پیش‌نمایش ترکیبی (Composition) — در این نما، عملکرد یکپارچه‌ی دکمه تغییر تم بر روی یک کارت پیچیده نشان داده شده است. هدف این استوری اثبات این موضوع است که با تغییر وضعیت سوییچ، توکن‌های معنایی (Semantic Tokens) چگونه رنگ پس‌زمینه، تایپوگرافی و المان‌های تعاملی را به صورت آبشاری با تم تاریک تطبیق می‌دهند.
 */
export const DarkModeCompositionPreview: Story = {
  decorators: [
    (Story) => (
      <div className="dark" style={{ padding: 24, background: "var(--color-background)", borderRadius: 20 }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div className="flex w-[360px] flex-col gap-4 rounded-card border border-border bg-background p-5">
      <div className="flex items-center justify-between">
        <span className="text-h3 font-bold text-foreground">شب، کنار هم</span>
        <ThemeToggle theme="dark" />
      </div>
      <MentorCard
        name="سارا محمدی"
        subtitle="پزشکی، تهران"
        rank="رتبه ۱۲ کنکور ۱۴۰۳"
      />
      <Alert tone="alert" title="کمی عقب افتادی">
        هر روز یه شروعِ تازه‌ست. بیا از همین‌جا ادامه بدیم.
      </Alert>
      <Card title="قدم بعدی" description="فقط یک قدم کوچک امشب">
        <Button variant="primary" fullWidth>
          ادامه با هم‌مسیرم
        </Button>
      </Card>
    </div>
  ),
};
