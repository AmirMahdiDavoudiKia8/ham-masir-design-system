/**
 * Sheet.stories — generic bottom sheet (scrim + slide-up panel +
 * drag-down-to-dismiss). Same implementation the product renders.
 */
import type { Meta, StoryObj } from "@storybook/nextjs";
import * as React from "react";
import { Button } from "../Button";
import { Sheet } from "./Sheet";

const meta = {
  title: "OVERLAYS/Sheet",
  component: Sheet,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "پنل پایین‌رونده برای تأییدها و کارهای مهم؛ مثل گرفتن تأیید برای لغو جلسه. پشتش یک اسکریم تیره است و با دکمه‌ی بستن، کشیدن رو به پایین یا زدن Escape بسته می‌شود.",
      },
    },
  },
  argTypes: {
    open: { control: "boolean", description: "باز بودن پنل" },
    ariaLabel: { control: "text", description: "برچسبی که صفحه‌خوان‌ها می‌خوانند" },
  },
  args: {
    open: false,
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

/**
 * No always-open story on purpose: an open sheet pins a fixed overlay and
 * locks body scroll, which would trap the docs page itself. Open it from
 * the button below instead.
 */

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
