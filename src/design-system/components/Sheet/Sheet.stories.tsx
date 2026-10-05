/**
 * Sheet.stories — generic bottom sheet (scrim + slide-up panel +
 * drag-down-to-dismiss). Same implementation the product renders.
 */
import type { Meta, StoryObj } from "@storybook/nextjs";
import * as React from "react";
import { Button } from "../Button";
import { Sheet } from "./Sheet";

const meta = {
  title: "Component/Sheet",
  component: Sheet,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "پنل پایین‌رونده برای تأییدها و اقدام‌های مهم — مثل تأیید لغو جلسه. با اسکریم تیره، دکمه‌ی بستن و کشیدن به پایین بسته می‌شه؛ با Escape هم بسته می‌شه.",
      },
    },
  },
  argTypes: {
    open: { control: "boolean", description: "باز بودن پنل" },
    ariaLabel: { control: "text", description: "لیبل دسترس‌پذیری دیالوگ" },
  },
  args: {
    open: true,
    onClose: () => {},
    ariaLabel: "لغو جلسه",
    children: (
      <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 8 }}>
        <h2 className="text-h3 font-bold text-foreground">مطمئنی می‌خوای این جلسه رو لغو کنی؟</h2>
      </div>
    ),
  },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  render: (args) => (
    <Sheet {...args}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 8 }}>
        <h2 className="text-h3 font-bold text-foreground">مطمئنی می‌خوای این جلسه رو لغو کنی؟</h2>
        <Button size="lg" fullWidth>
          لغو جلسه
        </Button>
      </div>
    </Sheet>
  ),
};

/** Full interaction: open via button, close via X / scrim / Escape / drag-down. */
function InteractiveDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <Button variant="primary" size="md" onClick={() => setOpen(true)}>
        باز کردن شیت
      </Button>
      <Sheet open={open} onClose={() => setOpen(false)} ariaLabel="نمونه">
        <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 8 }}>
          <h2 className="text-h3 font-bold text-foreground">مطمئنی می‌خوای این جلسه رو لغو کنی؟</h2>
          <Button size="lg" fullWidth onClick={() => setOpen(false)}>
            لغو جلسه
          </Button>
        </div>
      </Sheet>
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};
