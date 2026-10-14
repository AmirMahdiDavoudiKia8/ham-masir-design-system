/**
 * Chip.stories — selectable filter pill. Selected / unselected, plus the
 * scrollable filter row used on discovery screens.
 */
import type { Meta, StoryObj } from "@storybook/nextjs";
import * as React from "react";
import { Chip } from "./Chip";

const meta = {
  title: "COMPONENTS/Chip",
  component: Chip,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "چیپ‌ها (Chips) المان‌های تعاملی کوچکی هستند که برای ساخت فیلترها و تب‌ها در صفحات کاوش (Discover) استفاده می‌شوند. با انتخاب یک چیپ، رنگ action-primary آن را از سایر گزینه‌ها متمایز می‌کند. ردیف فیلترها به صورت افقی چیده شده و در صورت سرریز محتوا، قابلیت اسکرول افقی دارد.",
      },
    },
  },
  argTypes: {
    selected: { control: "boolean", description: "وضعیت انتخاب (aria-pressed)" },
    children: { control: "text", description: "متن چیپ" },
    disabled: { control: "boolean", description: "غیرفعال" },
  },
  args: { children: "تجربی", selected: false },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unselected: Story = {};

export const Selected: Story = {
  args: { selected: true, children: "همه" },
};

export const Disabled: Story = {
  args: { disabled: true, children: "غیرفعال" },
};

/**
 * همه‌ی حالت‌ها در کنار هم. گزینه‌ی انتخاب‌شده با رنگ action-primary پرشده مشخص است و
 * مقدار aria-pressed را true تنظیم می‌کند. حالت غیرفعال کم‌رنگ و بدون تعامل است.
 */
export const InteractionStates: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Chip>انتخاب‌نشده</Chip>
      <Chip selected>انتخاب‌شده</Chip>
      <Chip disabled>غیرفعال</Chip>
    </div>
  ),
};

/** ردیف فیلتر تک‌انتخابی — با کلیک یا کلیدهای Enter/Space گزینه‌ی فعال تغییر می‌کند. */
function FilterRowDemo() {
  const options = ["همه", "تجربی", "ریاضی", "انسانی", "هنر"];
  const [active, setActive] = React.useState("همه");
  return (
    <div className="no-scrollbar flex max-w-80 gap-2 overflow-x-auto p-1">
      {options.map((opt) => (
        <Chip key={opt} selected={active === opt} onClick={() => setActive(opt)}>
          {opt}
        </Chip>
      ))}
    </div>
  );
}

/** ردیف فیلتر صفحه‌ی کاوش — یک گزینه انتخاب شده و در صورت سرریز محتوا، اسکرول افقی دارد. */
export const FilterRow: Story = {
  render: () => <FilterRowDemo />,
};

export const DarkMode: Story = {
  decorators: [
    (Story) => (
      <div className="dark" style={{ padding: 24, background: "var(--color-background)", borderRadius: 20 }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div style={{ display: "flex", gap: 8 }}>
      <Chip selected>همه</Chip>
      <Chip>تجربی</Chip>
    </div>
  ),
};
