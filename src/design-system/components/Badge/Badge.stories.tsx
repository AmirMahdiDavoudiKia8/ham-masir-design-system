/**
 * Badge.stories — SEMANTIC variants: names describe booking states,
 * not colors. If a status color changes tomorrow, meaning doesn't.
 */
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Badge } from "./Badge";

const meta = {
  title: "COMPONENTS/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "برچسب کوچکی که وضعیت یک رزرو را نشان می‌دهد. سه حالت دارد و هرکدام با معنی‌اش نام‌گذاری شده‌اند، نه با رنگشان: pending برای رزروی که هنوز تأیید نشده، confirmed برای رزرو قطعی و cancelled برای رزرو کنسل‌شده. اگر فردا رنگ یکی از این وضعیت‌ها عوض شود، معنی‌اش سر جایش می‌ماند.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["pending", "confirmed", "cancelled"],
      description: "وضعیت رزرو — نام‌ها بر اساس معنی‌اند، نه رنگ",
    },
    children: { control: "text", description: "متن برچسب" },
  },
  args: { variant: "pending", children: "در انتظار" },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pending: Story = {
  args: { variant: "pending", children: "در انتظار" },
};

export const Confirmed: Story = {
  args: { variant: "confirmed", children: "تایید‌شده" },
};

export const Cancelled: Story = {
  args: { variant: "cancelled", children: "لغو‌شده" },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8 }}>
      <Badge variant="pending">در انتظار</Badge>
      <Badge variant="confirmed">تایید‌شده</Badge>
      <Badge variant="cancelled">لغو‌شده</Badge>
    </div>
  ),
};

/**
 * بج عمداً هیچ حالت تعاملی نداره: نه hover، نه focus، نه disabled.
 * فقط یه برچسب وضعیت خواندنیه (span) و فوکوس کیبورد نمی‌گیره — by design.
 */

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
      <Badge variant="pending">در انتظار</Badge>
      <Badge variant="confirmed">تایید‌شده</Badge>
      <Badge variant="cancelled">لغو‌شده</Badge>
    </div>
  ),
};
