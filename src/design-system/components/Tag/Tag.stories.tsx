/**
 * Tag.stories — read-only label pill for display metadata
 * (booking status, availability windows). Never interactive.
 */
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Tag } from "./Tag";

const meta = {
  title: "COMPONENTS/Tag",
  component: Tag,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "برچسب کوچک و فقط‌خواندنی برای اطلاعاتی که فقط نمایش داده می‌شوند؛ مثل وضعیت جلسه یا ساعت‌های در دسترس بودن. برخلاف Chip هیچ‌وقت قابل انتخاب نیست و کلیک هم نمی‌گیرد.",
      },
    },
  },
  argTypes: {
    children: { control: "text", description: "متن برچسب" },
  },
  args: { children: "فعال" },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Statuses: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Tag>جلسه‌ی بعدی</Tag>
      <Tag>فعال</Tag>
      <Tag>لغو شده</Tag>
    </div>
  ),
};

export const AvailabilityWindows: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Tag>شنبه صبح</Tag>
      <Tag>دوشنبه عصر</Tag>
      <Tag>چهارشنبه شب</Tag>
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
      <Tag>فعال</Tag>
      <Tag>لغو شده</Tag>
    </div>
  ),
};
