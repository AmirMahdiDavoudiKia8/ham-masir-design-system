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
          "سوییچ حالت روز/شب. دکمه‌ی واقعی (button) با aria-pressed که تم فعال رو نشون می‌ده و آیکن خورشید/ماه عوض می‌شه — پس وضعیت فقط با رنگ منتقل نمی‌شه. با کلیک، Enter یا Space تغییر می‌کنه و با Tab فوکوس visible داره.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {
  args: { theme: "light" },
};

export const Dark: Story = {
  args: { theme: "dark" },
  parameters: { backgrounds: { value: "dark" } },
};

/**
 * مثال تعاملی: با کلیک (یا Enter/Space روی دکمه‌ی فوکوس‌شده) تم عوض می‌شه،
 * aria-pressed و aria-label هم هم‌زمان به‌روز می‌شن. این استوری فقط وضعیت
 * داخلی دکمه رو نشون می‌ده و تم کل صفحه رو عوض نمی‌کنه.
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
 * Night walk — the same companionship, after dark. Warm charcoal-teal night,
 * cream text, lightened teal, peach kept warm. Flip the Mood toolbar above
 * between Light and Dark to feel the whole card accompany you.
 */
export const NightWalkPreview: Story = {
  render: () => (
    <div className="flex w-[360px] flex-col gap-4 rounded-lg border border-border bg-background p-5">
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
