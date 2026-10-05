/**
 * Checkbox.stories — native checked/disabled, styled with Tailwind.
 * Stories use defaultChecked (uncontrolled) so the box stays interactive.
 */
import type { Meta, StoryObj } from "@storybook/nextjs";
import * as React from "react";
import { Checkbox } from "./Checkbox";

const meta = {
  title: "FORMS/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "گزینه‌ی تیک‌خور، برای تاییدها و ترجیحات — مثل «یادم بمون» یا تایید قوانین. حالت‌ها: تیک‌خورده، خالی، و غیرفعال وقتی گزینه فعلاً قابل انتخاب نیست.",
      },
    },
  },
  argTypes: {
    label: { control: "text", description: "متن کنار تیک" },
    defaultChecked: { control: "boolean", description: "وضعیت اولیه (uncontrolled)" },
    disabled: { control: "boolean", description: "غیرفعال" },
  },
  args: { label: "یادم بمون" },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const Disabled: Story = {
  args: { label: "گزینه غیرفعال", disabled: true },
};

/**
 * همه‌ی حالت‌ها کنار هم. وضعیت انتخاب‌شده فقط با رنگ نشون داده نمی‌شه —
 * تیک (✓) هم داره. هاور حاشیه رو پررنگ می‌کنه؛ فوکوس کیبورد (Tab) حلقه‌ی
 * focus-visible داره. با Space هم می‌تونی تیک رو بزنی.
 */
export const InteractionStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Checkbox label="خالی (unchecked)" />
      <Checkbox label="تیک‌خورده (checked)" defaultChecked />
      <Checkbox label="غیرفعال خالی (disabled)" disabled />
      <Checkbox label="غیرفعال تیک‌خورده (disabled + checked)" disabled defaultChecked />
    </div>
  ),
};

/** مثال تعاملی: چند گزینه که با کلیک یا کیبورد (Space) تغییر می‌کنن. */
function InteractiveGroupDemo() {
  const [agreed, setAgreed] = React.useState(false);
  const [remember, setRemember] = React.useState(true);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Checkbox label="قوانین رو قبول دارم" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
      <Checkbox label="یادم بمون" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
      <span className="text-caption text-muted-foreground">
        وضعیت: قوانین {agreed ? "✓" : "—"} · یادم بمون {remember ? "✓" : "—"}
      </span>
    </div>
  );
}

export const InteractiveGroup: Story = {
  render: () => <InteractiveGroupDemo />,
};

export const DarkMode: Story = {
  decorators: [
    (Story) => (
      <div className="dark" style={{ padding: 24, background: "var(--color-background)", borderRadius: 20 }}>
        <Story />
      </div>
    ),
  ],
  render: () => <Checkbox label="یادم بمون" defaultChecked />,
};
