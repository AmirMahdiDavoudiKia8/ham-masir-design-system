/**
 * Tag.stories — read-only label pill for display metadata
 * (subject fields, availability windows). Never interactive.
 * Booking *statuses* with meaning belong to Badge — see Statuses below.
 */
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Tag } from "./Tag";
import { Badge } from "../Badge/Badge";

const meta = {
  title: "COMPONENTS/Tag",
  component: Tag,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "برچسب کوچک و فقط‌خواندنی برای اطلاعاتی که فقط نمایش داده می‌شوند؛ مثل رشته تحصیلی یا ساعت‌های در دسترس بودن. برخلاف Chip هیچ‌وقت قابل انتخاب نیست و کلیک هم نمی‌گیرد.",
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

/**
 * وضعیت‌های معنادار (فعال در برابر لغوشده) متعلق به Badge هستند، نه Tag —
 * برای همین اینجا همان سه وضعیت با رنگ‌های متضاد feedback رندر می‌شوند.
 * Tag عمداً تک‌رنگ خنثی می‌ماند تا با وضعیت اشتباه گرفته نشود.
 */
export const Statuses: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Badge variant="confirmed">فعال</Badge>
      <Badge variant="pending">جلسه‌ی بعدی</Badge>
      <Badge variant="cancelled">لغو شده</Badge>
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
      <Tag>ریاضی</Tag>
      <Tag>تجربی</Tag>
    </div>
  ),
};
