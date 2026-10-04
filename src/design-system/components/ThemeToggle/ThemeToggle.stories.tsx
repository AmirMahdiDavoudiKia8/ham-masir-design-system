import type { Meta, StoryObj } from "@storybook/nextjs";
import { ThemeToggle } from "./ThemeToggle";
import { Card } from "../Card";
import { Button } from "../Button";
import { Alert } from "../Alert";
import { MentorCard } from "../MentorCard";

const meta: Meta<typeof ThemeToggle> = {
  title: "Core/ThemeToggle",
  component: ThemeToggle,
  parameters: { layout: "centered" },
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
        major="پزشکی"
        university="تهران"
        rating={4.8}
        sessions={32}
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
