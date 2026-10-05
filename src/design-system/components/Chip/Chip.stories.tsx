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
          "قرص انتخابی برای فیلترها و تب‌ها؛ همان چیزی که در صفحه‌ی کشف گروه‌های رشته را نشان می‌دهد. وقتی انتخاب شود، رنگ primary آن را از بقیه جدا می‌کند. ردیف فیلترها هم افقی است و اگر جا کم بیاید اسکرول می‌خورد.",
      },
    },
  },
  argTypes: {
    selected: { control: "boolean", description: "انتخاب‌شده یا نه (aria-pressed)" },
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
 * همه‌ی حالت‌ها کنار هم. انتخاب‌شده با رنگ primary پرشده مشخصه و
 * aria-pressed=true می‌ذاره. غیرفعال کم‌رنگ و بدون تعامله.
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

/** مثال تعاملی: ردیف فیلتر تک‌انتخابی — با کلیک یا Enter/Space عوض می‌شه. */
function InteractiveFilterRowDemo() {
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

export const InteractiveFilterRow: Story = {
  render: () => <InteractiveFilterRowDemo />,
};

/** Discovery filter row — one selected, horizontally scrollable. */
export const FilterRow: Story = {
  render: () => (
    <div className="no-scrollbar flex max-w-80 gap-2 overflow-x-auto p-1">
      <Chip selected>همه</Chip>
      <Chip>تجربی</Chip>
      <Chip>ریاضی</Chip>
      <Chip>انسانی</Chip>
      <Chip>هنر</Chip>
    </div>
  ),
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
